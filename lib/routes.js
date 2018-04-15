/*
  This file is loaded outside of webpack so
  any code that makes use of webpack loaders
  must be required within the componentMap()
  function as this is called within the webpack
  context
*/
import React from "react";

import { allWorks } from "./models/work";

const config = ["/"];

const componentMap = () => {
  const templates = require("./templates/");

  return {
    "/": {
      exact: true,
      component: templates.Home
    }
  };
};

export const routing = () =>
  config.map(path => Object.assign({}, componentMap()[path], { path }));

export const paths = () => config;
