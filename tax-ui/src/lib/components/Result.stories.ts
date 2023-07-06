import type { Meta, StoryObj } from "@storybook/svelte";
import Result from "$lib/components/Result.svelte";

const meta = {
  component: Result,
} satisfies Meta<Result>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BeforeCalculation: Story = {
  args: {
    tax: 10000,
    calcStatus: "before-calculation",
  },
};

export const UnderCalculation: Story = {
  args: {
    tax: 10000,
    calcStatus: "under-calculation",
  },
};

export const Succeeded: Story = {
  args: {
    tax: 10000,
    calcStatus: "succeeded",
  },
};

export const Failed: Story = {
  args: {
    tax: 10000,
    calcStatus: "failed",
  },
};
