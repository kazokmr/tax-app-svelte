<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import InputForm from "./InputForm.svelte";

  const { Story } = defineMeta({
    component: InputForm,
  });
</script>

<Story
  name="Standard"
  args={{
    inputForm: {
      yearsOfService: 10,
      isDisability: false,
      isOfficer: "0",
      severancePay: 5_000_000,
    },
    calcStatus: "succeeded",
  }}
/>
