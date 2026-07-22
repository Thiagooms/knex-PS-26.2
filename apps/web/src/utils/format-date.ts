export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("pt-BR")
}
