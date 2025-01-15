import { forwardRef, useEffect, useMemo, useRef } from "react";
import { Endpoints } from "../configs/Endpoints";
import { useGLTF } from "@react-three/drei";


export const Part = forwardRef(
  ({ children, name, position, rotation }, ref) => {
    const { scene, isLoading, error } = useGLTF(Endpoints.Download(name));

    // Avoid unnecessary cloning
    const clonedScene = useMemo(() => {
      return scene ? scene.clone() : null;
    }, [scene]);

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
        object={clonedScene}
      >
        {children}
      </primitive>
    );
  }
);

export const Motor = ({
  children,
  position,
  rotation,
  angle = 0,
  childScale = 1,
}) => {
  const motorRef = useRef();
  const shaftRef = useRef();

  useEffect(() => {
    if (motorRef.current) {
      const shaft = motorRef.current.getObjectByName("Shaft");
      if (shaft) {
        shaft.rotation.x = angle;

        shaft.scale.set(childScale, childScale, childScale);

        // Check if shaftRef.current is already a child of shaft
        if (shaftRef.current && !shaft.children.includes(shaftRef.current)) {
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
