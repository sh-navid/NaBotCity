/**/
import RobotSelectorPanel from "../components/RobotSelectorPanel";
import RobotCanvas from "../components/RobotCanvas";
import JsonPanel from "../components/JsonPanel";
import { useState, useCallback } from "react";
import { Cylinder } from "@react-three/drei";
import Robot1 from "../json/Robot01.json";
import { Robot } from "./Robot";

const Scene = () => {
  const [robotJson, setRobotJson] = useState(Robot1);

  const handleJsonChange = useCallback((updatedJson) => {
    setRobotJson(updatedJson);
  }, []);

  const handleSelectRobot = (robotData) => {
    setRobotJson(robotData);
  };

  return (
    <>
      <JsonPanel
        json={robotJson}
        onJsonChange={handleJsonChange}
      />
      <RobotSelectorPanel onSelect={handleSelectRobot} currentRobot={robotJson} />
      <RobotCanvas camPosition={[15, 15, 15]}>
        <Robot position={[0, 0, 0]} robotJson={robotJson} />
        <Cylinder args={[5.2, 5, 0.5, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="gray" />
        </Cylinder>
      </RobotCanvas>
    </>
  );
};

export default Scene;