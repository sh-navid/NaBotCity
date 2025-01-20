import { RigidBody } from "@react-three/rapier";
import { useRef, useEffect, createRef, useState } from "react";
import { FixedJoint, Motor, Part, RevoluteJoint } from "./Part";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

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

  useFrame(() => {
    FollowJoint.forEach((joint) => {
      try {
        const part1 = PartRef.current[joint.part1]?.current;
        const part2 = PhysicsRef.current[joint.part2]?.current;

        if (!part1 || !part2) {
          return;
        }

        const worldPosition = new THREE.Vector3();
        part1.getWorldPosition(worldPosition);

        part2.wakeUp();
        part2.setTranslation(
          { x: worldPosition.x, y: worldPosition.y, z: worldPosition.z },
          true
        );

        const worldQuaternion = new THREE.Quaternion();
        part1.getWorldQuaternion(worldQuaternion);

        if (part2.setRotation) {
          part2.setRotation({
            x: worldQuaternion.x,
            y: worldQuaternion.y,
            z: worldQuaternion.z,
            w: worldQuaternion.w,
          });
        }
      } catch (error) {
        console.error("Error updating positions and rotations:", error);
      }
    });
  });

  let front = 2;

  const Parts = [
    {
      model: "Group",
      position: [front, 0, 0],
      physics: null,
      uid: "Front",
      parts: [
        {
          model: "Base1",
          position: [0, 0, 0],
          physics: { colliders: "trimesh" },
          uid: "FrontBody",
          parts: [],
        },
        {
          model: "Wheel1",
          physics: { colliders: "hull" },
          rotation: [Math.PI / 2, 0, 0],
          position: [0, 0, -1.5],
          uid: "FrontRightWheel",
        },
        {
          model: "Wheel1",
          physics: { colliders: "hull" },
          rotation: [Math.PI / 2, 0, 0],
          position: [0, 0, 1.5],
          uid: "FrontLeftWheel",
        },
      ],
    },
    // -----------------------------------------
    {
      model: "Group",
      position: [-front, 0, 0],
      physics: null,
      uid: "Rear",
      parts: [
        {
          model: "Base1",
          position: [0, 0, 0],
          physics: { colliders: "trimesh" },
          uid: "RearBody",
          parts: [],
        },
        {
          model: "Wheel1",
          physics: { colliders: "hull" },
          rotation: [Math.PI / 2, 0, 0],
          position: [0, 0, -1.5],
          uid: "RearRightWheel",
        },
        {
          model: "Wheel1",
          physics: { colliders: "hull" },
          rotation: [Math.PI / 2, 0, 0],
          position: [0, 0, 1.5],
          uid: "RearLeftWheel",
        },
      ],
    },
    // -----------------------------------------
    {
      model: "Motor",
      position: [-front, 2, 0],
      rotation: [0, 0, Math.PI / 2],
      physics: { type: "fixed", colliders: "hull" },
      uid: "ArmBase1Motor",
      parts: [
        {
          model: "Base3",
          position: [0.6, 0, 0],
          rotation: [0, 0, -Math.PI / 2],
          physics: null,
          uid: "ArmBase1",
          parts: [
            {
              model: "Motor",
              position: [1.1, 0, 0],
              physics: null,
              uid: "ArmBase1Motor",
              parts: [
                {
                  model: "Base3",
                  position: [0.6, 0, 0],
                  rotation: [0, 0, Math.PI / 2],
                  physics: null,
                  uid: "ArmBase2",
                  parts: [
                    {
                      model: "Motor",
                      position: [1.1, 0, 0],
                      physics: null,
                      uid: "ArmBase2Motor",
                      parts: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  const RevoluteJoints = [
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
    {
      part1: "RearBody",
      anchor1: [0, 0, 0],
      part2: "RearRightWheel",
      anchor2: [0, 0, 0],
    },
    {
      part1: "RearBody",
      anchor1: [0, 0, 0],
      part2: "RearLeftWheel",
      anchor2: [0, 0, 0],
    },
  ];

  const FixedJoints = [
    {
      part1: "RearBody",
      anchor1: [-front, 0, 0],
      part2: "FrontBody",
      anchor2: [front, 0, 0],
    },
  ];

  const FollowJoint = [
    {
      part1: "RearBody",
      part2: "ArmBase1Motor",
    },
  ];

  const PartSelector = ({ part }) => {
    if (part.model === "Group")
      return (
        <group
          key={"group-" + part.uid}
          name={part.model}
          {...part}
          ref={PartRef.current[part.uid]}
        >
          {part.parts && part.parts.length > 0 && renderParts(part.parts)}{" "}
        </group>
      );

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
          restitution={0.1} // bounciness
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

  const [renderFixedJoints, setRenderFixedJoints] = useState(false);

  useEffect(() => {
    const fixedTimeout = setTimeout(() => {
      setRenderFixedJoints(true);
    }, 1000);
    return () => clearTimeout(fixedTimeout);
  }, []);

  return (
    <>
      <group position={position}>{renderParts(Parts)}</group>

      {renderFixedJoints &&
        RevoluteJoints.map((j) => (
          <RevoluteJoint
            part1={PhysicsRef.current[j.part1]}
            part2={PhysicsRef.current[j.part2]}
            part1Anchor={j.anchor1 ?? [0, 0, 0]}
            part2Anchor={j.anchor2 ?? [0, 0, 0]}
            rotationAxis={j.axis ?? [0, 0, 1]}
          />
        ))}

      {renderFixedJoints &&
        FixedJoints.map((j) => (
          <FixedJoint
            part1={PhysicsRef.current[j.part1]}
            part2={PhysicsRef.current[j.part2]}
            part1Anchor={j.anchor1 ?? [0, 0, 0]}
            part2Anchor={j.anchor2 ?? [0, 0, 0]}
          />
        ))}
    </>
  );
};
