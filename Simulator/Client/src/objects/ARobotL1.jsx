import { Json } from "../utils/Json";
import { useFrame } from "@react-three/fiber";
import { Endpoints } from "../configs/Endpoints";
import { Random } from "../helpers/RandomHelper";
import { RobotHelper } from "../helpers/RobotHelper";
import { Constraints } from "../configs/Constraints";
import { TextObject } from "../components/TextObject";
import { useEffect, useMemo, useRef, useState } from "react";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";

const _robotHelper = new RobotHelper(Constraints);

export const ARobotL1 = ({
  name = "Robot",
  isManual = false,
  initPosition = [0, 0, 0],
}) => {
  const boxRef = useRef(null);
  const roboRef = useRef(null);
  const [data, setData] = useState(null);
  const [a, setA] = useState([0, 0, 0, 0]);
  const [b, setB] = useState([0, 0, 0, 0]);
  const { scene, isLoading, error } = useGLTF(Endpoints.Download(name));

  const movement=0.02;

  useFrame(() => {
    if (data != null) {
      _robotHelper.moveArmA(data, 1, a[0],movement);
      _robotHelper.moveArmA(data, 2, a[1],movement);
      _robotHelper.moveArmA(data, 3, a[2],movement);
      _robotHelper.moveArmA(data, 4, a[3],movement);
      _robotHelper.moveArmB(data, 1, b[0],movement);
      _robotHelper.moveArmB(data, 2, b[1],movement);
      _robotHelper.moveArmB(data, 3, b[2],movement);
      _robotHelper.moveArmB(data, 4, b[3],movement);
    }

    if (!isManual) {
      if (Math.random() < 0.01) {
        let i = Random.getInt(0, 4);
        let x = Random.getInt(-1, 2);
        let p = (x * Math.PI) / Random.getInt(1, 12);
        let tmp = Json.clone(a);
        tmp[i] = p;
        setA(tmp);
      }

      if (Math.random() < 0.01) {
        let i = Random.getInt(0, 5);
        let x = Random.getInt(-1, 2);
        let p = (x * Math.PI) / Random.getInt(1, 12);
        console.log("::", x);
        let tmp = Json.clone(b);
        tmp[i] = p;
        setB(tmp);
      }
    }
  });

  useMemo(() => {
    setData(scene.clone());
  }, [scene]);

  useEffect(() => {
    _robotHelper.resetArmA(data);
  }, [data]);

  return (
    <>
      {!isLoading && !error && data != null ? (
        <>
          <group position={initPosition} ref={roboRef}>
            <TextObject position={[0, 0.5, 1.5]}>
              {name + "_" + initPosition[0] + initPosition[1] + initPosition[2]}
            </TextObject>
            <primitive object={data} />

            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[2, 2, 0.5, 32]} />
              {/* radiusTop, radiusBottom, height, radialSegments */}
              <meshStandardMaterial
                color="green"
                transparent={true}
                opacity={0.2}
              />

              <mesh ref={boxRef}>
                {/* <boxGeometry args={[.1,.1,.1]}/> */}
                {/* <meshStandardMaterial color="tomato"/> */}
              </mesh>
            </mesh>
          </group>
        </>
      ) : (
        "Error"
      )}
    </>
  );
};
