# Test fixtures

Integration scans use **temporary directories** created in `tests/integration.test.ts` (each with its own `.git` and `.guardrailrc.json`) so `loadConfig` / `scanProject` behavior is not affected by the parent repository’s `.guardrailrc.json`.
