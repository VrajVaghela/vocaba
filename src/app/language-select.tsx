import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Pressable, TextInput } from "@/tw";
import { Image } from "@/tw/image";
import { images } from "@/constants/images";
import { colors } from "@/theme/colors";
import { languages } from "@/data/languages";
import { useLanguageStore } from "@/store/languageStore";
import { posthog } from "@/lib/posthog";

export default function LanguageSelectScreen() {
  const router = useRouter();
  const { selectedLanguageId, setSelectedLanguageId } = useLanguageStore();
  const [tempSelectedLanguageId, setTempSelectedLanguageId] = useState<string | null>(
    selectedLanguageId
  );
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConfirm = () => {
    if (tempSelectedLanguageId) {
      setSelectedLanguageId(tempSelectedLanguageId);
      const lang = languages.find((l) => l.id === tempSelectedLanguageId);
      if (lang) {
        posthog.capture("language_selected", {
          language_code: lang.id,
          language_name: lang.name,
        });
      }
      router.replace("/");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ── Header ────────────────────────────────────────── */}
      <View className="flex-row items-center py-4 px-6 relative">
        <Pressable
          onPress={() => router.back()}
          className="absolute left-6 z-10 p-1"
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text
            className="text-3xl text-text-primary leading-none"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            ‹
          </Text>
        </Pressable>
        <Text className="text-h3 text-center w-full" style={{ fontFamily: "Poppins-SemiBold" }}>
          Choose a language
        </Text>
      </View>

      {/* ── Search Bar ────────────────────────────────────── */}
      <View className="flex-row items-center border border-border rounded-full px-4 py-2.5 mx-6 mb-4 bg-background">
        <Text className="text-text-secondary mr-2 text-lg">🔍</Text>
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search languages"
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-body-md py-0"
          style={{ fontFamily: "Poppins-Regular" }}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* ── Scrollable Content ────────────────────────────── */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-h4 text-text-primary px-6 mb-3" style={{ fontFamily: "Poppins-SemiBold" }}>
          Popular
        </Text>

        {filteredLanguages.length > 0 ? (
          filteredLanguages.map((lang) => {
            const isSelected = tempSelectedLanguageId === lang.id;

            return (
              <Pressable
                key={lang.id}
                onPress={() => setTempSelectedLanguageId(lang.id)}
                className={`flex-row items-center justify-between p-4 mx-6 mb-3 border rounded-2xl bg-background transition-all ${
                  isSelected ? "border-lingua-purple bg-violet-50/40" : "border-border"
                }`}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.9 : 1,
                })}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                accessibilityLabel={lang.name}
              >
                {/* Flag + Name/Subtitle Container */}
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 rounded-full bg-slate-50 items-center justify-center overflow-hidden border border-gray-100">
                    <Text className="text-3xl leading-none">{lang.flag}</Text>
                  </View>

                  <View className="ml-4 flex-1">
                    <Text
                      className="text-h4 text-text-primary"
                      style={{ fontFamily: "Poppins-SemiBold" }}
                    >
                      {lang.name}
                    </Text>
                    {lang.learnersCount && (
                      <Text className="text-xs text-text-secondary mt-0.5" style={{ fontFamily: "Poppins-Regular" }}>
                        {lang.learnersCount}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Right selection indicator */}
                {isSelected ? (
                  <View className="w-6 h-6 rounded-full bg-lingua-purple items-center justify-center">
                    <Text className="text-white text-xs font-bold leading-none">✓</Text>
                  </View>
                ) : (
                  <Text className="text-text-secondary text-2xl font-poppins-medium mr-1 leading-none">›</Text>
                )}
              </Pressable>
            );
          })
        ) : (
          <View className="items-center justify-center py-12 px-6">
            <Text className="text-body-md text-text-secondary text-center" style={{ fontFamily: "Poppins-Regular" }}>
              No languages found matching &apos;{searchQuery}&apos;
            </Text>
          </View>
        )}
      </ScrollView>

      {/* ── Fixed Bottom Actions ─────────────────────────── */}
      <View className="pt-4 bg-background border-t border-gray-50">
        <Pressable
          onPress={handleConfirm}
          disabled={!tempSelectedLanguageId}
          style={({ pressed }) => ({
            opacity: !tempSelectedLanguageId ? 0.5 : pressed ? 0.9 : 1,
          })}
          accessibilityRole="button"
          accessibilityLabel="Continue selection"
        >
          <View className="button-primary mx-6 mb-2">
            <Text className="button-primary__text">Continue</Text>
          </View>
        </Pressable>

        <Image
          source={images.earth}
          className="w-full h-32"
          contentFit="contain"
        />
      </View>
    </SafeAreaView>
  );
}
