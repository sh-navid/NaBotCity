import { ARobotL1 } from "../objects/ARobotL1";
import { Floor } from "../components/LoadObject";
import RobotCanvas from "../components/RobotCanvas";

const pos = [
  { pos: [0, 0, 0], pChange: 0.01, movement: 0.01 },
  { pos: [0, 0, 8], pChange: 0.1, movement: 0.08 },
  { pos: [0, 0, -8], pChange: 0.04, movement: 0.06 },
  { pos: [8, 0, 0], pChange: 0.06, movement: 0.04 },
  { pos: [-8, 0, 0], pChange: 0.08, movement: 0.02 },
  { pos: [8, 0, 8], pChange: 0.02, movement: 0.06 },
  { pos: [8, 0, -8], pChange: 0.04, movement: 0.04 },
  { pos: [-8, 0, 8], pChange: 0.06, movement: 0.02 },
  { pos: [-8, 0, -8], pChange: 0.08, movement: 0.01 },
];

export const ALevel1 = () => {
  return (
    <RobotCanvas camPosition={[15, 15, 15]}>
      {pos.map((p) => (
        <ARobotL1
          initPosition={p.pos}
          pChange={p.pChange}
          movement={p.movement}
        />
      ))}
      <Floor />
    </RobotCanvas>
  );
};