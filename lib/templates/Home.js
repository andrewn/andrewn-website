// @flow
import React from "react";

import { findPublishedWorksByTags, selectedWorks } from "../models/work";
import {
  Figure,
  FigureProvider,
  Intro,
  Layout,
  PostList,
  ProjectList,
  withRoot
} from "../components";
import { homepage } from "../../config";

export default class extends React.Component {
  static async getInitialProps() {
    const allPosts = await findPublishedWorksByTags("post");
    return {
      items: await selectedWorks(),
      posts: allPosts.slice(0, homepage.numberOfPostsToDisplay)
    };
  }
  render() {
    const { items = [], posts = [] } = this.props;

    if (items.length === 0) {
      return <p>Nowt</p>;
    }

    return (
      <section>
        <Intro />
        <ProjectList items={items} />
        <PostList items={posts} />
      </section>
    );
  }
}
