## 2025-05-18 - Pre-allocating Mappings and Pre-compiling Regex in Hot String Functions
**Learning:** Re-creating string replacement dictionaries or compiling regexes inside utility functions invoked repeatedly during memory extraction / relationship graph processing introduces measurable per-call overhead (~40% slower).
**Action:** Always pre-compile regex patterns at module level and pre-allocate static transformation dictionaries (`CYPHER_RELATIONSHIP_CHAR_MAP`, `CODE_BLOCK_PATTERN`, `MULTIPLE_UNDERSCORES_RE`).
