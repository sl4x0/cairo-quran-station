import { render, screen, act } from "@testing-library/react";
import { expect, test } from "vitest";
import React, { useRef } from "react";
import { useDeviceVolume } from "@/hooks/use-device-volume";

function HookTest({
  audio,
  initialVolume,
}: {
  audio: HTMLAudioElement;
  initialVolume: number;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(audio);
  const { volume, isMobileDevice, isVolumeControlled } = useDeviceVolume(
    audioRef.current,
    initialVolume
  );
  return (
    <div>
      <span data-testid="volume">{volume}</span>
      <span data-testid="mobile">{String(isMobileDevice)}</span>
      <span data-testid="controlled">{String(isVolumeControlled)}</span>
    </div>
  );
}

test("useDeviceVolume updates volume on audio volumechange", async () => {
  // Mock a mobile userAgent so the hook attaches volume listeners
  Object.defineProperty(navigator, "userAgent", {
    value: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
    configurable: true,
  });

  const audio = document.createElement("audio");
  audio.volume = 0.5; // initial 50%

  render(<HookTest audio={audio} initialVolume={50} />);

  // initially volume should be 50
  expect(screen.getByTestId("volume").textContent).toBe("50");

  // change audio.volume and dispatch volumechange
  act(() => {
    audio.volume = 0.2;
    audio.dispatchEvent(new Event("volumechange"));
  });

  // volume should update to 20
  expect(screen.getByTestId("volume").textContent).toBe("20");

  // change audio.volume again and simulate visibility change
  act(() => {
    audio.volume = 0.8;
    document.dispatchEvent(new Event("visibilitychange"));
  });

  expect(screen.getByTestId("volume").textContent).toBe("80");
});
