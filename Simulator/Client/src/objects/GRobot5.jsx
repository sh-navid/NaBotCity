import { RigidBody } from "@react-three/rapier";
import { useRef, useEffect, useState, createRef } from "react";
import { FixedJoint, Part, RevoluteJoint } from "./Part";

export const GRobot5 = ({ position }) => {
  const bodyRef = useRef();
  const objectRef = useRef();

  // Initialize the car and wheels
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.setTranslation({
        x: position[0], // Red
        y: position[1], // Yellow UP
        z: position[2], // Blue
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

  // Example of applying impulse on key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp") {
        PhysicsRef.current["FrontLeftWheel"].current?.wakeUp();
        applyImpulse(2); // Adjust force as needed
      }
      if (event.key === "ArrowDown") {
        PhysicsRef.current["FrontRightWheel"].current?.wakeUp();
        applyImpulse(-2); // Adjust force as needed
      }

      if (event.key === "r") {
        objectRef.current?.wakeUp();
        objectRef.current.setTranslation({ x: 0, y: 5, z: 0 }, true); // Wake the body after setting position
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const PhysicsRef = useRef({});
  const PartRef = useRef({});
  const Sketch = {
    group1: {
      position: [2.2, 0, 0],
      children: [
        {
          model: "Base2",
          physics: {},
          uid: "FrontBody",
          joint: {
            type: "Fixed",
            body: "RearBody",
            anchor: [-2.2, 0, 0],
            bodyAnchor: [2.2, 0, 0],
          },
        },
        {
          model: "Wheel1",
          physics: { colliders: "hull" },
          rotation: [Math.PI / 2, 0, 0],
          position: [0, 0, 1.35],
          uid: "FrontLeftWheel",
          joint: {
            type: "Revolute",
            body: "FrontBody",
            axis: [0, 0, 1],
          },
        },
        {
          model: "Wheel1",
          physics: { colliders: "hull" },
          rotation: [Math.PI / 2, 0, 0],
          position: [0, 0, -1.35],
          uid: "FrontRightWheel",
          joint: {
            type: "Revolute",
            body: "FrontBody",
            axis: [0, 0, 1],
          },
        },
      ],
    },
    group3: {
      position: [-2.2, 0, 0],
      children: [
        {
          model: "Base3",
          physics: {},
          uid: "RearBody",
        },
        {
          model: "Wheel1",
          physics: { colliders: "hull" },
          rotation: [Math.PI / 2, 0, 0],
          position: [0, 0, 1.35],
          uid: "RearLeftWheel",
          joint: {
            type: "Revolute",
            body: "RearBody",
            axis: [0, 0, 1],
          },
        },
        {
          model: "Wheel1",
          physics: { colliders: "hull" },
          rotation: [Math.PI / 2, 0, 0],
          position: [0, 0, -1.35],
          uid: "RearRightWheel",
          joint: {
            type: "Revolute",
            body: "RearBody",
            axis: [0, 0, 1],
          },
        },
      ],
    },
  };

  console.log(PartRef, "");

  return (
    <>
      <group position={position}>
        {Object.keys(Sketch).map((group) => {
          Sketch[group].children.map((x) => {
            if (!PhysicsRef.current[x.uid]) {
              PhysicsRef.current[x.uid] = createRef();
            }
            if (!PartRef.current[x.uid]) {
              PartRef.current[x.uid] = createRef();
            }
          });
        })}

        {Object.keys(Sketch).map((group) => {
          return (
            <>
              <group position={Sketch[group].position ?? [0, 0, 0]}>
                {Sketch[group].children.map((x) => {
                  return x.physics ? (
                    <RigidBody
                      key={"rigidbody-" + x.uid}
                      {...x.physics}
                      ref={PhysicsRef.current[x.uid]}
                    >
                      <Part
                        key={"part-" + x.uid}
                        name={x.model}
                        {...x}
                        ref={PartRef.current[x.uid]}
                      />
                    </RigidBody>
                  ) : (
                    <Part
                      key={"part-" + x.uid}
                      name={x.model}
                      {...x}
                      ref={PartRef.current[x.uid]}
                    />
                  );
                })}
              </group>
            </>
          );
        })}

        {Object.keys(Sketch).map((group) => {
          return Sketch[group].children.map((x) => {
            return x.joint ? (
              x.joint.type === "Revolute" ? (
                <RevoluteJoint
                  part1={PhysicsRef.current[x.joint.body]}
                  part2={PhysicsRef.current[x.uid]}
                  part1Anchor={x.joint.bodyAnchor ?? [0, 0, 0]}
                  part2Anchor={x.joint.anchor ?? [0, 0, 0]}
                  rotationAxis={x.joint.axis}
                />
              ) : (
                <FixedJoint
                  part1={PhysicsRef.current[x.joint.body]}
                  part2={PhysicsRef.current[x.uid]}
                  part1Anchor={x.joint.bodyAnchor ?? [0, 0, 0]}
                  part2Anchor={x.joint.anchor ?? [0, 0, 0]}
                />
              )
            ) : null;
          });
        })}
      </group>

      <group>
        {/* 
          <FixedJoint
            body={bodyRef}
            wheel={bodyRef2}
            body1Anchor={[0, 0, 0]}
            body2Anchor={[3, 0, 0]}
          /> 
        */}
      </group>
    </>
  );
};
