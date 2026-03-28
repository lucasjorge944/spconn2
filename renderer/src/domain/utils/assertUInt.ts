/** Inteiro não negativo com teto (ex.: DECIMAL do DDL). */
export function assertUInt(name: string, n: number, max: number): void {
  if (!Number.isFinite(n) || n < 0 || n > max || !Number.isInteger(n)) {
    throw new Error(`${name} deve ser um inteiro entre 0 e ${max}.`);
  }
}
