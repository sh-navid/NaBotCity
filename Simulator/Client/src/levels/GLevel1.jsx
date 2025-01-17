import RobotCanvas from "../components/RobotCanvas";
import { Floor } from "../components/LoadObject";
import { GRobot } from "../objects/GRobot";
import { GRobot2 } from "../objects/GRobot2";
import { GRobot3 } from "../objects/GRobot3";
import { GRobot4 } from "../objects/GRobot4";
import { GRobot5 } from "../objects/GRobot5";
import { ARobotL1 } from "../objects/ARobotL1";
import { HRobot } from "../objects/HRobot";

const GLevel1 = () => {
  return (
    <RobotCanvas camPosition={[15, 15, 15]}>
      <GRobot position={[10, 0.5, 0]} />
      <GRobot2 position={[-10, 0.5, 0]}/>
      <GRobot3 position={[0, 0.5, 10]}/>
      <GRobot4 position={[-1, 1, -10]}/>
      <GRobot5 position={[0, 1.1, 0]}/>
      <ARobotL1 initPosition={[10, 0, 10]}/>
      <HRobot initPosition={[-10, 0, 10]}/>
      <Floor />
    </RobotCanvas>
  );
};

export default GLevel1;
