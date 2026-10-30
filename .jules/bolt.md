# Bolt's Journal - Performance Insights

## 2026-03-31 - Pre-compiled regex and string sanitization in Cypher queries
**Learning:** Sequential `.replace()` string calls (38 iterations per relationship) create high overhead and unnecessary string allocations. Pre-compiling a combined regex pattern with `re.sub` reduces execution time by ~34%.
**Action:** Use pre-compiled regex `re.sub` with dictionary mapping for multi-character string replacements instead of repetitive `.replace()` loops.
