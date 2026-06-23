import { useAuth } from "@clerk/expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, ActivityIndicator } from "react-native";
import { Redirect, useRouter, Href } from "expo-router";
import { View, Text } from "@/tw";
import { Image } from "@/tw/image";
import { images } from "@/constants/images";
import { useLanguageStore } from "@/store/languageStore";

const TOTAL_SLIDES = 4;
const ACTIVE_SLIDE = 0;

export default function OnboardingScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();
  const selectedLanguageId = useLanguageStore((s) => s.selectedLanguageId);
  const hasHydrated = useLanguageStore((s) => s.hasHydrated);

  // Wait for Clerk auth state AND the persisted language state to load
  // before deciding where to route the user.
  if (!isLoaded || !hasHydrated) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#7C3AED" />
      </SafeAreaView>
    );
  }

  // Authenticated users without a selected language must choose one first.
  if (isSignedIn && !selectedLanguageId) {
    return <Redirect href="/language-select" />;
  }

  // If already signed in, redirect to home tab screen
  if (isSignedIn) {
    return <Redirect href={"/home" as Href} />;
  }

  // Onboarding screen for unauthenticated users
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View className="onboarding__content">
        {/* ── Logo Row ────────────────────────────────────────── */}
        <View className="onboarding__logo-row">
          <Image source={images.mascotLogo} className="onboarding__logo-mark" />
          <Text className="onboarding__logo-wordmark">lingua</Text>
        </View>

        {/* ── Hero Text ───────────────────────────────────────── */}
        <View className="onboarding__hero">
          <Text className="onboarding__title">
            Your AI language{"\n"}
            <Text className="onboarding__title--accent">teacher</Text>
            <Text className="onboarding__title">.</Text>
          </Text>
          <Text className="onboarding__subtitle">
            Real conversations, personalized{"\n"}lessons, anytime, anywhere.
          </Text>
        </View>

        {/* ── Mascot Area ─────────────────────────────────────── */}
        <View className="onboarding__mascot-area">
          {/* Speech bubble – Hello! (top left) */}
          <View className="speech-bubble speech-bubble--hello">
            <Text className="speech-bubble__text speech-bubble__text--hello">
              Hello!
            </Text>
          </View>

          {/* Speech bubble – ¡Hola! (top right) */}
          <View className="speech-bubble speech-bubble--hola">
            <Text className="speech-bubble__text speech-bubble__text--hola">
              ¡Hola!
            </Text>
          </View>

          {/* Speech bubble – 你好！(bottom right) */}
          <View className="speech-bubble speech-bubble--nihao">
            <Text className="speech-bubble__text speech-bubble__text--nihao">
              你好！
            </Text>
          </View>

          {/* Mascot */}
          <Image
            source={images.mascotWelcome}
            className="onboarding__mascot"
            contentFit="contain"
          />
        </View>

        {/* ── Pagination Dots ─────────────────────────────────── */}
        <View className="onboarding__dots">
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <View
              key={i}
              className={
                i === ACTIVE_SLIDE
                  ? "onboarding__dot--active"
                  : "onboarding__dot"
              }
            />
          ))}
        </View>

        {/* ── CTA Button ──────────────────────────────────────── */}
        <Pressable
          onPress={() => router.push("/(auth)/sign-up")}
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
          })}
          accessibilityRole="button"
          accessibilityLabel="Get Started"
        >
          <View className="onboarding__cta">
            <Text className="onboarding__cta-text">Get Started</Text>
            <Text className="onboarding__cta-arrow">›</Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
