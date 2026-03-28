/**
 * Literais e fragmentos SQL seguros para concatenação (H2/JDBC).
 * Reutilizável em qualquer repositório que monte SQL dinâmico.
 */

/** Aspas simples com escape de apóstrofos (`'` → `''`). */
export function sqlStringLiteral(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

/** `NULL` ou literal de string. */
export function sqlNullOrString(value: string | null): string {
  if (value == null || value === '') return 'NULL';
  return sqlStringLiteral(value);
}

/** Reexporta util de domínio para uso em repositórios que montam SQL. */
export { digitsOnly } from '@/domain/utils/digitsOnly';
