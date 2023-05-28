<script lang="ts">
import { Card, CardBody, CardHeader, CardTitle } from "sveltestrap";

type ResultProps = {
  tax: number | null;
};

export let { tax }: ResultProps = { tax: null };
$: taxStr = tax === null ? "---" : new Intl.NumberFormat("ja-JP").format(tax);
</script>

<Card style="width: 375px;">
  <CardHeader>
    <div class="text-center">
      <CardTitle>退職金にかかる所得税</CardTitle>
    </div>
  </CardHeader>
  <CardBody style="height: 420px;">
    <div class="text-center">
      <span class="fs-1">{taxStr}</span>
      <span>円</span>
    </div>
  </CardBody>
</Card>
