import React, { forwardRef, useMemo } from "react";
import { Endpoints } from "../configs/Endpoints";
import { useGLTF } from "@react-three/drei";

export const Part = forwardRef(({ children, name, position, rotation, scale }, ref) => {
    const { scene, isLoading, error } = useGLTF(Endpoints.Download(name));

    scale = scale ?? [1, 1, 1];
    position = position ?? [0, 0, 0];
    rotation = rotation ?? [0, 0, 0];

    // Avoid unnecessary cloning
    const clonedScene = useMemo(() => {
      return scene ? scene.clone() : null;
    }, [scene]);

    if (isLoading) return null;
    if (error)
      return (
        <mesh position={position} rotation={rotation} scale={scale} ref={ref}>
          <boxBufferGeometry />
          <meshStandardMaterial color="red" />
          {children}
        </mesh>
      );

    return (
      <primitive
        position={position}
        rotation={rotation}
        scale={scale}
        ref={ref}
        object={clonedScene}
      >
        {children}
      </primitive>
    );
  }
);