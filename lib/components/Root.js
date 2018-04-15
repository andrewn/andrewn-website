// @flow

import React from "react";
import { Helmet } from "react-helmet";
import { StaticRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";

import { all } from "../models/images";
import { FigureProvider } from "./Figure";
import Layout from "./Layout";

class Root extends React.Component {
  render() {
    const { path, routes, imageStore, ...rest } = this.props;

    return (
      <StaticRouter location={path}>
        <>
          <FigureProvider value={imageStore}>
            <Helmet>
              <link rel="stylesheet" type="text/css" href="/styles.css" />
            </Helmet>
            <Layout>{renderRoutes(routes, rest)}</Layout>
          </FigureProvider>
        </>
      </StaticRouter>
    );
  }
}

export default Root;
