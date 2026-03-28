import { nrCandidatoComecaComPartido } from '@/domain/candidate/candidateNumberRules';
import type { InsertCandidateInput } from './InsertCandidateInput';

/**
 * Código de cargo **vereador** em `EPC_PESSOA.CD_CARGO`.
 * Confirme no catálogo do seu ambiente SPCE/TSE; o valor costuma coincidir com o domínio de cargos da eleição municipal.
 */
export const CD_CARGO_VEREADOR = 13;

/** Estado do formulário na UI (todos os campos como string). */
export type CandidateInsertFormState = {
  nmPessoa: string;
  nrCpf: string;
  sgUePessoa: string;
  nrTituloEleitor: string;
  nrCnpj: string;
  nrPartido: string;
  nrCandidato: string;
  cdEleicao: string;
  tpEntrega: InsertCandidateInput['tpEntrega'];
  stRetificadora: InsertCandidateInput['stRetificadora'];
  stSegundoTurno: InsertCandidateInput['stSegundoTurno'];
  cdTipoLogradouro: string;
  sgUeEndereco: string;
  nrLogradouro: string;
  dsLogradouro: string;
  dsComplemento: string;
  dsBairro: string;
  nrCep: string;
  nrTelefone: string;
  nrCelular: string;
  nrFax: string;
  nmEmail: string;
};

export function defaultCandidateInsertForm(): CandidateInsertFormState {
  return {
    nmPessoa: 'Vereador Teste Demo',
    nrCpf: '52998224725',
    /** Município exemplo: São Paulo (SP) — `UE.json` SG_UE 71072 */
    sgUePessoa: '71072',
    nrTituloEleitor: '123456789012',
    nrCnpj: '',
    nrPartido: '13',
    nrCandidato: '13123',
    cdEleicao: '619',
    tpEntrega: '1',
    stRetificadora: '0',
    stSegundoTurno: '0',
    cdTipoLogradouro: 'R',
    sgUeEndereco: '71072',
    nrLogradouro: '100',
    dsLogradouro: 'Rua Exemplo',
    dsComplemento: 'Sala 1',
    dsBairro: 'Centro',
    nrCep: '01310100',
    nrTelefone: '1133334444',
    nrCelular: '11987654321',
    nrFax: '',
    nmEmail: 'candidato.teste@example.com',
  };
}

export function toInsertCandidateInput(
  form: CandidateInsertFormState,
): InsertCandidateInput {
  const nrPartido = Number.parseInt(form.nrPartido, 10);
  const nrCandidato = Number.parseInt(form.nrCandidato, 10);
  const cdEleicao = Number.parseInt(form.cdEleicao, 10);
  if (
    [nrPartido, nrCandidato, cdEleicao].some(
      (n) => Number.isNaN(n) || !Number.isFinite(n),
    )
  ) {
    throw new Error(
      'Use números inteiros válidos em partido, nº candidato e código da eleição.',
    );
  }
  if (!nrCandidatoComecaComPartido(nrPartido, nrCandidato)) {
    throw new Error(
      `O número na urna (${nrCandidato}) deve iniciar com o número do partido (${nrPartido}).`,
    );
  }
  return {
    nmPessoa: form.nmPessoa,
    nrCpf: form.nrCpf,
    sgUePessoa: form.sgUePessoa,
    nrTituloEleitor: form.nrTituloEleitor,
    nrCnpj: form.nrCnpj,
    cdCargo: CD_CARGO_VEREADOR,
    nrPartido,
    nrCandidato,
    cdEleicao,
    tpEntrega: form.tpEntrega,
    stRetificadora: form.stRetificadora,
    stSegundoTurno: form.stSegundoTurno,
    cdTipoLogradouro: form.cdTipoLogradouro,
    sgUeEndereco: form.sgUeEndereco,
    nrLogradouro: form.nrLogradouro,
    dsLogradouro: form.dsLogradouro,
    dsComplemento: form.dsComplemento,
    dsBairro: form.dsBairro,
    nrCep: form.nrCep,
    nrTelefone: form.nrTelefone,
    nrCelular: form.nrCelular,
    nrFax: form.nrFax,
    nmEmail: form.nmEmail,
  };
}
