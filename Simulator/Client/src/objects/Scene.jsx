import RobotCanvas from "../components/RobotCanvas";
import { Cylinder } from "@react-three/drei";
import { Robot } from "./Robot";

const Scene = () => {
  return (
    <RobotCanvas camPosition={[15, 15, 15]}>
      <Robot position={[0, 0, 0]} />

      <Cylinder
        args={[5.2, 5, .5, 32]} // radiusTop, radiusBottom, height, and number of segments
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="gray" />
      </Cylinder>
    </RobotCanvas>
  );
};

export default Scene;
