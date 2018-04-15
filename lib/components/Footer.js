// @flow

import React from 'react';

import Intro from './Intro';

import styles from './Footer.css';

export default () => (
  <footer className={styles.footer}>
    <Intro secondary />
  </footer>
);
