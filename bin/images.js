#!/usr/bin/env node
// @flow

const chalk = require('chalk');
const flatMap = require('lodash/flatMap');
const fs = require('fs');
const glob = require('glob');
const imagemagick = require('imagemagick');
const path = require('path');
const promisify = require('util').promisify;

const identify = promisify(imagemagick.identify);
const readMetadata = promisify(imagemagick.readMetadata);
// const resize = promisify(imagemagick.resize);
const convert = promisify(imagemagick.convert);

const config = require('../config');
const contentRoot = config.contentRoot;
const staticRoot = config.staticRoot;

type Path = string;

type PathValue = {
  wholePath: Path,
  minusRoot: Path,
  minusRootWithPlaceholder: Path,
};

const outputSizes = [1024, 768, 320];

const placeholder = '{SIZE}';
const imagePattern = /(.*)(.jpg|.png)$/;

const searchPattern = path.join(contentRoot, '/**/*.?(jpg|png)');

const stringifyPathValue = ({
  wholePath,
  minusRoot,
  minusRootWithPlaceholder,
}: PathValue): string =>
  `${wholePath} - ${minusRoot} - ${minusRootWithPlaceholder}`;

const toPathValue = (path: Path): PathValue => ({
  wholePath: path,
  minusRoot: path.replace(contentRoot, ''),
  minusRootWithPlaceholder: path
    .replace(contentRoot, '')
    .replace(imagePattern, `$1${placeholder}$2`),
});

// See: https://www.smashingmagazine.com/2015/06/efficient-image-resizing-with-imagemagick/#bash-shell
const resizeArgs = ({ srcPath, dstPath, width }: ResizeArgs): Array<string> => [
  srcPath,
  '-filter',
  'Triangle',
  '-define',
  'filter:support=2',
  '-thumbnail',
  width.toString(),
  '-unsharp',
  '0.25x0.25+8+0.065',
  '-dither',
  'None',
  '-posterize',
  '136',
  '-quality',
  '82',
  '-define',
  'jpeg:fancy-upsampling=off',
  '-define',
  'png:compression-filter=5',
  '-define',
  'png:compression-level=9',
  '-define',
  'png:compression-strategy=1',
  '-define',
  'png:exclude-chunk=all',
  '-interlace',
  'none',
  '-colorspace',
  'sRGB',
  '-strip',
  dstPath,
];

type ResizeArgs = {
  srcPath: Path,
  dstPath: Path,
  width: number,
};

const resize = (params: ResizeArgs): Promise<void> => {
  return convert(resizeArgs(params));
};

type Dimensions = { width: number, height: number };

const getSize = async (path: PathValue): Promise<Dimensions> => {
  const dimensions = await identify(['-format', '%wx%h', path.wholePath]);
  const [width, height] = dimensions.split('x');

  return {
    width,
    height,
  };
};

type Result = {
  path: Path,
  err: ?(string | Error),
};

const convertToSize = async (
  source: PathValue,
  targetWidth: number,
  index: number,
): Promise<Result> => {
  const outputFile = source.minusRootWithPlaceholder.replace(
    placeholder,
    `-${targetWidth}`,
  );
  const outputPath = path.join(staticRoot, outputFile);
  const outputDirPath = path.dirname(outputPath);

  if (fs.existsSync(outputDirPath) === false) {
    console.log('  ', chalk.bold(`Creating ${outputDirPath}`));
    mkdir(outputDirPath);
  }

  const { width } = await getSize(source);

  if (index > 0 && targetWidth > width) {
    return Promise.resolve({
      path: outputPath,
      err: `Target of ${targetWidth} is greater than ${width}`,
    });
  }

  return resize({
    srcPath: source.wholePath,
    dstPath: outputPath,
    width: targetWidth,
  }).then(
    () => ({ path: outputPath, err: null }),
    err => ({ path: outputPath, err }),
  );
  // TODO:
  // - [ ] do size conversion here and copy to output path
  // - [ ] do not convert if outputPath already exists?
  // - [ ] parallelise conversion?
};

const state = {
  skipped: 0,
  success: 0,
  error: 0,
  total: 0,
};

const settled = promises => {
  var results = [];
  var done = promises.length;

  return new Promise(function(resolve) {
    function tryResolve(i, v) {
      results[i] = v;
      done = done - 1;
      if (done == 0) resolve(results);
    }

    for (var i = 0; i < promises.length; i++)
      promises[i].then(tryResolve.bind(null, i), tryResolve.bind(null, i));
    if (done == 0) resolve(results);
  });
};

const process = (pathValue: PathValue): Array<Promise<Result>> => {
  const sourcePath = pathValue.wholePath;

  const group = outputSizes.map((targetWidth, index) =>
    convertToSize(pathValue, targetWidth, index),
  );

  settled(group).then(results => {
    console.log('Process: ');
    console.log('  ', sourcePath);

    results.map(({ path, err }) => {
      state.total += 1;

      if (typeof err === 'string') {
        console.log('  ', chalk.blue(path));
        console.log('  ', chalk.blue(err));
        state.skipped += 1;
      } else if (err != null) {
        console.log('  ', chalk.red(path));
        console.log('  ', err.message);
        state.error += 1;
      } else {
        console.log('  ', chalk.green(path));
        state.success += 1;
      }
    });
  });

  return group;
};

const main = () => {
  console.log('Searching: ', searchPattern);

  const images = glob.sync(searchPattern).map(toPathValue);

  // console.log('Would transform:');
  // console.log(images.map(stringifyPathValue).join('\n'));

  const all = flatMap(images, process);

  settled(all).then(() => {
    console.log(chalk.bold('---'));
    console.log('Skipped', chalk.bold(state.skipped));
    console.log('Success', chalk.bold(state.success));
    console.log('Error', chalk.bold(state.error));
    console.log('Total', chalk.bold(state.total));

    if (state.skipped + state.success + state.error !== state.total) {
      console.log(chalk.red('Warning, total does not match'));
    }
  });
};

main();

function mkdir(dir, mode) {
  const parent = path.dirname(dir);
  const parentExists = fs.existsSync(parent);
  const targetExists = fs.existsSync(dir);

  if (targetExists) {
    return;
  } else if (!targetExists && !parentExists) {
    mkdir(parent);
  } else {
    fs.mkdirSync(dir, mode);
  }
}
