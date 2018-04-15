// @flow

import React from 'react';
import { Figure } from './Figure';
import Link, { url, LinkView } from './Link';
import { dateToYear } from '../utils';
import { rootTags } from '../../config';
import { OptionalDuration } from './WorkMetaInfo';
import ListHeader from './ListHeader';

import type { Work, Works } from '../models/client';

import styles from './ProjectList.css';

const Title = ({ text }) =>
  <p className={styles.title}>
    {text}
  </p>;

const Summary = ({ text }) =>
  <p className={styles.summary}>
    {text}
  </p>;

const Award = ({ text }) =>
  text == null
    ? null
    : <p className={`themeGradientOpacity ${styles.award}`}>
        {text}
      </p>;

const Image = ({ source }) =>
  source == null
    ? null
    : <div className={styles.image}>
        <Figure source={source} />
        <span className={`themeGradientOpacity ${styles.imageHover}`} />
      </div>;

const Project = ({ work }: { work: Work }) => {
  const { award, image, slug, summary, title, date, tags, rootTag } = work;
  const hasImage = image != null;

  let link = null;

  if (work.link && work.link.href) {
    link = work.link.href;
  } else if (work.link === false) {
    link = null;
  } else {
    link = url.work({ slug, year: dateToYear(date), rootTag });
  }

  const classes = [
    link != null ? styles.projectLink : '',
    hasImage ? styles.hasImage : ''
  ].join(
    ' ',
  );

  const inner = (
    <div className={styles.projectInner}>
      <Title text={title} />
      <Award text={award} />
      <Summary text={summary} />
      <Image source={image} />
    </div>
  );

  if (link != null) {
    return (
      <LinkView
        href={link}
        className={classes}
      >
        {inner}
      </LinkView>
    );
  }

  return (
    <div
      className={classes}
    >
      {inner}
    </div>
  );
};

const defaultHeader = (
  <ListHeader
    title="Selected projects"
    href={url.root({ rootTag: rootTags.project.tag })}
    label="All projects"
  />
);

export default ({
  items,
  header = defaultHeader,
}: {
  items: Works,
  header: React.Element,
}) =>
  <section className={styles.recentProjects}>
    {header}
    <ol className={styles.recentProjectsList}>
      {items.map(item =>
        <li key={item.id} className={styles.recentProjectsListItem}>
          <Project work={item} />
        </li>,
      )}
    </ol>
  </section>;
