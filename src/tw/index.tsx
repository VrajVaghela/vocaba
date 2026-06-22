import { Link as RouterLink } from "expo-router";
import React from "react";
import {
  Pressable as RNPressable,
  StyleProp,
  ScrollView as RNScrollView,
  StyleSheet,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableHighlight as RNTouchableHighlight,
  View as RNView,
  ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import {
  useCssElement,
  useNativeVariable as useFunctionalVariable,
} from "react-native-css";

type CssInterop = (
  component: React.ComponentType<unknown>,
  props: unknown,
  mapping: Record<string, string>,
) => React.ReactElement;

const cssElement = useCssElement as CssInterop;

export const Link = (
  props: React.ComponentProps<typeof RouterLink> & { className?: string },
) => {
  return cssElement(RouterLink as React.ComponentType<unknown>, props, {
    className: "style",
  });
};

Link.Trigger = RouterLink.Trigger;
Link.Menu = RouterLink.Menu;
Link.MenuAction = RouterLink.MenuAction;
Link.Preview = RouterLink.Preview;

export const useCSSVariable =
  process.env.EXPO_OS !== "web"
    ? useFunctionalVariable
    : (variable: string) => `var(${variable})`;

export type ViewProps = React.ComponentProps<typeof RNView> & {
  className?: string;
};

export const View = (props: ViewProps) => {
  return cssElement(RNView as React.ComponentType<unknown>, props, {
    className: "style",
  });
};
View.displayName = "CSS(View)";

export const Text = (
  props: React.ComponentProps<typeof RNText> & { className?: string },
) => {
  return cssElement(RNText as React.ComponentType<unknown>, props, {
    className: "style",
  });
};
Text.displayName = "CSS(Text)";

export const ScrollView = (
  props: React.ComponentProps<typeof RNScrollView> & {
    className?: string;
    contentContainerClassName?: string;
  },
) => {
  return cssElement(RNScrollView as React.ComponentType<unknown>, props, {
    className: "style",
    contentContainerClassName: "contentContainerStyle",
  });
};
ScrollView.displayName = "CSS(ScrollView)";

export const Pressable = (
  props: React.ComponentProps<typeof RNPressable> & { className?: string },
) => {
  return cssElement(RNPressable as React.ComponentType<unknown>, props, {
    className: "style",
  });
};
Pressable.displayName = "CSS(Pressable)";

export const TextInput = (
  props: React.ComponentProps<typeof RNTextInput> & { className?: string },
) => {
  return cssElement(RNTextInput as React.ComponentType<unknown>, props, {
    className: "style",
  });
};
TextInput.displayName = "CSS(TextInput)";

export const AnimatedScrollView = (
  props: React.ComponentProps<typeof Animated.ScrollView> & {
    className?: string;
    contentClassName?: string;
    contentContainerClassName?: string;
  },
) => {
  return cssElement(Animated.ScrollView as React.ComponentType<unknown>, props, {
    className: "style",
    contentClassName: "contentContainerStyle",
    contentContainerClassName: "contentContainerStyle",
  });
};
AnimatedScrollView.displayName = "CSS(AnimatedScrollView)";

function XXTouchableHighlight(
  props: React.ComponentProps<typeof RNTouchableHighlight> & {
    style?: StyleProp<ViewStyle & { underlayColor?: string }>;
  },
) {
  const { underlayColor, ...style } =
    (StyleSheet.flatten(props.style) as (ViewStyle & { underlayColor?: string }) | undefined) ||
    {};

  return (
    <RNTouchableHighlight
      underlayColor={underlayColor}
      {...props}
      style={style}
    />
  );
}

export const TouchableHighlight = (
  props: React.ComponentProps<typeof RNTouchableHighlight> & {
    className?: string;
  },
) => {
  return cssElement(XXTouchableHighlight as React.ComponentType<unknown>, props, {
    className: "style",
  });
};
TouchableHighlight.displayName = "CSS(TouchableHighlight)";
