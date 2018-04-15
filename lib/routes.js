/*
  This file is loaded outside of webpack so
  any code that makes use of webpack loaders
  must be required within the componentMap()
  function as this is called within the webpack
  context
*/
import React from "react";
import map from "lodash/map";

import { allWorks } from "./models/work";

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
  }
];

const routingWithComponentObjects = () => {
  const templates = require("./templates/");

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

export const routing = () => routingWithComponentObjects();

export const paths = () => map(routes, "path");
