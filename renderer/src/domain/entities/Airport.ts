/**
 * Aeroporto (tabela ADMSPCE16.AEROPORTO).
 * Campos alinhados ao banco legado; nomes em inglês na API TypeScript.
 */
export type AirportProps = {
  code: string;
  federativeUnitCode: string;
  name: string;
};

export class Airport {
  private readonly props: AirportProps;

  private constructor(props: AirportProps) {
    this.props = props;
  }

  static fromDatabaseRow(row: Record<string, unknown>): Airport {
    return new Airport({
      code: String(row.CD_AEROPORTO ?? ''),
      federativeUnitCode: String(row.SG_UE ?? ''),
      name: String(row.NM_AEROPORTO ?? ''),
    });
  }

  get code(): string {
    return this.props.code;
  }

  get federativeUnitCode(): string {
    return this.props.federativeUnitCode;
  }

  get name(): string {
    return this.props.name;
  }
}
