<script lang="ts">
  import type { PageData } from "./$types";
  import Presentation from "$lib/components/Presentation.svelte";
  import { superForm } from "sveltekit-superforms/client";

  export let data: PageData;
  const { message: tax } = superForm(data.form);
</script>

<Presentation data="{data.form}" tax="{$tax}" />
