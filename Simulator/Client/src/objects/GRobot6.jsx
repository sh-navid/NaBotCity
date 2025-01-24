import * as THREE from "three";
import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { quat, RigidBody } from "@react-three/rapier";
import { useRef, useEffect, createRef, useState } from "react";
import { FixedJoint, Motor, Part, RevoluteJoint } from "./Part";

export const GRobot6 = ({ position }) => {
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

      if (event.key === "a" || event.key === "d") {
        const rbRef = PhysicsRef.current["M_Shaft1"];
        if (rbRef.current) {
          const currentRotationRapier = rbRef.current.rotation();
          const currentRotation = quat(currentRotationRapier);

          const leftRotation = new THREE.Quaternion();
          const angleInRadians = THREE.MathUtils.degToRad(
            event.key === "d" ? 10 : -10
          );
          leftRotation.setFromAxisAngle(
            new THREE.Vector3(1, 0, 0),
            -angleInRadians
          );

          const newRotation = currentRotation.multiply(leftRotation);
          rbRef.current.setNextKinematicRotation(newRotation);
        }
      }

      if (event.key === "w" || event.key === "s") {
        const rbRef = PhysicsRef.current["M_Shaft2"];
        if (rbRef.current) {
          const currentRotationRapier = rbRef.current.rotation();
          const currentRotation = quat(currentRotationRapier);

          const leftRotation = new THREE.Quaternion();
          const angleInRadians = THREE.MathUtils.degToRad(
            event.key === "w" ? 10 : -10
          );
          leftRotation.setFromAxisAngle(
            new THREE.Vector3(1, 0, 0),
            -angleInRadians
          );

          const newRotation = currentRotation.multiply(leftRotation);
          rbRef.current.setNextKinematicRotation(newRotation);
        }
      }

      if (event.key === "m") {
        if (boxRef.current) {
          const currentPosition = boxRef.current.translation();
  
          const forwardVector = new THREE.Vector3(-.1, 0, 0); 
          const rotation = boxRef.current.rotation(); 

          forwardVector.applyEuler(new THREE.Euler(rotation.x, rotation.y, rotation.z));
  
          const newPosition = {
            x: currentPosition.x + forwardVector.x,
            y: currentPosition.y + forwardVector.y,
            z: currentPosition.z + forwardVector.z
          };
  
          boxRef.current.setNextKinematicTranslation(newPosition);
        }
      }
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

  let front = 1.5;

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
      model: "MotorBase",
      position: [0, 0.6, 0],
      rotation: [0, 0, Math.PI / 2],
      physics: {
        type: "kinematicPosition",
        collisionGroups: "",
      },
      uid: "M_Base1",
      parts: [
        {
          model: "MotorShaft",
          scale: [0.9, 0.9, 0.9],
          physics: {
            type: "kinematicPosition",
            collisionGroups: "",
          },
          uid: "M_Shaft1",
          parts: [
            {
              model: "Base3",
              position: [1.1, 0, 0],
              rotation: [0, 0, -Math.PI],
              physics: {
                type: "kinematicPosition",
                collisionGroups: "",
              },
              uid: "M_plate1",
              parts: [
                {
                  model: "MotorBase",
                  position: [0, 0.6, 0],
                  rotation: [0, 0, Math.PI / 2],
                  physics: {
                    type: "kinematicPosition",
                    collisionGroups: "",
                  },
                  uid: "M_Base2",
                  parts: [
                    {
                      model: "MotorShaft",
                      scale: [0.9, 0.9, 0.9],
                      physics: {
                        type: "kinematicPosition",
                        collisionGroups: "",
                      },
                      uid: "M_Shaft2",
                      parts: [
                        {
                          model: "Base3",
                          position: [1.1, 0, 0],
                          rotation: [0, 0, -Math.PI],
                          physics: {
                            type: "kinematicPosition",
                            collisionGroups: "",
                          },
                          uid: "M_plate2",
                          parts: [
                            {
                              model: "MotorBase",
                              position: [0, 0.6, 0],
                              rotation: [0, 0, Math.PI / 2],
                              physics: {
                                type: "kinematicPosition",
                                collisionGroups: "",
                              },
                              uid: "M_Base3",
                              parts: [
                                {
                                  model: "MotorShaft",
                                  scale: [0.9, 0.9, 0.9],
                                  physics: {
                                    type: "kinematicPosition",
                                    collisionGroups: "",
                                  },
                                  uid: "M_Shaft3",
                                  parts: [
                                    {
                                      model: "Base3",
                                      position: [1.1, 0, 0],
                                      rotation: [0, 0, -Math.PI],
                                      physics: {
                                        type: "kinematicPosition",
                                        colliders:"hull"
                                      },
                                      uid: "M_plate3",
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
      part1: "FrontBody",
      part2: "M_Base1",
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
            restitution={0} // Default Bounciness
            colliders={false} // Default value
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
    }, 100);
    return () => clearTimeout(fixedTimeout);
  }, []);

  const boxRef = useRef(null);

  const handleMouseMove = (event) => {
    if (boxRef.current) {
      // Convert mouse position to world coordinates
      const mouseX = (event.clientX / window.innerWidth) * 10; // Normalized device coordinates
      const mouseY = -(event.clientY / window.innerHeight) * 10;

      // Create a vector for the new position
      const newPosition = new THREE.Vector3(mouseX, mouseY, 0); // Z is set to 0 for 2D movement
      boxRef.current.setTranslation(newPosition); // Update the box's position in Rapier
    }
  };


  return (
    <>
      <RigidBody ref={boxRef} type="kinematicPosition" mass={10000000}>
        <Box args={[1, 1, 1]} position={[8, 1, 0]}>
          <meshStandardMaterial color="orange" />
        </Box>
      </RigidBody>

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
