declare module "*.svg" {
    import React from "react";
    import { SvgProps } from "react-native-svg";
    const content: React.FC<SvgProps>;
    export default content;
  }

declare module "*.png" {
  import React from "react";
  import { ImageProps } from 'react-native';
  const value: React.FC<ImageProps>;
  export default value;
}

declare module "*.jpg" {
  import React from "react";
  import { ImageProps } from 'react-native';
  const value: React.FC<ImageProps>;
  export default value;
}

declare module "*.jpeg" {
  import React from "react";
  import { ImageProps } from 'react-native';
  const value: React.FC<ImageProps>;
  export default value;
}