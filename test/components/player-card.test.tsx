import { render, fireEvent } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { PlayerCard } from "@/components/player-card";

test("PlayerCard renders and responds to controls", () => {
  const onTogglePlay = vi.fn();
  const onToggleMute = vi.fn();
  const onOpenPreferences = vi.fn();

  const { getByLabelText, getByText, getByRole, container, rerender } = render(
    <PlayerCard
      isPlaying={true}
      isBuffering={false}
      isMuted={false}
      volume={75}
      onTogglePlay={onTogglePlay}
      onToggleMute={onToggleMute}
      onOpenPreferences={onOpenPreferences}
      onVolumeChange={vi.fn()}
      prefersReducedMotion={true}
    />
  );

  const playButton = getByLabelText("إيقاف البث");
  expect(playButton).toBeInTheDocument();
  fireEvent.click(playButton);
  expect(onTogglePlay).toHaveBeenCalled();

  const muteButton = getByLabelText("كتم الصوت");
  fireEvent.click(muteButton);
  expect(onToggleMute).toHaveBeenCalled();

  const settings = getByLabelText("الإعدادات");
  fireEvent.click(settings);
  expect(onOpenPreferences).toHaveBeenCalled();

  // Volume slider present
  const slider = getByRole("slider");
  expect(slider).toBeInTheDocument();

  // Volume text present
  getByText("75%");

  // When playing and reduced motion is true, there should be no equalizer or 'مباشر' badge
  expect(container.querySelector(".equalizer")).toBeNull();
  expect(() => getByText(/مباشر/)).toThrow();

  // When playing and reduced motion is false, show equalizer
  rerender(
    <PlayerCard
      isPlaying={true}
      isBuffering={false}
      isMuted={false}
      volume={75}
      onTogglePlay={onTogglePlay}
      onToggleMute={onToggleMute}
      onOpenPreferences={onOpenPreferences}
      onVolumeChange={vi.fn()}
      prefersReducedMotion={false}
    />
  );
  expect(container.querySelector(".equalizer")).toBeTruthy();
});
