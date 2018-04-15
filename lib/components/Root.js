import React from "react";
import { StaticRouter, Route } from "react-router-dom";
import { renderRoutes } from "react-router-config";

export default ({ path, routes, data }) => {
  return (
    <StaticRouter location={path} context={{}}>
      {renderRoutes(routes, { data })}
    </StaticRouter>
  );
};
