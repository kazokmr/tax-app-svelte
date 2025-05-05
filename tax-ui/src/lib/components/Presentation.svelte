<script lang="ts">
  import type { SuperValidated } from "sveltekit-superforms";
  import type { InputSchema } from "$lib/schemas/inputSchema";
  import type { CalcStatus } from "$lib/modules/calcStatus";
  import InputForm from "$lib/components/InputForm.svelte";
  import Result from "$lib/components/Result.svelte";

  type Props = {
    inputForm: SuperValidated<InputSchema>;
    calcStatus: CalcStatus;
    tax: number;
  };

  let {
    inputForm,
    tax = $bindable(0),
    calcStatus = $bindable("before-calculation"),
  }: Props = $props();
</script>

<div class="container w-[870px]">
  <h2 class="text-center text-2xl font-semibold">退職金の所得税計算アプリケーション</h2>
  <div class="columns-2">
    <div class="">
      <InputForm inputForm={inputForm} bind:tax={tax} bind:calcStatus={calcStatus} />
    </div>
    <div>
      <Result tax={tax} calcStatus={calcStatus} />
    </div>
  </div>
</div>
