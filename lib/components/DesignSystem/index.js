// @flow

import React from 'react';
import Markdown from '../Markdown';

import testMarkdown from './testMarkdown';

export default () => {
  return (
    <div>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <p>This is paragraph text</p>
      <blockquote>This is a blockquote</blockquote>
      <h2>Markdown content</h2>
      <Markdown content={testMarkdown} />
    </div>
  );
};
