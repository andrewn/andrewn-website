// @flow

import React from 'react';

import Availability from './Availability';
import Logo from './Logo';

import styles from './Masthead.css';

export default () => (
  <div className={styles.container}>
    <Logo />
    <Availability />
  </div>
);
