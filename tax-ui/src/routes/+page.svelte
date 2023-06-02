<script lang="ts">
  import type { InputForm } from "$lib/components/InputForm.svelte";
  import Presentation from "$lib/components/Presentation.svelte";

  const formInputs = {
    yearsOfService: 10,
    isDisability: false,
    isOfficer: "0",
    severancePay: 5_000_000
  } satisfies InputForm;

  const handleInputFormSubmit = (event) => {
    event.preventDefault();
    console.log(formInputs);
  };

  let tax: number | null = null;
</script>

<Presentation {...formInputs} bind:tax="{tax}" on:submit|preventDefault={handleInputFormSubmit} />
