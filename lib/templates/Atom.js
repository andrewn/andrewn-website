// @flow
import React from "react";
import capitalize from "lodash/capitalize";

import { type Work, allPublishedWorks } from "../models/work";
import { type RootTag, rootTags } from "../../config";

const listComponentForRootTag = (rootTag: RootTag) => {
  switch (rootTag) {
    case rootTags.post.tag:
      return PostList;
    case rootTags.project.tag:
      return ProjectList;
  }
};

export default class extends React.Component {
  static async getInitialProps({ context: {} }) {
    return {
      works: await allPublishedWorks()
    };
  }
  render() {
    const { works } = this.props;
    // const pluralRootTagName = rootTags[rootTag].url;
    // const heading =
    //   rootTag && tag
    //     ? `${capitalize(pluralRootTagName)} tagged '${tag}'`
    //     : `All ${pluralRootTagName}`;

    // const ListComponent = listComponentForRootTag(rootTag);

    // const header = <Heading>{heading}</Heading>;

    const base = "http://andrewnicolaou.co.uk";

    return (
      <feed xmlns="http://www.w3.org/2005/Atom">
        <title>Andrew Nicolaou - latest</title>
        <link href={base} />
        <updated>{new Date().toISOString()}</updated>
        <author>
          <name>Andrew Nicolaou</name>
        </author>
        <id>{base}</id>

        {works.map(work => (
          <entry>
            <title>{work.title}</title>
            <link href={`${base}`} />
            <id>urn:uuid:1225c695-cfb8-4ebb-aaaa-80da344efa6a</id>
            <updated>{/*work.endDate.toISOString()*/}</updated>
            <summary>{work.summary}</summary>
          </entry>
        ))}
      </feed>
    );
  }
}
