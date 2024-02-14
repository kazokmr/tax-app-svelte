import type { Meta, StoryObj } from "@storybook/svelte";
import InputForm from "./InputForm.svelte";

const meta = {
  component: InputForm,
  parameters: {
    sveltekit_experimental: {
      stores: {
        page: {},
        navigating: {},
      },
    },
  },
} satisfies Meta<InputForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    inputForm: {
      yearsOfService: 10,
      isDisability: false,
      isOfficer: "0",
      severancePay: 5_000_000,
    },
    calcStatus: "succeeded",
  },
};
