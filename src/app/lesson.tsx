import React, { useState, useEffect } from "react";
import { StyleSheet, Animated, ActivityIndicator, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, Pressable } from "@/tw";
import { Image } from "@/tw/image";
import { SymbolView, SFSymbol, AndroidSymbol } from "expo-symbols";
import { colors } from "@/theme/colors";
import { useProgressStore } from "@/store/progressStore";
import { lessons } from "@/data/lessons";
import { units } from "@/data/units";
import { languages } from "@/data/languages";
import { images } from "@/constants/images";

// Icons mapping for SymbolView
const backIcon = {
  ios: "chevron.left" as SFSymbol,
  android: "arrow_back" as AndroidSymbol,
  web: "arrow_back" as AndroidSymbol,
};

const videoBadgeIcon = {
  ios: "video" as SFSymbol,
  android: "videocam" as AndroidSymbol,
  web: "videocam" as AndroidSymbol,
};

const streakBadgeIcon = {
  ios: "flame.fill" as SFSymbol,
  android: "local_fire_department" as AndroidSymbol,
  web: "local_fire_department" as AndroidSymbol,
};

const profileBadgeIcon = {
  ios: "person.crop.circle" as SFSymbol,
  android: "account_circle" as AndroidSymbol,
  web: "account_circle" as AndroidSymbol,
};

// Control Buttons
const cameraIcon = {
  ios: "video.fill" as SFSymbol,
  android: "videocam" as AndroidSymbol,
  web: "videocam" as AndroidSymbol,
};

const cameraSlashIcon = {
  ios: "video.slash.fill" as SFSymbol,
  android: "videocam_off" as AndroidSymbol,
  web: "videocam_off" as AndroidSymbol,
};

const micIcon = {
  ios: "mic.fill" as SFSymbol,
  android: "mic" as AndroidSymbol,
  web: "mic" as AndroidSymbol,
};

const micSlashIcon = {
  ios: "mic.slash.fill" as SFSymbol,
  android: "mic_off" as AndroidSymbol,
  web: "mic_off" as AndroidSymbol,
};

const subtitlesIcon = {
  ios: "captions.bubble.fill" as SFSymbol,
  android: "subtitles" as AndroidSymbol,
  web: "subtitles" as AndroidSymbol,
};

const speakerIcon = {
  ios: "speaker.wave.2.fill" as SFSymbol,
  android: "volume_up" as AndroidSymbol,
  web: "volume_up" as AndroidSymbol,
};

const endCallIcon = {
  ios: "phone.down.fill" as SFSymbol,
  android: "call_end" as AndroidSymbol,
  web: "call_end" as AndroidSymbol,
};

export default function LessonScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { id: lessonId } = params;
  const { completeLesson, streak } = useProgressStore();

  // Find the lesson in lessons data
  const lesson = lessons.find((l) => l.id === lessonId) || lessons[0];

  // Resolve language info
  const unit = units.find((u) => u.id === lesson.unitId);
  const language = languages.find((lang) => lang.id === (unit ? unit.languageId : "es")) || languages[0];

  // Screen/UI States
  const [status, setStatus] = useState<"connecting" | "connected" | "ended">("connecting");
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Modals / Confirmations
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Safe helper to extract content properties from the union type
  const firstActivityContent = lesson.activities?.[0]?.content;
  const rawTranscript = firstActivityContent && "transcript" in firstActivityContent ? firstActivityContent.transcript : null;
  const rawTeacherName = firstActivityContent && "teacherName" in firstActivityContent ? firstActivityContent.teacherName : "Sofia";

  // Conversation Simulation Steps based on active lesson data
  const step1Text = rawTranscript || `¡Hola! Welcome to your lesson. I am your AI teacher. Let's practice some key phrases.`;
  const step2Text = lesson.phrasesList?.[0]?.phrase || lesson.vocabularyList?.[0]?.word || "Hola";
  const step2Trans = lesson.phrasesList?.[0]?.translation || lesson.vocabularyList?.[0]?.translation || "Hello";
  const step3Text = lesson.phrasesList?.[1]?.phrase || lesson.vocabularyList?.[1]?.word || "¿Cómo estás?";
  const step3Trans = lesson.phrasesList?.[1]?.translation || lesson.vocabularyList?.[1]?.translation || "How are you?";

  const steps = [
    {
      teacherSpeech: step1Text,
      englishTranslation: "Welcome to the lesson! Today we are learning key phrases.",
      actionPrompt: "Tap the mic and say hello to begin!",
      speaking: "Good",
      pronunciation: "Good",
      grammar: "Good",
    },
    {
      teacherSpeech: `Excellent. Let's practice the first phrase. Repeat after me: "${step2Text}"`,
      englishTranslation: `"${step2Trans}"`,
      actionPrompt: `Tap the mic and repeat: "${step2Text}"`,
      speaking: "Great",
      pronunciation: "Great",
      grammar: "Good",
    },
    {
      teacherSpeech: `Amazing! Now try repeating this next phrase: "${step3Text}"`,
      englishTranslation: `"${step3Trans}"`,
      actionPrompt: `Tap the mic and repeat: "${step3Text}"`,
      speaking: "Excellent",
      pronunciation: "Great",
      grammar: "Good", // Matches the mock design (Excellent, Great, Good)
    },
    {
      teacherSpeech: "¡Muy bien! That was great! You did an amazing job today. 👏",
      englishTranslation: "Very well! That was great! You did an amazing job today.",
      actionPrompt: "Lesson finished! Tap End Call to finish and claim your XP.",
      speaking: "Excellent",
      pronunciation: "Great",
      grammar: "Good",
    },
  ];

  // Active step details
  const activeStep = steps[currentStep] || steps[0];

  // Pulse animation for mic button during recording
  const [pulseAnim] = useState(() => new Animated.Value(1));

  // Simulate Connection on Load
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus("connected");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle pulse animation loop
  useEffect(() => {
    let animation: Animated.CompositeAnimation | null = null;
    if (isRecording) {
      animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.25,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1.0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();
    } else {
      pulseAnim.setValue(1);
    }
    return () => {
      if (animation) animation.stop();
    };
  }, [isRecording, pulseAnim]);

  // Mic Button Press: Simulates recording user speech
  const handleMicPress = () => {
    if (!micEnabled) {
      setMicEnabled(true);
      return;
    }
    if (isRecording || isEvaluating || currentStep >= steps.length - 1) return;

    // Start recording state
    setIsRecording(true);

    // Simulate 2.5 seconds of recording
    setTimeout(() => {
      setIsRecording(false);
      setIsEvaluating(true);

      // Simulate 1.5 seconds of evaluation/AI teacher processing
      setTimeout(() => {
        setIsEvaluating(false);
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      }, 1500);
    }, 2500);
  };

  // End Call / Finish
  const handleEndCall = () => {
    if (currentStep >= steps.length - 1) {
      // Completed! Award XP and show Success modal
      completeLesson(lesson.id, lesson.xpReward);
      setShowSuccessModal(true);
    } else {
      // Show confirmation dialog before leaving early
      setShowExitConfirm(true);
    }
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    router.replace("/learn");
  };

  const handleFinishAndReturn = () => {
    setShowSuccessModal(false);
    router.replace("/learn");
  };

  // Get color for feedback value text
  const getFeedbackColor = (val: string) => {
    if (val === "Excellent") return "#21C16B"; // Green
    if (val === "Great") return "#4D8BFF"; // Blue
    return "#6C4EF5"; // Purple
  };

  if (status === "connecting") {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 items-center justify-center bg-white px-6">
          <ActivityIndicator size="large" color={colors.linguaPurple} />
          <Text
            className="text-lg text-text-primary mt-6 text-center font-bold"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            Connecting to AI Teacher...
          </Text>
          <Text
            className="text-sm text-text-secondary mt-2 text-center"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            Setting up secure audio session for {lesson.title}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Header ────────────────────────────────────────── */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-gray-50 z-20">
        <Pressable
          onPress={handleEndCall}
          className="w-10 h-10 items-center justify-center rounded-full bg-slate-50 border border-gray-150 active:opacity-75"
        >
          <SymbolView name={backIcon} tintColor={colors.textPrimary} size={18} />
        </Pressable>

        <View className="items-center">
          <Text
            className="text-base text-text-primary font-bold"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            AI Teacher
          </Text>
          <View className="flex-row items-center mt-0.5">
            <View className="w-1.5 h-1.5 rounded-full bg-[#21C16B] mr-1.5" />
            <Text
              className="text-xs text-text-secondary font-medium"
              style={{ fontFamily: "Poppins-Medium" }}
            >
              Online
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-2">
          {/* Video Toggle Status Indicator */}
          <Pressable
            onPress={() => setCameraEnabled(!cameraEnabled)}
            className={`w-9 h-9 items-center justify-center rounded-full border border-gray-100 active:opacity-75 ${
              cameraEnabled ? "bg-white" : "bg-slate-100"
            }`}
          >
            <SymbolView
              name={cameraEnabled ? videoBadgeIcon : cameraSlashIcon}
              tintColor={cameraEnabled ? colors.textPrimary : colors.textSecondary}
              size={15}
            />
          </Pressable>

          {/* Local Streak */}
          <View className="h-9 px-3 items-center justify-center rounded-full border border-gray-100 bg-white flex-row gap-1">
            <SymbolView name={streakBadgeIcon} tintColor={colors.streak} size={13} />
            <Text
              className="text-sm font-bold text-text-primary"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              {streak}
            </Text>
          </View>

          {/* Profile silhouette */}
          <View className="w-9 h-9 items-center justify-center rounded-full border border-gray-100 bg-white">
            <SymbolView name={profileBadgeIcon} tintColor={colors.textPrimary} size={15} />
          </View>
        </View>
      </View>

      {/* ── Main Container (Visual Room Card) ────────────────────── */}
      <View className="flex-1 mx-6 mt-4 mb-4 rounded-[36px] overflow-hidden border border-gray-100 shadow-md relative bg-slate-200">
        {/* Blurred Library Room Background */}
        <Image
          source={images.cafeTableIcon}
          blurRadius={12}
          className="absolute inset-0 w-full h-full"
          contentFit="cover"
        />

        {/* Semi-transparent dark overlay for premium aesthetics */}
        <View className="absolute inset-0 bg-black/5" />

        {/* Floating Student PIP (Picture-In-Picture) in top right */}
        {cameraEnabled && (
          <View className="absolute top-4 right-4 w-24 h-32 rounded-2xl border-2 border-white shadow-md overflow-hidden z-10">
            <Image source={images.studentAvatar} className="w-full h-full" contentFit="cover" />
          </View>
        )}

        {/* AI Mascot character positioned centered at the bottom of the card */}
        <View className="flex-1 items-center justify-end pb-12 z-0">
          <Image
            source={images.mascotTeacher}
            className="w-[280px] h-[280px]"
            contentFit="contain"
          />
        </View>

        {/* Speech Bubble overlay at the bottom */}
        {subtitlesEnabled && (
          <View className="absolute bottom-6 left-4 right-4 bg-white rounded-3xl p-5 shadow-xl flex-row items-center justify-between z-20">
            <View className="flex-1 pr-4">
              <Text
                className="text-[18px] text-text-primary font-bold leading-snug"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                {activeStep.teacherSpeech}
              </Text>
              {/* English subtitles helper toggles inside bubble */}
              <Text
                className="text-xs text-text-secondary mt-1 leading-normal font-medium"
                style={{ fontFamily: "Poppins-Medium" }}
              >
                {activeStep.englishTranslation}
              </Text>
            </View>

            {/* Audio Wave Play Button */}
            <Pressable className="w-10 h-10 items-center justify-center rounded-full bg-purple-50 active:opacity-75">
              <SymbolView name={speakerIcon} tintColor={colors.linguaPurple} size={18} />
            </Pressable>

            {/* Speech bubble triangle pointer */}
            <View className="absolute bottom-[-6px] left-[50%] -ml-1.5 w-3 h-3 bg-white rotate-45" />
          </View>
        )}
      </View>

      {/* ── Status Prompt Helper ──────────────────────────── */}
      <View className="items-center justify-center px-6 h-8">
        <Text
          className={`text-sm font-semibold text-center ${
            isRecording
              ? "text-success"
              : isEvaluating
              ? "text-info"
              : "text-linguaPurple"
          }`}
          style={{ fontFamily: "Poppins-Medium" }}
        >
          {isRecording
            ? "🎙 Listening... Speak now!"
            : isEvaluating
            ? "⚙ Evaluation in progress..."
            : activeStep.actionPrompt}
        </Text>
      </View>

      {/* ── Circular Controls Row ────────────────────────── */}
      <View className="flex-row items-center justify-around px-8 py-4">
        {/* Toggle Camera */}
        <View className="items-center">
          <Pressable
            onPress={() => setCameraEnabled(!cameraEnabled)}
            className={`w-14 h-14 rounded-full items-center justify-center border shadow-sm ${
              cameraEnabled ? "bg-white border-gray-150" : "bg-slate-100 border-gray-200"
            }`}
          >
            <SymbolView
              name={cameraEnabled ? cameraIcon : cameraSlashIcon}
              tintColor={cameraEnabled ? colors.textPrimary : colors.textSecondary}
              size={20}
            />
          </Pressable>
          <Text
            className="text-[11px] text-text-secondary mt-2 font-medium"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            Camera
          </Text>
        </View>

        {/* Toggle / Trigger Mic */}
        <View className="items-center">
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Pressable
              onPress={handleMicPress}
              disabled={isEvaluating || currentStep >= steps.length - 1}
              className={`w-14 h-14 rounded-full items-center justify-center border shadow-sm ${
                isRecording
                  ? "bg-[#21C16B] border-transparent"
                  : !micEnabled
                  ? "bg-slate-100 border-gray-200"
                  : "bg-white border-gray-150"
              }`}
            >
              <SymbolView
                name={!micEnabled ? micSlashIcon : micIcon}
                tintColor={
                  isRecording
                    ? "#FFFFFF"
                    : !micEnabled
                    ? colors.textSecondary
                    : colors.textPrimary
                }
                size={20}
              />
            </Pressable>
          </Animated.View>
          <Text
            className="text-[11px] text-text-secondary mt-2 font-medium"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            {isRecording ? "Listening" : "Mic"}
          </Text>
        </View>

        {/* Toggle Subtitles */}
        <View className="items-center">
          <Pressable
            onPress={() => setSubtitlesEnabled(!subtitlesEnabled)}
            className={`w-14 h-14 rounded-full items-center justify-center border shadow-sm ${
              subtitlesEnabled ? "bg-white border-gray-150" : "bg-slate-100 border-gray-200"
            }`}
          >
            <SymbolView
              name={subtitlesIcon}
              tintColor={subtitlesEnabled ? colors.linguaPurple : colors.textSecondary}
              size={20}
            />
          </Pressable>
          <Text
            className="text-[11px] text-text-secondary mt-2 font-medium"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            Subtitles
          </Text>
        </View>

        {/* End Call / Finish */}
        <View className="items-center">
          <Pressable
            onPress={handleEndCall}
            className="w-14 h-14 rounded-full items-center justify-center bg-[#FF3B30] border-transparent shadow-md active:bg-[#D32F2F]"
          >
            <SymbolView name={endCallIcon} tintColor="#FFFFFF" size={20} />
          </Pressable>
          <Text
            className="text-[11px] text-text-secondary mt-2 font-medium"
            style={{ fontFamily: "Poppins-Medium" }}
          >
            End Call
          </Text>
        </View>
      </View>

      {/* ── Feedback Status Card ────────────────────────── */}
      <View className="px-6 pb-6 pt-2">
        <View className="flex-row items-center justify-between bg-[#F8F9FC] border border-gray-100 rounded-3xl py-4 px-6 shadow-sm">
          {/* Speaking Column */}
          <View className="flex-1 items-center">
            <Text
              className="text-[11px] text-text-secondary uppercase tracking-wider font-semibold"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Speaking
            </Text>
            <Text
              className="text-sm font-bold mt-1"
              style={{
                fontFamily: "Poppins-Bold",
                color: getFeedbackColor(activeStep.speaking),
              }}
            >
              {activeStep.speaking}
            </Text>
          </View>

          {/* Divider */}
          <View className="w-[1px] h-6 bg-gray-200" />

          {/* Pronunciation Column */}
          <View className="flex-1 items-center">
            <Text
              className="text-[11px] text-text-secondary uppercase tracking-wider font-semibold"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Pronunciation
            </Text>
            <Text
              className="text-sm font-bold mt-1"
              style={{
                fontFamily: "Poppins-Bold",
                color: getFeedbackColor(activeStep.pronunciation),
              }}
            >
              {activeStep.pronunciation}
            </Text>
          </View>

          {/* Divider */}
          <View className="w-[1px] h-6 bg-gray-200" />

          {/* Grammar Column */}
          <View className="flex-1 items-center">
            <Text
              className="text-[11px] text-text-secondary uppercase tracking-wider font-semibold"
              style={{ fontFamily: "Poppins-SemiBold" }}
            >
              Grammar
            </Text>
            <Text
              className="text-sm font-bold mt-1"
              style={{
                fontFamily: "Poppins-Bold",
                color: getFeedbackColor(activeStep.grammar),
              }}
            >
              {activeStep.grammar}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Confirm Early Exit Modal ────────────────────── */}
      <Modal
        visible={showExitConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExitConfirm(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl items-center">
            <Text
              className="text-xl text-text-primary font-bold text-center"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Quit Lesson?
            </Text>
            <Text
              className="text-sm text-text-secondary text-center mt-3 leading-relaxed"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              {"Are you sure you want to end this audio session? You will lose all current progress and won't earn any XP."}
            </Text>

            <View className="flex-row w-full mt-6 gap-3">
              <Pressable
                onPress={confirmExit}
                className="flex-1 py-3.5 bg-slate-100 rounded-2xl items-center justify-center active:bg-slate-200"
              >
                <Text
                  className="text-text-primary text-sm font-bold"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  Quit
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setShowExitConfirm(false)}
                className="flex-1 py-3.5 bg-linguaPurple rounded-2xl items-center justify-center active:bg-linguaDeepPurple"
              >
                <Text
                  className="text-white text-sm font-bold"
                  style={{ fontFamily: "Poppins-Bold" }}
                >
                  Keep Learning
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Success Completion Modal ────────────────────── */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="slide"
        onRequestClose={handleFinishAndReturn}
      >
        <View className="flex-1 justify-center items-center bg-black/60 px-6">
          <View className="bg-white w-full max-w-sm rounded-[36px] p-6 shadow-2xl items-center">
            <Image
              source={images.mascotLogo}
              className="w-28 h-28 mb-2"
              contentFit="contain"
            />
            
            <Text
              className="text-2xl text-text-primary font-bold text-center mt-2"
              style={{ fontFamily: "Poppins-Bold" }}
            >
              Lesson Completed!
            </Text>
            
            <Text
              className="text-sm text-text-secondary text-center mt-2 px-2 leading-relaxed"
              style={{ fontFamily: "Poppins-Regular" }}
            >
              Great conversation! You completed the audio session with {language.name} teacher {rawTeacherName}.
            </Text>

            {/* XP Award Badge */}
            <View className="flex-row items-center bg-purple-50 border border-purple-100 px-4 py-2.5 rounded-full mt-5 gap-1.5">
              <SymbolView name={streakBadgeIcon} tintColor={colors.streak} size={15} />
              <Text
                className="text-base text-linguaPurple font-bold"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                +{lesson.xpReward} XP
              </Text>
            </View>

            <Pressable
              onPress={handleFinishAndReturn}
              className="w-full py-4 bg-linguaPurple rounded-2xl items-center justify-center mt-6 shadow-md active:bg-linguaDeepPurple"
            >
              <Text
                className="text-white text-base font-bold"
                style={{ fontFamily: "Poppins-Bold" }}
              >
                Awesome!
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
