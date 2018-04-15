// @flow

import path from "path";

export const root = __dirname;
export const outputRoot = path.join(root, "dist");
export const contentRoot = path.join(root, "content");
export const staticRoot = path.join(root, "static");
export const selectedProjectsPath = path.join(contentRoot, "selected.json");
export const rootTags = {
  project: {
    url: "projects",
    tag: "project",
    dirPath: path.join(contentRoot, "projects")
  },
  post: {
    url: "posts",
    tag: "post",
    dirPath: path.join(contentRoot, "posts")
  },
  misc: {
    url: "misc",
    tag: "misc",
    dirPath: path.join(contentRoot, "misc")
  }
};
export const homepage = {
  numberOfPostsToDisplay: 5
};

export type RootTag = $Keys<typeof rootTags>;
export type Tag = string;
