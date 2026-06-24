import { useEffect, useRef } from "react";
import { useUser } from "@clerk/expo";
import { useLanguageStore } from "@/store/languageStore";
import { posthog } from "@/lib/posthog";

export function PostHogIdentifier() {
  const { user } = useUser();
  const { selectedLanguageId, hasHydrated } = useLanguageStore();
  const lastIdentified = useRef<{ userId: string | null; languageId: string | null }>({
    userId: null,
    languageId: null,
  });

  useEffect(() => {
    // Only proceed if Clerk user info is loaded and the language store is hydrated
    if (user?.id && hasHydrated) {
      const currentLang = selectedLanguageId || null;
      const hasUserIdChanged = lastIdentified.current.userId !== user.id;
      const hasLanguageChanged = lastIdentified.current.languageId !== currentLang;

      if (hasUserIdChanged || hasLanguageChanged) {
        const properties: any = {
          $set_once: {
            signup_date: new Date().toISOString(),
          },
        };

        properties.$set = {
          preferred_language: currentLang,
        };

        posthog.identify(user.id, properties);
        lastIdentified.current = { userId: user.id, languageId: currentLang };
      }
    } else if (!user?.id && lastIdentified.current.userId !== null) {
      // If user logs out, reset posthog identifier
      posthog.reset();
      lastIdentified.current = { userId: null, languageId: null };
    }
  }, [user?.id, selectedLanguageId, hasHydrated]);

  return null;
}
