import React from "react";
import { Helmet } from "react-helmet";

import styles from "./Post.module.css";

export default () => (
  <>
    <Helmet>
      <title>My page</title>
    </Helmet>
    <div className={styles.container}>This is the content of the Post page</div>
  </>
);
