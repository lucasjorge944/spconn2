import type { Candidate } from '@/domain/entities/Candidate';
import type { GetAllCandidatesUseCase } from '@/domain/usecases/GetAllCandidatesUseCase';
import type { CandidateViewModel } from '../viewmodels/CandidateViewModel';

export class CandidateController {
  private readonly getAllCandidatesUseCase: GetAllCandidatesUseCase;

  constructor(getAllCandidatesUseCase: GetAllCandidatesUseCase) {
    this.getAllCandidatesUseCase = getAllCandidatesUseCase;
  }

  async getAllCandidates(): Promise<CandidateViewModel[]> {
    const candidates = await this.getAllCandidatesUseCase.execute();
    return candidates.map((c) => this.toViewModel(c));
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
