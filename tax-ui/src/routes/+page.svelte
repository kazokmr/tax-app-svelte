<script lang="ts">
  import Presentation from "$lib/components/Presentation.svelte";
  import type InputForm from "$lib/components/InputForm.svelte";
  import type { CalcStatus } from "$lib/modules/calcStatus";
  import type { PageData } from "./$types";
  import type { ComponentEvents } from "svelte";

  export let data: PageData;
  let tax: number;
  let calcStatus: CalcStatus = "before-calculation";
  const handleResult = (event: ComponentEvents<InputForm>["tax"]) => (tax = event.detail.tax);
  const handleCalcStatus = (event: ComponentEvents<InputForm>["calcStatus"]) =>
    (calcStatus = event.detail.calcStatus);
</script>

<Presentation
  inputForm="{data.form}"
  tax="{tax}"
  calcStatus="{calcStatus}"
  on:calculate="{handleResult}"
  on:changeStatus="{handleCalcStatus}"
/>
