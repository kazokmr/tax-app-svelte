<script lang="ts">
  import type { PageData } from "./$types";
  import Presentation from "$lib/components/Presentation.svelte";
  import type { CalcStatus } from "$lib/modules/calcStatus";

  export let data: PageData;
  let tax;
  const handleResult = (event) => (tax = event.detail.tax);
  let calcStatus: CalcStatus = "succeeded";
</script>

<Presentation
  data="{data.form}"
  tax="{tax}"
  on:calculate="{handleResult}"
  calcStatus="{calcStatus}"
/>
