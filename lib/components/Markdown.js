// @flow

import React from "react";
import toPairs from "lodash/toPairs";

import footnotes from "showdown-footnotes";
import Markdown from "react-showdown";

import { numberYears } from "../utils/";

import { Figure } from "./Figure";

import styles from "./Markdown.css";

const Intro = ({ children }) => (
  <div className={styles.intro}>
    <p>{children}</p>
  </div>
);

const Vimeo = ({ videoId, width, height, loop = true }) => (
  <iframe
    src={`https://player.vimeo.com/video/${videoId}?loop=${
      loop ? "1" : "0"
    }&color=ff0179&title=0&byline=0&portrait=0`}
    width={width}
    height={height}
    frameBorder="0"
    webkitallowfullscreen="true"
    mozallowfullscreen="true"
    allowFullScreen
  />
);

const YouTube = ({ videoId, width, height }) => (
  <iframe
    width={width}
    height={height}
    src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&amp;showinfo=0`}
    frameborder="0"
    allow="autoplay; encrypted-media"
    allowfullscreen
  />
);

const videoComponent = (provider: "vimeo" | "youtube") => {
  switch (provider) {
    case "vimeo":
      return Vimeo;
    case "youtube":
      return YouTube;
    default:
      throw new Error(`No video provider found "${provider}"`);
  }
};

const strToBool = (str) => {
  if (str === "true") {
    return true;
  } else if (str === "false") {
    return false;
  }

  return null;
};

const Video = ({
  provider = "vimeo",
  videoId,
  width,
  height,
  align = "left",
  loop,
}) => {
  const Compoent = videoComponent(provider);

  return (
    <div style={{ maxWidth: width }} className={`video is-aligned-${align}`}>
      <Compoent
        videoId={videoId}
        width={width}
        height={height}
        loop={strToBool(loop)}
      />
    </div>
  );
};

const Clear = () => <div className={styles.clear} />;

const toAttributes = (obj) =>
  toPairs(obj)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");

const Script = ({ children, ...props }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: `<script ${toAttributes(props)}></script>`,
    }}
  />
);

const YearsToNow = ({ fromDate }) => {
  return numberYears(fromDate);
};

const components = {
  Figure,
  Intro,
  Clear,
  Video,
  Script,
  YearsToNow,
};

// https://github.com/showdownjs/showdown#valid-options
const options = {
  tables: true,
  simplifiedAutoLink: true,
  parseImgDimensions: true,
  // extensions: [footnotes],
};

export default ({ content }: { content: string }) => (
  <div className={styles.markdownContent}>
    <Markdown
      markdown={content}
      flavor="github"
      components={components}
      {...options}
    />
  </div>
);
