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
    const formData = new FormData(event.target);
    for (let data of formData.entries()) {
      console.log(data);
    }
  };

  let tax: number | null = null;
</script>

<Presentation formInputs="{formInputs}" bind:tax="{tax}" on:submit={handleInputFormSubmit} />
