import { GetAllAirportsUseCase } from '@/domain/usecases/GetAllAirportsUseCase';
import { ElectronSqlExecutionAdapter } from '@/infrastructure/adapters/ElectronSqlExecutionAdapter';
import { DEFAULT_DB_HOST } from '@/infrastructure/config/databaseDefaults';
import { ElectronSqlAirportRepository } from '@/infrastructure/repositories/ElectronSqlAirportRepository';
import { AirportController } from '@/presentation/controllers/AirportController';

/**
 * Wires airport-related dependencies (mirrors admin SpaceContainer pattern).
 */
export class AirportContainer {
  private sqlAdapter: ElectronSqlExecutionAdapter | null = null;
  private airportRepository: ElectronSqlAirportRepository | null = null;
  private getAllAirportsUseCase: GetAllAirportsUseCase | null = null;
  private airportController: AirportController | null = null;

  getSqlExecutionAdapter(): ElectronSqlExecutionAdapter {
    if (!this.sqlAdapter) {
      this.sqlAdapter = new ElectronSqlExecutionAdapter();
    }
    return this.sqlAdapter;
  }

  getAirportRepository(): ElectronSqlAirportRepository {
    if (!this.airportRepository) {
      this.airportRepository = new ElectronSqlAirportRepository(
        this.getSqlExecutionAdapter(),
        DEFAULT_DB_HOST,
      );
    }
    return this.airportRepository;
  }

  getGetAllAirportsUseCase(): GetAllAirportsUseCase {
    if (!this.getAllAirportsUseCase) {
      this.getAllAirportsUseCase = new GetAllAirportsUseCase(
        this.getAirportRepository(),
      );
    }
    return this.getAllAirportsUseCase;
  }

  getAirportController(): AirportController {
    if (!this.airportController) {
      this.airportController = new AirportController(
        this.getGetAllAirportsUseCase(),
      );
    }
    return this.airportController;
  }

  reset(): void {
    this.sqlAdapter = null;
    this.airportRepository = null;
    this.getAllAirportsUseCase = null;
    this.airportController = null;
  }
}
