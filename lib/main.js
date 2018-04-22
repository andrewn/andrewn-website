const { renderToStaticMarkup } = require("react-dom/server");
const { createElement } = require("react");
const { Helmet } = require("react-helmet");
import { matchRoutes, renderRoutes } from "react-router-config";

import { outputRoot } from "../config";
import { routing, renames } from "./routes";
import Root from "./components/Root";
import { all as allImages } from "./models/images";

const firstRoute = matchingRoutes => matchingRoutes[0].route;

const fetchInitialProps = async matchingRoutes => {
  const { component, context } = firstRoute(matchingRoutes);

  if (typeof component.getInitialProps === "function") {
    return await component.getInitialProps({ context });
  }

  return null;
};

const page = (type, helmet, body) => {
  switch (type) {
    case "html":
      return `<!doctype html>
<html ${helmet.htmlAttributes.toString()}>
    <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        ${helmet.style.toString()}
    </head>
    <body ${helmet.bodyAttributes.toString()}>
        <div id="content">
            ${body}
        </div>
        ${helmet.noscript.toString()}
        ${helmet.script.toString()}
    </body>
</html>`;
    case "xml":
      return `<?xml version="1.0" encoding="utf-8"?>
      ${body}
`;
  }
};

module.exports = async function render({ path }) {
  const routes = await routing();

  const matching = matchRoutes(routes, path);

  const initialProps = await fetchInitialProps(matching);
  const imageStore = await allImages();

  const { type = "html" } = firstRoute(matching);

  const body = renderToStaticMarkup(
    createElement(Root, { path, routes, imageStore, type, ...initialProps })
  );
  const helmet = Helmet.renderStatic();

  const rendered = await page(type, helmet, body);

  return Promise.resolve(rendered);
};
