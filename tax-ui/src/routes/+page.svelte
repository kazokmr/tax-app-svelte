<script lang="ts">
  import type { PageData } from "./$types";
  import Presentation from "$lib/components/Presentation.svelte";
  import type { CalcStatus } from "$lib/modules/calcStatus";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();
  let tax = $state(0);
  let calcStatus: CalcStatus = $state("before-calculation");
</script>

<Presentation inputForm={data.form} bind:tax={tax} bind:calcStatus={calcStatus} />
