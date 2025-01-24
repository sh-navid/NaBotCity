import { Part } from "../objects/Part";
import { HRobot } from "../objects/HRobot";
import { RigidBody } from "@react-three/rapier";
import { ARobotNew } from "../objects/ARobotNew";
import { ARobotNew2 } from "../objects/ARobotNew2";
import RobotCanvas from "../components/RobotCanvas";

const GLevel1 = () => {
  return (
    <RobotCanvas camPosition={[15, 15, 15]}>
      <ARobotNew position={[10, 0,10]}/>
      <ARobotNew2 position={[0, 0,0]}/>

      <HRobot initPosition={[-10, 0, 10]} />

      <RigidBody type={"fixed"} >
        <Part name="Floor3" />
      </RigidBody>

      <RigidBody type={"fixed"} colliders={"hull"}>
        <Part name="JumpTrain" />
      </RigidBody>

      <RigidBody type={"fixed"} colliders={"trimesh"}>
        <Part name="MountTrain" />
      </RigidBody>

      <RigidBody type={"fixed"} colliders={"trimesh"}>
        <Part name="Train" />
      </RigidBody>
    </RobotCanvas>
  );
};

export default GLevel1;
