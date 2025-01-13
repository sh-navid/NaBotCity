import { IRobotHelper } from "../interfaces/IRobotHelper";

export class RobotHelper implements IRobotHelper {
  // FIXME: Change Constraints type from any to its true type
  _constraints: any;

  constructor(constraints: any) {
    this._constraints = constraints;
  }

  checkInBound(no: number, pos: number): number {
    if (pos > this._constraints[no].max) {
      pos = this._constraints[no].max;
    } else if (pos < this._constraints[no].min) {
      pos = this._constraints[no].min;
    }
    return pos;
  }

  rotateBase(robotData: any, pos: number, mv: number = 0.01): void {
    if (robotData != null) {
      var arm = robotData.getObjectByName(`Arm-Base`);
      if (arm) {
        arm.rotation.x = 0;
        arm.rotation.z = 0;
        if (mv === 0) {
          arm.rotation.y = pos;
        } else {
          if (arm.rotation.y + mv < pos) {
            arm.rotation.y += mv;
          } else if (arm.rotation.y - mv > pos) {
            arm.rotation.y -= mv;
          } else {
            arm.rotation.y = pos;
          }
        }
      }
    }
  }

  getBaseRotation(robotData: any) {
    return robotData.getObjectByName(`Arm-Base`).rotation.y;
  }

  getArmARotation(robotData: any, no: number) {
    return robotData.getObjectByName(`Arm${no}-A`).rotation.z;
  }

  getArmBRotation(robotData: any, no: number) {
    return robotData.getObjectByName(`Arm${no}-B`).rotation.y;
  }

  // FIXME: Change scene type from any to its true type
  // FIXME: Change type of no to Integer
  moveArmA(
    robotData: any,
    no: number = 1,
    pos: number,
    mv: number = 0.01
  ): void {
    pos = this.checkInBound(no, pos);

    pos = no === 1 ? pos : Math.PI + pos;

    if (robotData != null) {
      var arm = robotData.getObjectByName(`Arm${no}-A`);
      if (arm) {
        arm.rotation.x = 0;
        arm.rotation.y = 0;
        if (mv === 0) {
          arm.rotation.z = pos;
        } else {
          if (arm.rotation.z + mv < pos) {
            arm.rotation.z += mv;
          } else if (arm.rotation.z - mv > pos) {
            arm.rotation.z -= mv;
          } else {
            arm.rotation.z = pos;
          }
        }
      }
    }
  }

  resetArmA(robotData: any): void {
    this.moveArmA(robotData, 1, 0, 0);
    this.moveArmA(robotData, 2, 0, 0);
    this.moveArmA(robotData, 3, 0, 0);
    this.moveArmA(robotData, 4, 0, 0);
  }

  // FIXME: Change scene type from any to its true type
  // FIXME: Change type of no to Integer
  moveArmB(
    robotData: any,
    no: number = 1,
    pos: number,
    mv: number = 0.01
  ): void {
    if (robotData != null) {
      var arm = robotData.getObjectByName(`Arm${no}-B`);
      if (arm) {
        arm.rotation.x = 0;
        if (mv === 0) {
          arm.rotation.y = pos;
        } else {
          if (arm.rotation.y + mv < pos) {
            arm.rotation.y += mv;
          } else if (arm.rotation.y - mv > pos) {
            arm.rotation.y -= mv;
          } else {
            arm.rotation.y = pos;
          }
        }
        arm.rotation.z = Math.PI;
      }
    }
  }

  resetArmB(robotData: any): void {
    this.moveArmB(robotData, 1, 0, 0);
    this.moveArmB(robotData, 2, 0, 0);
    this.moveArmB(robotData, 3, 0, 0);
    this.moveArmB(robotData, 4, 0, 0);
  }
}
