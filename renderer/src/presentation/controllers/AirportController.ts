import type { Airport } from '@/domain/entities/Airport';
import type { GetAllAirportsUseCase } from '@/domain/usecases/GetAllAirportsUseCase';
import type { AirportViewModel } from '../viewmodels/AirportViewModel';

export class AirportController {
  private readonly getAllAirportsUseCase: GetAllAirportsUseCase;

  constructor(getAllAirportsUseCase: GetAllAirportsUseCase) {
    this.getAllAirportsUseCase = getAllAirportsUseCase;
  }

  async getAllAirports(): Promise<AirportViewModel[]> {
    const airports = await this.getAllAirportsUseCase.execute();
    return airports.map((a) => this.toViewModel(a));
  }

  private toViewModel(airport: Airport): AirportViewModel {
    return {
      code: airport.code,
      federativeUnitCode: airport.federativeUnitCode,
      name: airport.name,
      displayLabel: `${airport.code} — ${airport.name}`,
    };
  }
}
