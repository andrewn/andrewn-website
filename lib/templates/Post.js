import React from "react";
import { Helmet } from "react-helmet";

import styles from "./Post.module.css";

export default ({ data }) => (
  <>
    <Helmet>
      <title>My page</title>
    </Helmet>
    <div className={styles.container}>
      This is the content of the Post page
      <br />
      {data ? `There are ${data.length} items.` : "No data"}
    </div>
  </>
);
