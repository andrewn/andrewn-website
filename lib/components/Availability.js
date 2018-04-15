// @flow

import React from 'react';

import Link from './Link';

import styles from './Availability.css';

export default () => (
  <div className={`${styles.container}`} data-not-printable>
    <Link>
      <a href="/profile#availability">
        <span className="label">Availability: </span>
        <time datetime="2018-03">March 2018</time>
      </a>
    </Link>
  </div>
);
