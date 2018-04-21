// @flow

import orderBy from "lodash/orderBy";
import fs from "fs";

import { all } from "./files";
import { type RootTag, selectedProjectsPath } from "../../config";

const selectedProjects = JSON.parse(fs.readFileSync(selectedProjectsPath));

export type Tag = string;

type CalendarDate = string;

export type Work = {|
  content: string,
  date: CalendarDate,
  startDate: ?CalendarDate,
  endDate: ?CalendarDate,
  id: string,
  filename: string,
  link: ?{
    title: string,
    href: string
  },
  published: boolean,
  slug: string,
  title: string,
  summary: ?string,
  image: ?string,
  rootTag: RootTag,
  tags: Tag[],
  tech: ?(Tag[]),
  award: ?string
|};

export type Works = Array<Work>;

export const published = (work: Work) => work && work.published === true;

export const orderByNewest = (works: Works): Works =>
  orderBy(works, ["date", "title"], ["desc", "desc"]);

export const allWorks = async (): Promise<Works> => {
  const data = await all();

  return orderByNewest(data);
};

export const allPublishedWorks = async (): Promise<Works> => {
  const works = await allWorks();
  return Promise.resolve(works.filter(published));
};

export const findWorksByTags = async (
  ...tags: Array<?string>
): Promise<Works> => {
  const all = await allWorks();
  const works = all.filter(w =>
    tags.every(t => (t == null ? true : w.tags.includes(t)))
  );
  if (works == null) {
    return Promise.reject();
  }
  return Promise.resolve(works);
};

export const findPublishedWorksByTags = async (
  ...tags: Array<?string>
): Promise<Works> => {
  const works = await findWorksByTags(...tags);
  return Promise.resolve(works.filter(published));
};

/*
  Individual finders
*/
export const findWork = async ({
  rootTag,
  slug
}: {
  rootTag: RootTag,
  slug: string
}): Promise<Work> => {
  const works = await allWorks();

  const worksMatchingSlug = works.filter(w => w.slug === slug);
  if (worksMatchingSlug == null) {
    return Promise.reject();
  }

  const work = worksMatchingSlug.find(w => w.tags && w.tags[0] === rootTag);

  if (work == null) {
    return Promise.reject();
  }

  return Promise.resolve(work);
};

export const selectedWorks = async (): Promise<Works> => {
  return Promise.all(
    selectedProjects.map(slug => findWork({ rootTag: "project", slug }))
  );
};
