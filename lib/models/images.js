// @flow

const promisify = require('util').promisify;
const fs = require('fs');
const path = require('path');
const originalGlob = require('glob');
const lodash = require('lodash');

import { root, staticRoot } from '../../config';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const glob = promisify(originalGlob);

const basePath = root;
const Types = {
  project: {
    dirPath: path.join(staticRoot, 'projects', 'images'),
  },
  post: {
    dirPath: path.join(staticRoot, 'posts', 'images'),
  },
};

type ImageSize = {
  path: string,
  size: number,
};
export type Image = {
  source: string,
  sizes: ImageSize[],
};
export type Images = { [path: string]: Image };

type ImageMetadata = {
  source: Path,
  path: Path,
  size: ImageSize,
};

type Path = string;

const extractPathInfo = (basePath: Path, path: Path): Path =>
  path.replace(staticRoot, '');

const imagePattern = '(png|svg|jpg)';

export const filesInDir = async (
  basePath: Path,
  dirPath: Path,
): Promise<Path[]> => {
  const files: Path[] = await glob(path.join(dirPath, `**/*.@${imagePattern}`));
  return Promise.resolve(files.map(f => extractPathInfo(basePath, f)));
};

//
// TODO: Also parse the original file path without the size
//
const filenameMatcher = new RegExp(`(.*)(-(\\d+)).${imagePattern}`);
const SIZE_WITH_SEPARATOR = 2; // '-768'
const SIZE = 3; // '768'

export const filenameParser = (file: string): ?ImageMetadata => {
  const parts = filenameMatcher.exec(file);
  if (parts && parts[SIZE] && parts[SIZE_WITH_SEPARATOR]) {
    return {
      source: file.replace(parts[SIZE_WITH_SEPARATOR], ''),
      path: file,
      size: lodash.toNumber(parts[SIZE]),
    };
  }
  return null;
};

const transformToSizes = (array: ImageMetadata[]): Image => ({
  source: array[0].source,
  sizes: lodash(array)
    .map(({ size, path }) => ({ size, path }))
    .sortBy('size')
    .value(),
});

export const all = async (): Promise<Images> => {
  const list = [
    ...(await filesInDir(basePath, Types.project.dirPath)),
    ...(await filesInDir(basePath, Types.post.dirPath)),
  ];
  const data = lodash(list)
    .map(filenameParser)
    .compact()
    .groupBy('source')
    .mapValues(transformToSizes)
    .value();

  return Promise.resolve(data);
};
