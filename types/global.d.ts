// Extend Navigator and related types for experimental APIs used in the app
interface NetworkInformation {
  saveData?: boolean;
  addEventListener?: (
    event: string,
    handler: EventListenerOrEventListenerObject
  ) => void;
  removeEventListener?: (
    event: string,
    handler: EventListenerOrEventListenerObject
  ) => void;
}

interface BatteryManager {
  level: number;
  addEventListener?: (
    event: string,
    handler: EventListenerOrEventListenerObject
  ) => void;
  removeEventListener?: (
    event: string,
    handler: EventListenerOrEventListenerObject
  ) => void;
}

declare interface Navigator {
  connection?: NetworkInformation;
  getBattery?: () => Promise<BatteryManager>;
}

declare interface Window {
  // Add any window-level extensions here if needed later
}
