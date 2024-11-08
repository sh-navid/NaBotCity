export interface IRobotHelper {
  resetArmA(robotData: any): void;
  resetArmB(robotData: any): void;
  checkInBound(no: number, pos: number): number;
  moveArmA(robotData: any, no: number, pos: number, mv: number): void;
  moveArmB(robotData: any, no: number, pos: number, mv: number): void;
}
