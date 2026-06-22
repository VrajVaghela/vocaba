import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useSignIn, useAuth } from "@clerk/expo";
import { View, Text } from "@/tw";
import { Image } from "@/tw/image";
import { images } from "@/constants/images";
import { colors } from "@/theme";
import { VerificationModal } from "@/components/VerificationModal";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const { isLoaded } = useAuth();

  const [email, setEmail] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!isLoaded || !email.trim()) return;

    setIsLoading(true);
    try {
      // Create sign-in with email code strategy (passwordless)
      const { error } = await signIn.emailCode.sendCode({
        emailAddress: email.trim(),
      });

      if (error) {
        const message = error.longMessage || error.message || "Sign in failed. Please try again.";
        Alert.alert("Sign In Error", message);
        return;
      }

      // Show verification modal for the code
      setShowVerification(true);
    } catch (err: any) {
      const message =
        err?.message ||
        "Sign in failed. Please try again.";
      Alert.alert("Sign In Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Back button ─────────────────────────────────── */}
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.backButton}
            accessibilityLabel="Go back"
          >
            <Text className="auth__back-icon">‹</Text>
          </TouchableOpacity>

          {/* ── Header ──────────────────────────────────────── */}
          <View className="auth__header">
            <Text className="auth__title">Welcome back</Text>
            <Text className="auth__subtitle">
              Continue your language journey ✨
            </Text>
          </View>

          {/* ── Mascot ──────────────────────────────────────── */}
          <View className="auth__mascot-wrap">
            <Image
              source={images.mascotAuth}
              className="auth__mascot"
              contentFit="contain"
            />
          </View>

          {/* ── Email Input ─────────────────────────────────── */}
          <View className="auth__input-wrap">
            <Text className="auth__input-label">Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="your@email.com"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              accessibilityLabel="Email address"
            />
          </View>

          {/* ── Sign In Button ──────────────────────────────── */}
          <Pressable
            onPress={handleSignIn}
            disabled={isLoading || !email.trim()}
            style={({ pressed }) => [
              styles.primaryButton,
              { opacity: pressed || isLoading ? 0.7 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Log In"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="auth__btn-text">Log In</Text>
            )}
          </Pressable>

          {/* ── Divider ─────────────────────────────────────── */}
          <View className="auth__divider">
            <View className="auth__divider-line" />
            <Text className="auth__divider-text">or continue with</Text>
            <View className="auth__divider-line" />
          </View>

          {/* ── Social Buttons ──────────────────────────────── */}
          <View className="auth__social-list">
            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.8}
              accessibilityLabel="Continue with Google"
            >
              <Text className="auth__social-icon">🇬</Text>
              <Text className="auth__social-text">Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.8}
              accessibilityLabel="Continue with Facebook"
            >
              <Text className="auth__social-icon">🇫</Text>
              <Text className="auth__social-text">Continue with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              activeOpacity={0.8}
              accessibilityLabel="Continue with Apple"
            >
              <Text className="auth__social-icon">🍎</Text>
              <Text className="auth__social-text">Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          {/* ── Footer Link ─────────────────────────────────── */}
          <View className="auth__footer">
            <Text className="auth__footer-text">Don&apos;t have an account? </Text>
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/sign-up")}
              activeOpacity={0.7}
            >
              <Text className="auth__footer-link">Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Verification Modal ──────────────────────────── */}
      <VerificationModal
        visible={showVerification}
        email={email}
        onClose={() => setShowVerification(false)}
        mode="sign-in"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  backButton: {
    marginTop: 8,
    marginBottom: 8,
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingRight: 12,
  },
  textInput: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 0,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: colors.linguaPurple,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    marginTop: 8,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 12,
    backgroundColor: colors.background,
  },
});
