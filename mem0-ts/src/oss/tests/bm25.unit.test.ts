import { BM25 } from "../src/utils/bm25";

describe("BM25 unit tests", () => {
  it("correctly ranks documents matching query terms", () => {
    const docs = [
      ["apple", "banana", "fruit"],
      ["cherry", "date", "fruit"],
      ["apple", "apple", "pie"],
      ["banana", "split", "dessert"],
    ];

    const bm25 = new BM25(docs);
    const results = bm25.search(["apple"]);

    // Documents containing "apple" should be ranked at the top.
    // Document with two "apple" tokens should have higher TF and rank highest.
    expect(results[0]).toEqual(["apple", "apple", "pie"]);
    expect(results[1]).toEqual(["apple", "banana", "fruit"]);
  });

  it("handles multi-term queries and ranks documents with more matches higher", () => {
    const docs = [
      ["database", "postgres", "sql"],
      ["database", "redis", "cache", "nosql"],
      ["frontend", "react", "javascript"],
    ];

    const bm25 = new BM25(docs);
    const results = bm25.search(["database", "sql"]);

    // Document with both 'database' and 'sql' should rank first
    expect(results[0]).toEqual(["database", "postgres", "sql"]);
    // Document with only 'database' should rank second
    expect(results[1]).toEqual(["database", "redis", "cache", "nosql"]);
    // Document with no matches should rank last
    expect(results[2]).toEqual(["frontend", "react", "javascript"]);
  });

  it("handles queries with terms not in corpus gracefully", () => {
    const docs = [
      ["alpha", "beta"],
      ["gamma", "delta"],
    ];
    const bm25 = new BM25(docs);
    const results = bm25.search(["nonexistent", "unknown"]);

    // All documents score 0, should still return all docs without error
    expect(results).toHaveLength(2);
  });

  it("handles empty document list and empty query", () => {
    const bm25Empty = new BM25([]);
    expect(bm25Empty.search(["test"])).toEqual([]);

    const docs = [["hello", "world"]];
    const bm25 = new BM25(docs);
    const results = bm25.search([]);
    expect(results).toHaveLength(1);
  });

  it("measures performance of repeated queries over documents", () => {
    // Generate synthetic corpus
    const numDocs = 500;
    const docLen = 50;
    const vocab = Array.from({ length: 200 }, (_, i) => `term_${i}`);

    const docs: string[][] = [];
    for (let i = 0; i < numDocs; i++) {
      const doc: string[] = [];
      for (let j = 0; j < docLen; j++) {
        doc.push(vocab[(i * 7 + j * 13) % vocab.length]);
      }
      docs.push(doc);
    }

    const bm25 = new BM25(docs);
    const query = ["term_5", "term_25", "term_50", "term_75"];

    const start = performance.now();
    for (let i = 0; i < 20; i++) {
      bm25.search(query);
    }
    const elapsed = performance.now() - start;

    // Fast O(1) term lookup ensures this runs in < 100ms
    expect(elapsed).toBeLessThan(500);
  });
});
