// @flow
import React from "react";
import capitalize from "lodash/capitalize";

import { type Work, allPublishedWorks } from "../models/work";
import { url } from "../components/Link";
import { type RootTag, rootTags } from "../../config";

const listComponentForRootTag = (rootTag: RootTag) => {
  switch (rootTag) {
    case rootTags.post.tag:
      return PostList;
    case rootTags.project.tag:
      return ProjectList;
  }
};

const hasDate = (w: Work) => w.date != null;
const isProjectOrPost = (w: Work) =>
  [rootTags.project.tag, rootTags.post.tag].includes(w.rootTag);

export default class extends React.Component {
  static async getInitialProps({ context: {} }) {
    return {
      works: await allPublishedWorks()
    };
  }
  render() {
    const works = this.props.works.filter(hasDate).filter(isProjectOrPost);
    const base = "http://andrewnicolaou.co.uk";

    return (
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>Andrew Nicolaou - Latest</title>
        <link rel="self" href={`${base}/latest.atom`} />
        <link href={base} />
        <updated>{new Date().toISOString()}</updated>
        <author>
          <name>Andrew Nicolaou</name>
        </author>
        <id>{base}/</id>

        {works.map(work => (
          <entry key={work.slug}>
            <title>
              {capitalize(work.rootTag)}: {work.title}
            </title>
            <link href={`${base}${work.urlPath}`} />
            <id>{`${base}${work.urlPath}`}</id>
            <updated>{new Date(work.date).toISOString()}</updated>
            {work.summary ? <summary>{work.summary}</summary> : ""}
          </entry>
        ))}
      </feed>
    );
  }
}
