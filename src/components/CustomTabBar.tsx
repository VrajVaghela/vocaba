import React, { useEffect, useState } from "react";
import { Dimensions, LayoutChangeEvent, Platform } from "react-native";
import { View, Text, Pressable } from "@/tw";
import { SymbolView, SFSymbol, AndroidSymbol } from "expo-symbols";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface IconMapping {
  ios: SFSymbol;
  android: AndroidSymbol;
  web: AndroidSymbol;
}

interface TabConfig {
  name: string;
  label: string;
  icon: IconMapping;
  activeIcon: IconMapping;
}

const TABS: TabConfig[] = [
  {
    name: "home",
    label: "Home",
    icon: {
      ios: "house" as SFSymbol,
      android: "home" as AndroidSymbol,
      web: "home" as AndroidSymbol,
    },
    activeIcon: {
      ios: "house.fill" as SFSymbol,
      android: "home" as AndroidSymbol,
      web: "home" as AndroidSymbol,
    },
  },
  {
    name: "learn",
    label: "Learn",
    icon: {
      ios: "book.closed" as SFSymbol,
      android: "menu_book" as AndroidSymbol,
      web: "menu_book" as AndroidSymbol,
    },
    activeIcon: {
      ios: "book.closed.fill" as SFSymbol,
      android: "menu_book" as AndroidSymbol,
      web: "menu_book" as AndroidSymbol,
    },
  },
  {
    name: "ai-teacher",
    label: "Teacher",
    icon: {
      ios: "play.rectangle" as SFSymbol,
      android: "smart_display" as AndroidSymbol,
      web: "smart_display" as AndroidSymbol,
    },
    activeIcon: {
      ios: "play.rectangle.fill" as SFSymbol,
      android: "smart_display" as AndroidSymbol,
      web: "smart_display" as AndroidSymbol,
    },
  },
  {
    name: "chat",
    label: "Chat",
    icon: {
      ios: "bubble.left.and.bubble.right" as SFSymbol,
      android: "chat" as AndroidSymbol,
      web: "chat" as AndroidSymbol,
    },
    activeIcon: {
      ios: "bubble.left.and.bubble.right.fill" as SFSymbol,
      android: "chat" as AndroidSymbol,
      web: "chat" as AndroidSymbol,
    },
  },
  {
    name: "profile",
    label: "Profile",
    icon: {
      ios: "person.crop.circle" as SFSymbol,
      android: "person" as AndroidSymbol,
      web: "person" as AndroidSymbol,
    },
    activeIcon: {
      ios: "person.crop.circle.fill" as SFSymbol,
      android: "person" as AndroidSymbol,
      web: "person" as AndroidSymbol,
    },
  },
];

interface TabButtonProps {
  isActive: boolean;
  label: string;
  icon: IconMapping;
  activeIcon: IconMapping;
  onPress: () => void;
  onLongPress: () => void;
}

function TabButton({
  isActive,
  label,
  icon,
  activeIcon,
  onPress,
  onLongPress,
}: TabButtonProps) {
  const progress = useSharedValue(isActive ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(isActive ? 1 : 0, {
      damping: 15,
      stiffness: 150,
    });
  }, [isActive, progress]);

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [-8, 0]),
        },
      ],
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [1, 0]),
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [0, 12]),
        },
        {
          scale: interpolate(progress.value, [0, 1], [1, 0.7]),
        },
      ],
    };
  });

  const currentIcon = isActive ? activeIcon : icon;
  const iconColor = isActive ? "#FFFFFF" : "#6B7280";

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-1 h-full items-center justify-center relative"
      accessibilityRole="button"
      accessibilityState={isActive ? { selected: true } : {}}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
      })}
    >
      <Animated.View
        className="absolute items-center justify-center w-12 h-12"
        style={iconStyle}
      >
        <SymbolView
          name={currentIcon}
          tintColor={iconColor}
          size={24}
        />
      </Animated.View>

      <Animated.View
        className="absolute bottom-2 items-center justify-center"
        style={textStyle}
      >
        <Text
          className="text-[11px] text-text-secondary"
          style={{ fontFamily: "Poppins-Medium" }}
        >
          {label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

interface TabRoute {
  key: string;
  name: string;
  params?: object;
}

interface CustomBottomTabBarProps {
  state: {
    index: number;
    routes: {
      key: string;
      name: string;
      params?: object;
    }[];
  };
  descriptors: Record<
    string,
    {
      options: {
        tabBarLabel?: unknown;
        title?: string;
      };
    }
  >;
  navigation: any;
}

export default function CustomTabBar({ state, descriptors, navigation }: CustomBottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [layoutWidth, setLayoutWidth] = useState(SCREEN_WIDTH);

  const tabHeight = 72;
  const circleSize = 48;
  const tabWidth = layoutWidth / TABS.length;

  const translateX = useSharedValue(state.index * tabWidth);

  useEffect(() => {
    translateX.value = withSpring(state.index * tabWidth, {
      damping: 18,
      stiffness: 120,
    });
  }, [state.index, tabWidth, translateX]);

  const onLayout = (event: LayoutChangeEvent) => {
    setLayoutWidth(event.nativeEvent.layout.width);
  };

  const animatedCircleStyle = useAnimatedStyle(() => {
    const leftOffset = (tabWidth - circleSize) / 2;
    return {
      transform: [
        {
          translateX: translateX.value + leftOffset,
        },
      ],
    };
  });

  const shadowStyle = Platform.select({
    ios: {
      shadowColor: "#0D132B",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
      shadowColor: "#0D132B",
    },
    web: {
      boxShadow: "0 -4px 16px rgba(13, 19, 43, 0.04)",
    },
  });

  return (
    <View
      className="flex-row bg-white border-t border-border/60 relative"
      style={[
        {
          height: tabHeight + insets.bottom,
          paddingBottom: insets.bottom,
        },
        shadowStyle,
      ]}
      onLayout={onLayout}
    >
      {/* Active circular indicator */}
      <Animated.View
        className="absolute bg-lingua-purple rounded-full"
        style={[
          {
            width: circleSize,
            height: circleSize,
            top: (tabHeight - circleSize) / 2,
          },
          animatedCircleStyle,
        ]}
      />

      {/* Tab items */}
      {state.routes.map((route: TabRoute, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? (options.tabBarLabel as string)
            : options.title !== undefined
            ? options.title
            : route.name;

        const isSystemTab = TABS.some((tab) => tab.name === route.name);
        if (!isSystemTab) return null;

        const tabConfig = TABS.find((tab) => tab.name === route.name)!;
        const isActive = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabButton
            key={route.key}
            isActive={isActive}
            label={label}
            icon={tabConfig.icon}
            activeIcon={tabConfig.activeIcon}
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </View>
  );
}
