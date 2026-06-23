import React from "react";
import { StyleSheet, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, Pressable } from "@/tw";
import { SymbolView, SFSymbol, AndroidSymbol } from "expo-symbols";
import { colors } from "@/theme/colors";
import { useProgressStore } from "@/store/progressStore";
import { lessons } from "@/data/lessons";

const backIcon = {
  ios: "chevron.left" as SFSymbol,
  android: "arrow_back" as AndroidSymbol,
  web: "arrow_back" as AndroidSymbol,
};

const checkIcon = {
  ios: "checkmark.seal.fill" as SFSymbol,
  android: "verified" as AndroidSymbol,
  web: "verified" as AndroidSymbol,
};

const playIcon = {
  ios: "play.fill" as SFSymbol,
  android: "play_arrow" as AndroidSymbol,
  web: "play_arrow" as AndroidSymbol,
};

export default function LessonDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { id: lessonId } = params;
  const { completeLesson, completedLessons } = useProgressStore();

  // Find the lesson in lessons data
  const lesson = lessons.find((l) => l.id === lessonId) || lessons[0];
  const isCompleted = completedLessons.includes(lesson.id);

  const handleStartLesson = () => {
    // Complete the lesson and reward XP (or simulate completing it for demo purposes)
    completeLesson(lesson.id, lesson.xpReward);
    alert(`Success! You completed "${lesson.title}" and earned +${lesson.xpReward} XP!`);
    router.replace("/learn");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-100 z-20">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-slate-50 border border-gray-100 active:opacity-75"
        >
          <SymbolView name={backIcon} tintColor={colors.textPrimary} size={18} />
        </Pressable>

        <Text
          className="text-base text-text-primary text-center font-bold flex-1 mx-4"
          style={{ fontFamily: "Poppins-Bold" }}
        >
          Lesson Overview
        </Text>

        <View className="w-10 h-10" />
      </View>

      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lesson Intro Card */}
        <View className="p-6 bg-slate-50/50 rounded-3xl border border-gray-100 mb-6">
          <View className="flex-row items-center justify-between">
            <Text
              className="text-xs text-linguaPurple uppercase font-bold tracking-wider"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              {lesson.type} lesson
            </Text>
            <View className="flex-row items-center bg-purple-50 px-3 py-1 rounded-full">
              <Text className="text-xs text-linguaPurple font-bold" style={{ fontFamily: "Poppins-Bold" }}>
                +{lesson.xpReward} XP
              </Text>
            </View>
          </View>

          <Text
            className="text-2xl text-text-primary mt-3"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            {lesson.title}
          </Text>

          <Text
            className="text-sm text-text-secondary mt-2 leading-relaxed"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            {lesson.description}
          </Text>

          <View className="flex-row items-center gap-4 mt-4 text-xs text-text-secondary">
            <Text style={{ fontFamily: "Poppins-Medium" }}>
              ⏱ {lesson.durationMinutes} minutes
            </Text>
            <Text style={{ fontFamily: "Poppins-Medium" }}>
              📋 {lesson.activities?.length || 0} activities
            </Text>
          </View>
        </View>

        {/* Goals Section */}
        {lesson.goals && lesson.goals.length > 0 && (
          <View className="mb-6">
            <Text
              className="text-base text-text-primary mb-3"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              What you will learn
            </Text>
            <View className="gap-2.5">
              {lesson.goals.map((goal) => (
                <View
                  key={goal.id}
                  className="flex-row items-start bg-slate-50/50 p-4 rounded-2xl border border-gray-50"
                >
                  <View className="w-5 h-5 rounded-full bg-success/10 items-center justify-center mt-0.5 mr-3">
                    <SymbolView name={checkIcon} tintColor={colors.success} size={15} />
                  </View>
                  <Text
                    className="flex-1 text-sm text-text-primary leading-relaxed"
                    style={{ fontFamily: "Poppins-Medium" }}
                  >
                    {goal.description}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Vocabulary List Section */}
        {lesson.vocabularyList && lesson.vocabularyList.length > 0 && (
          <View className="mb-6">
            <Text
              className="text-base text-text-primary mb-3"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Vocabulary words
            </Text>
            <View className="gap-2.5">
              {lesson.vocabularyList.map((vocab) => (
                <View
                  key={vocab.id}
                  className="flex-row justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
                >
                  <View>
                    <Text
                      className="text-base text-text-primary font-bold"
                      style={{ fontFamily: "Poppins-Bold" }}
                    >
                      {vocab.word}
                    </Text>
                    {vocab.pronunciation && (
                      <Text
                        className="text-xs text-text-secondary mt-0.5"
                        style={{ fontFamily: "Poppins-Medium" }}
                      >
                        [{vocab.pronunciation}]
                      </Text>
                    )}
                  </View>
                  <View className="items-end justify-center">
                    <Text
                      className="text-base text-linguaPurple font-bold"
                      style={{ fontFamily: "Poppins-Bold" }}
                    >
                      {vocab.translation}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Start Lesson Button Panel */}
      <View className="p-6 border-t border-gray-100 bg-white shadow-lg shadow-black/5 z-20">
        <Pressable
          onPress={handleStartLesson}
          className={`w-full py-4 rounded-2xl items-center justify-center flex-row gap-2 active:opacity-95 ${
            isCompleted ? "bg-success" : "bg-linguaPurple"
          }`}
          style={Platform.select({
            ios: {
              shadowColor: isCompleted ? colors.success : colors.linguaPurple,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
            },
            android: {
              elevation: 4,
            },
          })}
        >
          <SymbolView name={playIcon} tintColor="#FFFFFF" size={16} />
          <Text
            className="text-white text-base font-bold"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            {isCompleted ? "Practice Lesson Again" : "Start Lesson"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
});
