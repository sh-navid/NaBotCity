// FIXME: Needs unit tests
// FIXME: Move this to utils or rename it to RandomHelper and make interface for it
export class Random {
  static getNumber(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // FIXME: Make type Int for this
  static getInt(min: number, max: number) {
    return Math.floor(Random.getNumber(min, max));
  }
}
