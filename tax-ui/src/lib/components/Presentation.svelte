<script lang="ts">
  import type { InputFormProps, ResultProps } from "$lib/components/InputForm.svelte";
  import InputForm from "$lib/components/InputForm.svelte";
  import Result from "$lib/components/Result.svelte";

  type PresentationProps = InputFormProps & ResultProps;

  export let { formInputs }: PresentationProps = {};
  export let { tax }: PresentationProps = { tax: null };
</script>
<div class="container w-[870px]">
  <p class="text-center">退職金の所得税計算アプリケーション</p>
  <div class="columns-2">
    <div class="">
      <InputForm {...formInputs} on:submit />
    </div>
    <div>
      <Result tax="{tax}" />
    </div>
  </div>
</div>
