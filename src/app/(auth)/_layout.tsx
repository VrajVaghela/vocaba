import { useAuth } from "@clerk/expo";
import { Redirect, Stack } from "expo-router";
import { colors } from "@/theme";

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  // Wait for Clerk to load before making any decisions
  if (!isLoaded) {
    return null;
  }

  // If already signed in, redirect to home
  if (isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: colors.background },
        headerShown: false,
      }}
    />
  );
}
