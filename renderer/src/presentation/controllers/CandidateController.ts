import type { Candidate } from '@/domain/entities/Candidate';
import type { InsertCandidateInput } from '@/domain/entities/InsertCandidateInput';
import type { GetAllCandidatesUseCase } from '@/domain/usecases/GetAllCandidatesUseCase';
import type { InsertCandidateUseCase } from '@/application/usecases/InsertCandidateUseCase';
import type { CandidateViewModel } from '../viewmodels/CandidateViewModel';

export class CandidateController {
  private readonly getAllCandidatesUseCase: GetAllCandidatesUseCase;

  private readonly insertCandidateUseCase: InsertCandidateUseCase;

  constructor(
    getAllCandidatesUseCase: GetAllCandidatesUseCase,
    insertCandidateUseCase: InsertCandidateUseCase,
  ) {
    this.getAllCandidatesUseCase = getAllCandidatesUseCase;
    this.insertCandidateUseCase = insertCandidateUseCase;
  }

  async getAllCandidates(): Promise<CandidateViewModel[]> {
    const candidates = await this.getAllCandidatesUseCase.execute();
    return candidates.map((c) => this.toViewModel(c));
  }

  async insertCandidate(input: InsertCandidateInput): Promise<void> {
    await this.insertCandidateUseCase.execute(input);
  }

  private toViewModel(c: Candidate): CandidateViewModel {
    const nr = c.nrCandidato !== '' ? c.nrCandidato : '—';
    return {
      sqPessoa: c.sqPessoa,
      sqEntregaPrestacao: c.sqEntregaPrestacao,
      cdEleicao: c.cdEleicao,
      name: c.name,
      cpf: c.cpf,
      nrCandidato: c.nrCandidato,
      cdCargo: c.cdCargo,
      nrPartido: c.nrPartido,
      federativeUnitCode: c.federativeUnitCode,
      displayLabel: `${c.name || 'Candidato'} — nº ${nr}`,
    };
  }
}
