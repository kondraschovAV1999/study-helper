/**
 * Splits a given text into smaller chunks, each containing up to a specified maximum number of words.
 *
 * @param {string} text - The input text to be chunked.
 * @param {number} [maxWords=5000] - The maximum number of words per chunk.
 * @returns {string[]} An array of text chunks, each containing up to the specified number of words.
 */
export default function chunkText(
  text: string,
  maxWords: number = 5000
): string[] {
  if (!text) return [];
  if (maxWords <= 0) throw new Error("maxWords must be greater than 0");
  const chunks: string[] = [];
  const words = text.match(/\S+/g) || [];
  const totalWords = words.length;

  if (totalWords <= maxWords) return [text];

  let startIndex = 0;
  while (startIndex < totalWords) {
    const endIndex = startIndex + maxWords;
    chunks.push(words.slice(startIndex, endIndex).join(" "));
    startIndex = endIndex;
  }

  return chunks;
}
