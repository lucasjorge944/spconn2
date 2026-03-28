import type { InsertCandidateInput } from './InsertCandidateInput';

/**
 * Payload validado e normalizado para persistência de candidato + endereço.
 */
export type NormalizedInsertCandidate = {
  nmPessoa: string;
  nrCpf: string;
  sgUePessoa: string;
  nrTituloEleitor: string | null;
  nrCnpj: string | null;
  cdCargo: number;
  nrPartido: number;
  nrCandidato: number;
  cdEleicao: number;
  tpEntrega: InsertCandidateInput['tpEntrega'];
  stRetificadora: InsertCandidateInput['stRetificadora'];
  stSegundoTurno: InsertCandidateInput['stSegundoTurno'];
  cdTipoLogradouro: string;
  sgUeEndereco: string;
  nrLogradouro: string;
  dsLogradouro: string | null;
  dsComplemento: string | null;
  dsBairro: string | null;
  nrCep: string | null;
  nrTelefone: string | null;
  nrCelular: string | null;
  nrFax: string | null;
  nmEmail: string | null;
};
