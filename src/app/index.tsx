import { useAuth } from "@clerk/expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { View, Text } from "@/tw";
import { Image } from "@/tw/image";
import { images } from "@/constants/images";

const TOTAL_SLIDES = 4;
const ACTIVE_SLIDE = 0;

export default function OnboardingScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  // Wait for Clerk to determine auth state
  if (!isLoaded) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#7C3AED" />
      </SafeAreaView>
    );
  }

  // If already signed in, show home (will be replaced by full tabs screen later)
  if (isSignedIn) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#ffffff", justifyContent: "center", alignItems: "center" }}
      >
        <View className="items-center px-6">
          <Text className="text-h2 text-center text-lingua-purple mb-2">
            🎉 You&apos;re signed in!
          </Text>
          <Text className="text-body-md text-center mb-6">
            Welcome to Vocaba. Ready to start your learning journey?
          </Text>
          
          <Pressable
            onPress={() => router.push("/language-select")}
            style={({ pressed }) => ({
              opacity: pressed ? 0.85 : 1,
            })}
            accessibilityRole="button"
            accessibilityLabel="Choose Language"
          >
            <View className="button-primary px-8">
              <Text className="button-primary__text">Choose a Language</Text>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    );
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
