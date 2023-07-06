import type { Meta, StoryObj } from "@storybook/svelte";
import Presentation from "$lib/components/Presentation.svelte";

const meta = {
  component: Presentation,
} satisfies Meta<Presentation>;

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
    tax: 10000,
  },
};

export const NoResult: Story = {
  args: {
    tax: null,
  },
};
