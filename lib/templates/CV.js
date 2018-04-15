// @flow
import React from "react";

import { findWorksByTags } from "../models/work";
import { Markdown } from "../components";

import styles from "./CV.module.css";

export default class extends React.Component {
  static async getInitialProps() {
    const cv = await findWorksByTags("cv");
    return {
      cv: cv != null ? cv[0] : "Not found"
    };
  }
  render() {
    const { cv } = this.props;

    if (cv == null) {
      return <p>Nowt</p>;
    }

    return (
      <section className={styles.cv}>
        <Markdown content={cv.content} />
      </section>
    );
  }
}
