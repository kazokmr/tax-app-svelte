import { setupServer } from "msw/node";
import { rest } from "msw";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/svelte";
import Page from "./+page.svelte";
import { superValidate } from "sveltekit-superforms/server";
import { inputSchema } from "$lib/schemas/inputSchema";

const server = setupServer(
  rest.post("http://localhost:3000/calc-tax", (req, res, context) =>
    res(context.status(200), context.json({ tax: 10000 }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ページコンポーネント", () => {
  test("初期表示の確認", async () => {
    // Begin
    // SuperValidateオブジェクトを
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
  test.skip("所得税を計算できる", async () => {
    // Begin
    const user = userEvent.setup();
    const form = await superValidate(inputSchema);
    form.data.yearsOfService = 10;
    form.data.severancePay = 5_000_000;
    render(Page, { data: { form } });

    // When
    await user.click(screen.getByRole("button", { name: "所得税を計算する" }));

    // Then
    // FIXME $app/form モジュールを Mock化できないとアクションが実行できない。 E2Eテストで代用する予定
    await waitFor(() => expect(screen.getByLabelText("tax").textContent).toBe("10,000 円"));
  });
  test("勤続年数を入力できる", async () => {
    // Begin
    const user = userEvent.setup();
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // When
    await user.click(screen.getByRole("spinbutton", { name: "勤続年数" }));
    await user.clear(screen.getByRole("spinbutton", { name: "勤続年数" }));
    await user.keyboard("20");

    // Then
    await waitFor(() =>
      expect(screen.getByRole("spinbutton", { name: "勤続年数" })).toHaveValue(20)
    );
  });
  test("退職基因チェックボックスを選択できる", async () => {
    // Begin
    const user = userEvent.setup();
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // When
    await user.click(screen.getByRole("checkbox", { name: /障害者/i }));

    // Then
    await waitFor(() => expect(screen.getByRole("checkbox", { name: /障害者/i })).toBeChecked());
  });
  test("退職基因チェックボックスを未選択にできる", async () => {
    // Begin
    const user = userEvent.setup();
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // When
    await user.click(screen.getByRole("checkbox", { name: /障害者/i }));
    await user.click(screen.getByRole("checkbox", { name: /障害者/i }));

    // Then
    await waitFor(() =>
      expect(screen.getByRole("checkbox", { name: /障害者/i })).not.toBeChecked()
    );
  });
  test("役員等を選択できる", async () => {
    // Begin
    const user = userEvent.setup();
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // When
    await user.click(screen.getByRole("radio", { name: "役員等以外" }));
    await user.click(screen.getByRole("radio", { name: "役員等" }));

    // Then
    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "役員等" })).toBeChecked();
    });
    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "役員等以外" })).not.toBeChecked();
    });
  });
  test("役員等以外を選択できる", async () => {
    // Begin
    const user = userEvent.setup();
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // When
    await user.click(screen.getByRole("radio", { name: "役員等" }));
    await user.click(screen.getByRole("radio", { name: "役員等以外" }));

    // Then
    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "役員等" })).not.toBeChecked();
    });
    await waitFor(() => {
      expect(screen.getByRole("radio", { name: "役員等以外" })).toBeChecked();
    });
  });
  test("退職金を入力できる", async () => {
    // Begin
    const user = userEvent.setup();
    const form = await superValidate(inputSchema);
    render(Page, { data: { form } });

    // When
    await user.click(screen.getByRole("spinbutton", { name: "退職金" }));
    await user.clear(screen.getByRole("spinbutton", { name: "退職金" }));
    await user.keyboard("1234567");

    // Then
    await waitFor(() =>
      expect(screen.getByRole("spinbutton", { name: "退職金" })).toHaveValue(1234567)
    );
  });
});
