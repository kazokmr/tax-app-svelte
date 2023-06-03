import { setupServer } from "msw/node";
import { rest } from "msw";
import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
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