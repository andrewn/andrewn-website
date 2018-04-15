// @flow
import React from 'react';

import styles from './Intro.css';

export const text = `A freelance Creative Technologist working with the web, mobile and
hardware from prototype to production.`;

const elsewhere = (
  <p className={styles.elsewhere}>
    Get in touch: <a href="mailto:hello@andrewnicolaou.co.uk">email</a>,{' '}
    <a href="http://twitter.com/andrewn">tweets</a>.
    <br />
    Elsewhere: <a href="https://github.com/andrewn/">code</a>,{' '}
    <a href="http://www.flickr.com/photos/andrewnicolaou">photos</a>,{' '}
    <a href="http://www.last.fm/user/andrewnicolaou">listening</a>,{' '}
    <a href="http://pinboard.in/u:andrewn">links</a>,{' '}
    <a href="http://a-spark-file.tumblr.com/">magpie</a>,{' '}
    <a href="http://www.bbc.co.uk/rd/people/andrew-nicolaou">BBC projects</a>.
  </p>
);

export default ({ secondary = false }: { secondary?: boolean }) => (
  <header className={`${styles.intro} ${secondary ? styles.secondary : ''}`}>
    <p className={`${styles.summary} ${secondary ? '' : 'themeTextGradient'}`}>
      {text}{' '}
      <a className={`${secondary ? '' : styles.moreLink}`} href="/profile">
        More
      </a>
    </p>
    {elsewhere}
  </header>
);
