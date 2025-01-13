import { Json } from "../utils/Json";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import { Endpoints } from "../configs/Endpoints";
import { RobotHelper } from "../helpers/RobotHelper";
import { Constraints } from "../configs/Constraints";
import { TextObject } from "../components/TextObject";
import { useEffect, useMemo, useRef, useState } from "react";

const _robotHelper = new RobotHelper(Constraints);

export const HRobot = ({
  name = "HRobot16",
  initPosition = [0, 0, 0],
  isManual = false,
}) => {
  const roboRef = useRef(null);
  const [data, setData] = useState(null);
  const [a, setA] = useState([0, 0, 0, 0]);
  const [position, setPosition] = useState(initPosition);
  const { scene, isLoading, error } = useGLTF(Endpoints.Download(name));

  const rbRef = useRef(null);
  const meshRef = useRef(null);

  useEffect(() => {
    let x = Json.clone(position);

    const handleKeyDown = (event) => {
      if (!isManual) return;
      switch (event.key) {
        case "q":
          a[0] += Math.PI / 4;
          setA(a);
          break;
        case "a":
          a[0] = 0;
          setA(a);
          break;
        case "z":
          a[0] -= Math.PI / 4;
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

  useFrame(() => {
    if (meshRef.current) {
      const obj = meshRef.current.getObjectByName("Robot-Body-Upper");

      let mv = 0.05;

      if (obj) {
        if (obj.rotation.y + mv < a[0]) obj.rotation.y += mv;
        else if (obj.rotation.y - mv > a[0]) obj.rotation.y -= mv;
        else obj.rotation.y = a[0];

        if (rbRef.current) {
          console.log(rbRef.current)
          rbRef.current.setRotation(obj);

          // rbRef.current.applyImpulse(
          // rbRef.current.applyTorqueImpulse(
          //   {
          //     x: 0,
          //     y: 1,
          //     z: 0,
          //   },
          //   true
          // );
        }
      }
    }
  });

  useMemo(() => {
    setData(scene.clone());
  }, [scene]);

  useEffect(() => {
    _robotHelper.resetArmA(data);
  }, [data]);

  // Foot4-A-Left

  return (
    <>
      {!isLoading && !error && data != null ? (
        <>
          <group position={initPosition} ref={roboRef}>
            <TextObject position={[0, 0.5, 1.5]}>{name}</TextObject>

            <RigidBody
              mass={100}
              ref={rbRef}
              restitution={0.1}
              colliders={"hull"}
              position={[0, 5, 0]}
              type="kinematic"
              // enabled={["Foot4-A-Left","Foot4-A-Right"]}
            >
              <primitive ref={meshRef} object={data} />
            </RigidBody>
          </group>

          {/* <RigidBody ref={rbRef} type="kinematic">
            <Box position={[0, 5, 0]} args={[1, 1, 1]} />
          </RigidBody> */}
          {/* <RigidBody type="fixed">
            <Box position={[0, 0, 0]} args={[5, 1, 5]} />
          </RigidBody> */}
        </>
      ) : (
        "Error"
      )}
    </>
  );
};
