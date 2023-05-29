<script lang="ts">
  import Presentation from "$lib/components/Presentation.svelte";

  let tax: number | null = null;
</script>

<Presentation bind:tax="{tax}" />
