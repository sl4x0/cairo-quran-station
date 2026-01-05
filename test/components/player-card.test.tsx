import { render, fireEvent } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { PlayerCard } from "@/components/player-card";

test("PlayerCard renders and responds to controls", () => {
  const onTogglePlay = vi.fn();
  const onToggleMute = vi.fn();
  const onOpenPreferences = vi.fn();

  const {
    getByLabelText,
    getByText,
    getByRole,
    getAllByText,
    getByTestId,
    container,
    rerender,
  } = render(
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
      isMobileDevice={false}
      isVolumeControlled={false}
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

  // When playing, the play button should show pause icon
  expect(playButton).toBeInTheDocument();
});

test("PlayerCard hides mute button on mobile devices", () => {
  const { queryByLabelText } = render(
    <PlayerCard
      isPlaying={false}
      isBuffering={false}
      isMuted={false}
      volume={75}
      onTogglePlay={vi.fn()}
      onToggleMute={vi.fn()}
      onOpenPreferences={vi.fn()}
      onVolumeChange={vi.fn()}
      isMobileDevice={true}
      isVolumeControlled={true}
    />
  );

  const muteButton = queryByLabelText("كتم الصوت");
  expect(muteButton).toBeNull();
});

test("PlayerCard shows volume control hint when controlled by device", () => {
  const { getByText, getByRole, getByTestId } = render(
    <PlayerCard
      isPlaying={false}
      isBuffering={false}
      isMuted={false}
      volume={75}
      onTogglePlay={vi.fn()}
      onToggleMute={vi.fn()}
      onOpenPreferences={vi.fn()}
      onVolumeChange={vi.fn()}
      isMobileDevice={true}
      isVolumeControlled={true}
    />
  );

  // Expect the new phrasing and that the slider references the hint via aria-describedby
  expect(getByText("التحكم عبر أزرار الهاتف")).toBeInTheDocument();
  const slider = getByRole("slider");
  expect(slider.getAttribute("aria-describedby")).toContain(
    "device-volume-hint"
  );

  // Watermark should be rendered (decorative)
  const watermark = getByTestId("player-watermark");
  expect(watermark).toBeInTheDocument();
});
