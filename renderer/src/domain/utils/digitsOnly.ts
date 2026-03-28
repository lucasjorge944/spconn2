/** Mantém apenas dígitos, limitando o tamanho (CPF, CEP, telefone, etc.). */
export function digitsOnly(input: string, maxLen: number): string {
  return input.replace(/\D/g, '').slice(0, maxLen);
}
