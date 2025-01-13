import { useEffect, useMemo, useRef, useState } from "react";
import { TextObject } from "../components/TextObject";
import { RobotHelper } from "../helpers/RobotHelper";
import { Constraints } from "../configs/Constraints";
import { Endpoints } from "../configs/Endpoints";
import { Random } from "../helpers/RandomHelper";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Json } from "../utils/Json";
import { Boxes } from "./Boxes";
import * as THREE from "three";
import Box from "./Box";

const _robotHelper = new RobotHelper(Constraints);

export const ARobotL1 = ({
  name = "Robot",
  initPosition = [0, 0, 0],
  pChange = 0.01,
  movement = 0.01,
}) => {
  const yBoxRef = useRef(null);
  const xBoxRef = useRef(null);
  const zBoxRef = useRef(null);
  const posBoxRef = useRef(null);
  const roboRef = useRef(null);
  const [data, setData] = useState(null);
  const [base, setBase] = useState(0);
  const [a, setA] = useState([0, 0, 0, 0]);
  const [b, setB] = useState([0, 0, 0, 0]);
  const { scene, isLoading, error } = useGLTF(Endpoints.Download(name));

  // [{base, a0, a1, a2, a3, b0, b1, b2, b3, x, y, z}]
  const [trainingData, setTrainingData] = useState([]);

  useFrame(() => {
    if (data != null) {
      _robotHelper.rotateBase(data, base, movement);
      _robotHelper.moveArmA(data, 1, a[0], movement);
      _robotHelper.moveArmA(data, 2, a[1], movement);
      _robotHelper.moveArmA(data, 3, a[2], movement);
      _robotHelper.moveArmA(data, 4, a[3], movement);
      _robotHelper.moveArmB(data, 1, b[0], movement);
      _robotHelper.moveArmB(data, 2, b[1], movement);
      _robotHelper.moveArmB(data, 3, b[2], movement);
      _robotHelper.moveArmB(data, 4, b[3], movement);
    }

    for (let i = 0; i < 4; i++) {
      let k = _robotHelper.getArmARotation(data, i + 1);
      if (k > a[i] - 0.5 || k < a[i] + 0.5) {
        if (Math.random() < pChange) {
          let x = Math.random() > 0.5 ? 1 : -1;
          let p = (x * Math.PI) / Random.getInt(1, 18);
          let tmp = Json.clone(a);
          tmp[i] = p;
          setA(tmp);
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      let k = _robotHelper.getArmBRotation(data, i + 1);
      if (k > b[i] - 0.5 || k < b[i] + 0.5) {
        if (Math.random() < pChange) {
          let x = Math.random() > 0.5 ? 1 : -1;
          let p = (x * Math.PI) / Random.getInt(1, 18);
          let tmp = Json.clone(b);
          tmp[i] = p;
          setB(tmp);
        }
      }
    }

    if (Math.random() < pChange) {
      let x = Math.random() > 0.5 ? 1 : -1;
      let p = (x * Math.PI) / 2;
      setBase(p);
    }

    if (yBoxRef != null && roboRef != null) {
      let aPos = roboRef.current.position;
      let obj = roboRef.current.getObjectByName("Arm4-B");
      const pos = new THREE.Vector3();
      obj.getWorldPosition(pos);

      let x, y, z;
      y = pos.y - aPos.y;
      x = pos.x - aPos.x;
      z = pos.z - aPos.z;

      yBoxRef.current.position.y = y; // Tomato
      xBoxRef.current.position.x = x; // RoyalBlue
      zBoxRef.current.position.z = z; // Gold

      xBoxRef.current.position.y = y;
      zBoxRef.current.position.y = y;

      posBoxRef.current.position.y = y;
      posBoxRef.current.position.x = x;
      posBoxRef.current.position.z = z;

      let tmp = Json.clone(trainingData);
      tmp.push({
        base: _robotHelper.getBaseRotation(data),
        a1: _robotHelper.getArmARotation(data, 1),
        a2: _robotHelper.getArmARotation(data, 2),
        a3: _robotHelper.getArmARotation(data, 3),
        a4: _robotHelper.getArmARotation(data, 4),
        b1: _robotHelper.getArmBRotation(data, 1),
        b2: _robotHelper.getArmARotation(data, 2),
        b3: _robotHelper.getArmARotation(data, 3),
        b4: _robotHelper.getArmARotation(data, 4),
        x,
        y,
        z,
      });
      setTrainingData(tmp);

      console.log(tmp);
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
              <cylinderGeometry args={[2, 2, 0.5, 32]} />{" "}
              {/* radiusTop, radiusBottom, height, radialSegments */}
              <meshStandardMaterial
                color="black"
                transparent={true}
                opacity={0.1}
              />
              <Box color="tomato" size={0.2} ref={yBoxRef} />
              <Box color="royalblue" size={0.2} ref={xBoxRef} />
              <Box color="gold" size={0.2} ref={zBoxRef} />
              <Box color="seagreen" position={[0, 6, 0]} size={0.2} />
              <Box color="gray" ref={posBoxRef} size={0.2} />
              <Boxes positions={trainingData} />
            </mesh>
          </group>
        </>
      ) : (
        "Error"
      )}
    </>
  );
};
