import { render, fireEvent } from "@testing-library/react";
import { expect, test } from "vitest";
import { Toggle } from "@/components/toggle";

test("Toggle calls onChange and reflects checked state", async () => {
  let checked = false;
  const handleChange = (next: boolean) => {
    checked = next;
  };

  const { getByLabelText, rerender } = render(
    <Toggle checked={checked} onChange={handleChange} ariaLabel="toggle-test" />
  );

  const input = getByLabelText("toggle-test") as HTMLInputElement;
  expect(input).toBeInTheDocument();
  expect(input.checked).toBe(false);

  // Click wrapper (label) to toggle
  fireEvent.click(input.parentElement!);
  // handler updated variable; re-render with new prop
  rerender(
    <Toggle checked={checked} onChange={handleChange} ariaLabel="toggle-test" />
  );
  const input2 = getByLabelText("toggle-test") as HTMLInputElement;
  expect(input2.checked).toBe(true);

  // Click again
  fireEvent.click(input2.parentElement!);
  rerender(
    <Toggle checked={checked} onChange={handleChange} ariaLabel="toggle-test" />
  );
  const input3 = getByLabelText("toggle-test") as HTMLInputElement;
  expect(input3.checked).toBe(false);
});
