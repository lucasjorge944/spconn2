import type { Airport } from '../entities/Airport';
import type { AirportRepository } from '../repositories/AirportRepository';

/**
 * Loads every airport row from the data source.
 */
export class GetAllAirportsUseCase {
  private readonly airportRepository: AirportRepository;

  constructor(airportRepository: AirportRepository) {
    this.airportRepository = airportRepository;
  }

  async execute(): Promise<Airport[]> {
    return this.airportRepository.findAll();
  }
}
