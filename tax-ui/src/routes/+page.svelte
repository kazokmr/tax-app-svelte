<script lang="ts">
  import type { PageData } from "./$types";
  import type { CalcTaxParam, CalcTaxResult } from "$lib/fetch/client/calcTax";
  import { calcTax } from "$lib/fetch/client/calcTax";
  import Presentation from "$lib/components/Presentation.svelte";

  export let data: PageData;

  let tax: number | null = null;

  const handleInputFormSubmit = async (event) => {
    const formData = new FormData(event.target);
    const param = {
      yearsOfService: Number(formData.get("yearsOfService")),
      isDisability: !!formData.get("isDisability"),
      isOfficer: !!Number(formData.get("isOfficer")),
      severancePay: Number(formData.get("severancePay"))
    } satisfies CalcTaxParam;
    const response = await calcTax(param);
    if (response.ok) {
      const json = (await response.json()) satisfies CalcTaxResult;
      tax = json.tax;
    }
  };
</script>

<Presentation data="{data.form}" tax="{tax}" on:submit="{handleInputFormSubmit}" />
