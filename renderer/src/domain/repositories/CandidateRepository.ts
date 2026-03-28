import type { Candidate } from '../entities/Candidate';

export interface CandidateRepository {
  findAll(): Promise<Candidate[]>;
}
