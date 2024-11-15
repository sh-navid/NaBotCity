import { Robot } from "../objects/Robot";
import { HRobot } from "../objects/HRobot";
import RobotCanvas from "../components/RobotCanvas";
import { Base, Floor } from "../components/LoadObject";


const Scene = () => {
  <RobotCanvas>
        <Robot initPosition={[-4, 0, -4]} />
        <Robot initPosition={[-8, 0, -8]} />
        <Robot initPosition={[8, 0, 8]} name="Robot2" />
        <Robot initPosition={[4, 0, 4]} name="Robot2" />
        <Robot initPosition={[4, 0, -4]} name="Robot3" />
        <Robot initPosition={[-4, 0, 4]} name="Robot4" />
        <Robot initPosition={[8, 0, -8]} name="Robot3" />
        <Robot initPosition={[-8, 0, 8]} name="Robot4" />

        <Base initPosition={[-18, 0, 0]} initRotation={[0, 0, 0]} />
        <Base initPosition={[18, 0, 0]} initRotation={[0, Math.PI, 0]} />
        <Base initPosition={[0, 0, 18]} initRotation={[0, Math.PI / 2, 0]} />
        <Base initPosition={[0, 0, -18]} initRotation={[0, -Math.PI / 2, 0]} />

        <Robot initPosition={[0, 0, 0]} isManual={true} />
        <HRobot initPosition={[2, 0, 2]} isManual={true} />

        <Floor />
  </RobotCanvas>
};

export default Scene;
