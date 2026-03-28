import { AirportContainer } from './containers/AirportContainer';

/**
 * Root DI container (singleton), grouped by domain like the admin reference app.
 */
export class DIContainer {
  private static instance: DIContainer | null = null;

  private airportContainer: AirportContainer | null = null;

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  get airports(): AirportContainer {
    if (!this.airportContainer) {
      this.airportContainer = new AirportContainer();
    }
    return this.airportContainer;
  }

  reset(): void {
    this.airportContainer?.reset();
    this.airportContainer = null;
  }
}

export const getDIContainer = (): DIContainer => DIContainer.getInstance();
