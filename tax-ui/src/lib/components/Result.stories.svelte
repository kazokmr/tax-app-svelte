<script module lang="ts">
  import { defineMeta } from "@storybook/addon-svelte-csf";
  import Result from "./Result.svelte";

  const { Story } = defineMeta({
    component: Result,
  });
</script>

<Story
  name="BeforeCalculation"
  args={{
    tax: 10000,
    calcStatus: "before-calculation",
  }}
/>

<Story
  name="UnderCalculation"
  args={{
    tax: 10000,
    calcStatus: "under-calculation",
  }}
/>

<Story
  name="Succeeded"
  args={{
    tax: 10000,
    calcStatus: "succeeded",
  }}
/>

<Story
  name="Failed"
  args={{
    tax: 10000,
    calcStatus: "failed",
  }}
/>
