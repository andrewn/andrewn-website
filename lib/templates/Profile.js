// @flow
import React from "react";

import { findWorksByTags } from "../models/work";
import { Footer, Markdown } from "../components";

export default class extends React.Component {
  static async getInitialProps() {
    const work = await findWorksByTags("profile");
    return {
      work: work != null ? work[0] : "Not found"
    };
  }
  render() {
    const { work } = this.props;

    if (work == null) {
      return <p>Nowt</p>;
    }

    return (
      <section>
        <Markdown content={work.content} />
        <Footer />
      </section>
    );
  }
}
