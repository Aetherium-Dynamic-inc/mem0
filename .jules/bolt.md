## 2026-03-29 - Pre-compiled regex and fast paths for string parsing
**Learning:** Frequent string parsing utilities (`remove_code_blocks`, `extract_json`, `parse_messages`) executed during memory insertion and retrieval benefit significantly from module-level pre-compiled regexes and fast-path substring checks (`"`/```"`, `"<think>"`) to bypass regex execution when markers are absent.
**Action:** When working with core string parsing helpers in LLM output processing, pre-compile regexes and guard regex execution with fast string containment checks.
