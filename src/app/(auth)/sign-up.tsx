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
import { useSignUp, useAuth, useSSO } from "@clerk/expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { View, Text } from "@/tw";
import { Image } from "@/tw/image";
import { images } from "@/constants/images";
import { colors } from "@/theme";
import { VerificationModal } from "@/components/VerificationModal";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const router = useRouter();
  const { signUp } = useSignUp();
  const { isLoaded } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);
  const { startSSOFlow } = useSSO();

  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  const handleOAuthSignUp = async (strategy: "oauth_google" | "oauth_facebook" | "oauth_apple") => {
    if (!isLoaded) return;
    setIsOAuthLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: Linking.createURL("/sso-callback"),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      console.error("OAuth error", err);
      Alert.alert("Authentication Error", err.message || "Something went wrong.");
    } finally {
      setIsOAuthLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!isLoaded || !email.trim() || !password.trim()) return;

    setIsLoading(true);
    try {
      // Start sign-up with email + password
      const { error } = await signUp.create({
        emailAddress: email.trim(),
        password,
      });

      if (error) {
        const message = error.longMessage || error.message || "Sign up failed. Please try again.";
        Alert.alert("Sign Up Error", message);
        return;
      }

      // Send email verification code
      const { error: prepareError } = await signUp.verifications.sendEmailCode();

      if (prepareError) {
        const message = prepareError.longMessage || prepareError.message || "Failed to send verification code.";
        Alert.alert("Sign Up Error", message);
        return;
      }

      // Show the verification modal
      setShowVerification(true);
    } catch (err: any) {
      const message =
        err?.message ||
        "Sign up failed. Please try again.";
      Alert.alert("Sign Up Error", message);
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
            <Text className="auth__title">Create your account</Text>
            <Text className="auth__subtitle">
              Start your language journey today ✨
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

          {/* ── Password Input ──────────────────────────────── */}
          <View className="auth__input-wrap">
            <Text className="auth__input-label">Password</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.textInput, styles.passwordInput]}
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="new-password"
                textContentType="newPassword"
                accessibilityLabel="Password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
                accessibilityLabel={
                  showPassword ? "Hide password" : "Show password"
                }
                activeOpacity={0.7}
              >
                <Text className="auth__eye-icon">
                  {showPassword ? "🙈" : "👁"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Sign Up Button ──────────────────────────────── */}
          <Pressable
            onPress={handleSignUp}
            disabled={isLoading || !email.trim() || !password.trim()}
            style={({ pressed }) => [
              styles.primaryButton,
              { opacity: pressed || isLoading ? 0.7 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Sign Up"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="auth__btn-text">Sign Up</Text>
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
              style={[styles.socialButton, { opacity: isOAuthLoading || isLoading ? 0.5 : 1 }]}
              activeOpacity={0.8}
              onPress={() => handleOAuthSignUp("oauth_google")}
              disabled={isOAuthLoading || isLoading}
              accessibilityLabel="Continue with Google"
            >
              <Text className="auth__social-icon">🇬</Text>
              <Text className="auth__social-text">Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { opacity: isOAuthLoading || isLoading ? 0.5 : 1 }]}
              activeOpacity={0.8}
              onPress={() => handleOAuthSignUp("oauth_facebook")}
              disabled={isOAuthLoading || isLoading}
              accessibilityLabel="Continue with Facebook"
            >
              <Text className="auth__social-icon">🇫</Text>
              <Text className="auth__social-text">Continue with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, { opacity: isOAuthLoading || isLoading ? 0.5 : 1 }]}
              activeOpacity={0.8}
              onPress={() => handleOAuthSignUp("oauth_apple")}
              disabled={isOAuthLoading || isLoading}
              accessibilityLabel="Continue with Apple"
            >
              <Text className="auth__social-icon">🍎</Text>
              <Text className="auth__social-text">Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          {/* ── Footer Link ─────────────────────────────────── */}
          <View className="auth__footer">
            <Text className="auth__footer-text">Already have an account? </Text>
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/sign-in")}
              activeOpacity={0.7}
            >
              <Text className="auth__footer-link">Log in</Text>
            </TouchableOpacity>
          </View>

          {/* Required for Clerk bot protection */}
          <View nativeID="clerk-captcha" />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Verification Modal ──────────────────────────── */}
      <VerificationModal
        visible={showVerification}
        email={email}
        onClose={() => setShowVerification(false)}
        mode="sign-up"
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
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
  },
  eyeButton: {
    paddingLeft: 8,
    paddingVertical: 4,
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
