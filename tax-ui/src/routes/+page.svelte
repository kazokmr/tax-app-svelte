<script lang="ts">
  import type { PageData } from "./$types";
  import type { CalcStatus } from "$lib/modules/calcStatus";
  import Presentation from "$lib/components/Presentation.svelte";

  export let data: PageData;
  let tax;
  let calcStatus: CalcStatus = "before-calculation";
  const handleResult = (event) => (tax = event.detail.tax);
  const handleCalcStatus = (event) => (calcStatus = event.detail.calcStatus);
</script>

<Presentation
  data="{data.form}"
  tax="{tax}"
  calcStatus="{calcStatus}"
  on:calculate="{handleResult}"
  on:changeStatus="{handleCalcStatus}"
/>
