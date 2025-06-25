import { Part } from "../objects/Part";
import { RigidBody } from "@react-three/rapier";
import { Robot } from "../objects/Robot";
import RobotCanvas from "../components/RobotCanvas";

const GLevel1 = () => {
  return (
    <RobotCanvas camPosition={[15, 15, 15]}>
      <Robot position={[0, 0, 0]} />
      <RigidBody type={"fixed"}>
        <Part name="Floor2" />
      </RigidBody>
    </RobotCanvas>
  );
};

export default GLevel1;
