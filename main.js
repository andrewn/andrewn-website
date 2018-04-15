const { renderToStaticMarkup } = require("react-dom/server");
const { createElement } = require("react");
const { Helmet } = require("react-helmet");
import { matchRoutes, renderRoutes } from "react-router-config";

const work = require("./lib/models/work");

import Root from "./lib/components/Root";
import { routing } from "./lib/routes";

module.exports = async function render({ path }) {
  const routes = routing();

  const matching = matchRoutes(routes, path);

  let data = null;

  if (matching[0].route.data) {
    data = await matching[0].route.data();
  }

  const body = renderToStaticMarkup(
    createElement(Root, { path, routes, data })
  );
  const helmet = Helmet.renderStatic();

  const html = `
    <!doctype html>
    <html ${helmet.htmlAttributes.toString()}>
        <head>
            ${helmet.title.toString()}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
        </head>
        <body ${helmet.bodyAttributes.toString()}>
            <div id="content">
               ${body}
            </div>
        </body>
    </html>
`;
  return Promise.resolve(html);
};
