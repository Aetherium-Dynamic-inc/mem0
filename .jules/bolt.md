## 2025-05-20 - Unconditional Character Replacement in Cypher Relationship Sanitization

**Learning:** `sanitize_relationship_for_cypher` in `mem0/memory/utils.py` previously constructed a 40+ key dictionary and performed 40+ `str.replace()` operations sequentially on every relationship string during graph entity normalization. Because most relationship strings (e.g. `WORKS_AT`, `LIVES_IN`) contain none or very few of the special characters, performing unconditional `str.replace()` calls creates unnecessary string allocation overhead.

**Action:** Prefer module-scoping lookup data/regexes and using membership pre-checks (`if old in string:`) before invoking string replacement logic on hot paths like entity and relationship processing.
