<script lang="ts">
  import type { InputForm } from "$lib/components/InputForm.svelte";
  import Presentation from "$lib/components/Presentation.svelte";
  import type { CalcTaxParam, CalcTaxResult } from "$lib/fetch/client/calcTax";
  import { calcTax } from "$lib/fetch/client/calcTax";

  const formInputs = {
    yearsOfService: 10,
    isDisability: false,
    isOfficer: "0",
    severancePay: 5_000_000
  } satisfies InputForm;

  const handleInputFormSubmit = async (event) => {
    const formData = new FormData(event.target);
    const param = {
      yearsOfService: Number(formData.get("yearsOfService")),
      isDisability: !!formData.get("isDisability"),
      isOfficer: !!Number(formData.get("isOfficer")),
      severancePay: Number(formData.get("severancePay"))
    }satisfies CalcTaxParam;
    const response = await calcTax(param);
    if (response.ok) {
      const json = await response.json() satisfies CalcTaxResult;
      console.log(json);
    }
  };

  let tax: number | null = null;
</script>

<Presentation formInputs="{formInputs}" bind:tax="{tax}" on:submit={handleInputFormSubmit} />
