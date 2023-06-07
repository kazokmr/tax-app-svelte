<script lang="ts">
  import type { InputSchema } from "$lib/schemas/inputSchema";
  import type { SuperValidated } from "sveltekit-superforms";
  import InputForm from "$lib/components/InputForm.svelte";
  import Result from "$lib/components/Result.svelte";

  export let data: SuperValidated<InputSchema>;
  export let tax: number | undefined;
</script>

<div class="container w-[870px]">
  <h2 class="text-center text-2xl font-semibold">退職金の所得税計算アプリケーション</h2>
  <div class="columns-2">
    <div class="">
      <InputForm data="{data}" on:calculate />
    </div>
    <div>
      <Result tax="{tax}" />
    </div>
  </div>
</div>
