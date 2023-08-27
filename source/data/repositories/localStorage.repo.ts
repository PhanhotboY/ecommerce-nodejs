export abstract class LocalStorageRepo {
  abstract get(key: string): string;

  abstract set(key: string, value: string): string;
}
