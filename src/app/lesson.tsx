import React, { useState, useEffect, useRef } from "react";
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
import { useUser } from "@clerk/expo";
import { posthog } from "@/lib/posthog";
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
  useCallStateHooks,
  Call,
} from "@stream-io/video-react-native-sdk";

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

interface ActiveCallInterfaceProps {
  lesson: typeof lessons[0];
  language: typeof languages[0];
  streak: number;
  activeStep: any;
  isRecording: boolean;
  setIsRecording: (val: boolean) => void;
  isEvaluating: boolean;
  setIsEvaluating: (val: boolean) => void;
  steps: any[];
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  handleEndCall: () => void;
  cameraEnabled: boolean;
  setCameraEnabled: (val: boolean) => void;
  subtitlesEnabled: boolean;
  setSubtitlesEnabled: (val: boolean) => void;
  pulseAnim: Animated.Value;
  rawTeacherName: string;
  isStream: boolean;
  localMicEnabled: boolean;
  setLocalMicEnabled: (val: boolean) => void;
  callId: string;
  user: any;
  agentStatus: "idle" | "connecting" | "connected" | "failed";
  setAgentStatus: React.Dispatch<React.SetStateAction<"idle" | "connecting" | "connected" | "failed">>;
  closedCaptions?: any[];
}

// Presentational Layout Component
function CallInterfaceLayout({
  lesson,
  language,
  streak,
  activeStep,
  isRecording,
  setIsRecording,
  isEvaluating,
  setIsEvaluating,
  steps,
  currentStep,
  setCurrentStep,
  handleEndCall,
  cameraEnabled,
  setCameraEnabled,
  subtitlesEnabled,
  setSubtitlesEnabled,
  pulseAnim,
  rawTeacherName,
  isStream,
  callId,
  user,
  isMuted,
  toggleMic,
  participantCount,
  agentStatus,
  closedCaptions,
}: ActiveCallInterfaceProps & {
  isMuted: boolean;
  toggleMic: () => Promise<void>;
  participantCount: number;
}) {
  // Handle Speech/Recording practice simulation when unmuted
  const triggerRecordingFlow = () => {
    if (isMuted || isRecording || isEvaluating || currentStep >= steps.length - 1) return;

    setIsRecording(true);

    setTimeout(() => {
      setIsRecording(false);
      setIsEvaluating(true);

      setTimeout(() => {
        setIsEvaluating(false);
        setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      }, 1500);
    }, 2500);
  };

  // Get color for feedback value text
  const getFeedbackColor = (val: string) => {
    if (val === "Excellent") return "#21C16B"; // Green
    if (val === "Great") return "#4D8BFF"; // Blue
    return "#6C4EF5"; // Purple
  };

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
          <View className="flex-row items-center mt-0.5 justify-center">
            {isStream && (
              <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                agentStatus === "connected" ? "bg-[#21C16B]" :
                agentStatus === "connecting" ? "bg-amber-500" :
                agentStatus === "failed" ? "bg-red-500" : "bg-gray-400"
              }`} />
            )}
            <Text
              className="text-xs font-semibold"
              style={{
                fontFamily: "Poppins-Medium",
                color: !isStream ? colors.textSecondary :
                  agentStatus === "connected" ? "#21C16B" :
                  agentStatus === "connecting" ? "#F59E0B" :
                  agentStatus === "failed" ? "#EF4444" : "#6B7280"
              }}
            >
              {isStream ? (
                agentStatus === "connected" ? `Sofia Joined (${participantCount} active)` :
                agentStatus === "connecting" ? "Sofia Joining..." :
                agentStatus === "failed" ? "Sofia Offline" : "Sofia Offline"
              ) : "Demo Room"}
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

          {/* Profile silhouette / avatar */}
          <View className="w-9 h-9 items-center justify-center rounded-full border border-gray-100 bg-white overflow-hidden">
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} className="w-full h-full" contentFit="cover" />
            ) : (
              <SymbolView name={profileBadgeIcon} tintColor={colors.textPrimary} size={15} />
            )}
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

        {/* Floating Participant details */}
        <View className="absolute top-4 left-4 bg-white/80 border border-gray-100 rounded-full px-3 py-1 flex-row items-center gap-1.5 shadow-sm z-10">
          <View className={`w-2 h-2 rounded-full ${isMuted ? "bg-red-500" : "bg-[#21C16B]"}`} />
          <Text className="text-[10px] font-bold text-text-primary uppercase" style={{ fontFamily: "Poppins-Bold" }}>
            {isStream ? `Call: ${callId.slice(-8)}` : "Demo Mode"}
          </Text>
        </View>

        {/* Floating Student PIP (Picture-In-Picture) in top right */}
        <View className="absolute top-4 right-4 w-24 h-32 rounded-2xl border-2 border-white shadow-md overflow-hidden bg-slate-100 flex-col items-center justify-center z-10">
          {cameraEnabled ? (
            <Image source={user?.imageUrl ? { uri: user.imageUrl } : images.studentAvatar} className="w-full h-full" contentFit="cover" />
          ) : (
            <View className="items-center justify-center p-2">
              <SymbolView name={profileBadgeIcon} tintColor={colors.textSecondary} size={24} />
              <Text className="text-[9px] text-center text-text-secondary mt-1 font-bold truncate max-w-full" style={{ fontFamily: "Poppins-Bold" }}>
                {user?.firstName || "You"}
              </Text>
              <Text className="text-[8px] text-center text-text-secondary font-semibold mt-0.5" style={{ fontFamily: "Poppins-SemiBold", color: isMuted ? "#FF3B30" : "#21C16B" }}>
                {isMuted ? "Muted" : "Active"}
              </Text>
            </View>
          )}
        </View>

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
              {isStream && closedCaptions && closedCaptions.length > 0 ? (
                <View className="flex-col gap-1.5">
                  {closedCaptions.map((caption, index) => {
                    const isTeacher = caption.user?.id === "ai-teacher";
                    const speakerName = isTeacher ? rawTeacherName : "You";
                    return (
                      <View key={index} className="flex-row flex-wrap">
                        <Text
                          className="text-sm font-bold"
                          style={{
                            fontFamily: "Poppins-Bold",
                            color: isTeacher ? colors.linguaPurple : "#10B981"
                          }}
                        >
                          {speakerName}:{" "}
                        </Text>
                        <Text
                          className="text-sm text-text-primary font-semibold leading-relaxed flex-1"
                          style={{ fontFamily: "Poppins-SemiBold" }}
                        >
                          {caption.text}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <>
                  <Text
                    className="text-[18px] text-text-primary font-bold leading-snug"
                    style={{ fontFamily: "Poppins-Bold" }}
                  >
                    {activeStep.teacherSpeech}
                  </Text>
                  {/* English subtitles helper toggles inside subtitle box */}
                  <Text
                    className="text-xs text-text-secondary mt-1 leading-normal font-medium"
                    style={{ fontFamily: "Poppins-Medium" }}
                  >
                    {activeStep.englishTranslation}
                  </Text>
                </>
              )}
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
            isMuted
              ? "text-red-500"
              : isRecording
              ? "text-success"
              : isEvaluating
              ? "text-info"
              : "text-linguaPurple"
          }`}
          style={{ fontFamily: "Poppins-Medium" }}
        >
          {isMuted
            ? "🎙 Microphone is muted. Tap Mic to unmute!"
            : isRecording
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
              onPress={isMuted ? toggleMic : triggerRecordingFlow}
              disabled={isEvaluating || currentStep >= steps.length - 1}
              className={`w-14 h-14 rounded-full items-center justify-center border shadow-sm ${
                isRecording
                  ? "bg-[#21C16B] border-transparent"
                  : isMuted
                  ? "bg-slate-100 border-gray-200"
                  : "bg-white border-gray-150"
              }`}
            >
              <SymbolView
                name={isMuted ? micSlashIcon : micIcon}
                tintColor={
                  isRecording
                    ? "#FFFFFF"
                    : isMuted
                    ? colors.textSecondary
                    : colors.textPrimary
                }
                size={20}
              />
            </Pressable>
          </Animated.View>
          <View className="flex-row items-center gap-1.5 mt-2">
            <Text
              className="text-[11px] text-text-secondary font-medium"
              style={{ fontFamily: "Poppins-Medium" }}
            >
              {isRecording ? "Listening" : isMuted ? "Muted" : "Mic"}
            </Text>
            {!isRecording && (
              <Pressable onPress={toggleMic} className="w-4 h-4 bg-slate-100 border border-gray-200 items-center justify-center rounded-full">
                <Text className="text-[8px] font-bold text-text-secondary">
                  {isMuted ? "🎙" : "🔇"}
                </Text>
              </Pressable>
            )}
          </View>
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
    </SafeAreaView>
  );
}

// Inner Stream calling component (called only when isStream is true)
function StreamActiveCallInterface(props: ActiveCallInterfaceProps) {
  const { useMicrophoneState, useParticipants, useCallClosedCaptions } = useCallStateHooks();
  const { microphone, isMute } = useMicrophoneState();
  const participants = useParticipants();
  const closedCaptions = useCallClosedCaptions();

  const toggleMic = async () => {
    try {
      await microphone.toggle();
    } catch (err) {
      console.error("Failed to toggle stream microphone:", err);
    }
  };

  const agentParticipant = participants.find((p) => p.userId === "ai-teacher");
  const { agentStatus, setAgentStatus } = props;

  useEffect(() => {
    if (agentParticipant) {
      if (agentStatus !== "connected") {
        setAgentStatus("connected");
      }
    } else {
      if (agentStatus === "connected") {
        setAgentStatus("idle");
      }
    }
  }, [agentParticipant, agentStatus, setAgentStatus]);

  return (
    <CallInterfaceLayout
      {...props}
      isMuted={isMute}
      toggleMic={toggleMic}
      participantCount={participants.length}
      closedCaptions={closedCaptions}
    />
  );
}

// Inner local fallback/demo component
function DemoActiveCallInterface(props: ActiveCallInterfaceProps) {
  const toggleMic = async () => {
    props.setLocalMicEnabled(!props.localMicEnabled);
  };

  return (
    <CallInterfaceLayout
      {...props}
      isMuted={!props.localMicEnabled}
      toggleMic={toggleMic}
      participantCount={1}
    />
  );
}

export default function LessonScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { id: lessonId } = params;
  const { completeLesson, streak } = useProgressStore();
  const { user } = useUser();

  // Find the lesson in lessons data
  const lesson = lessons.find((l) => l.id === lessonId) || lessons[0];

  // Resolve language info
  const unit = units.find((u) => u.id === lesson.unitId);
  const language = languages.find((lang) => lang.id === (unit ? unit.languageId : "es")) || languages[0];

  // GetStream SDK connection states
  const [streamClient, setStreamClient] = useState<StreamVideoClient | null>(null);
  const [streamCall, setStreamCall] = useState<Call | null>(null);
  const [streamStatus, setStreamStatus] = useState<"connecting" | "joined" | "error" | "ended">("connecting");
  const [errorMessage, setErrorMessage] = useState("");
  const [demoMode, setDemoMode] = useState(false);
  const [localMicEnabled, setLocalMicEnabled] = useState(true);
  const [agentStatus, setAgentStatus] = useState<"idle" | "connecting" | "connected" | "failed">("idle");
  const [agentSessionId, setAgentSessionId] = useState<string | null>(null);

  // Screen/UI States
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // PostHog Tracking references & effect
  const startTimeRef = useRef<number>(0);
  const isCompletedRef = useRef<boolean>(false);
  const currentStepRef = useRef<number>(0);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    const getLessonNumber = (id: string): number => {
      const match = id.match(/lesson-(\d+)/i);
      if (match) {
        return parseInt(match[1], 10);
      }
      const idx = lessons.findIndex((l) => l.id === id);
      return idx !== -1 ? idx + 1 : 1;
    };

    posthog.capture("lesson_started", {
      lesson_id: lesson.id,
      language: language.name,
      lesson_number: getLessonNumber(lesson.id),
    });

    startTimeRef.current = Date.now();
    isCompletedRef.current = false;

    return () => {
      if (!isCompletedRef.current) {
        const timeIntoLessonSeconds = startTimeRef.current > 0 ? Math.round((Date.now() - startTimeRef.current) / 1000) : 0;
        posthog.capture("lesson_abandoned", {
          lesson_id: lesson.id,
          time_into_lesson_seconds: timeIntoLessonSeconds,
          duration_seconds: timeIntoLessonSeconds,
          last_question_index: currentStepRef.current,
        });
      }
    };
  }, [lesson.id, language.name]);

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
      grammar: "Good",
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

  // Initialize GetStream Room Call via Expo API Route
  useEffect(() => {
    let activeClient: StreamVideoClient | null = null;
    let activeCall: Call | null = null;
    let activeAgentSessionId: string | null = null;
    let activeCallId: string | null = null;
    let isMounted = true;

    async function initStream() {
      try {
        if (!user) return;

        // 1. Fetch token and call config from backend
        const response = await fetch("/api/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
            userName: user.fullName || user.firstName || "Learner",
            userImage: user.imageUrl || "",
            lessonId: lesson.id,
            lessonTitle: lesson.title,
            languageId: language.id,
            languageName: language.name,
            goals: lesson.goals?.map((g) => g.description) || [],
            vocabulary: lesson.vocabularyList || [],
            phrases: lesson.phrasesList || [],
            aiTeacherPrompt: lesson.aiTeacherPrompt || "",
          }),
        });

        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        if (!isMounted) return;
        activeCallId = data.callId;

        // 2. Setup Client
        const client = new StreamVideoClient({
          apiKey: data.apiKey,
          user: {
            id: user.id,
            name: user.fullName || user.firstName || "Learner",
            image: user.imageUrl || undefined,
          },
          token: data.token,
        });

        activeClient = client;
        setStreamClient(client);

        // 3. Create & Join Call
        const call = client.call(data.callType, data.callId);
        await call.join({ create: true });

        if (!isMounted) return;
        activeCall = call;
        setStreamCall(call);
        setStreamStatus("joined");

        // Start closed captions automatically for this call room
        try {
          await call.startClosedCaptions({ language: language.id as any });
          console.log(`Stream closed captions started successfully for language: ${language.id}`);
        } catch (ccErr) {
          console.warn("Failed to start closed captions automatically:", ccErr);
        }

        // 4. Start the AI Agent session
        try {
          setAgentStatus("connecting");
          const agentResponse = await fetch("/api/agent/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              callId: data.callId,
            }),
          });
          
          if (!agentResponse.ok) {
            throw new Error(`Failed to start agent: ${agentResponse.status}`);
          }
          
          const agentData = await agentResponse.json();
          if (agentData.session_id && isMounted) {
            activeAgentSessionId = agentData.session_id;
            setAgentSessionId(agentData.session_id);
          } else if (isMounted) {
            setAgentStatus("failed");
          }
        } catch (agentErr) {
          console.error("Error starting AI Agent:", agentErr);
          if (isMounted) {
            setAgentStatus("failed");
          }
        }
      } catch (err: any) {
        console.error("Stream Video/Audio error:", err);
        if (isMounted) {
          setErrorMessage(err.message || "Could not connect to Stream call room");
          setStreamStatus("error");
        }
      }
    }

    if (user && !demoMode) {
      initStream();
    }

    return () => {
      isMounted = false;
      if (activeCall) {
        activeCall.leave().catch((err) => console.log("Clean up leaving call:", err));
      }
      if (activeClient) {
        activeClient.disconnectUser().catch((err) => console.log("Clean up disconnecting client:", err));
      }
      if (activeCallId && activeAgentSessionId) {
        fetch("/api/agent/stop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callId: activeCallId,
            sessionId: activeAgentSessionId,
          }),
        }).catch((err) => console.log("Clean up stopping agent error:", err));
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, demoMode, lesson.id, language.id]);

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

  const stopAgentSession = async () => {
    if (streamCall?.id && agentSessionId) {
      try {
        console.log(`Stopping agent session ${agentSessionId} for call ${streamCall.id}`);
        await fetch("/api/agent/stop", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            callId: streamCall.id,
            sessionId: agentSessionId,
          }),
        });
        setAgentSessionId(null);
        setAgentStatus("idle");
      } catch (err) {
        console.error("Error stopping agent session:", err);
      }
    }
  };

  // End Call / Finish
  const handleEndCall = () => {
    if (currentStep >= steps.length - 1) {
      completeLesson(lesson.id, lesson.xpReward);
      isCompletedRef.current = true;
      setShowSuccessModal(true);
    } else {
      setShowExitConfirm(true);
    }
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    stopAgentSession();
    setStreamStatus("ended");
    router.replace("/learn");
  };

  const handleFinishAndReturn = () => {
    setShowSuccessModal(false);
    stopAgentSession();
    setStreamStatus("ended");
    router.replace("/learn");
  };

  // Connecting view
  if (streamStatus === "connecting" && !demoMode) {
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
            Joining call room for {lesson.title}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error fallback view
  if (streamStatus === "error" && !demoMode) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 items-center justify-center bg-white px-6">
          <SymbolView
            name={{ ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" }}
            tintColor="#FF3B30"
            size={48}
          />
          <Text
            className="text-xl text-text-primary mt-6 text-center font-bold"
            style={{ fontFamily: "Poppins-Bold" }}
          >
            Connection Error
          </Text>
          <Text
            className="text-sm text-text-secondary mt-2 text-center max-w-xs leading-relaxed"
            style={{ fontFamily: "Poppins-Regular" }}
          >
            {errorMessage || "We couldn't connect to the Stream Call. This happens if your API credentials are not set up."}
          </Text>
          
          <View className="w-full gap-3 mt-8">
            <Pressable
              onPress={() => {
                setStreamStatus("connecting");
                setDemoMode(false);
              }}
              className="w-full py-4 bg-linguaPurple rounded-2xl items-center justify-center shadow-md active:bg-linguaDeepPurple"
            >
              <Text className="text-white text-base font-bold" style={{ fontFamily: "Poppins-Bold" }}>
                Retry Connection
              </Text>
            </Pressable>
            
            <Pressable
              onPress={() => setDemoMode(true)}
              className="w-full py-4 bg-slate-100 rounded-2xl items-center justify-center active:bg-slate-200"
            >
              <Text className="text-text-primary text-base font-bold" style={{ fontFamily: "Poppins-Bold" }}>
                Start Offline Demo Mode
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Call Content container
  const callId = streamCall?.id || "demo-room";
  const isStreamActive = !demoMode && !!streamClient && !!streamCall;

  return (
    <SafeAreaView style={styles.safeArea}>
      {isStreamActive ? (
        <StreamVideo client={streamClient!}>
          <StreamCall call={streamCall!}>
            <StreamActiveCallInterface
              lesson={lesson}
              language={language}
              streak={streak}
              activeStep={activeStep}
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              isEvaluating={isEvaluating}
              setIsEvaluating={setIsEvaluating}
              steps={steps}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              handleEndCall={handleEndCall}
              cameraEnabled={cameraEnabled}
              setCameraEnabled={setCameraEnabled}
              subtitlesEnabled={subtitlesEnabled}
              setSubtitlesEnabled={setSubtitlesEnabled}
              pulseAnim={pulseAnim}
              rawTeacherName={rawTeacherName}
              isStream={true}
              localMicEnabled={localMicEnabled}
              setLocalMicEnabled={setLocalMicEnabled}
              callId={callId}
              user={user}
              agentStatus={agentStatus}
              setAgentStatus={setAgentStatus}
            />
          </StreamCall>
        </StreamVideo>
      ) : (
        <DemoActiveCallInterface
          lesson={lesson}
          language={language}
          streak={streak}
          activeStep={activeStep}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          isEvaluating={isEvaluating}
          setIsEvaluating={setIsEvaluating}
          steps={steps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          handleEndCall={handleEndCall}
          cameraEnabled={cameraEnabled}
          setCameraEnabled={setCameraEnabled}
          subtitlesEnabled={subtitlesEnabled}
          setSubtitlesEnabled={setSubtitlesEnabled}
          pulseAnim={pulseAnim}
          rawTeacherName={rawTeacherName}
          isStream={false}
          localMicEnabled={localMicEnabled}
          setLocalMicEnabled={setLocalMicEnabled}
          callId={callId}
          user={user}
          agentStatus="connected"
          setAgentStatus={() => {}}
        />
      )}

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
