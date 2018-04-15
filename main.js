const { renderToStaticMarkup } = require("react-dom/server");
const { createElement } = require("react");
const { Helmet } = require("react-helmet");
import { matchRoutes, renderRoutes } from "react-router-config";

import { routing } from "./lib/routes";
import Root from "./lib/components/Root";
import { all as allImages } from "./lib/models/images";

const fetchInitialProps = async matchingRoutes => {
  if (matchingRoutes[0].route.component.getInitialProps) {
    return await matchingRoutes[0].route.component.getInitialProps();
  }

  return null;
};

module.exports = async function render({ path }) {
  const routes = routing();
  const matching = matchRoutes(routes, path);

  const initialProps = await fetchInitialProps(matching);
  const imageStore = await allImages();

  const body = renderToStaticMarkup(
    createElement(Root, { path, routes, imageStore, ...initialProps })
  );
  const helmet = Helmet.renderStatic();

  const html = `
    <!doctype html>
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
    </html>
`;
  return Promise.resolve(html);
};
