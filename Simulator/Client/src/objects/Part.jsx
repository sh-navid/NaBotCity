import { useGLTF } from "@react-three/drei";
import { Endpoints } from "../configs/Endpoints";

export const Part = ({ children, name, position, rotation }) => {
  const { scene, isLoading, error } = useGLTF(Endpoints.Download(name));

  if (isLoading) return null;
  if (error)
    return (
      <mesh position={position} rotation={rotation}>
        <boxBufferGeometry />
        <meshStandardMaterial color="red" />
        {children}
      </mesh>
    );

  return (
    <primitive position={position} rotation={rotation} object={scene.clone()}>
      {children}
    </primitive>
  );
};

export const Motor = ({ children, position, rotation, angle }) => {
  return (
    <Part name={"Motor"} position={position} rotation={rotation}>
      {children}
    </Part>
  );
};
