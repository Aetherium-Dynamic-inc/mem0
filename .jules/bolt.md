# Bolt's Journal

Critical learnings and performance insights for Mem0 repository.

## 2025-05-18 - LRU Caching Field Sensitivity Checks
**Learning:** `_is_sensitive_field` is called repeatedly across config deepcopies and telemetry sanitization for the same recurring set of field names. Caching it with `@lru_cache(maxsize=256)` speeds up 300k checks from ~0.76s to ~0.14s (~80% speedup).
**Action:** Use `lru_cache` on pure, deterministic string inspection functions in high-frequency config/telemetry paths.
