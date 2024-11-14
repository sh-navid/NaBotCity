import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Endpoints } from "../configs/Endpoints";
import { RigidBody } from "@react-three/rapier";

export const LoadObject = ({
  endpoint = "",
  initPosition = [0, 0, 0],
  initRotation = [0, 0, 0],
}) => {
  const { scene } = useGLTF(endpoint);

  const clonedScene = useMemo(() => {
    return scene.clone();
  }, [scene]);

  return (
    <primitive
      position={initPosition}
      rotation={initRotation}
      object={clonedScene}
    />
  );
};

export const Walls = () => {
  return <LoadObject endpoint={Endpoints.Download("Walls")} />;
};

export const Floor = () => {
  return (
    <RigidBody type="fixed">
      <LoadObject endpoint={Endpoints.Download("Floor")} />
    </RigidBody>
  );
};

export const Base = ({
  initPosition = [0, 0, 0],
  initRotation = [0, 0, 0],
}) => {
  return (
    <LoadObject
      endpoint={Endpoints.Download("Base")}
      initPosition={initPosition}
      initRotation={initRotation}
    />
  );
};
