<script lang="ts">
  import { Col, Container, Row } from "sveltestrap";
  import InputForm from "$lib/components/InputForm.svelte";
  import Result from "$lib/components/Result.svelte";

  type PresentationProps = {
    tax: number | null;
  };

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
      <InputForm />
    </Col>
    <Col xs="2" />
    <Col xs="2">
      <Result {tax} />
    </Col>
  </Row>
</Container>
