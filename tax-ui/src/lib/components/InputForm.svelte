<script lang="ts">
  import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Form,
    FormCheck,
    FormGroup,
    FormText,
    Input,
    InputGroup,
    InputGroupText,
    Label
  } from "sveltestrap";

  let year = 10;
  let group = "0";
  let severancePay = 5_000_000;
</script>

<Card style="width: 375px;">
  <CardHeader>
    <div class="text-center">
      <CardTitle>退職金情報を入力してください</CardTitle>
    </div>
  </CardHeader>
  <CardBody style="height: 420px;">
    <Form>
      <FormGroup>
        <Label style="font-weight: bold">勤続年数</Label>
        <InputGroup style="width: 120px;">
          <Input type="number" bind:value={year} />
          <InputGroupText>年</InputGroupText>
        </InputGroup>
        <FormText>1年未満の端数は切り上げ</FormText>
      </FormGroup>
      <FormGroup>
        <Label style="font-weight: bold">退職基因</Label>
        <FormCheck type="checkbox" label="障害者となったことに直接基因して退職した" />
      </FormGroup>
      <FormGroup>
        <Label style="font-weight: bold">役員等以外か役員等か</Label>
        <br />
        <FormCheck type="radio" inline={true} bind:group value="0" label="役員等以外" />
        <FormCheck type="radio" inline={true} bind:group value="1" label="役員等" />
      </FormGroup>
      <FormGroup>
        <Label style="font-weight: bold">退職金</Label>
        <InputGroup style="width: 200px">
          <Input type="number" bind:value={severancePay} />
          <InputGroupText>円</InputGroupText>
        </InputGroup>
      </FormGroup>
      <div class="d-md-flex justify-content-md-end">
        <Button color="primary" type="submit">所得税を計算する</Button>
      </div>
    </Form>
  </CardBody>
</Card>