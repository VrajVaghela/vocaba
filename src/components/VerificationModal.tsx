import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSignUp, useSignIn } from "@clerk/expo";
import { View, Text } from "@/tw";
import { colors } from "@/theme";

interface VerificationModalProps {
  visible: boolean;
  email: string;
  onClose: () => void;
  /** "sign-up" uses signUp.attemptEmailAddressVerification
   *  "sign-in" uses signIn.attemptFirstFactor with email_code */
  mode: "sign-up" | "sign-in";
}

export function VerificationModal({
  visible,
  email,
  onClose,
  mode,
}: VerificationModalProps) {
  const router = useRouter();
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const resetCode = () => setCode(["", "", "", "", "", ""]);

  const handleVerify = async (fullCode: string) => {
    setIsVerifying(true);
    try {
      if (mode === "sign-up") {
        // ── Sign-up verification ──────────────────────────────
        const { error } = await signUp!.verifications.verifyEmailCode({
          code: fullCode,
        });

        if (error) {
          throw error;
        }

        if (signUp!.status === "complete") {
          const { error: finalizeError } = await signUp!.finalize({
            navigate: () => {
              onClose();
              resetCode();
              router.replace("/");
            },
          });
          if (finalizeError) {
            throw finalizeError;
          }
        } else {
          // Code verified but the attempt still needs more steps
          // (e.g. an extra factor configured in the Clerk dashboard).
          throw new Error(
            "Your email is verified, but a few more steps are needed to finish signing up. Please contact support.",
          );
        }
      } else {
        // ── Sign-in verification ──────────────────────────────
        const { error } = await signIn!.emailCode.verifyCode({
          code: fullCode,
        });

        if (error) {
          throw error;
        }

        if (signIn!.status === "complete") {
          const { error: finalizeError } = await signIn!.finalize({
            navigate: () => {
              onClose();
              resetCode();
              router.replace("/");
            },
          });
          if (finalizeError) {
            throw finalizeError;
          }
        } else {
          // Code verified but the attempt still needs more steps
          // (e.g. a second factor configured in the Clerk dashboard).
          throw new Error(
            "Your email is verified, but a few more steps are needed to finish signing in. Please contact support.",
          );
        }
      }
    } catch (err: any) {
      const message =
        err?.longMessage ||
        err?.message ||
        "Invalid code. Please try again.";
      Alert.alert("Verification Error", message);
      resetCode();
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      if (mode === "sign-up") {
        const { error } = await signUp!.verifications.sendEmailCode();
        if (error) throw error;
      } else {
        const { error } = await signIn!.emailCode.sendCode({
          emailAddress: email.trim(),
        });
        if (error) throw error;
      }
      Alert.alert("Code Sent", "A new verification code has been sent.");
      resetCode();
      inputRefs.current[0]?.focus();
    } catch (err: any) {
      const message =
        err?.message || "Failed to resend. Please try again.";
      Alert.alert("Error", message);
    }
  };

  const handleChange = (value: string, index: number) => {
    // Only accept digits
    const digit = value.replace(/[^0-9]/g, "").slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are entered
    if (digit && index === 5) {
      const fullCode = [...newCode].join("");
      if (fullCode.length === 6) {
        setTimeout(() => {
          handleVerify(fullCode);
        }, 200);
      }
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const maskedEmail =
    email.length > 4
      ? email.slice(0, 3) + "***" + email.slice(email.indexOf("@"))
      : email;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View className="auth-verify__sheet">
          {/* Handle bar */}
          <View className="auth-verify__handle" />

          {/* Icon */}
          <View className="auth-verify__icon-wrap">
            <Text className="auth-verify__icon">✉️</Text>
          </View>

          {/* Title */}
          <Text className="auth-verify__title">Check your email</Text>
          <Text className="auth-verify__subtitle">
            We sent a 6-digit code to{"\n"}
            <Text className="auth-verify__email">{maskedEmail}</Text>
          </Text>

          {/* Code inputs */}
          <View className="auth-verify__code-row">
            {code.map((digit, i) => (
              <TextInput
                key={i}
                ref={(el) => {
                  inputRefs.current[i] = el;
                }}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : styles.codeInputEmpty,
                  isVerifying && styles.codeInputDisabled,
                ]}
                value={digit}
                onChangeText={(val) => handleChange(val, i)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, i)
                }
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                editable={!isVerifying}
              />
            ))}
          </View>

          {/* Loading indicator while verifying */}
          {isVerifying && (
            <ActivityIndicator
              color={colors.linguaPurple}
              style={{ marginTop: 8 }}
            />
          )}

          {/* Resend */}
          <View className="auth-verify__resend-row">
            <Text className="auth-verify__resend-label">
              Didn&apos;t receive it?{" "}
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleResend}
              disabled={isVerifying}
            >
              <Text className="auth-verify__resend-link">Resend</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  codeInput: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    color: colors.textPrimary,
  },
  codeInputEmpty: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  codeInputFilled: {
    borderColor: colors.linguaPurple,
    backgroundColor: "#ede9fe",
  },
  codeInputDisabled: {
    opacity: 0.6,
  },
});
