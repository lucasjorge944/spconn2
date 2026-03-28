/**
 * Candidato na prestação: ADMSPCE16.EPC_PESSOA com TP_PESSOA = 'CA'.
 * Ver regra `database-schema` e DDL.
 */
export type CandidateProps = {
  sqPessoa: string;
  sqEntregaPrestacao: string;
  cdEleicao: string;
  name: string;
  cpf: string;
  nrCandidato: string;
  cdCargo: string;
  nrPartido: string;
  federativeUnitCode: string;
};

function str(row: Record<string, unknown>, key: string): string {
  const v = row[key];
  if (v == null || v === '') return '';
  return String(v);
}

export class Candidate {
  private readonly props: CandidateProps;

  private constructor(props: CandidateProps) {
    this.props = props;
  }

  static fromDatabaseRow(row: Record<string, unknown>): Candidate {
    return new Candidate({
      sqPessoa: str(row, 'SQ_PESSOA'),
      sqEntregaPrestacao: str(row, 'SQ_ENTREGA_PRESTACAO'),
      cdEleicao: str(row, 'CD_ELEICAO'),
      name: str(row, 'NM_PESSOA'),
      cpf: str(row, 'NR_CPF'),
      nrCandidato: str(row, 'NR_CANDIDATO'),
      cdCargo: str(row, 'CD_CARGO'),
      nrPartido: str(row, 'NR_PARTIDO'),
      federativeUnitCode: str(row, 'SG_UE_PESSOA'),
    });
  }

  get sqPessoa(): string {
    return this.props.sqPessoa;
  }

  get sqEntregaPrestacao(): string {
    return this.props.sqEntregaPrestacao;
  }

  get cdEleicao(): string {
    return this.props.cdEleicao;
  }

  get name(): string {
    return this.props.name;
  }

  get cpf(): string {
    return this.props.cpf;
  }

  get nrCandidato(): string {
    return this.props.nrCandidato;
  }

  get cdCargo(): string {
    return this.props.cdCargo;
  }

  get nrPartido(): string {
    return this.props.nrPartido;
  }

  get federativeUnitCode(): string {
    return this.props.federativeUnitCode;
  }
}
