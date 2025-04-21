<script lang="ts">
  import Presentation from "$lib/components/Presentation.svelte";
  import type { CalcStatus } from "$lib/modules/calcStatus";
  import type { PageData } from "./$types";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let tax: number = $state(0);
  let calcStatus: CalcStatus = $state("before-calculation");
  const handleResult = (inputTax: number) => (tax = inputTax);
  const handleCalcStatus = (status: CalcStatus) => (calcStatus = status);
</script>

<Presentation
  inputForm={data.form}
  tax={tax}
  calcStatus={calcStatus}
  handleResult={handleResult}
  handleCalcStatus={handleCalcStatus}
/>
