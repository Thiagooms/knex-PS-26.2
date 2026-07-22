const COMBINING_MARKS = /[̀-ͯ]/g

export function normalizeText(text: string): string {
  return text.normalize("NFD").replace(COMBINING_MARKS, "").toLowerCase().trim()
}
