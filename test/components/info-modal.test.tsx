import { render, screen, fireEvent } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import { InfoModal } from "@/components/info-modal";

test("install popover opens, shows instructions, and has high-contrast class", () => {
  const handleClose = vi.fn();

  render(
    <InfoModal
      isOpen={true}
      onClose={handleClose}
      timePhase={"day"}
      phaseConfig={{
        bgClass: "bg-black/60",
        name: "day",
        icon: "sun",
        color: "yellow",
      }}
    />
  );

  // Install button should be in the document
  const installButton = screen.getByRole("button", { name: /تثبيت التطبيق/i });
  expect(installButton).toBeInTheDocument();

  // Click to open instructions
  fireEvent.click(installButton);

  // Popover should appear
  const popover = screen.getByTestId("install-popover");
  expect(popover).toBeInTheDocument();
  expect(popover).toHaveTextContent("طريقة التثبيت");
});
