import "react";

/**
 * Legacy lesson components historically pass `active` to a few local visual
 * components that do not declare it. Keep that compatibility without
 * constraining real component `active` props to boolean. `unknown` is neutral
 * in intersections, so a component declaring `active: string | number | boolean`
 * keeps its own type instead of collapsing to `never`.
 */
declare module "react" {
  namespace JSX {
    interface IntrinsicAttributes {
      active?: unknown;
    }
  }
}
