// @flow

import React from 'react';

import styles from './Heading.css';

export default ({ children }: { children: ?React.Element<*> }) =>
  <h1 className={styles.heading}>
    {children}
  </h1>;
