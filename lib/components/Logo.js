// @flow

import React from 'react';

import Availability from './Availability';
import Link from './Link';

import styles from './Logo.css';

export default () => (
  <div className={styles.logo}>
    <Link href="/">
      <a className="themeBorderBottomGradient">
        <span>Andrew Nicolaou</span>
      </a>
    </Link>
  </div>
);
