import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable } from "@/tw";
import { colors } from "@/theme/colors";
import { useUser, useAuth } from "@clerk/expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguageStore } from "@/store/languageStore";
import { Image } from "react-native";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const handleClearStorage = async () => {
    await AsyncStorage.clear();
    useLanguageStore.getState().setSelectedLanguageId(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View className="flex-1 px-6 pt-8">
        <Text className="text-h2 mb-6" style={{ fontFamily: "Poppins-Bold" }}>
          Profile
        </Text>

        {/* User Card */}
        <View className="bg-surface rounded-2xl p-5 border border-border flex-row items-center mb-6">
          {user?.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="w-16 h-16 rounded-full mr-4 bg-gray-200"
            />
          ) : (
            <View className="w-16 h-16 rounded-full bg-lingua-purple/10 items-center justify-center mr-4">
              <Text className="text-lingua-purple text-h2" style={{ fontFamily: "Poppins-Bold" }}>
                {user?.firstName?.charAt(0) || "U"}
              </Text>
            </View>
          )}

          <View className="flex-1">
            <Text className="text-h3 text-text-primary mb-0.5" style={{ fontFamily: "Poppins-SemiBold" }}>
              {user?.fullName || "User"}
            </Text>
            <Text className="text-body-sm text-text-secondary" style={{ fontFamily: "Poppins-Regular" }}>
              {user?.primaryEmailAddress?.emailAddress || "No email"}
            </Text>
          </View>
        </View>

        {/* Account Options */}
        <View className="gap-4">
          <Pressable
            onPress={() => signOut()}
            className="flex-row items-center justify-between p-4 bg-white border border-border rounded-xl"
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <Text className="text-body-md text-error" style={{ fontFamily: "Poppins-Medium" }}>
              Sign Out
            </Text>
            <Text className="text-text-secondary">›</Text>
          </Pressable>

          <View className="mt-8 border-t border-border pt-6">
            <Text className="text-caption text-text-secondary uppercase mb-3" style={{ fontFamily: "Poppins-SemiBold" }}>
              Developer Tools
            </Text>
            <Pressable
              onPress={handleClearStorage}
              className="flex-row items-center justify-between p-4 bg-violet-50/20 border border-violet-100 rounded-xl"
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
              })}
              accessibilityRole="button"
              accessibilityLabel="Reset App State"
            >
              <View>
                <Text className="text-body-md text-lingua-purple" style={{ fontFamily: "Poppins-Medium" }}>
                  Reset App State
                </Text>
                <Text className="text-[11px] text-text-secondary mt-0.5" style={{ fontFamily: "Poppins-Regular" }}>
                  Clears local language preference & cached data
                </Text>
              </View>
              <Text className="text-lingua-purple">⚡</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
