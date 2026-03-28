import type { Airport } from '../entities/Airport';

/**
 * Persistence contract for airports. Implementation lives in infrastructure (JDBC via Electron).
 */
export interface AirportRepository {
  findAll(): Promise<Airport[]>;
}
