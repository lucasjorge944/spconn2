import { GetAllCandidatesUseCase } from '@/domain/usecases/GetAllCandidatesUseCase';
import { ElectronSqlExecutionAdapter } from '@/infrastructure/adapters/ElectronSqlExecutionAdapter';
import { DEFAULT_DB_HOST } from '@/infrastructure/config/databaseDefaults';
import { ElectronSqlCandidateRepository } from '@/infrastructure/repositories/ElectronSqlCandidateRepository';
import { CandidateController } from '@/presentation/controllers/CandidateController';

export class CandidateContainer {
  private sqlAdapter: ElectronSqlExecutionAdapter | null = null;
  private candidateRepository: ElectronSqlCandidateRepository | null = null;
  private getAllCandidatesUseCase: GetAllCandidatesUseCase | null = null;
  private candidateController: CandidateController | null = null;

  getSqlExecutionAdapter(): ElectronSqlExecutionAdapter {
    if (!this.sqlAdapter) {
      this.sqlAdapter = new ElectronSqlExecutionAdapter();
    }
    return this.sqlAdapter;
  }

  getCandidateRepository(): ElectronSqlCandidateRepository {
    if (!this.candidateRepository) {
      this.candidateRepository = new ElectronSqlCandidateRepository(
        this.getSqlExecutionAdapter(),
        DEFAULT_DB_HOST,
      );
    }
    return this.candidateRepository;
  }

  getGetAllCandidatesUseCase(): GetAllCandidatesUseCase {
    if (!this.getAllCandidatesUseCase) {
      this.getAllCandidatesUseCase = new GetAllCandidatesUseCase(
        this.getCandidateRepository(),
      );
    }
    return this.getAllCandidatesUseCase;
  }

  getCandidateController(): CandidateController {
    if (!this.candidateController) {
      this.candidateController = new CandidateController(
        this.getGetAllCandidatesUseCase(),
      );
    }
    return this.candidateController;
  }

  reset(): void {
    this.sqlAdapter = null;
    this.candidateRepository = null;
    this.getAllCandidatesUseCase = null;
    this.candidateController = null;
  }
}
