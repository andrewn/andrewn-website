// @flow

import React from 'react';
import { Figure } from './Figure';
import Link, { url, LinkView } from './Link';
import { dateToYear } from '../utils';

import type { Work, Works } from '../models/client';

import { PublishedDate } from './WorkMetaInfo';
import ListHeader from './ListHeader';

import { rootTags } from '../../config';

import styles from './PostList.css';

const Title = ({ text }) =>
  <p className={styles.title}>
    {text}
  </p>;

const Summary = ({ text }) =>
  <p className={styles.summary}>
    {text}
  </p>;

const Date = ({ text }) =>
  text == null
    ? null
    : <p className={styles.publishedDate}>
        {text}
      </p>;

const Item = ({ work }: { work: Work }) => {
  const { slug, summary, title, date, rootTag } = work;

  return (
    <LinkView
      href={url.work({ slug, year: dateToYear(date), rootTag })}
      className={styles.itemLink}
    >
      <div className={styles.itemInner}>
        <Title text={title} />
        <PublishedDate date={date} />
      </div>
    </LinkView>
  );
};

const defaultHeader = (
  <ListHeader
    title="Latest writing"
    href={url.root({ rootTag: rootTags.post.tag })}
    label="All writing"
  />
);

export default ({
  items,
  header = defaultHeader,
}: {
  items: Works,
  header: React.Element<*>,
}) =>
  <section className={styles.container}>
    {header}
    <ol className={styles.list}>
      {items.map(item =>
        <li key={item.id} className={styles.listItem}>
          <Item work={item} />
        </li>,
      )}
    </ol>
  </section>;
