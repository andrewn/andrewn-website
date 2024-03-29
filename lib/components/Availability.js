// @flow

import React from "react";

import Link from "./Link";

import styles from "./Availability.css";

export default () => (
  <div className={`${styles.container}`} data-not-printable>
    <a href="/profile#availability">
      <span className="label">Availability: </span>
      <time dateTime="2019-03">June 2022</time>
    </a>
  </div>
);
