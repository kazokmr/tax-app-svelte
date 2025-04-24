import type { StorybookConfig } from "@storybook/sveltekit";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx|svelte)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-mdx-gfm",
    "@storybook/addon-svelte-csf",
    "@chromatic-com/storybook",
  ],
  framework: {
    name: "@storybook/sveltekit",
    options: {},
  },
  docs: {},
};
export default config;
