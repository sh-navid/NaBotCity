import { ARobotL1 } from "../../objects/ARobotL1";
import { Floor } from "../../components/LoadObject";
import RobotCanvas from "../../components/RobotCanvas";

const pos=[
  [0,0,0],
  [0,0,8],
  [0,0,-8],
  [8,0,0],
  [-8,0,0],
  [8,0,8],
  [8,0,-8],
  [-8,0,8],
  [-8,0,-8],
]

const Level1 = () => {
  return (
    <RobotCanvas camPosition={[15,15,15]}>
      {
        pos.map((p)=>(
      <ARobotL1 initPosition={p}/>

        ))
      }
      <Floor />
    </RobotCanvas>
  );
};

export default Level1;
