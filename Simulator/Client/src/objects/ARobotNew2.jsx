import * as THREE from "three";
import { Json } from "../utils/Json";
import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { FixedJoint, Motor, Part, RevoluteJoint } from "./Part";
import { quat, RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef, useEffect, createRef, useState, useMemo } from "react";

export const ARobotNew2 = ({ position }) => {
  const bodyRef = useRef();
  const PartRef = useRef({});
  const PhysicsRef = useRef({});

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

      // if (event.key === "a" || event.key === "d") {
      //   const rbRef = PhysicsRef.current["M_Shaft1"];
      //   if (rbRef.current) {
      //     const currentRotationRapier = rbRef.current.rotation();
      //     const currentRotation = quat(currentRotationRapier);

      //     const leftRotation = new THREE.Quaternion();
      //     const angleInRadians = THREE.MathUtils.degToRad(
      //       event.key === "d" ? 10 : -10
      //     );
      //     leftRotation.setFromAxisAngle(
      //       new THREE.Vector3(1, 0, 0),
      //       -angleInRadians
      //     );

      //     const newRotation = currentRotation.multiply(leftRotation);
      //     rbRef.current.setNextKinematicRotation(newRotation);
      //   }
      // }

      // if (event.key === "m") {
      //   if (boxRef.current) {
      //     const currentPosition = boxRef.current.translation();

      //     const forwardVector = new THREE.Vector3(-0.1, 0, 0);
      //     const rotation = boxRef.current.rotation();

      //     forwardVector.applyEuler(
      //       new THREE.Euler(rotation.x, rotation.y, rotation.z)
      //     );

      //     const newPosition = {
      //       x: currentPosition.x + forwardVector.x,
      //       y: currentPosition.y + forwardVector.y,
      //       z: currentPosition.z + forwardVector.z,
      //     };

      //     boxRef.current.setNextKinematicTranslation(newPosition);
      //   }
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

    if (PhysicsRef && PhysicsRef.current) {
      Object.keys(PhysicsRef.current).forEach((name) => {
        try {
          const part1 = PartRef.current[name]?.current;
          const part2 = PhysicsRef.current[name]?.current;

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
    }
  });

  const COUNT = 8;
  const M_POS = 1.12;
  const D_SCALE = 0.9;
  const SPEED = 0.01;

  const [mAngle, setMAngle] = useState(Array(COUNT).fill(0));
  const [xAngle, setXAngle] = useState(Array(COUNT).fill(0));

  const [mTo, setMTo] = useState(Array(COUNT).fill(0));
  const [xTo, setXTo] = useState(Array(COUNT).fill(0));

  const getRnd = () => {
    return (Math.random() * 2 - 1) * Math.PI;
  };

  const updateAngles = (currentAngles, targetAngles) => {
    return currentAngles.map((angle, i) => {
      if (angle + SPEED < targetAngles[i]) {
        return angle + SPEED;
      } else if (angle - SPEED > targetAngles[i]) {
        return angle - SPEED;
      } else {
        return targetAngles[i];
      }
    });
  };

  useEffect(() => {
    const interval1 = setInterval(async () => {
      setMAngle((prevMAngle) => updateAngles(Json.clone(prevMAngle), mTo));
      setXAngle((prevXAngle) => updateAngles(Json.clone(prevXAngle), xTo));
    }, 30);

    for (let i = 0; i < COUNT; i++) {
      if (mAngle[i] === mTo[i]) {
        mTo[i] = getRnd();
        setMTo(mTo);
      }
      if (xAngle[i] === xTo[i]) {
        xTo[i] = getRnd();
        setMTo(xTo);
      }
    }

    return () => {
      clearInterval(interval1);
    };
  }, []);

  const M = (index, parts = [], y = 0) => {
    return [
      {
        model: "Motor1",
        position: [0, y, 0],
        physics: { type: "kinematicPosition" },
        uid: "M" + index,
        parts: [
          {
            model: "Shaft1",
            position: [0, -0.2, 0],
            rotation: [0, mAngle[index], 0],
            scale: [D_SCALE, D_SCALE, D_SCALE],
            physics: { type: "kinematicPosition" },
            uid: "S" + index,
            parts: [
              {
                model: "Motor2",
                position: [0, M_POS, 0],
                physics: { type: "kinematicPosition" },
                uid: "XM" + index,
                parts: [
                  {
                    model: "Shaft2",
                    position: [0, 0, 0],
                    rotation: [0, 0, xAngle[index]],
                    scale: [D_SCALE, D_SCALE, D_SCALE],
                    physics: { type: "kinematicPosition" },
                    uid: "XS" + index,
                    parts: parts,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];
  };

  const MCount = (index, parts = [], y = 1) => {
    if (index > 0) {
      return MCount(index - 1, M(index, parts, y), y);
    } else {
      return M(0, parts, 0.2);
    }
  };

  const Parts = [
    {
      model: "Body3",
      position: [0, 0.5, 0],
      physics: null,
      uid: "Base",
      parts: MCount(COUNT),
    },
  ];

  const RevoluteJoints = [
    // {
    //   part1: "FrontBody",
    //   anchor1: [0, 0, 0],
    //   part2: "FrontRightWheel",
    //   anchor2: [0, 0, 0],
    // },
    // {
    //   part1: "FrontBody",
    //   anchor1: [0, 0, 0],
    //   part2: "FrontLeftWheel",
    //   anchor2: [0, 0, 0],
    // },
    // {
    //   part1: "RearBody",
    //   anchor1: [0, 0, 0],
    //   part2: "RearRightWheel",
    //   anchor2: [0, 0, 0],
    // },
    // {
    //   part1: "RearBody",
    //   anchor1: [0, 0, 0],
    //   part2: "RearLeftWheel",
    //   anchor2: [0, 0, 0],
    // },
  ];

  const FixedJoints = [
    // {
    //   part1: "RearBody",
    //   anchor1: [-front, 0, 0],
    //   part2: "FrontBody",
    //   anchor2: [front, 0, 0],
    // },
  ];

  const FollowJoint = [
    // {
    //   part1: "FrontBody",
    //   part2: "M_Base1",
    // },
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
          {part.parts && part.parts.length > 0 && renderParts(part.parts)}
        </group>
      );

    return (
      <>
        {part.model === "Motor" ? (
          <Motor
            key={"part-" + part.uid}
            name={part.model}
            {...part}
            ref={PartRef.current[part.uid]}
          >
            {part.parts && part.parts.length > 0 && renderParts(part.parts)}
          </Motor>
        ) : (
          <Part
            key={"part-" + part.uid}
            name={part.model}
            {...part}
            ref={PartRef.current[part.uid]}
          >
            {part.parts && part.parts.length > 0 && renderParts(part.parts)}
          </Part>
        )}
      </>
    );
  };

  const renderParts = (parts) => {
    return parts.map((part) => {
      if (!PartRef.current[part.uid]) {
        PartRef.current[part.uid] = createRef();
      }

      return (
        <>
          <PartSelector part={part} />
        </>
      );
    });
  };

  const renderPhysics = (parts) => {
    return parts.map((part) => {
      if (!PhysicsRef.current[part.uid]) {
        PhysicsRef.current[part.uid] = createRef();
      }

      return (
        <>
          {part.physics && (
            <RigidBody
              {...part.physics}
              position={part.position ?? [0, 0, 0]}
              rotation={part.rotation ?? [0, 0, 0]}
              scale={part.scale ?? [1, 1, 1]}
              colliders={false}
              key={"rb-" + part.uid}
              type="kinematicPosition"
              ref={PhysicsRef.current[part.uid]}
            >
              <CuboidCollider args={[0.15, 0.15, 0.15]} />
            </RigidBody>
          )}
          {part.parts && part.parts.length > 0 && renderPhysics(part.parts)}
        </>
      );
    });
  };

  const [renderFixedJoints, setRenderFixedJoints] = useState(false);

  useEffect(() => {
    const fixedTimeout = setTimeout(() => {
      setRenderFixedJoints(true);
    }, 100);
    return () => clearTimeout(fixedTimeout);
  }, []);

  const physicsElements = useMemo(() => renderPhysics(Parts), []);

  return (
    <>
      <RigidBody type="dynamic">
        <Box args={[1, 1, 1]} position={[1, 1, 1]}>
          <meshStandardMaterial color="orange" />
        </Box>
      </RigidBody>

      <RigidBody type="dynamic">
        <Box args={[1, 1, 1]} position={[-1, 1, 1]}>
          <meshStandardMaterial color="orange" />
        </Box>
      </RigidBody>

      <RigidBody type="dynamic">
        <Box args={[1, 1, 1]} position={[1, 1, -1]}>
          <meshStandardMaterial color="orange" />
        </Box>
      </RigidBody>

      <RigidBody type="dynamic">
        <Box args={[1, 1, 1]} position={[-1, 1, -1]}>
          <meshStandardMaterial color="orange" />
        </Box>
      </RigidBody>

      <group position={position}>
        {renderParts(Parts)}
        {physicsElements}
      </group>

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
