<script lang="ts">
  import type { PageData } from "./$types";
  import Presentation from "$lib/components/Presentation.svelte";

  export let data: PageData;
  let tax;
  const handleResult = (event) => (tax = event.detail.tax);
</script>

<Presentation data="{data.form}" tax="{tax}" on:calculate="{handleResult}" />
