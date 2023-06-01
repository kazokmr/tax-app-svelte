<script lang="ts">
  import type { InputFormProps, ResultProps } from "$lib/components/InputForm.svelte";
  import InputForm from "$lib/components/InputForm.svelte";
  import Result from "$lib/components/Result.svelte";
  import { Col, Container, Row } from "sveltestrap";

  type PresentationProps = InputFormProps & ResultProps;

  export let { formInputs }: PresentationProps = {};
  export let { tax }: PresentationProps = { tax: null };
</script>

<Container>
  <Row>
    <Col>
      <h2 class="text-center">退職金の所得税計算アプリケーション</h2>
    </Col>
  </Row>
  <Row>
    <Col xs="2" />
    <Col xs="2">
      <InputForm {...formInputs} on:submit />
    </Col>
    <Col xs="2" />
    <Col xs="2">
      <Result tax="{tax}" />
    </Col>
  </Row>
</Container>
