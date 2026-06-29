/**
 * Result of text analysis performed by the Web Worker.
 */
export interface AnalysisResult {
  totalUniqueWords: number
  top3: Array<{ word: string; count: number }>
  error?: string
}
