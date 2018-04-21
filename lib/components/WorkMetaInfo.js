// @flow

import React from "react";
import flatMap from "lodash/flatMap";

import { type Work } from "../models/client/work";
import { dateToDayMonthYear, dateToMonthYear } from "../utils/index";
import { type RootTag, type Tag as TagType } from "../../config";
import { url } from "./Link";

import styles from "./WorkMetaInfo.css";

const Tag = ({ rootTag, tag }: { rootTag: RootTag, tag: TagType }) => (
  <a href={url.tag({ rootTag, tag })}>{tag}</a>
);

/*
  Something, something and something.
*/
const separatorForPosition = (
  position: number,
  total: number
): " and " | ", " | "" => {
  if (position === total - 2) {
    return " and ";
  } else if (position < total - 1) {
    return ", ";
  } else {
    return "";
  }
};

const addComma = items =>
  flatMap(items, (value, index, array) => [
    value,
    separatorForPosition(index, array.length)
  ]);

const TagList = ({ tags }: { tags: TagType[] }) => {
  const [rootTag, ...otherTags] = tags;
  const list = otherTags.map(tag => (
    <Tag key={tag} rootTag={rootTag} tag={tag} />
  ));

  return (
    <div>
      This is a <a href={url.root({ rootTag })}>{rootTag}</a> about{" "}
      {addComma(list)}.
    </div>
  );
};

const Line = ({ children }) => <p className={styles.line}>{children}</p>;

export const PublishedDate = ({ date }) => (
  <Line>Published on {dateToDayMonthYear(date)}</Line>
);

const Duration = ({ startDate, endDate }) => (
  <Line>
    {dateToMonthYear(startDate)}—{dateToMonthYear(endDate)}
  </Line>
);

export const OptionalDuration = ({ work }: { work: Work }) => {
  if (work.startDate && work.endDate) {
    return <Duration startDate={work.startDate} endDate={work.endDate} />;
  }

  return null;
};

const SomeKindOfDate = ({ work }: { work: Work }) => {
  if (work.startDate && work.endDate) {
    return <Duration startDate={work.startDate} endDate={work.endDate} />;
  } else if (work.date) {
    return <PublishedDate date={work.date} />;
  }

  return null;
};

export default (work: Work) => (
  <div>
    <SomeKindOfDate work={work} />
    {work.tags == null || work.tags.length === 0 ? null : (
      <TagList tags={work.tags} />
    )}
  </div>
);
