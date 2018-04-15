// @flow

import React from 'react';
import Masthead from '../Masthead';

import styles from './index.css';
import './typography.css';

export default ({ children }: { children: React.Element<*> }) => {
  return (
    <div className={styles.container}>
      <div className={styles.containerInner}>
        <Masthead />
        {children}
      </div>
    </div>
  );
};
