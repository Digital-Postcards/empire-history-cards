import os from "os";
import path from "path";

// Runs before any test file's imports are loaded (see jest.config.js
// "setupFiles"). Sets fixed env values so tests don't depend on the real
// server/.env file (which is gitignored, so it doesn't exist in CI) --
// dotenv.config() (called inside config.ts and fileUpload.ts, which app
// imports) does not overwrite a process.env value that's already set, so
// these values win as long as this runs first.

// Used by tests that sign/verify JWTs (e.g. authentication route tests).
process.env.SECRET_KEY = "test-secret";

// utils/fileUpload.ts throws at import time if this is unset, which breaks
// every integration test that imports the app. Points at a temp dir so tests
// never write into the real images directory.
process.env.IMAGES_DIR = path.join(os.tmpdir(), "empire-history-cards-test-images");
