export abstract class UseCase<T> {
  abstract execute(...arg: any[]): T;
}
