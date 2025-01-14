import { forwardRef, useEffect, useRef } from "react";
import { Endpoints } from "../configs/Endpoints";
import { useGLTF } from "@react-three/drei";

export const Part = forwardRef(
  ({ children, name, position, rotation }, ref) => {
    const { scene, isLoading, error } = useGLTF(Endpoints.Download(name));

    if (isLoading) return null;
    if (error)
      return (
        <mesh position={position} rotation={rotation} ref={ref}>
          <boxBufferGeometry />
          <meshStandardMaterial color="red" />
          {children}
        </mesh>
      );

    return (
      <primitive
        position={position}
        rotation={rotation}
        ref={ref}
        object={scene.clone()}
      >
        {children}
      </primitive>
    );
  }
);

export const Motor = ({ children, position, rotation, angle }) => {
  const motorRef = useRef();
  const shaftRef = useRef();

  useEffect(() => {
    if (motorRef.current) {
      const shaft = motorRef.current.getObjectByName("Shaft");
      if (shaft) {
        shaft.rotation.x = angle;
        if (shaftRef.current) {
          shaft.add(shaftRef.current);
        }
      }
    }
  }, [angle, children]);

  return (
    <Part name={"Motor"} position={position} rotation={rotation} ref={motorRef}>
      <group ref={shaftRef}>{children}</group>
    </Part>
  );
};
