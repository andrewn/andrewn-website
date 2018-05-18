// @flow

import React from "react";

const Context = React.createContext([]);

import type { Image, Images } from "../../models/images";

import styles from "./index.css";

export const FigureProvider = Context.Provider;

const srcSetForSizes = (sizes): string =>
  sizes.map(({ path, size }) => `${path} ${size}w`).join(", ");

// TODO: Figure out how to specift these in different places
// const sizesForSizes = (sizes): string => sizes.map(({ path, size }) => `(min-width: ${size}px) ${size}vw`).join(', ');
const sizesForSizes = (sizes): string => `(min-width: 400px) 335px`;

type Caption = React.Element<*>;

type Alignment = "left" | "right" | "center";

type PublicProps = {
  caption?: Caption,
  alt?: string,
  align?: Alignment
};

type BaseFigureProps = Image & PublicProps;

const BaseFigure = ({
  source,
  sizes,
  caption,
  align = "left",
  alt = ""
}: BaseFigureProps) => (
  <figure className={`${styles.figure} is-aligned-${align}`}>
    <img
      src={sizes[0].path}
      srcSet={srcSetForSizes(sizes)}
      sizes={sizesForSizes(sizes)}
      alt={alt}
    />
    {caption ? (
      <figcaption className={styles.figcaption}>{caption}</figcaption>
    ) : null}
  </figure>
);

const NotFoundFigure = ({ source }) => (
  <span className={styles.notFoundFigure}>⚠️ '{source}' not found</span>
);

const WrappedFigure = ({
  imageStore,
  source,
  caption,
  align
}: {
  imageStore: Images,
  source: string,
  caption?: Caption,
  align?: Alignment
}) => {
  const sourceImage = imageStore[source];

  if (sourceImage != null) {
    const { sizes, source } = sourceImage;
    return (
      <BaseFigure
        sizes={sizes}
        source={source}
        caption={caption}
        align={align}
      />
    );
  }

  return <NotFoundFigure source={source} />;
};

export const Figure = props => (
  <Context.Consumer>
    {images => <WrappedFigure {...props} imageStore={images} />}
  </Context.Consumer>
);
