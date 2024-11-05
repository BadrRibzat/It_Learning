declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, unknown>; // Changed 'any' to 'unknown'
  export default component;
}

declare module "*.js" {
  const content: Record<string, unknown>; // Changed 'any' to 'Record<string, unknown>'
  export default content;
}

declare module "*.json" {
  const content: Record<string, unknown>; // Changed 'any' to 'Record<string, unknown>'
  export default content;
}
