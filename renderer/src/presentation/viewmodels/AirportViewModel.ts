/**
 * UI-facing airport row (decoupled from DB column names).
 */
export type AirportViewModel = {
  code: string;
  federativeUnitCode: string;
  name: string;
  /** Convenience label for lists */
  displayLabel: string;
};
