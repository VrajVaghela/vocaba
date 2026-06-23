import React, { useState } from "react";
import { StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Pressable } from "@/tw";
import { Image } from "@/tw/image";
import { SymbolView, SFSymbol, AndroidSymbol } from "expo-symbols";
import { colors } from "@/theme/colors";
import { images } from "@/constants/images";
import { useLanguageStore } from "@/store/languageStore";
import { useProgressStore } from "@/store/progressStore";
import { languages } from "@/data/languages";
import { units } from "@/data/units";
import { lessons } from "@/data/lessons";

// Icons mapping for SymbolView
const backIcon = {
  ios: "chevron.left" as SFSymbol,
  android: "arrow_back" as AndroidSymbol,
  web: "arrow_back" as AndroidSymbol,
};

const bookmarkIcon = {
  ios: "bookmark" as SFSymbol,
  android: "bookmark_border" as AndroidSymbol,
  web: "bookmark_border" as AndroidSymbol,
};

const bookmarkedIcon = {
  ios: "bookmark.fill" as SFSymbol,
  android: "bookmark" as AndroidSymbol,
  web: "bookmark" as AndroidSymbol,
};

const lockIcon = {
  ios: "lock.fill" as SFSymbol,
  android: "lock" as AndroidSymbol,
  web: "lock" as AndroidSymbol,
};

const checkmarkIcon = {
  ios: "checkmark.circle.fill" as SFSymbol,
  android: "check_circle" as AndroidSymbol,
  web: "check_circle" as AndroidSymbol,
};

const micIcon = {
  ios: "mic.fill" as SFSymbol,
  android: "mic" as AndroidSymbol,
  web: "mic" as AndroidSymbol,
};

const listenIcon = {
  ios: "headphones" as SFSymbol,
  android: "headphones" as AndroidSymbol,
  web: "headphones" as AndroidSymbol,
};

const flashcardIcon = {
  ios: "rectangle.on.rectangle.angled.fill" as SFSymbol,
  android: "content_copy" as AndroidSymbol,
  web: "content_copy" as AndroidSymbol,
};

export default function LearnScreen() {
  const router = useRouter();
  const { selectedLanguageId } = useLanguageStore();
  const { completedLessons, currentLessonId, startLesson } = useProgressStore();

  const [activeTab, setActiveTab] = useState<"lessons" | "practice">("lessons");
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Get current language details
  const selectedLanguage = languages.find((l) => l.id === selectedLanguageId) || languages[0];

  // Get units for this language
  const languageUnits = units.filter((u) => u.languageId === selectedLanguage.id);
  // Default to the first unit or create a fallback
  const activeUnit = languageUnits[0] || {
    id: `${selectedLanguage.id}-unit-1`,
    title: "Core Foundations",
    level: "Beginner",
    order: 1,
    description: "Start learning essential greetings and vocabulary.",
  };

  // Find lessons belonging to this unit
  const unitLessons = lessons.filter((l) => l.unitId === activeUnit.id);

  // Calculate unit completion progress
  const completedUnitLessonsCount = unitLessons.filter((l) =>
    completedLessons.includes(l.id)
  ).length;
  const totalUnitLessonsCount = unitLessons.length || 5;

  // Select banner image based on language, falling back to cafeBanner
  const getBannerImage = () => {
    switch (selectedLanguage.id) {
      case "es":
        return images.cafeBanner;
      case "fr":
        return images.palace;
      case "ja":
        return images.earth;
      default:
        // Use an Unsplash placeholder with educational theme for other languages
        return "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format&fit=crop";
    }
  };

  // Select lesson illustration, falling back to cafeTableIcon or nice placeholders
  const getLessonIllustration = (lessonId: string, index: number) => {
    if (lessonId.includes("lesson-3") || index === 2) {
      return images.cafeTableIcon;
    }
    const illustrations = [
      "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=150&auto=format&fit=crop", // Letter/basics
      "https://images.unsplash.com/photo-1590608897129-79da98d15969?q=80&w=150&auto=format&fit=crop", // Chat bubble/intro
      images.cafeTableIcon,
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=150&auto=format&fit=crop", // Beach/travel
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=150&auto=format&fit=crop", // Shopping bag
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=150&auto=format&fit=crop", // Friends/family
    ];
    return illustrations[index % illustrations.length];
  };

  const handleLessonClick = (lessonId: string) => {
    // Set active lesson in progress store
    startLesson(lessonId);
    // Navigate to lesson screen (which will be implemented in future phase)
    router.push({
      pathname: "/lesson",
      params: { id: lessonId },
    });
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      {/* ── Header ────────────────────────────────────────── */}
      <View className="flex-row items-center justify-between px-6 py-3 bg-white border-b border-gray-100 z-20">
        <Pressable
          onPress={() => router.replace("/home")}
          className="w-10 h-10 items-center justify-center rounded-full bg-slate-50 border border-gray-100 active:opacity-75"
        >
          <SymbolView name={backIcon} tintColor={colors.textPrimary} size={18} />
        </Pressable>

        <View className="items-center flex-1 mx-4">
          <Text
            className="text-base text-text-primary text-center truncate w-full"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            {activeUnit.title}
          </Text>
          <Text
            className="text-xs text-text-secondary mt-0.5"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            Unit {activeUnit.order} • {completedUnitLessonsCount} / {totalUnitLessonsCount} lessons
          </Text>
        </View>

        <Pressable
          onPress={() => setIsBookmarked(!isBookmarked)}
          className="w-10 h-10 items-center justify-center rounded-full bg-slate-50 border border-gray-100 active:opacity-75"
        >
          <SymbolView
            name={isBookmarked ? bookmarkedIcon : bookmarkIcon}
            tintColor={isBookmarked ? colors.streak : colors.textPrimary}
            size={18}
          />
        </Pressable>
      </View>

      {/* ── Scrollable Content ─────────────────────────────── */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Main Illustration Banner Card ──────────────────── */}
        <View className="relative w-full h-52 bg-slate-100 overflow-hidden z-10">
          <Image
            source={getBannerImage()}
            className="w-full h-full"
            contentFit="cover"
          />
          {/* Soft gradient bottom overlay for seamless design */}
          <View className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/20 to-transparent" />
        </View>

        {/* ── Tab Selector (Overlapping Banner) ───────────────── */}
        <View className="align-self-center w-[88%] bg-gray-100/90 p-1.5 rounded-full flex-row items-center justify-between -mt-8 shadow-sm z-30 mb-6 backdrop-blur-md">
          <Pressable
            onPress={() => setActiveTab("lessons")}
            className={`flex-1 py-3 items-center rounded-full ${
              activeTab === "lessons" ? "bg-white shadow-sm" : ""
            }`}
          >
            <Text
              className={`text-sm ${
                activeTab === "lessons" ? "text-linguaPurple font-bold" : "text-text-secondary"
              }`}
              style={{ fontFamily: activeTab === "lessons" ? "Poppins-Bold" : "Poppins-Medium" }}
            >
              Lessons
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("practice")}
            className={`flex-1 py-3 items-center rounded-full ${
              activeTab === "practice" ? "bg-white shadow-sm" : ""
            }`}
          >
            <Text
              className={`text-sm ${
                activeTab === "practice" ? "text-linguaPurple font-bold" : "text-text-secondary"
              }`}
              style={{ fontFamily: activeTab === "practice" ? "Poppins-Bold" : "Poppins-Medium" }}
            >
              Practice
            </Text>
          </Pressable>
        </View>

        {/* ── Dynamic Tab View ──────────────────────────────── */}
        {activeTab === "lessons" ? (
          // ==========================================
          // LESSONS TAB
          // ==========================================
          <View className="px-6 gap-4 pb-28">
            {unitLessons.map((lesson, idx) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isActive = currentLessonId === lesson.id || (!isCompleted && idx === 0 && !currentLessonId);

              // Card styling configuration based on status
              let cardBg = "bg-white";
              let cardBorder = "border border-gray-100 shadow-sm";
              let titleColor = "text-text-primary";
              let numberColor = "text-text-secondary";

              if (isActive) {
                cardBg = "bg-[#F5F1FF]";
                cardBorder = "border-2 border-linguaPurple shadow-md shadow-linguaPurple/5";
                titleColor = "text-text-primary";
                numberColor = "text-linguaPurple";
              }

              return (
                <Pressable
                  key={lesson.id}
                  onPress={() => handleLessonClick(lesson.id)}
                  className={`flex-row items-center justify-between p-5 rounded-[24px] ${cardBg} ${cardBorder}`}
                  style={Platform.select({
                    ios: {
                      shadowColor: isActive ? colors.linguaPurple : "#0D132B",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: isActive ? 0.08 : 0.03,
                      shadowRadius: 10,
                    },
                    android: {
                      elevation: isActive ? 3 : 1,
                    },
                  })}
                >
                  <View className="flex-1 pr-4">
                    <Text
                      className={`text-xs uppercase tracking-wide ${numberColor}`}
                      style={{ fontFamily: "Poppins-Bold" }}
                    >
                      Lesson {idx + 1}
                    </Text>
                    <Text
                      className={`text-lg mt-1 ${titleColor}`}
                      style={{ fontFamily: "Poppins-Bold" }}
                    >
                      {lesson.title}
                    </Text>

                    {/* Dynamic Status / Progress Subtitle */}
                    {isCompleted ? (
                      <Text
                        className="text-xs text-linguaGreen mt-1"
                        style={{ fontFamily: "Poppins-Medium" }}
                      >
                        Completed • +{lesson.xpReward} XP
                      </Text>
                    ) : isActive ? (
                      <Text
                        className="text-xs text-linguaPurple mt-1"
                        style={{ fontFamily: "Poppins-Medium" }}
                      >
                        In progress
                      </Text>
                    ) : (
                      <Text
                        className="text-xs text-text-secondary mt-1"
                        style={{ fontFamily: "Poppins-Regular" }}
                      >
                        0 / {lesson.activities?.length || 4} activities
                      </Text>
                    )}
                  </View>

                  {/* Right Side Visual Indicator */}
                  {isCompleted ? (
                    <View className="w-8 h-8 rounded-full bg-success/10 items-center justify-center">
                      <SymbolView name={checkmarkIcon} tintColor={colors.success} size={24} />
                    </View>
                  ) : isActive ? (
                    <View className="w-16 h-16 rounded-2xl overflow-hidden border border-purple-100 bg-white">
                      <Image
                        source={getLessonIllustration(lesson.id, idx)}
                        className="w-full h-full"
                        contentFit="cover"
                      />
                    </View>
                  ) : (
                    <View className="w-8 h-8 rounded-full bg-slate-50 border border-gray-100 items-center justify-center">
                      <SymbolView name={lockIcon} tintColor={colors.textSecondary} size={15} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        ) : (
          // ==========================================
          // PRACTICE TAB
          // ==========================================
          <View className="px-6 gap-4 pb-28">
            <Text
              className="text-lg text-text-primary mb-1"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Daily Practice Hub
            </Text>

            {/* Speaking Practice */}
            <Pressable
              onPress={() => router.push("/ai-teacher")}
              className="flex-row items-center justify-between p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm active:opacity-90"
            >
              <View className="w-12 h-12 rounded-2xl bg-orange-50 items-center justify-center">
                <SymbolView name={micIcon} tintColor={colors.streak} size={22} />
              </View>
              <View className="flex-1 ml-4 pr-2">
                <Text
                  className="text-base text-text-primary"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  Speaking Practice
                </Text>
                <Text
                  className="text-xs text-text-secondary mt-0.5"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  Practice talking with your AI Teacher
                </Text>
              </View>
              <Text
                className="text-xs text-streak bg-orange-50 px-2.5 py-1 rounded-full font-bold"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                +20 XP
              </Text>
            </Pressable>

            {/* Vocabulary Review */}
            <Pressable
              onPress={() => router.push("/chat")}
              className="flex-row items-center justify-between p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm active:opacity-90"
            >
              <View className="w-12 h-12 rounded-2xl bg-purple-50 items-center justify-center">
                <SymbolView name={flashcardIcon} tintColor={colors.linguaPurple} size={22} />
              </View>
              <View className="flex-1 ml-4 pr-2">
                <Text
                  className="text-base text-text-primary"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  Vocabulary Review
                </Text>
                <Text
                  className="text-xs text-text-secondary mt-0.5"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  Review word meanings and spelling
                </Text>
              </View>
              <Text
                className="text-xs text-linguaPurple bg-purple-50 px-2.5 py-1 rounded-full font-bold"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                +15 XP
              </Text>
            </Pressable>

            {/* Listening Challenge */}
            <Pressable
              onPress={() => router.push("/ai-teacher")}
              className="flex-row items-center justify-between p-5 bg-white border border-gray-100 rounded-[24px] shadow-sm active:opacity-90"
            >
              <View className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center">
                <SymbolView name={listenIcon} tintColor={colors.info} size={22} />
              </View>
              <View className="flex-1 ml-4 pr-2">
                <Text
                  className="text-base text-text-primary"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  Listening Challenge
                </Text>
                <Text
                  className="text-xs text-text-secondary mt-0.5"
                  style={{ fontFamily: "Poppins-Regular" }}
                >
                  Tune your ear with quick audio tasks
                </Text>
              </View>
              <Text
                className="text-xs text-linguaBlue bg-blue-50 px-2.5 py-1 rounded-full font-bold"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                +25 XP
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.background,
  },
});
