/**
 * Text Analyzer Web Worker
 * Performs text analysis off the main thread to keep UI responsive.
 *
 * Note: AnalysisResult type is duplicated here instead of imported
 * because Web Workers run in an isolated context and bundler
 * module resolution may behave differently.
 */

interface AnalysisResult {
  totalUniqueWords: number
  top3: Array<{ word: string; count: number }>
  error?: string
}

self.onmessage = (event: MessageEvent<string>) => {
  const content = event.data

  try {
    // 1. Validate: only allow alphabet, dots, commas, whitespace
    const validPattern = /^[a-zA-Z.,\s]+$/
    if (!validPattern.test(content)) {
      const result: AnalysisResult = {
        totalUniqueWords: 0,
        top3: [],
        error: 'File chứa ký tự không hợp lệ. Chỉ chấp nhận chữ cái (a-z, A-Z), dấu chấm (.), dấu phẩy (,) và khoảng trắng.',
      }
      self.postMessage(result)
      return
    }

    // 2. Tokenize: split by dots, commas, whitespace — filter empties
    const tokens = content.split(/[.,\s]+/).filter((token) => token.length > 0)

    if (tokens.length === 0) {
      const result: AnalysisResult = {
        totalUniqueWords: 0,
        top3: [],
        error: 'File không chứa từ nào.',
      }
      self.postMessage(result)
      return
    }

    // 3. Count words (case-insensitive)
    const wordCounts = new Map<string, number>()
    for (const token of tokens) {
      const word = token.toLowerCase()
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
    }

    // 4. Validate: need at least 3 unique words
    if (wordCounts.size < 3) {
      const result: AnalysisResult = {
        totalUniqueWords: wordCounts.size,
        top3: [],
        error: `File chỉ có ${wordCounts.size} từ duy nhất. Cần ít nhất 3 từ khác nhau.`,
      }
      self.postMessage(result)
      return
    }

    // 5. Find top 3 by count descending
    const sorted = Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word, count]) => ({ word, count }))

    const result: AnalysisResult = {
      totalUniqueWords: wordCounts.size,
      top3: sorted,
    }
    self.postMessage(result)
  } catch (err) {
    const result: AnalysisResult = {
      totalUniqueWords: 0,
      top3: [],
      error: `Lỗi xử lý: ${err instanceof Error ? err.message : String(err)}`,
    }
    self.postMessage(result)
  }
}
