/**
 * Regras de identificação na urna (número de candidato × partido).
 */

export function nrCandidatoComecaComPartido(
  nrPartido: number,
  nrCandidato: number,
): boolean {
  return String(nrCandidato).startsWith(String(nrPartido));
}
