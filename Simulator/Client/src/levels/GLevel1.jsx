import { Part } from "../objects/Part";
import { RigidBody } from "@react-three/rapier";
import { ARobotNew2 } from "../objects/ARobotNew2";
import RobotCanvas from "../components/RobotCanvas";

const GLevel1 = () => {
  return (
    <RobotCanvas camPosition={[15, 15, 15]}>
      <ARobotNew2 position={[0, 0,0]}/>

      <RigidBody type={"fixed"} >
        <Part name="Floor2" />
      </RigidBody>

    </RobotCanvas>
  );
};

export default GLevel1;
