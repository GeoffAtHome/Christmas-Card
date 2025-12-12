/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope & typeof globalThis;
declare function importScripts(...urls: string[]): void;
declare const __WB_MANIFEST: Array<unknown>;
// Workbox/Vite PWA build-time globals
/// <reference lib="webworker" />
// Custom Service Worker: Combines PWA (Workbox) and Firebase Messaging

import { precacheAndRoute } from "workbox-precaching";

// PWA/Workbox logic (Vite will inject the precache manifest here)
precacheAndRoute(self.__WB_MANIFEST);

