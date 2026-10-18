# Bolt's Journal

## 2025-05-18 - Single-Pass Regex Replacement vs Sequential `str.replace`
**Learning:** Sequential `.replace()` calls (e.g. 39 string iterations over a character mapping) create excessive string allocations and passes in Python. Combining all candidate string replacements into a single pre-compiled regular expression `_CYPHER_RE.sub(lambda m: _CHAR_MAP[m.group(0)], text)` delivers ~2.6x speedups while keeping logic clean and identical.
**Action:** When doing multi-character or multi-token replacements in hot paths, pre-compile a single regex matching all tokens and substitute using a lookup dict.
