import { Image as RNImage } from "expo-image";
import React from "react";
import { ImageStyle, StyleProp, StyleSheet } from "react-native";
import { useCssElement } from "react-native-css";

type CssInterop = (
  component: React.ComponentType<unknown>,
  props: unknown,
  mapping: Record<string, string>,
) => React.ReactElement;

const cssElement = useCssElement as CssInterop;

export type ImageProps = React.ComponentProps<typeof Image>;

type CSSImageStyle = ImageStyle & {
  objectFit?: React.ComponentProps<typeof RNImage>["contentFit"];
  objectPosition?: React.ComponentProps<typeof RNImage>["contentPosition"];
};

function CSSImage(
  props: React.ComponentProps<typeof RNImage> & {
    style?: StyleProp<CSSImageStyle>;
  },
) {
  const { objectFit, objectPosition, ...style } =
    (StyleSheet.flatten(props.style) as CSSImageStyle | undefined) || {};

  return (
    <RNImage
      contentFit={objectFit}
      contentPosition={objectPosition}
      {...props}
      source={
        typeof props.source === "string" ? { uri: props.source } : props.source
      }
      style={style}
    />
  );
}

export const Image = (
  props: React.ComponentProps<typeof CSSImage> & { className?: string },
) => {
  return cssElement(CSSImage as React.ComponentType<unknown>, props, {
    className: "style",
  });
};

Image.displayName = "CSS(Image)";
