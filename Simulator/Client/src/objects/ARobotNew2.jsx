import { useRef, useEffect, createRef } from "react";
import { Part } from "./Part";

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
            rotation: [0, .2 /* Change */, 0],
            scale: [0.9, 0.9, 0.9],
            uid: "S" + index,
            parts: [
              {
                model: "Motor2",
                position: [0, 1.2, 0],
                uid: "XM" + index,
                parts: [
                  {
                    model: "Shaft2",
                    position: [0, 0, 0],
                    rotation: [0, 0, 1 /* Change */],
                    scale: [0.9, 0.9, 0.9],
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
      parts: MCount(4),
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
          {part.parts && part.parts.length > 0 && renderParts(part.parts)}
        </group>
      );

    return (
      <>
        <Part
          key={"part-" + part.uid}
          name={part.model}
          {...part}
          ref={PartRef.current[part.uid]}
        >
          {part.parts && part.parts.length > 0 && renderParts(part.parts)}
        </Part>
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

  return (
    <>
      <group position={position}>{renderParts(Parts)}</group>
    </>
  );
};
