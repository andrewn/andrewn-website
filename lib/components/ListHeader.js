// @flow

import React from "react";
import Link from "./Link";

import styles from "./ListHeader.css";

const AllLink = ({ label, href }) => (
  <div className={styles.headerLink}>
    <Link href={href}>
      <span>{label}</span>
    </Link>
  </div>
);

export default ({ label = "All", href, title = "All" }) => (
  <div className={styles.header}>
    <h3 className={styles.headerHeading}>{title}</h3>
    <AllLink label={label} href={href} />
  </div>
);
