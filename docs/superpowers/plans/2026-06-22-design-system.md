# Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete NativeWind-based design system for the app that matches the provided Lingua theme and loads the Poppins font family at startup.

**Architecture:** Keep design tokens in `src/theme/`, expose shared asset imports through `src/constants/images.ts`, and put NativeWind theme utilities in `src/global.css`. Load fonts in the root Expo Router layout before rendering the stack, then exercise the system in the home route with a visual token showcase.

**Tech Stack:** Expo SDK 56, Expo Router, NativeWind v5 preview, `expo-font`, `expo-splash-screen`, TypeScript.

---

### Task 1: Create theme token modules

**Files:**
- Create: `src/theme/colors.ts`
- Create: `src/theme/typography.ts`
- Create: `src/theme/radius.ts`
- Create: `src/theme/spacing.ts`
- Create: `src/theme/shadows.ts`
- Create: `src/theme/index.ts`

- [ ] **Step 1: Add typed token constants**

```ts
export const colors = {
  linguaPurple: "#6C4EF5",
  linguaDeepPurple: "#5B3BF6",
  linguaBlue: "#4D8BFF",
  linguaGreen: "#21C16B",
  success: "#21C16B",
  warning: "#FFC800",
  streak: "#FF8A00",
  error: "#FF4D4F",
  info: "#4D8BFF",
  textPrimary: "#0D132B",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  surface: "#F6F7FB",
  background: "#FFFFFF",
} as const;
```

- [ ] **Step 2: Re-export tokens from a single entrypoint**

```ts
export { colors, type ThemeColor } from "./colors";
export { radius } from "./radius";
export { shadows } from "./shadows";
export { spacing } from "./spacing";
export { fontFamily, typography } from "./typography";
```

### Task 2: Add centralized image imports

**Files:**
- Create: `src/constants/images.ts`
- Update: `src/types/css.d.ts`

- [ ] **Step 1: Centralize the logo and mascot assets**

```ts
import mascotWelcome from "@/assets/images/mascot-welcome.png";
import mascotLogo from "@/assets/images/moscot-logo.png";

export const images = {
  mascotLogo,
  mascotWelcome,
} as const;
```

- [ ] **Step 2: Declare PNG modules for TypeScript**

```ts
declare module "*.png" {
  const asset: import("react-native").ImageSourcePropType;
  export default asset;
}
```

### Task 3: Configure NativeWind theme utilities

**Files:**
- Update: `src/global.css`

- [ ] **Step 1: Define CSS-first theme tokens**

```css
@theme {
  --color-lingua-purple: #6c4ef5;
  --color-lingua-deep-purple: #5b3bf6;
  --color-lingua-blue: #4d8bff;
  --color-lingua-green: #21c16b;
  --color-success: #21c16b;
  --color-warning: #ffc800;
  --color-streak: #ff8a00;
  --color-error: #ff4d4f;
  --color-info: #4d8bff;
  --color-text-primary: #0d132b;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  --color-surface: #f6f7fb;
  --color-background: #ffffff;

  --font-poppins: "Poppins-Regular";
  --font-poppins-medium: "Poppins-Medium";
  --font-poppins-semibold: "Poppins-SemiBold";
  --font-poppins-bold: "Poppins-Bold";
}
```

- [ ] **Step 2: Add reusable utility classes for cards, text, and swatches**

```css
.ds-card {
  background-color: var(--color-background);
  border-color: var(--color-border);
  border-radius: 20px;
  border-width: 1px;
  padding: 22px;
  gap: 18px;
  box-shadow: 0 12px 30px rgba(13, 19, 43, 0.08);
}
```

### Task 4: Load fonts and hold splash screen in root layout

**Files:**
- Update: `src/app/_layout.tsx`

- [ ] **Step 1: Load all Poppins variants with `useFonts`**

```tsx
const [fontsLoaded, fontError] = useFonts({
  "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
  "Poppins-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
  "Poppins-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
  "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
});
```

- [ ] **Step 2: Hide splash once fonts resolve**

```tsx
useEffect(() => {
  if (fontsLoaded || fontError) {
    SplashScreen.hideAsync();
  }
}, [fontError, fontsLoaded]);
```

### Task 5: Build the design-system showcase screen

**Files:**
- Update: `src/app/index.tsx`

- [ ] **Step 1: Replace the placeholder screen with a token showcase**

```tsx
<ScrollView
  className="screen__root"
  contentInsetAdjustmentBehavior="automatic"
  contentContainerClassName="screen__content"
>
```

- [ ] **Step 2: Render brand, colors, and typography sections using the new utilities**

```tsx
<View className="ds-card">
  <SectionTitle>Brand</SectionTitle>
  <View className="flex-row items-center justify-center gap-7 py-5">
    <Image source={images.mascotLogo} className="brand-logo__mark" />
    <Text className="brand-logo__wordmark">lingua</Text>
  </View>
</View>
```

### Task 6: Add a typecheck script and verify

**Files:**
- Update: `package.json`

- [ ] **Step 1: Add `typecheck` to scripts**

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 2: Run validation**

```bash
npm run lint
npm run typecheck
```

Expected: lint passes, typecheck passes.
