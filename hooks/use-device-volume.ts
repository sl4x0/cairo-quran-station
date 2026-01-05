/**
 * Custom hook for iOS/mobile device volume synchronization
 * Handles device volume detection and real-time synchronization
 */

import { useState, useEffect, useCallback, useRef } from "react";

interface DeviceVolumeState {
  volume: number;
  isMobileDevice: boolean;
  isVolumeControlled: boolean;
}

export function useDeviceVolume(
  audioElement: HTMLAudioElement | null,
  initialVolume: number
): DeviceVolumeState {
  const [volume, setVolume] = useState(initialVolume);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isVolumeControlled, setIsVolumeControlled] = useState(false);
  const volumeCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastKnownVolumeRef = useRef<number>(initialVolume);
  const isCheckingRef = useRef(false);

  const detectMobileDevice = useCallback(() => {
    if (typeof window === "undefined") return false;

    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile =
      /iphone|ipad|ipod|android|webos|blackberry|windows phone/i.test(
        userAgent
      );
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;

    return isMobile || isIOS || (isTouchDevice && window.innerWidth < 1024);
  }, []);

  const checkVolumeControl = useCallback(async (audio: HTMLAudioElement) => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    try {
      const originalVolume = audio.volume;
      const testVolume = originalVolume > 0.5 ? 0.4 : 0.6;

      audio.volume = testVolume;

      await new Promise((resolve) => setTimeout(resolve, 50));

      const actualVolume = audio.volume;
      const volumeChanged = Math.abs(actualVolume - testVolume) < 0.01;

      audio.volume = originalVolume;

      setIsVolumeControlled(!volumeChanged);
      isCheckingRef.current = false;

      return !volumeChanged;
    } catch (error) {
      console.error("Volume control check failed:", error);
      isCheckingRef.current = false;
      return true;
    }
  }, []);

  const syncVolumeFromDevice = useCallback((audio: HTMLAudioElement) => {
    const currentVolume = audio.volume;
    const volumePercent = Math.round(currentVolume * 100);

    if (Math.abs(volumePercent - lastKnownVolumeRef.current) > 1) {
      lastKnownVolumeRef.current = volumePercent;
      setVolume(volumePercent);
    }
  }, []);

  useEffect(() => {
    const isMobile = detectMobileDevice();
    setIsMobileDevice(isMobile);

    if (!audioElement || !isMobile) {
      return;
    }

    const initializeVolumeSync = async () => {
      await checkVolumeControl(audioElement);

      volumeCheckIntervalRef.current = setInterval(() => {
        if (audioElement && !audioElement.paused) {
          syncVolumeFromDevice(audioElement);
        }
      }, 200);
    };

    initializeVolumeSync();

    const handleVolumeChange = () => {
      syncVolumeFromDevice(audioElement);
    };

    const handlePlay = () => {
      syncVolumeFromDevice(audioElement);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && audioElement) {
        syncVolumeFromDevice(audioElement);
      }
    };

    audioElement.addEventListener("volumechange", handleVolumeChange);
    audioElement.addEventListener("play", handlePlay);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (volumeCheckIntervalRef.current) {
        clearInterval(volumeCheckIntervalRef.current);
      }
      audioElement.removeEventListener("volumechange", handleVolumeChange);
      audioElement.removeEventListener("play", handlePlay);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    audioElement,
    detectMobileDevice,
    checkVolumeControl,
    syncVolumeFromDevice,
  ]);

  useEffect(() => {
    if (audioElement && !isMobileDevice && !isVolumeControlled) {
      audioElement.volume = volume / 100;
    }
  }, [volume, audioElement, isMobileDevice, isVolumeControlled]);

  return {
    volume,
    isMobileDevice,
    isVolumeControlled,
  };
}
