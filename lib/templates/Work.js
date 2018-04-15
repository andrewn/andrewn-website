// @flow
import React from "react";

import { findWork } from "../models/work";
import {
  Footer,
  Heading,
  Layout,
  Markdown,
  withRoot,
  WorkMetaInfo
} from "../components";

export default class extends React.Component {
  static async getInitialProps({ context: { slug, year, rootTag } }) {
    const work = await findWork({ slug, rootTag });
    return {
      ...work
    };
  }
  render() {
    const { content, title } = this.props;

    return (
      <section>
        <Heading>{title}</Heading>
        <WorkMetaInfo {...this.props} />
        <Markdown content={content} />
        <Footer />
      </section>
    );
  }
}
