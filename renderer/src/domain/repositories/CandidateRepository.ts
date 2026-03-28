import type { NormalizedInsertCandidate } from '../entities/NormalizedInsertCandidate';
import type { Candidate } from '../entities/Candidate';

export type CandidatoPessoaKeys = {
  sqPessoa: string;
  sqEntregaPrestacao: string;
};

export interface CandidateRepository {
  findAll(): Promise<Candidate[]>;

  /**
   * Garante uma linha mínima em `EPC_ENTREGA_PRESTACAO` quando o banco ainda não tem nenhuma.
   */
  ensureMinimalEntregaPrestacaoIfNone(
    p: NormalizedInsertCandidate,
  ): Promise<void>;

  /** Insere `EPC_PESSOA` com `TP_PESSOA = 'CA'`. Retorna linhas afetadas (esperado 1). */
  insertPessoaCandidato(p: NormalizedInsertCandidate): Promise<number>;

  /** Localiza a pessoa candidata recém-inserida (ou mais recente) pelo CPF. */
  findCandidatoPessoaKeysByCpf(
    nrCpf: string,
  ): Promise<CandidatoPessoaKeys | null>;

  /**
   * Insere `EPC_ENDERECO` com tipo de endereço de comunicação com a JE.
   * Retorna linhas afetadas (esperado 1).
   */
  insertEnderecoCandidatoComunicacaoJe(
    p: NormalizedInsertCandidate,
    sqPessoa: string,
    sqEntregaPrestacao: string,
  ): Promise<number>;
}
