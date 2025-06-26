/**/
import { useRef, useEffect, createRef } from "react";
import { Part } from "./Part";
// REMOVE import Robot1 from "../json/Robot01.json";

export const Robot = ({ position, robotJson }) => {
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

  const Parts = robotJson ?? []; // <<-- Use the prop

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
          {console.log(JSON.stringify(part))}
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