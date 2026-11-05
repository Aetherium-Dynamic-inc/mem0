## 2025-05-10 - Dynamic Package Metadata Lookup in Client Headers
**Learning:** `importlib.metadata.version()` traverses entry points and the filesystem distribution directories synchronously on every invocation, taking ~1ms per call. When generating HTTP surface client headers dynamically (or on client instantiation), calling `importlib.metadata.version()` repeatedly creates unnecessary I/O and CPU overhead.
**Action:** Always memoize package version resolution with `@functools.lru_cache(maxsize=1)` when computing client header strings dynamically.
