/**
 * Leitura defensiva de resultados JDBC serializados como objetos genéricos.
 */

export function getRowString(
  row: Record<string, unknown>,
  key: string,
): string {
  const v = row[key];
  if (v == null) return '';
  return String(v);
}
