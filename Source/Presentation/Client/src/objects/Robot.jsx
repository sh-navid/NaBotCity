import * as THREE from 'three';
import { Json } from "../utils/Json";
import { useFrame } from "@react-three/fiber";
import { Endpoints } from "../configs/Endpoints";
import { Random } from "./../helpers/RandomHelper";
import { RobotHelper } from "../helpers/RobotHelper";
import { Constraints } from "../configs/Constraints";
import { TextObject } from "./../components/TextObject";
import { useEffect, useMemo, useRef, useState } from "react";
import { PerspectiveCamera, useGLTF } from "@react-three/drei";

const _robotHelper = new RobotHelper(Constraints);

export const Robot = ({
  name = "Robot",
  initPosition = [0, 0, 0],
  isManual = false,
}) => {
  const boxRef = useRef(null);
  const roboRef = useRef(null);
  const [data, setData] = useState(null);
  const [a, setA] = useState([0, 0, 0, 0]);
  const [b, setB] = useState([0, 0, 0, 0]);
  const [position, setPosition] = useState(initPosition);
  const { scene, isLoading, error } = useGLTF(Endpoints.Download(name));

  const cameraRef = useRef(null);

  useEffect(() => {
    let x = Json.clone(position);

    const handleKeyDown = (event) => {
      if (!isManual) return;
      switch (event.key) {
        case "ArrowUp":
          x[2] += 2;
          break;
        case "ArrowDown":
          x[2] -= 2;
          break;
        case "ArrowLeft":
          x[0] -= 2;
          break;
        case "ArrowRight":
          x[0] += 2;
          break;

        case "q":
          a[0] += 0.1;
          setA(a);
          break;
        case "a":
          a[0] = 0;
          b[0] = 0;
          setA(a);
          setB(b);
          break;
        case "z":
          a[0] -= 0.1;
          setA(a);
          break;

        case "w":
          a[1] += 0.1;
          setA(a);
          break;
        case "s":
          a[1] = 0;
          b[1] = 0;
          setA(a);
          setB(b);
          break;
        case "x":
          a[1] -= 0.1;
          setA(a);
          break;

        case "e":
          a[2] += 0.1;
          setA(a);
          break;
        case "d":
          a[2] = 0;
          b[2] = 0;
          setA(a);
          setB(b);
          break;
        case "c":
          a[2] -= 0.1;
          setA(a);
          break;

        case "r":
          a[3] += 0.1;
          setA(a);
          break;
        case "f":
          a[3] = 0;
          b[3] = 0;
          setA(a);
          setB(b);
          break;
        case "v":
          a[3] -= 0.1;
          setA(a);
          break;

        case "1":
          b[0] += Math.PI / 4;
          setA(a);
          break;
        case "2":
          b[1] += Math.PI / 4;
          setA(a);
          break;
        case "3":
          b[2] += Math.PI / 4;
          setA(a);
          break;
        case "4":
          b[3] += Math.PI / 4;
          setA(a);
          break;

        default:
          break;
      }

      setPosition(x);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const updateMovements = () => {
    const r1 = roboRef.current;

    const mv = 0.05;

    if (r1.position.x + mv < position[0]) {
      r1.position.x += mv;
    } else if (r1.position.x - mv > position[0]) {
      r1.position.x -= mv;
    }

    if (r1.position.z + mv < position[2]) {
      r1.position.z += mv;
    } else if (r1.position.z - mv > position[2]) {
      r1.position.z -= mv;
    }
  };

  const updateCamera = () => {
    var a = roboRef.current.getObjectByName(`Arm4-A`);
    var b = roboRef.current.getObjectByName(`Arm4-B`);

    if (cameraRef.current && a && b) {
      // Make the camera look at the box
      //cameraRef.current.position.set(a.position[0],a.position[1],a.position[2]);



      const worldPosition = new THREE.Vector3();
      b.getWorldPosition(worldPosition);
      // console.log('World Position:', worldPosition);

      boxRef.current.position.x = worldPosition.x;
      boxRef.current.position.y = worldPosition.y;
      boxRef.current.position.z = worldPosition.z;

      cameraRef.current.position.x = worldPosition.x;
      cameraRef.current.position.y = worldPosition.y;
      cameraRef.current.position.z = worldPosition.z;
      cameraRef.current.lookAt(b.position);
    }
  };

  useFrame(() => {
    updateMovements();

    if (data != null) {
      _robotHelper.moveArmA(data, 1, a[0]);
      _robotHelper.moveArmA(data, 2, a[1]);
      _robotHelper.moveArmA(data, 3, a[2]);
      _robotHelper.moveArmA(data, 4, a[3]);
      _robotHelper.moveArmB(data, 1, b[0]);
      _robotHelper.moveArmB(data, 2, b[1]);
      _robotHelper.moveArmB(data, 3, b[2]);
      _robotHelper.moveArmB(data, 4, b[3]);
    }

    if (!isManual) {
      if (Math.random() < 0.01) {
        let i = Random.getInt(0, 4);
        let p = Random.getInt(-1, 1) * (Math.PI / Random.getInt(1, 6));
        // p = _robotHelper.checkInBound(i + 1, p);
        let tmp = Json.clone(a);
        tmp[i] = p;
        setA(tmp);
      }

      if (Math.random() < 0.01) {
        let i = Random.getInt(0, 5);
        let p = (Random.getInt(-1, 1) * Math.PI) / Random.getInt(1, 6);
        let tmp = Json.clone(b);
        tmp[i] = p;
        setB(tmp);
      }

      if (Math.random() < 0.005) {
        let i = Random.getInt(0, 3);
        let p = Random.getInt(-16, 16);
        let tmp = Json.clone(position);
        tmp[i] = p;
        setPosition(tmp);
      }
    }

    updateCamera();
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
            <TextObject position={[0, 0.5, 1.5]}>{name}</TextObject>
            <primitive object={data} />

            <PerspectiveCamera
              makeDefault={false}
              fov={75}
              position={[1, -0.5, 0]}
              ref={cameraRef}
            />

            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[2, 2, 0.5, 32]} />
              {/* radiusTop, radiusBottom, height, radialSegments */}
              <meshStandardMaterial
                color="green"
                transparent={true}
                opacity={0.2}
              />

              <mesh ref={boxRef} >
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
