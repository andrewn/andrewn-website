/*
  This file is loaded outside of webpack so
  any code that makes use of webpack loaders
  must be required within the componentMap()
  function as this is called within the webpack
  context
*/
import React from "react";

import { allWorks } from "./models/work";

const config = ["/", "/hello", "/world"];

const componentMap = () => {
  const Post = require("./templates/Post").default;

  return {
    "/": {
      exact: true,
      component: () => <h1>Home</h1>
    },
    "/hello": {
      exact: true,
      component: Post,
      data: () => allWorks()
    },
    "/world": {
      exact: true,
      component: Post
    }
  };
};

export const routing = () =>
  config.map(path => Object.assign({}, componentMap()[path], { path }));

export const paths = () => config;
