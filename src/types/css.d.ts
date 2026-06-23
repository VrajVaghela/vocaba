/// <reference types="react-native-css/types" />

declare module "*.css";

declare module "*.png" {
  const asset: import("react-native").ImageSourcePropType;
  export default asset;
}

declare module "*.jpg" {
  const asset: import("react-native").ImageSourcePropType;
  export default asset;
}

declare module "*.jpeg" {
  const asset: import("react-native").ImageSourcePropType;
  export default asset;
}

declare module "*.gif" {
  const asset: import("react-native").ImageSourcePropType;
  export default asset;
}

declare module "*.webp" {
  const asset: import("react-native").ImageSourcePropType;
  export default asset;
}

declare module "*.svg" {
  const asset: import("react-native").ImageSourcePropType;
  export default asset;
}
