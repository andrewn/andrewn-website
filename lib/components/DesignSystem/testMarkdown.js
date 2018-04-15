// @flow

const testMarkdown = `
# Heading 1

Here's a paragraph of text to see it next to the heading. A web-based mobile-first web app using a chat metaphor to ask users in plain language about their lives. The app then calculates their likely tax rebate and if it's worth filing a tax return.

## Heading 2

Here's a paragraph of text to see it next to the heading. A web-based mobile-first web app using a chat metaphor to ask users in plain language about their lives. The app then calculates their likely tax rebate and if it's worth filing a tax return.

### Heading 3

This is *something* **nice**. Here's a paragraph of text to see it next to the heading. A web-based mobile-first web app using a chat metaphor to ask users in plain language about their lives. The app then calculates their likely tax rebate and if it's worth filing a tax return.

> This is a blockquote

A contextual alternate SXF -> STN.

- A list
- Of thing

1. Ordered list
2. Here 
  - with sublist
  - and another item
3. Final ordered item

\`\`\`js
const Component = () => {
  return (
    <div className="div">
      This is code
    </div>
  );
};
\`\`\`

- [ ] Checklist
- [x] Another one

[A link](http://google.com) goes here.
`;

export default testMarkdown;
