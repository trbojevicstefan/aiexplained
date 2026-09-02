import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicAttributes {
      active?: boolean;
    }
  }
}
