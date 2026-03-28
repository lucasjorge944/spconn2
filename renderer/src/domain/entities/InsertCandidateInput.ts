/**
 * Payload para cadastrar candidato no modelo ADMSPCE16, alinhado às telas SPCE
 * (Qualificação: Prestador de contas + Endereço para comunicação com a JE).
 *
 * Mapeamento de tabelas: ver `docs/database/candidato-cadastro.md`.
 */
export type InsertCandidateInput = {
  /** EPC_PESSOA.NM_PESSOA */
  nmPessoa: string;
  /** EPC_PESSOA.NR_CPF — 11 dígitos */
  nrCpf: string;
  /** EPC_PESSOA.SG_UE_PESSOA — FK UE (UF / unidade da candidatura) */
  sgUePessoa: string;
  /** EPC_PESSOA.NR_TITULO_ELEITOR — até 12 caracteres; vazio grava NULL */
  nrTituloEleitor: string;
  /** EPC_PESSOA.NR_CNPJ — 14 dígitos campanha; vazio grava NULL */
  nrCnpj: string;
  /** EPC_PESSOA.CD_CARGO — no fluxo atual, sempre vereador (`CD_CARGO_VEREADOR`). */
  cdCargo: number;
  /** EPC_PESSOA.NR_PARTIDO */
  nrPartido: number;
  /** EPC_PESSOA.NR_CANDIDATO — deve iniciar com o número do partido (regra de urna). */
  nrCandidato: number;
  /**
   * EPC_ENTREGA_PRESTACAO.CD_ELEICAO na inserção mínima quando ainda não há entrega.
   */
  cdEleicao: number;
  /** EPC_ENTREGA_PRESTACAO.TP_ENTREGA — domínio CK: '0'..'3' */
  tpEntrega: '0' | '1' | '2' | '3';
  /** EPC_ENTREGA_PRESTACAO.ST_RETIFICADORA */
  stRetificadora: '0' | '1';
  /**
   * EPC_ENTREGA_PRESTACAO.ST_CONCORRE_SEGUNDO_TURNO — na UI: 2º turno = '1'.
   */
  stSegundoTurno: '0' | '1';

  /** EPC_ENDERECO.CD_TIPO_LOGRADOURO — FK TIPO_LOGRADOURO (até 4 caracteres) */
  cdTipoLogradouro: string;
  /** EPC_ENDERECO.SG_UE — UE do endereço (município); FK UE */
  sgUeEndereco: string;
  /** EPC_ENDERECO.NR_LOGRADOURO — número / S/N */
  nrLogradouro: string;
  /** EPC_ENDERECO.DS_LOGRADOURO */
  dsLogradouro: string;
  /** EPC_ENDERECO.DS_COMPLEMENTO */
  dsComplemento: string;
  /** EPC_ENDERECO.DS_BAIRRO */
  dsBairro: string;
  /** EPC_ENDERECO.NR_CEP — 8 dígitos; vazio grava NULL */
  nrCep: string;
  /** EPC_ENDERECO.NR_TELEFONE — até 11 dígitos */
  nrTelefone: string;
  /** EPC_ENDERECO.NR_CELULAR */
  nrCelular: string;
  /** EPC_ENDERECO.NR_FAX */
  nrFax: string;
  /** EPC_ENDERECO.NM_EMAIL */
  nmEmail: string;
};
