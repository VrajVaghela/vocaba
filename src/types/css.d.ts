/// <reference types="react-native-css/types" />

declare module "*.css";

declare module "*.png" {
  const asset: import("react-native").ImageSourcePropType;
  export default asset;
}
