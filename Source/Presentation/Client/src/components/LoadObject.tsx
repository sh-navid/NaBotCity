import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { Endpoints } from "../configs/Endpoints";

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
  return <LoadObject endpoint={Endpoints.Download("Floor")} />;
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
