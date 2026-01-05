import { render } from "@testing-library/react";
import { test, expect } from "vitest";
import Head from "@/app/head";

test("adds upgrade-insecure-requests meta tag", () => {
  render(<Head />);
  // Meta tag may be added to document.head by head component; check document.head
  const meta = document.querySelector(
    'meta[http-equiv="Content-Security-Policy"], meta[content="upgrade-insecure-requests"]'
  );
  expect(meta).not.toBeNull();
  expect(
    meta?.getAttribute("content") === "upgrade-insecure-requests" ||
      (meta?.getAttribute("http-equiv") || "").toLowerCase() ===
        "content-security-policy"
  ).toBeTruthy();
});
