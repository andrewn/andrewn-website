// @flow

import React from "react";
import toPairs from "lodash/toPairs";

// Uses a forked branch to support block-level components
// i.e. rendering <Figure /> outside of the default <p>
import { Markdown } from "react-showdown";

import { Figure } from "./Figure";

import styles from "./Markdown.css";

const Intro = ({ children }) => <div className={styles.intro}>{children}</div>;

const Video = ({ videoId, width, height, align = "left" }) => (
  <div style={{ maxWidth: width }} className={`video is-aligned-${align}`}>
    <iframe
      src={`https://player.vimeo.com/video/${videoId}?loop=1&color=ff0179&title=0&byline=0&portrait=0`}
      width={width}
      height={height}
      frameborder="0"
      webkitallowfullscreen
      mozallowfullscreen
      allowfullscreen
    />
  </div>
);

const Clear = () => <div className={styles.clear} />;

const toAttributes = obj =>
  toPairs(obj)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

const Script = ({ children, ...props }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: `<script ${toAttributes(props)}></script>`
    }}
  />
);

const components = [
  {
    name: "Figure",
    component: Figure,
    block: true
  },
  {
    name: "Intro",
    component: Intro,
    block: true
  },
  {
    name: "Clear",
    component: Clear,
    block: true
  },
  {
    name: "Video",
    component: Video,
    block: true
  },
  {
    name: "Script",
    component: Script,
    block: true
  }
];

// https://github.com/showdownjs/showdown#valid-options
const options = {
  tables: true,
  simplifiedAutoLink: true,
  parseImgDimensions: true
};

export default ({ content }: { content: string }) => (
  <div className={styles.markdownContent}>
    <Markdown markdown={content} components={components} {...options} />
  </div>
);
