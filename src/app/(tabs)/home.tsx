import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/expo";
import { View, Text, ScrollView, Pressable } from "@/tw";
import { Image } from "@/tw/image";
import { SymbolView, SFSymbol, AndroidSymbol } from "expo-symbols";
import { colors } from "@/theme/colors";
import { images } from "@/constants/images";
import { useLanguageStore } from "@/store/languageStore";
import { languages } from "@/data/languages";
import { units } from "@/data/units";

const bellIcon = {
  ios: "bell" as SFSymbol,
  android: "notifications" as AndroidSymbol,
  web: "notifications" as AndroidSymbol,
};

const bookIcon = {
  ios: "book.closed.fill" as SFSymbol,
  android: "menu_book" as AndroidSymbol,
  web: "menu_book" as AndroidSymbol,
};

const headphonesIcon = {
  ios: "headphones" as SFSymbol,
  android: "headphones" as AndroidSymbol,
  web: "headphones" as AndroidSymbol,
};

const wordsIcon = {
  ios: "face.smiling.fill" as SFSymbol,
  android: "emoji_emotions" as AndroidSymbol,
  web: "emoji_emotions" as AndroidSymbol,
};

const cameraIcon = {
  ios: "video.fill" as SFSymbol,
  android: "videocam" as AndroidSymbol,
  web: "videocam" as AndroidSymbol,
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { selectedLanguageId } = useLanguageStore();

  // Find the selected language
  const selectedLanguage = languages.find((l) => l.id === selectedLanguageId) || languages[0];

  // Find the active unit for this language
  const languageUnits = units.filter((u) => u.languageId === selectedLanguage.id);
  const activeUnit = languageUnits[0] || { level: "Beginner", order: 1, title: "Getting Started" };

  // Map the unit level to a simple CEFR level code
  const levelCode = activeUnit.level === "Beginner" ? "A1" : activeUnit.level === "Intermediate" ? "B1" : "C1";

  // Dynamic greetings based on selected language
  const getGreeting = () => {
    switch (selectedLanguage.id) {
      case "es":
        return "Hola";
      case "fr":
        return "Bonjour";
      case "ja":
        return "こんにちは";
      case "ko":
        return "안녕하세요";
      case "de":
        return "Hallo";
      case "zh":
        return "你好";
      default:
        return "Hello";
    }
  };

  const greeting = getGreeting();

  // Tasks plan for the selected language
  const getPlanData = () => {
    switch (selectedLanguage.id) {
      case "es":
        return [
          {
            id: "1",
            title: "Lesson",
            subtitle: "Greetings & Basics",
            icon: bookIcon,
            iconBg: "#6C4EF5",
            completed: true,
          },
          {
            id: "2",
            title: "AI Conversation",
            subtitle: "Talk about your day",
            icon: headphonesIcon,
            iconBg: "#6C4EF5",
            completed: false,
          },
          {
            id: "3",
            title: "New words",
            subtitle: "10 words",
            icon: wordsIcon,
            iconBg: "#FF4D4F",
            completed: false,
          },
        ];
      case "fr":
        return [
          {
            id: "1",
            title: "Lesson",
            subtitle: "First Steps in French",
            icon: bookIcon,
            iconBg: "#6C4EF5",
            completed: true,
          },
          {
            id: "2",
            title: "AI Conversation",
            subtitle: "At a French Bistro",
            icon: headphonesIcon,
            iconBg: "#6C4EF5",
            completed: false,
          },
          {
            id: "3",
            title: "New words",
            subtitle: "8 words",
            icon: wordsIcon,
            iconBg: "#FF4D4F",
            completed: false,
          },
        ];
      case "ja":
        return [
          {
            id: "1",
            title: "Lesson",
            subtitle: "Greetings & Basics",
            icon: bookIcon,
            iconBg: "#6C4EF5",
            completed: true,
          },
          {
            id: "2",
            title: "AI Conversation",
            subtitle: "Introduce yourself",
            icon: headphonesIcon,
            iconBg: "#6C4EF5",
            completed: false,
          },
          {
            id: "3",
            title: "New words",
            subtitle: "12 words",
            icon: wordsIcon,
            iconBg: "#FF4D4F",
            completed: false,
          },
        ];
      default:
        return [
          {
            id: "1",
            title: "Lesson",
            subtitle: "Introduction Lesson",
            icon: bookIcon,
            iconBg: "#6C4EF5",
            completed: true,
          },
          {
            id: "2",
            title: "AI Conversation",
            subtitle: "First Conversation",
            icon: headphonesIcon,
            iconBg: "#6C4EF5",
            completed: false,
          },
          {
            id: "3",
            title: "New words",
            subtitle: "5 words",
            icon: wordsIcon,
            iconBg: "#FF4D4F",
            completed: false,
          },
        ];
    }
  };

  const planTasks = getPlanData();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* ── Header ────────────────────────────────────────── */}
      <View className="flex-row items-center justify-between py-4 px-6">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
            <Text className="text-2xl leading-none">{selectedLanguage.flag}</Text>
          </View>
          <Text className="text-lg text-text-primary" style={{ fontFamily: "Poppins-Bold" }}>
            {greeting}, {user?.firstName || "Learner"}! 👋
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          <Pressable className="flex-row items-center bg-orange-50/50 border border-orange-100 rounded-full px-3 py-1.5 gap-1.5">
            <Image source={images.streakFire} className="w-5 h-5" contentFit="contain" />
            <Text className="text-sm text-streak font-bold" style={{ fontFamily: "Poppins-Bold" }}>
              12
            </Text>
          </Pressable>

          <Pressable className="w-10 h-10 rounded-full bg-slate-50 border border-gray-100 items-center justify-center shadow-sm">
            <SymbolView name={bellIcon} tintColor="#0D132B" size={20} />
          </Pressable>
        </View>
      </View>

      {/* ── Scrollable Body ───────────────────────────────── */}
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-28 pt-2 gap-6"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Daily Goal Card ─────────────────────────────── */}
        <View className="bg-[#FFFDF9] border border-[#FFE7C4] rounded-3xl p-5 flex-row items-center justify-between shadow-sm">
          <View className="flex-1 pr-4">
            <Text className="text-[11px] text-text-secondary uppercase tracking-wider" style={{ fontFamily: "Poppins-SemiBold" }}>
              Daily goal
            </Text>
            <View className="flex-row items-baseline mt-1">
              <Text className="text-3xl text-text-primary" style={{ fontFamily: "Poppins-Bold" }}>
                15
              </Text>
              <Text className="text-sm text-text-secondary ml-1" style={{ fontFamily: "Poppins-Regular" }}>
                / 20 XP
              </Text>
            </View>
            <View className="h-2.5 bg-orange-100/50 rounded-full mt-3.5 overflow-hidden w-full">
              <View className="h-full bg-streak rounded-full" style={{ width: "75%" }} />
            </View>
          </View>
          <Image source={images.treasure} className="w-20 h-20" contentFit="contain" />
        </View>

        {/* ── Continue Learning Card ──────────────────────── */}
        <View className="bg-linguaPurple rounded-3xl p-6 relative overflow-hidden shadow-md shadow-linguaPurple/20">
          <View className="z-10 max-w-[60%]">
            <Text className="text-[11px] text-white/80 uppercase tracking-wider" style={{ fontFamily: "Poppins-SemiBold" }}>
              Continue learning
            </Text>
            <Text className="text-2xl text-white mt-1" style={{ fontFamily: "Poppins-Bold" }}>
              {selectedLanguage.name}
            </Text>
            <Text className="text-sm text-white/90 mt-1" style={{ fontFamily: "Poppins-Medium" }}>
              {levelCode} • Unit {activeUnit.order}
            </Text>
            
            <Pressable
              className="bg-white rounded-full py-2.5 px-6 self-start mt-5 shadow-sm active:opacity-90"
              onPress={() => router.push("/learn")}
            >
              <Text className="text-sm text-linguaDeepPurple font-bold" style={{ fontFamily: "Poppins-Bold" }}>
                Continue
              </Text>
            </Pressable>
          </View>
          
          <Image
            source={images.palace}
            className="absolute right-0 bottom-0 w-36 h-36"
            contentFit="contain"
          />
        </View>

        {/* ── Today's Plan ────────────────────────────────── */}
        <View className="gap-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg text-text-primary" style={{ fontFamily: "Poppins-Bold" }}>
              Today&apos;s plan
            </Text>
            <Pressable onPress={() => router.push("/learn")}>
              <Text className="text-sm text-linguaPurple" style={{ fontFamily: "Poppins-SemiBold" }}>
                View all
              </Text>
            </Pressable>
          </View>

          <View className="gap-3">
            {planTasks.map((task) => (
              <View
                key={task.id}
                className="flex-row items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: task.iconBg }}
                  >
                    <SymbolView name={task.icon} tintColor="#FFFFFF" size={24} />
                  </View>
                  <View className="ml-4 flex-1">
                    <Text className="text-base text-text-primary" style={{ fontFamily: "Poppins-SemiBold" }}>
                      {task.title}
                    </Text>
                    <Text className="text-sm text-text-secondary mt-0.5" style={{ fontFamily: "Poppins-Regular" }}>
                      {task.subtitle}
                    </Text>
                  </View>
                </View>

                {task.completed ? (
                  <View className="w-6 h-6 rounded-full bg-[#6C4EF5] items-center justify-center">
                    <Text className="text-white text-[10px] font-bold leading-none">✓</Text>
                  </View>
                ) : (
                  <View className="w-6 h-6 rounded-full border-2 border-gray-200 bg-transparent" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* ── Next Up ─────────────────────────────────────── */}
        <Pressable
          onPress={() => router.push("/ai-teacher")}
          className="bg-[#F4FBF7] border border-[#E3F2E7] rounded-3xl p-5 flex-row items-center justify-between shadow-sm"
          style={({ pressed }) => ({
            opacity: pressed ? 0.95 : 1,
          })}
        >
          <View className="flex-1">
            <Text className="text-xs text-[#21C16B] uppercase tracking-wider" style={{ fontFamily: "Poppins-Bold" }}>
              Next up
            </Text>
            <Text className="text-lg text-text-primary mt-1" style={{ fontFamily: "Poppins-Bold" }}>
              AI Video Call
            </Text>
            <Text className="text-sm text-text-secondary mt-0.5" style={{ fontFamily: "Poppins-Regular" }}>
              Practice speaking
            </Text>
          </View>

          <View className="flex-row items-center gap-3">
            <Image
              source="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
              className="w-14 h-14 rounded-full border border-white shadow-sm"
              contentFit="cover"
            />
            <View className="w-12 h-12 rounded-full bg-[#21C16B] items-center justify-center shadow-sm">
              <SymbolView name={cameraIcon} tintColor="#FFFFFF" size={22} />
            </View>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

