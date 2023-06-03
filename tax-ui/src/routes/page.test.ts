import { setupServer } from "msw/node";
import { rest } from "msw";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@testing-library/svelte";
import Page from "./+page.svelte";

const server = setupServer(
  rest.post("http://localhost:3000/calc-tax", (req, res, context) =>
    res(context.status(200), context.json({ tax: 10000 }))
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("ページコンポーネント", () => {
  test("初期表示の確認", () => {
    // Begin
    render(Page);

    // Then
    expect(screen.getByRole("spinbutton", { name: "勤続年数" })).toHaveValue(10);
    expect(
      screen.getByRole("checkbox", { name: "障害者となったことに直接基因して退職した" })
    ).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "役員等以外" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "役員等" })).not.toBeChecked();
    expect(screen.getByRole("spinbutton", { name: "退職金" })).toHaveValue(5000000);
    expect(screen.getByLabelText("tax").textContent).toBe("--- 円");
  });
  test("所得税を計算できる", async () => {
    // Begin
    const user = userEvent.setup();
    render(Page);

    // When
    await user.click(screen.getByRole("button", { name: "所得税を計算する" }));

    // Then
    await waitFor(() => expect(screen.getByLabelText("tax").textContent).toBe("10,000 円"));
  });
});
