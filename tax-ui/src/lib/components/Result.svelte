<script lang="ts">
  export let tax;
  $: taxStr = tax === null ? "---" : new Intl.NumberFormat("ja-JP").format(tax);
</script>

<div class="border-2 rounded-xl w-96 h-[450px]">
  <div class="border-b-2 bg-gray-100 leading-10 text-lg text-center">退職金にかかる所得税</div>
  <div class="my-12 text-center" aria-label="tax">
    <span class="text-5xl">{taxStr}</span>
    <span>円</span>
  </div>
</div>
