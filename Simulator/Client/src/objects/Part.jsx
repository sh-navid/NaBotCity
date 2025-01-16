import React, { forwardRef, useEffect, useMemo, useRef } from "react";
import { Endpoints } from "../configs/Endpoints";
import { useGLTF } from "@react-three/drei";
import { useFixedJoint, useRevoluteJoint } from "@react-three/rapier";

export const Part = forwardRef(
  ({ children, name, position, rotation, scale }, ref) => {
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

/*
@deprecated
*/
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

export const FixedJoint = ({ part1, part2, part1Anchor, part2Anchor }) => {
  useFixedJoint(part1, part2, [
    part1Anchor,
    [0, 0, 0, 1],
    part2Anchor,
    [0, 0, 0, 1],
  ]);

  return null;
};

export const RevoluteJoint = ({
  part1,
  part2,
  part1Anchor,
  part2Anchor,
  rotationAxis,
}) => {
  useRevoluteJoint(part1, part2, [part1Anchor, part2Anchor, rotationAxis]);

  return null;
};