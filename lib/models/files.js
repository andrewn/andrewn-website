// @flow

import type { Work, Works } from "../work";

import { type RootTag, rootTags } from "../../config";

const promisify = require("util").promisify;
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

type Path = {
  file: string,
  path: string
};

type FilenameMeta = {
  date: string,
  slug: string
};

const fileToPath = (dirPath: string, file: string): Path => ({
  file,
  path: path.join(dirPath, file)
});

export const filesInDir = async (dirPath: string): Promise<Path[]> => {
  const files = await readdir(dirPath);
  return files.map(f => fileToPath(dirPath, f));
};

// Matches all *.md except *.ignore.md
const typeMatcher = /^(?!.*ignore\.md$).*\.md$/;
const filenameMatcher = /^([0-9]{4}-[0-9]{2}-[0-9]{2})-(.*)\..*$/;

export const markdownTypes = (paths: Array<Path>) =>
  paths.filter(({ file }) => typeMatcher.test(file));

export const filenameParser = (file: string): FilenameMeta => {
  const parts = filenameMatcher.exec(file);
  return {
    date: parts[1],
    slug: parts[2]
  };
};

const parseTags = (tags: string[] | string = []): string[] => {
  if (typeof tags === "string") {
    return tags.split(" ");
  }

  return tags;
};

export const content = async (
  rootTag: RootTag,
  { file, path }: Path
): Promise<Work> => {
  const contents = await readFile(path);
  const { data, content, orig } = matter(contents.toString());
  const { date, slug } = filenameParser(file);

  return {
    content,
    date,
    id: `${rootTag}-${file}`,
    image: data.image || null,
    filename: file,
    award: data.award || null,
    link:
      data.link != null && data.link instanceof Array
        ? { title: data.link[0], href: data.link[1] }
        : data.link,
    published: data.published != null ? data.published : false,
    slug,
    summary: data.summary || null,
    startDate: data.start || null,
    endDate: data.end || null,
    rootTag: rootTag,
    tags: [rootTag, ...parseTags(data.tags)],
    tech: data.tech,
    title: data.title
  };
};

export const fileContentsUnderRootTag = async (
  rootTag: RootTag,
  dirPath: string
): Promise<Works> => {
  const list = await filesInDir(dirPath);
  const markdownPaths = markdownTypes(list);
  const fileContents = markdownPaths.map(path => content(rootTag, path));
  return Promise.all(fileContents);
};

export const all = async (): Promise<Works> => {
  try {
    const projects = await fileContentsUnderRootTag(
      rootTags.project.tag,
      rootTags.project.dirPath
    );

    const posts = await fileContentsUnderRootTag(
      rootTags.post.tag,
      rootTags.post.dirPath
    );

    const misc = await fileContentsUnderRootTag(
      rootTags.misc.tag,
      rootTags.misc.dirPath
    );

    return [...projects, ...posts, ...misc];
  } catch (err) {
    console.error("error");
    console.error(err);

    return [];
  }
};
