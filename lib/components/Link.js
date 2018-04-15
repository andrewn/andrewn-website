// @flow

import React from "react";
// import Link from 'next/link';

import { type Tag, type RootTag, rootTags } from "../../config";

type Props = {
  children: React.Element<*>,
  href: string
};

type WorkPath = {
  rootTag: RootTag,
  year: number,
  slug: string
};

type TagPath = {
  rootTag: RootTag,
  tag: Tag
};

type WorkRoot = {
  rootTag: RootTag
};

export const workPath = ({ rootTag, year, slug }: WorkPath) =>
  `/${rootTags[rootTag].url}/${year}/${slug}`;

export const tagPath = ({ rootTag, tag }: TagPath) =>
  `/${rootTags[rootTag].url}/tagged/${tag}`;

export const workRoot = ({ rootTag }: WorkRoot) => `/${rootTags[rootTag].url}`;

export const url = {
  work: workPath,
  root: workRoot,
  tag: tagPath,
  home: () => `/`
};

export const LinkView = ({ children, href, className = "" }: Props) => (
  <a className={`noThemeHoverBorder ${className}`} href={href}>
    {children}
  </a>
);

export default ({ children, href }: Props) => (
  <address href={href}>{children}</address>
);
