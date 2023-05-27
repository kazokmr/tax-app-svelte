import type { Meta, StoryObj } from "@storybook/svelte";
import Result from "$lib/components/Result.svelte";

const meta = {
  component: Result
} satisfies Meta<Result>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: { tax: 10000 }
};

export const NoResult: Story = {
  args: { tax: null }
};
