import InputForm from "./InputForm.svelte";
import type { Meta, StoryObj } from "@storybook/svelte";

const meta = {
  component: InputForm
} satisfies Meta<InputForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};
