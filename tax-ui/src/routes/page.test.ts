import { render, screen, waitFor } from "@testing-library/svelte";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { superValidate } from "sveltekit-superforms/server";
import { inputSchema } from "$lib/schemas/inputSchema";
import Page from "./+page.svelte";

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ページコンポーネント", async () => {
  test("初期表示の確認", async () => {
    // Begin
    const form = await superValidate(inputSchema);
    form.data.yearsOfService = 10;
    form.data.severancePay = 5_000_000;
    render(Page, { data: { form } });

    // Then
    expect(screen.getByRole("spinbutton", { name: "勤続年数" })).toHaveValue(10);
    expect(
      screen.getByRole("checkbox", { name: "障害者となったことに直接基因して退職した" }),
    ).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "役員等以外" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "役員等" })).not.toBeChecked();
    expect(screen.getByRole("spinbutton", { name: "退職金" })).toHaveValue(5_000_000);
    expect(screen.getByLabelText("tax").textContent).toBe("--- 円");
  });
  test("勤続年数を入力できる", async () => {
    // Begin
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // When
    const user = userEvent.setup();
    await user.click(screen.getByRole("spinbutton", { name: "勤続年数" }));
    await user.clear(screen.getByRole("spinbutton", { name: "勤続年数" }));
    await user.keyboard("20");

    // Then
    expect(await screen.findByRole("spinbutton", { name: "勤続年数" })).toHaveValue(20);
  });
  test("退職基因チェックボックスを選択できる", async () => {
    // Begin
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // When
    const user = userEvent.setup();
    await user.click(screen.getByRole("checkbox", { name: /障害者/i }));

    // Then
    expect(await screen.getByRole("checkbox", { name: /障害者/i })).toBeChecked();
  });
  test("退職基因チェックボックスを未選択にできる", async () => {
    // Begin
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // When
    const user = userEvent.setup();
    await user.click(screen.getByRole("checkbox", { name: /障害者/i }));
    await user.click(screen.getByRole("checkbox", { name: /障害者/i }));

    // Then
    await screen.findByRole("checkbox", { name: /障害者/i });
    expect(screen.getByRole("checkbox", { name: /障害者/i })).not.toBeChecked();
  });
  test("役員等を選択できる", async () => {
    // Begin
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // When
    const user = userEvent.setup();
    await user.click(screen.getByRole("radio", { name: "役員等以外" }));
    await user.click(screen.getByRole("radio", { name: "役員等" }));

    // Then
    expect(await screen.getByRole("radio", { name: "役員等" })).toBeChecked();
    expect(await screen.getByRole("radio", { name: "役員等以外" })).not.toBeChecked();
  });
  test("役員等以外を選択できる", async () => {
    // Begin
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // When
    const user = userEvent.setup();
    await user.click(screen.getByRole("radio", { name: "役員等" }));
    await user.click(screen.getByRole("radio", { name: "役員等以外" }));

    // Then
    expect(await screen.getByRole("radio", { name: "役員等" })).not.toBeChecked();
    expect(await screen.getByRole("radio", { name: "役員等以外" })).toBeChecked();
  });
  test("退職金を入力できる", async () => {
    // Begin
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // When
    const user = userEvent.setup();
    await user.click(screen.getByRole("spinbutton", { name: "退職金" }));
    await user.clear(screen.getByRole("spinbutton", { name: "退職金" }));
    await user.keyboard("1234567");

    // Then
    expect(await screen.findByRole("spinbutton", { name: "退職金" })).toHaveValue(1234567);
  });
});

describe("勤続年数のバリデーション", () => {
  test.each`
    yearsOfServiceValue | errorMessage
    ${"-1"}             | ${"１以上の整数を入力してください"}
    ${"0"}              | ${"１以上の整数を入力してください"}
    ${"101"}            | ${"１００以下の整数を入力してください"}
    ${"10.5"}           | ${"整数を入力してください"}
  `("勤続年数$yearsOfServiceValue", async ({ yearsOfServiceValue, errorMessage }) => {
    // Begin
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // 事前確認
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    // When
    const user = userEvent.setup();
    await user.click(screen.getByRole("spinbutton", { name: "勤続年数" }));
    await user.clear(screen.getByRole("spinbutton", { name: "勤続年数" }));
    await user.keyboard(yearsOfServiceValue);
    // focusを移動する(onBlur)
    await user.tab();

    // Then
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByLabelText("tax")).toHaveTextContent("--- 円");
  });
  test("未入力の場合", async () => {
    // Begin
    const form = await superValidate(inputSchema);
    form.data.yearsOfService = 10;
    render(Page, { data: { form } });

    // 事前確認
    expect(screen.queryByText("勤続年数は１以上の整数を入力してください")).not.toBeInTheDocument();

    // When
    const user = userEvent.setup();
    await user.click(screen.getByRole("spinbutton", { name: "勤続年数" }));
    await user.clear(screen.getByRole("spinbutton", { name: "勤続年数" }));

    // FIXME 初期値を空文字のまま Submit時のValidationを実行させたかったがコンポーネントテストだとStoreが効かないため値を空にしてfocusoutで検証させる
    // await user.click(screen.getByRole("button", { name: /所得税を/ }));
    await user.tab();

    // Then
    await expect(screen.getByText("勤続年数は１以上の整数を入力してください")).toBeInTheDocument();
  });
});

describe("退職金のバリデーション", () => {
  test.each`
    severancePayValue  | errorMessage
    ${"-1"}            | ${"０円以上を入力してください"}
    ${"1000000000001"} | ${"1,000,000,000,000円までです"}
    ${"8000000.1"}     | ${"１円単位で入力してください"}
  `("退職金$severancePayValue", async ({ severancePayValue, errorMessage }) => {
    // Begin
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    // When
    const user = userEvent.setup();
    await user.click(screen.getByRole("spinbutton", { name: "退職金" }));
    await user.clear(screen.getByRole("spinbutton", { name: "退職金" }));
    await user.keyboard(severancePayValue);

    await user.tab();

    // Then
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByLabelText("tax")).toHaveTextContent("--- 円");
  });
  test("未入力の場合", async () => {
    // Begin
    const form = await superValidate(inputSchema);
    form.data.severancePay = 500000;
    render(Page, { data: { form } });

    // 事前確認
    expect(screen.queryByText("退職金を入力してください")).not.toBeInTheDocument();

    // When
    const user = userEvent.setup();
    await user.click(screen.getByRole("spinbutton", { name: "退職金" }));
    await user.clear(screen.getByRole("spinbutton", { name: "退職金" }));

    // FIXME 初期値を空文字のまま Submit時のValidationを実行させたかったがコンポーネントテストだとStoreが効かないため値を空にしてfocusoutで検証させる
    // await user.click(screen.getByRole("button", { name: /所得税を/ }));
    await user.tab();

    // Then
    await expect(screen.getByText("退職金を入力してください")).toBeInTheDocument();
  });
});

describe("勤続年数が入力できる", () => {
  test.each`
    yearsOfServiceValue
    ${"1"}
    ${"20"}
    ${"100"}
  `("勤続年数$yearsOfServiceValue", async ({ yearsOfServiceValue }) => {
    // Begin
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // 事前確認
    const user = userEvent.setup();
    await user.click(screen.getByRole("spinbutton", { name: "勤続年数" }));
    await user.clear(screen.getByRole("spinbutton", { name: "勤続年数" }));
    await user.keyboard("-1");

    // エラーメッセージが出ることを確認する
    await user.tab();
    expect(await screen.findByText("１以上の整数を入力してください")).toBeInTheDocument();

    // When
    await user.click(screen.getByRole("spinbutton", { name: "勤続年数" }));
    await user.clear(screen.getByRole("spinbutton", { name: "勤続年数" }));
    await user.keyboard(yearsOfServiceValue);

    await user.tab();

    // Then
    // メッセージが非表示となること
    await waitFor(() => {
      expect(screen.queryByText("勤続年数を入力してください")).not.toBeInTheDocument();
      expect(
        screen.queryByText("勤続年数は１以上の整数を入力してください"),
      ).not.toBeInTheDocument();
      expect(screen.queryByText("整数を入力してください")).not.toBeInTheDocument();
      expect(screen.queryByText("１以上の整数を入力してください")).not.toBeInTheDocument();
      expect(screen.queryByText("１００以下の整数を入力してください")).not.toBeInTheDocument();
    });
  });
});
describe("退職金が入力できる", () => {
  test.each`
    severancePayValue
    ${"0"}
    ${"1"}
    ${"10000000"}
    ${"1000000000000"}
  `("退職金$severancePayValue", async ({ severancePayValue }) => {
    // Begin
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // 事前確認
    const user = userEvent.setup();
    await user.click(screen.getByRole("spinbutton", { name: "退職金" }));
    await user.clear(screen.getByRole("spinbutton", { name: "退職金" }));
    await user.keyboard("-1");

    // エラーメッセージが出ることを確認する
    await user.tab();
    expect(await screen.findByText("０円以上を入力してください")).toBeInTheDocument();

    // When
    await user.click(screen.getByRole("spinbutton", { name: "退職金" }));
    await user.clear(screen.getByRole("spinbutton", { name: "退職金" }));
    await user.keyboard(severancePayValue);

    await user.tab();

    // Then
    // メッセージが非表示となること
    await waitFor(() => {
      expect(screen.queryByText("退職金を入力してください")).not.toBeInTheDocument();
      expect(screen.queryByText("１円以上を入力してください")).not.toBeInTheDocument();
      expect(screen.queryByText("０円以上を入力してください")).not.toBeInTheDocument();
      expect(screen.queryByText("1,000,000,000,000円までです")).not.toBeInTheDocument();
    });
  });
});
