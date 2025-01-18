import { RigidBody } from "@react-three/rapier";
import { useRef, useEffect, createRef, useState } from "react";
import { FixedJoint, Motor, Part, RevoluteJoint } from "./Part";

export const GRobot6 = ({ position }) => {
  const bodyRef = useRef();
  const PartRef = useRef({});
  const PhysicsRef = useRef({});

  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.setTranslation({
        x: position[0],
        y: position[1],
        z: position[2],
      });
    }
  }, [position]);

  const applyImpulse = (force) => {
    if (PhysicsRef.current) {
      let i = [0, 0, 1];

      PhysicsRef.current["FrontLeftWheel"].current.applyTorqueImpulse({
        x: i[0] * force,
        y: i[1] * force,
        z: i[2] * force,
      });

      PhysicsRef.current["FrontRightWheel"].current.applyTorqueImpulse({
        x: i[0] * force,
        y: i[1] * force,
        z: i[2] * force,
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      PhysicsRef.current["FrontLeftWheel"].current?.wakeUp();
      PhysicsRef.current["FrontRightWheel"].current?.wakeUp();
      if (event.key === "ArrowUp") {
        applyImpulse(2);
      }
      if (event.key === "ArrowDown") {
        applyImpulse(-2);
      }

      // if (event.key === "r") {
      //   objectRef.current?.wakeUp();
      //   objectRef.current.setTranslation({ x: 0, y: 5, z: 0 }, true); // Wake the body after setting position
      // }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const Parts = [
    {
      model: "Base1",
      position: [0, 0, 0],
      physics: { colliders: "hull" },
      uid: "FrontBody",
      parts: [],
    },
    {
      model: "Wheel1",
      physics: { colliders: "hull" },
      rotation: [Math.PI / 2, 0, 0],
      position: [0, 0, -2],
      uid: "FrontRightWheel",
    },
    {
      model: "Wheel1",
      physics: { colliders: "hull" },
      rotation: [Math.PI / 2, 0, 0],
      position: [0, 0, 2],
      uid: "FrontLeftWheel",
    },
  ];

  const Joints = [
    {
      part1: "FrontBody",
      anchor1: [0, 0, 0],
      part2: "FrontRightWheel",
      anchor2: [0, 0, 0],
    },
    {
      part1: "FrontBody",
      anchor1: [0, 0, 0],
      part2: "FrontLeftWheel",
      anchor2: [0, 0, 0],
    },
  ];

  const PartSelector = ({ part }) => {
    return (
      <>
        {part.model === "Motor" ? (
          <Motor
            key={"part-" + part.uid}
            name={part.model}
            {...part}
            angle={angle}
            ref={PartRef.current[part.uid]}
          >
            {part.parts && part.parts.length > 0 && renderParts(part.parts)}{" "}
          </Motor>
        ) : (
          <Part
            key={"part-" + part.uid}
            name={part.model}
            {...part}
            ref={PartRef.current[part.uid]}
          >
            {part.parts && part.parts.length > 0 && renderParts(part.parts)}{" "}
          </Part>
        )}
      </>
    );
  };

  const renderParts = (parts) => {
    return parts.map((part) => {
      if (!PhysicsRef.current[part.uid]) {
        PhysicsRef.current[part.uid] = createRef();
      }
      if (!PartRef.current[part.uid]) {
        PartRef.current[part.uid] = createRef();
      }

      if (part.physics) {
        return (
          <RigidBody
            key={"rigidbody-" + part.uid}
            {...part.physics}
            ref={PhysicsRef.current[part.uid]}
          >
            <PartSelector part={part} />
          </RigidBody>
        );
      } else {
        return <PartSelector part={part} />;
      }
    });
  };

  return (
    <>
      <group position={position}>{renderParts(Parts)}</group>
      {Joints.map((j) => (
        <RevoluteJoint
          part1={PhysicsRef.current[j.part1]}
          part2={PhysicsRef.current[j.part2]}
          part1Anchor={j.anchor1 ?? [0, 0, 0]}
          part2Anchor={j.anchor2 ?? [0, 0, 0]}
          rotationAxis={j.axis ?? [0, 0, 1]}
        />
      ))}
    </>
  );
};
