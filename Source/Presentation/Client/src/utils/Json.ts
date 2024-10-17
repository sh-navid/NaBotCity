/**
 * To deep clone json/array
 * @param obj - The json/array object that should be cloned
 * @returns A deep copy of obj
 */
// FIXME: You may want to use it in server as well
export class Json {
  // FIXME: Change any to JSON
  static clone(obj: any): any | null {
    return JSON.parse(JSON.stringify(obj));
  }
}
