import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text } from "@/tw";
import { colors } from "@/theme/colors";

export default function LearnScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-h2 text-center text-text-primary mb-2" style={{ fontFamily: "Poppins-Bold" }}>
          Learn Screen
        </Text>
        <Text className="text-body-md text-center text-text-secondary" style={{ fontFamily: "Poppins-Regular" }}>
          This is a placeholder for the Learn screen UI.
        </Text>
      </View>
    </SafeAreaView>
  );
}
