import React from "react";
import { StaticRouter, Route } from "react-router-dom";

import Post from "../templates/Post";

export default ({ path }) => {
  return (
    <StaticRouter location={path} context={{}}>
      <>
        <Route exact path="/" component={() => <h1>Home</h1>} />
        <Route exact path="/hello" component={Post} />
        <Route exact path="/world" component={Post} />
      </>
    </StaticRouter>
  );
};
