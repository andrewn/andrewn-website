// @flow
import React from "react";

import {
  type Work,
  allPublishedWorks,
  findPublishedWorksByTags,
  published
} from "../models/work";
import {
  Footer,
  Heading,
  Layout,
  Markdown,
  withRoot,
  PostList,
  ProjectList
} from "../components";
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
  static async getInitialProps({
    context: { slug, year, tag, rootTag = undefined }
  }) {
    return {
      works: await findPublishedWorksByTags(rootTag, tag),
      rootTag,
      tag
    };
  }
  render() {
    const { rootTag, tag, works } = this.props;
    const pluralRootTagName = rootTags[rootTag].url;
    const heading =
      rootTag && tag
        ? `${capitalize(pluralRootTagName)} tagged '${tag}'`
        : `All ${pluralRootTagName}`;

    const ListComponent = listComponentForRootTag(rootTag);

    const header = <Heading>{heading}</Heading>;

    return (
      <div>
        <ListComponent items={works} header={header} />
        <Footer />
      </div>
    );
  }
}
