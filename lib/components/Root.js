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
    const { path, routes, imageStore, type, ...rest } = this.props;

    const rendered = renderRoutes(routes, rest);

    const content = type === "html" ? <Layout>{rendered}</Layout> : rendered;

    return (
      <StaticRouter context={{}} location={path}>
        <>
          <FigureProvider value={imageStore}>
            <Helmet>
              <link
                href="/latest.atom"
                type="application/atom+xml"
                rel="alternate"
                title="Latest posts and projects"
              />
              <link rel="stylesheet" type="text/css" href="/styles.css" />
              <script src="/assets/js/client.js" />
            </Helmet>
            {content}
          </FigureProvider>
        </>
      </StaticRouter>
    );
  }
}

export default Root;
