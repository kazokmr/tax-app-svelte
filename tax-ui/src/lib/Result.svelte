<script lang="ts">
  import { Card, CardBody, CardHeader, CardTitle } from "sveltestrap";

  export let tax: number | null = null;
  $: taxStr = tax === null ? "---" : new Intl.NumberFormat("ja-JP").format(tax);
</script>

<Card style="height: 200px; width: 400px">
  <CardHeader>
    <div class="text-center">
      <CardTitle>退職金にかかる所得税</CardTitle>
    </div>
  </CardHeader>
  <CardBody>
    <div class="text-center">
      <span class="fs-1">{taxStr}</span>
      <span>円</span>
    </div>
  </CardBody>
</Card>