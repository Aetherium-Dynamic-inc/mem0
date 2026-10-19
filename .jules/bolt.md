## 2026-10-19 - Pre-compiled regex patterns in text parsing utilities
**Learning:** Functions like `remove_code_blocks`, `extract_json`, and `sanitize_relationship_for_cypher` in `mem0/memory/utils.py` are executed repeatedly during LLM memory extraction and entity sanitization. Pre-compiling module-level regex objects and adding simple string presence checks (`if "<think>" in string:`) avoids unnecessary regex compilation and substitution overhead.
**Action:** Always pre-compile module-level regex patterns when creating text parsing utilities in hot paths.
