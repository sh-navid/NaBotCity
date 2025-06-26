/**/
import RobotCanvas from "../components/RobotCanvas";
import JsonPanel from "../components/JsonPanel";
import { Cylinder } from "@react-three/drei";
import { useState, useCallback } from "react";
import { Robot } from "./Robot";
import Robot1 from "../json/Robot01.json";

const Scene = () => {
  // State holds the JSON robot to use
  const [robotJson, setRobotJson] = useState(Robot1);

  // Update handler: triggered from JsonPanel
  const handleJsonChange = useCallback((updatedJson) => {
    setRobotJson(updatedJson);
  }, []);

  return (
    <>
      <JsonPanel
        json={robotJson}
        onJsonChange={handleJsonChange}
      />
      <RobotCanvas camPosition={[15, 15, 15]}>
        <Robot position={[0, 0, 0]} robotJson={robotJson} />
        <Cylinder
          args={[5.2, 5, 0.5, 32]}
          position={[0, 0, 0]}
        >
          <meshStandardMaterial color="gray" />
        </Cylinder>
      </RobotCanvas>
    </>
  );
};

export default Scene;