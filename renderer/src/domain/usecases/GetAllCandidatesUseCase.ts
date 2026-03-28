import type { Candidate } from '../entities/Candidate';
import type { CandidateRepository } from '../repositories/CandidateRepository';

export class GetAllCandidatesUseCase {
  private readonly candidateRepository: CandidateRepository;

  constructor(candidateRepository: CandidateRepository) {
    this.candidateRepository = candidateRepository;
  }

  async execute(): Promise<Candidate[]> {
    return this.candidateRepository.findAll();
  }
}
