import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/svelte";
import Page from "./+page.svelte";
import { superValidate } from "sveltekit-superforms/server";
import { inputSchema } from "$lib/schemas/inputSchema";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect } from "vitest";
import { rest } from "msw";
import * as devalue from "devalue";

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
      screen.getByRole("checkbox", { name: "障害者となったことに直接基因して退職した" })
    ).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "役員等以外" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "役員等" })).not.toBeChecked();
    expect(screen.getByRole("spinbutton", { name: "退職金" })).toHaveValue(5_000_000);
    expect(screen.getByLabelText("tax").textContent).toBe("--- 円");
  });
  test("所得税を計算できる", async () => {
    // Begin
    server.use(
      rest.post("http://localhost:3000/*", (req, res, context) =>
        res(
          context.json({
            type: "success",
            status: 200,
            data: devalue.stringify({ form, tax: 10000 })
          })
        )
      )
    );
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // When
    const user = userEvent.setup();
    await user.click(screen.getByRole("spinbutton", { name: "勤続年数" }));
    await user.clear(screen.getByRole("spinbutton", { name: "勤続年数" }));
    await user.keyboard("10");
    await user.click(screen.getByRole("spinbutton", { name: "退職金" }));
    await user.clear(screen.getByRole("spinbutton", { name: "退職金" }));
    await user.keyboard("5000000");
    await user.click(screen.getByRole("button", { name: "所得税を計算する" }));

    // Then
    await waitFor(() => {
      expect(screen.getByLabelText("tax")).toHaveTextContent("10,000 円");
    });
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
    expect(await screen.getByRole("checkbox", { name: /障害者/i })).not.toBeChecked();
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
    ${""}               | ${"１以上の整数を入力してください"}
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
});

describe("退職金のバリデーション", () => {
  test.each`
    severancePayValue  | errorMessage
    ${"-1"}            | ${"１円以上を入力してください"}
    ${"1000000000001"} | ${"1,000,000,000,000円までです"}
    ${"8000000.1"}     | ${"１円以上を入力してください"}
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
      expect(screen.queryByText("１以上の整数を入力してください")).not.toBeInTheDocument();
    });
  });
});
