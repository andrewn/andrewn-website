/*
  This file is loaded outside of webpack so
  any code that makes use of webpack loaders
  must be required within the componentMap()
  function as this is called within the webpack
  context
*/
import React from "react";
import map from "lodash/map";
import filter from "lodash/filter";
import { join } from "path";

import { outputRoot, rootTags } from "../config";

import { dateToYear } from "../lib/utils";
import { all } from "./models/files";
import { allWorks } from "./models/work";

const routeToHtmlPath = ({ path, ...rest }) => ({
  ...rest,
  path: `${path}.html`
});

const groupByTags = (works: Works): Tagged => {
  const tagged = {
    project: {},
    post: {}
  };

  works.forEach(work => {
    const [rootTag, ...tags] = work.tags;
    const collection = tagged[rootTag];

    if (collection == null) {
      // console.warn(`No collection for '${rootTag}' - ignoring`);
      return;
    }

    tags.forEach(tag => {
      if (collection[tag] == null) {
        collection[tag] = [];
      }

      collection[tag].push(work);
    });
  });

  return tagged;
};

const createRoutes = async () => {
  const indexRoute = {
    path: "/",
    exact: true,
    component: "Home"
  };

  const routes = [
    {
      path: "/cv",
      exact: true,
      component: "CV"
    },
    {
      path: "/eg",
      exact: true,
      component: "EG"
    },
    {
      path: "/profile",
      exact: true,
      component: "Profile"
    },
    {
      path: `/${rootTags.project.url}`,
      exact: true,
      component: "Works",
      context: { rootTag: rootTags.project.tag }
    },
    {
      path: `/latest`, // static site plugin will output latest.html...
      exact: true,
      type: "xml",
      outputPath: "/latest.atom", // ... which we rename to .atom
      component: "Atom",
      context: {}
    },
    {
      path: `/${rootTags.post.url}`,
      exact: true,
      component: "Works",
      context: { rootTag: rootTags.post.tag }
    }
  ];

  const works = await all();

  // :rootTag/:year/:slug
  // Loop through posts and projects and create URLs
  // as appropriate and link them to the correct template
  // e.g. a rootTag = 'projects' will have the URL
  //      "/projects/" and will use the "project" template
  works.filter(w => w.published === true).forEach(work => {
    try {
      const year = dateToYear(work.date);
      const rootTagConfig = rootTags[work.rootTag];
      const path = `/${rootTagConfig.url}/${year}/${work.slug}`;
      const route = {
        path,
        component: "Work",
        context: {
          rootTag: rootTagConfig.tag,
          slug: work.slug,
          year
        }
      };

      routes.push(route);
    } catch (e) {}
  });

  const tags = groupByTags(works);

  // :rootTag/tagged/:tag
  // Loop through tags and create URLs for each tag page
  // as appropriate and link them to the correct template
  // e.g. a rootTag = 'projects' will have the URL
  //      "/projects/" and will use the "project" template
  Object.entries(tags.project).forEach(([tag, works]) => {
    const path = `/projects/tagged/${tag}`;
    routes.push({
      path,
      exact: true,
      component: "Works",
      context: { rootTag: rootTags.project.tag, tag }
    });
  });

  Object.entries(tags.post).forEach(([tag, works]) => {
    const path = `/posts/tagged/${tag}`;
    routes.push({
      path,
      exact: true,
      component: "Works",
      context: { rootTag: rootTags.post.tag, tag }
    });
  });

  return [indexRoute, ...routes.map(routeToHtmlPath)];
};

const routingWithComponentObjects = async () => {
  const templates = require("./templates/");
  const routes = await createRoutes();

  return map(routes, ({ component, ...rest }) => {
    const componentObject = templates[component];

    if (componentObject == null) {
      throw new Error(`Can't find object for "${component}"`);
    }

    return {
      ...rest,
      component: componentObject
    };
  });
};

export const routing = async () => routingWithComponentObjects();

export const paths = async () => map(await createRoutes(), "path");

export const renames = async () =>
  filter(await createRoutes(), "outputPath").map(({ path, outputPath }) => ({
    from: join(outputRoot, path),
    to: join(outputRoot, outputPath)
  }));
