// @flow
import React from "react";

import { findPublishedWorksByTags, selectedWorks } from "../models/work";
import {
  Figure,
  FigureProvider,
  Intro,
  Layout,
  ListHeader,
  PostList,
  ProjectList,
  withRoot,
  url,
} from "../components";
import { homepage, rootTags } from "../../config";

const prototypesHeader = (
  <ListHeader
    title="Prototyping projects"
    href={url.root({ rootTag: rootTags.project.tag })}
    label="All projects"
  />
);

const productionsHeader = (
  <ListHeader
    title="Production projects"
    href={url.root({ rootTag: rootTags.project.tag })}
    label="All projects"
  />
);

export default class extends React.Component {
  static async getInitialProps() {
    const allPosts = await findPublishedWorksByTags("post");
    const selected = await selectedWorks();

    return {
      selected,
      prototypes: selected.prototypes || [],
      productions: selected.productions || [],
      posts: allPosts.slice(0, homepage.numberOfPostsToDisplay),
    };
  }
  render() {
    const { prototypes = [], productions = [], posts = [] } = this.props;

    const prototypesList =
      prototypes.length === 0 ? null : (
        <ProjectList header={prototypesHeader} items={prototypes} />
      );

    const productionsList =
      productions.length === 0 ? null : (
        <ProjectList header={productionsHeader} items={productions} />
      );

    return (
      <section>
        <Intro />
        {productionsList}
        {prototypesList}
        <PostList items={posts} />
      </section>
    );
  }
}
