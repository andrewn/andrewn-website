/*
  This file is loaded outside of webpack so
  any code that makes use of webpack loaders
  must be required within the componentMap()
  function as this is called within the webpack
  context
*/
import React from "react";
import map from "lodash/map";

import { rootTags } from "../config";

import { dateToYear } from "../lib/utils";
import { all } from "./models/files";
import { allWorks } from "./models/work";

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
  const routes = [
    {
      path: "/",
      exact: true,
      component: "Home"
    },
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

  return routes;
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
