import RobotCanvas from "../components/RobotCanvas";
import { RigidBody } from "@react-three/rapier";
import { ARobotL1 } from "../objects/ARobotL1";
import { GRobot2 } from "../objects/GRobot2";
import { GRobot3 } from "../objects/GRobot3";
import { GRobot4 } from "../objects/GRobot4";
import { GRobot5 } from "../objects/GRobot5";
import { GRobot6 } from "../objects/GRobot6";
import { GRobot } from "../objects/GRobot";
import { HRobot } from "../objects/HRobot";
import { Part } from "../objects/Part";
import { ARobotNew } from "../objects/ARobotNew";
import { ARobotNew2 } from "../objects/ARobotNew2";

const GLevel1 = () => {
  return (
    <RobotCanvas camPosition={[15, 15, 15]}>
      {/* <GRobot position={[10, 0.5, 0]} />
      <GRobot2 position={[-10, 0.5, 0]} />
      <GRobot3 position={[0, 0.5, 10]} />
      <GRobot4 position={[-1, 1, -10]} /> */}
      {/* <GRobot5 position={[10, 1.1, -10]} /> */}

      {/* <GRobot6 position={[10, 1.1, 10]} /> */}

      <ARobotNew position={[10, 0,10]}/>
      <ARobotNew2 position={[0, 0,0]}/>

      {/* <ARobotL1 initPosition={[10, 0, 10]} /> */}
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
