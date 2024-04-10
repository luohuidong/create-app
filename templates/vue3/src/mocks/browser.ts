import { setupWorker, type SetupWorker } from "msw";
import { handlers } from "./handlers.js";

// This configures a Service Worker with the given request handlers.
export const worker: SetupWorker = setupWorker(...handlers);
