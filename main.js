const { renderToStaticMarkup } = require("react-dom/server");
const { createElement } = require("react");
const { Helmet } = require("react-helmet");

const Root = require("./lib/components/Root").default;

module.exports = function render(locals) {
  const body = renderToStaticMarkup(createElement(Root, { path: locals.path }));
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
