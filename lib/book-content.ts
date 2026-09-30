import { readFileSync } from "fs";
import { join } from "path";

export const PRICING_MARKER = "<!-- BOOK_PRICING -->";

/**
 * Чете HTML съдържанието на страница на книга от content/ и го разделя на
 * мястото, където <BookPricing /> вмъква секцията „Издания и цени“.
 */
export function readBookContent(file: string): { before: string; after: string } {
  const [before, after, ...rest] = readFileSync(
    join(process.cwd(), "content", file),
    "utf8"
  ).split(PRICING_MARKER);
  if (after === undefined || rest.length > 0) {
    throw new Error(`content/${file} must contain exactly one ${PRICING_MARKER} marker`);
  }
  return { before, after };
}
