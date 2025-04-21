<script lang="ts">
  import type { Infer, SuperValidated } from "sveltekit-superforms";
  import InputForm from "$lib/components/InputForm.svelte";
  import Result from "$lib/components/Result.svelte";
  import type { CalcStatus } from "$lib/modules/calcStatus";
  import type { InputSchema } from "$lib/schemas/inputSchema";

  interface Props {
    inputForm: SuperValidated<Infer<InputSchema>>;
    tax: number;
    calcStatus: CalcStatus;
    handleResult: (inputTax: number) => void;
    handleCalcStatus: (status: CalcStatus) => void;
  }

  let { inputForm, tax, calcStatus, handleResult, handleCalcStatus }: Props = $props();
</script>

<div class="container w-[870px]">
  <h2 class="text-center text-2xl font-semibold">退職金の所得税計算アプリケーション</h2>
  <div class="columns-2">
    <div class="">
      <InputForm
        inputForm={inputForm}
        calcStatus={calcStatus}
        handleResult={handleResult}
        handleCalcStatus={handleCalcStatus}
      />
    </div>
    <div>
      <Result tax={tax} calcStatus={calcStatus} />
    </div>
  </div>
</div>
