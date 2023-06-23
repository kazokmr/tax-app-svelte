<script lang="ts">
  import type { SuperValidated } from "sveltekit-superforms";
  import InputForm from "$lib/components/InputForm.svelte";
  import Result from "$lib/components/Result.svelte";
  import type { CalcStatus } from "$lib/modules/calcStatus";
  import type { InputSchema } from "$lib/schemas/inputSchema";

  export let data: SuperValidated<InputSchema>;
  export let tax: number;
  export let calcStatus: CalcStatus;
</script>

<div class="container w-[870px]">
  <h2 class="text-center text-2xl font-semibold">退職金の所得税計算アプリケーション</h2>
  <div class="columns-2">
    <div class="">
      <InputForm data="{data}" calcStatus="{calcStatus}" on:calculate on:changeStatus />
    </div>
    <div>
      <Result tax="{tax}" calcStatus="{calcStatus}" />
    </div>
  </div>
</div>
