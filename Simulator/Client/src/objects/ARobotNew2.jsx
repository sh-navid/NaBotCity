/* */
import * as THREE from "three";
import { Json } from "../utils/Json";
import { Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { FixedJoint, Motor, Part, RevoluteJoint } from "./Part";
import { useRef, useEffect, createRef, useState, useMemo } from "react";

export const ARobotNew2 = ({ position }) => {
  const bodyRef = useRef();
  const PartRef = useRef({});

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
    // Removed physics application
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Removed physics wakeUp calls
      if (event.key === "ArrowUp") {
        applyImpulse(2);
      }
      if (event.key === "ArrowDown") {
        applyImpulse(-2);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useFrame(() => {
    // Removed physics updates in useFrame
    FollowJoint.forEach((joint) => {
      try {
        const part1 = PartRef.current[joint.part1]?.current;
        const part2 = PartRef.current[joint.part2]?.current; // Changed to PartRef

        if (!part1 || !part2) {
          return;
        }

        const worldPosition = new THREE.Vector3();
        part1.getWorldPosition(worldPosition);

        part2.position.copy(worldPosition); // Direct position update

        const worldQuaternion = new THREE.Quaternion();
        part1.getWorldQuaternion(worldQuaternion);
        part2.quaternion.copy(worldQuaternion); // Direct quaternion update

      } catch (error) {
        console.error("Error updating positions and rotations:", error);
      }
    });
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
        uid: "M" + index,
        parts: [
          {
            model: "Shaft1",
            position: [0, -0.2, 0],
            rotation: [0, mAngle[index], 0],
            scale: [D_SCALE, D_SCALE, D_SCALE],
            uid: "S" + index,
            parts: [
              {
                model: "Motor2",
                position: [0, M_POS, 0],
                uid: "XM" + index,
                parts: [
                  {
                    model: "Shaft2",
                    position: [0, 0, 0],
                    rotation: [0, 0, xAngle[index]],
                    scale: [D_SCALE, D_SCALE, D_SCALE],
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
      uid: "Base",
      parts: MCount(COUNT),
    },
  ];

  const RevoluteJoints = [];
  const FixedJoints = [];
  const FollowJoint = [];

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


  const [renderFixedJoints, setRenderFixedJoints] = useState(false);

  useEffect(() => {
    const fixedTimeout = setTimeout(() => {
      setRenderFixedJoints(true);
    }, 100);
    return () => clearTimeout(fixedTimeout);
  }, []);


  return (
    <>
      <group position={position}>
        {renderParts(Parts)}
      </group>
    </>
  );
};