// @flow

export const isDev = (nodeEnv: ?string = process.env.NODE_ENV) =>
  nodeEnv !== 'production';
