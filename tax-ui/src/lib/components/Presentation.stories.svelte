<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Presentation from "./Presentation.svelte";

  const { Story } = defineMeta({
    component: Presentation,
  });

  const standardArgs = {
    inputForm: {
      yearsOfService: 10,
      isDisability: false,
      isOfficer: "0",
      severancePay: 5_000_000,
    },
    tax: 10000,
    calcStatus: "succeeded",
  };
</script>

<Story name="Standard" args={standardArgs} } />>

<Story
  name="NoResult"
  args={{
    ...standardArgs,
    tax: 0,
    calcStatus: "failed",
  }}
/>
