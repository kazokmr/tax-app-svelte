import type { Meta, StoryObj } from "@storybook/svelte";
import InputForm from "./InputForm.svelte";

const meta = {
  component: InputForm,
} satisfies Meta<InputForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    data: {
      yearsOfService: 10,
      isDisability: false,
      isOfficer: "0",
      severancePay: 5_000_000,
    },
  },
};
