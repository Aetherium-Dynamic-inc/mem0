## 2025-05-20 - Precomputing date evaluation in memory payload filtering
**Learning:** `_payload_is_expired` in `mem0/memory/main.py` was constructing `datetime.now(timezone.utc).date()` on every iteration over search and list results. Passing a precomputed `current_date` from list/search loops and avoiding `str()` casting when `expiration_date` is already `str` or `date` speeds up payload expiration checking by ~1.7x-2x without changing return semantics.
**Action:** Always check loop bodies for time/date instantiation or redundant string coercions when filtering result collections.
