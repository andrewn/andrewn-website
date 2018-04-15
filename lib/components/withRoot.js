// @flow
import React from "react";

import Root from "./Root";
// import { allImages } from '../models/client';

export default function withRoot(
  WrappedComponent: Class<React.Component<*, *, *>>
) {
  return class extends React.Component {
    static async getInitialProps(...params) {
      const wrappedGetInitialProps =
        typeof WrappedComponent.getInitialProps === "function"
          ? await WrappedComponent.getInitialProps(...params)
          : null;

      return {
        ...wrappedGetInitialProps
        // imageStore: await allImages()
      };
    }

    render() {
      const { imageStore, ...props } = this.props;
      return (
        <Root imageStore={imageStore}>
          <WrappedComponent {...props} />
        </Root>
      );
    }
  };
}
