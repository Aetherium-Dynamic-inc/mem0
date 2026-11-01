export class BM25 {
  private documents: string[][];
  private k1: number;
  private b: number;
  private avgDocLength: number;
  private docFreq: Map<string, number>;
  private docLengths: number[];
  private idf: Map<string, number>;
  // Optimization: Pre-compute term frequencies per document to replace O(L) doc.filter(...)
  // with O(1) hash map lookups during search scoring.
  private docTermFreqs: Map<string, number>[];

  constructor(documents: string[][], k1 = 1.5, b = 0.75) {
    this.documents = documents;
    this.k1 = k1;
    this.b = b;
    this.docLengths = documents.map((doc) => doc.length);
    this.avgDocLength =
      this.docLengths.reduce((a, b) => a + b, 0) / (documents.length || 1);
    this.docFreq = new Map();
    this.idf = new Map();
    this.docTermFreqs = [];
    this.computeIdfAndDocTermFreqs();
  }

  /**
   * Pre-computes per-document term frequency maps and corpus-wide document frequency (DF),
   * then calculates the Inverse Document Frequency (IDF) for all unique terms.
   *
   * By counting term frequencies once during initialization in O(total_tokens),
   * scoring per query term drops from O(tokens_in_doc) to O(1).
   */
  private computeIdfAndDocTermFreqs() {
    const N = this.documents.length;

    // Count term frequencies per doc and document frequency for each term
    for (const doc of this.documents) {
      const tfMap = new Map<string, number>();
      for (const term of doc) {
        tfMap.set(term, (tfMap.get(term) || 0) + 1);
      }
      this.docTermFreqs.push(tfMap);

      for (const term of tfMap.keys()) {
        this.docFreq.set(term, (this.docFreq.get(term) || 0) + 1);
      }
    }

    // Compute IDF for each term
    for (const [term, freq] of this.docFreq) {
      this.idf.set(term, Math.log((N - freq + 0.5) / (freq + 0.5) + 1));
    }
  }

  private score(query: string[], doc: string[], index: number): number {
    let score = 0;
    const docLength = this.docLengths[index];
    const tfMap = this.docTermFreqs[index];

    for (const term of query) {
      // O(1) lookup replaces doc.filter((t) => t === term).length
      const tf = tfMap.get(term) || 0;
      if (tf === 0) {
        continue;
      }

      const idf = this.idf.get(term) || 0;

      score +=
        (idf * tf * (this.k1 + 1)) /
        (tf +
          this.k1 * (1 - this.b + (this.b * docLength) / this.avgDocLength));
    }

    return score;
  }

  search(query: string[]): string[][] {
    const scores = this.documents.map((doc, idx) => ({
      doc,
      score: this.score(query, doc, idx),
    }));

    return scores.sort((a, b) => b.score - a.score).map((item) => item.doc);
  }
}
