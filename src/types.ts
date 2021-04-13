export type UserIntegrationConfig = {
  qualysUsername: string;
  qualysPassword: string;

  /**
   * The URL of the Qualys API.
   *
   * @example https://qualysapi.qg3.apps.qualys.com
   */
  qualysApiUrl: string;

  /**
   * The minimum number of days since execution time (now) to use when searching
   * for scanned web applications and hosts.
   */
  minScannedSinceDays: number;

  /**
   * The minimum number of days since execution time (now) to use when searching
   * for web app findings and host detections.
   */
  minFindingsSinceDays: number;

  /**
   * The severities to use when searching for host detections, used to limit
   * data fetched to only severities a security team wants to ingest.
   */
  vmdrFindingSeverities?: number[];
};

export type CalculatedIntegrationConfig = UserIntegrationConfig & {
  /**
   * The start date to use when searching for scanned web applications and
   * hosts, calculated from `minScannedSinceDays`.
   */
  minScannedSinceISODate: string;

  /**
   * The end date to use when searching for scanned hosts, calculated from
   * execution start time.
   */
  maxScannedSinceISODate: string;

  /**
   * The start date to use when searching for web application findings and host
   * detections, calculated from `minFindingsSinceDays`.
   */
  minFindingsSinceISODate: string;

  /**
   * The end date to use when searching for host detections, calculated from
   * execution start time.
   */
  maxFindingsSinceISODate: string;
};

export type QualysIntegrationConfig = CalculatedIntegrationConfig;

export type PossibleArray<T> = T | T[];

export type Opaque<K, T> = T & { __TYPE__: K };

export type ISODateString = Opaque<'Date', string>;

export type QualyNumericSeverity = 1 | 2 | 3 | 4 | 5 | undefined;

/**
 * Values that conform to the `Finding.numericSeverity` property.
 */
export type NormalizedNumericSeverity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
