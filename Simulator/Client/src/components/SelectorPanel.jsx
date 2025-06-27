/**/
import { useState } from "react";
import { Theme } from "../Theme";

// Define your robots here (add as many as you want)
import Robot1 from "../json/Robot01.json";
import Robot2 from "../json/Robot02.json";
import Robot3 from "../json/Robot03.json";
import Robot4 from "../json/Robot04.json";
import Robot5 from "../json/Robot05.json";

const robotsList = [
  { name: "Robot 1", id: "robot01", data: Robot1 },
  { name: "Robot 2", id: "robot02", data: Robot2 },
  { name: "Robot 3", id: "robot03", data: Robot3 },
  { name: "Robot 4", id: "robot04", data: Robot4 },
  { name: "Robot 5", id: "robot05", data: Robot5 },
];

const panelStyle = {
  position: "absolute",
  right: 0,
  top: 0,
  width: "320px",
  height: "100%",
  background: `${Theme.PANEL_BG}cc`, // semi-transparent if needed
  borderLeft: `1px solid ${Theme.PANEL_BORDER}`,
  boxSizing: "border-box",
  zIndex: 20,
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  overflowY: "auto",
};

export default function SelectorPanel({ onSelect, currentRobot }) {
  const [selectedId, setSelectedId] = useState(
    robotsList.find(
      (r) => JSON.stringify(r.data) === JSON.stringify(currentRobot)
    )?.id || robotsList[0].id
  );

  const handleSelect = (robot) => {
    setSelectedId(robot.id);
    onSelect(robot.data);
  };

  return (
    <div style={panelStyle}>
      <h3 style={{ margin: 0, marginBottom: "1rem", color: Theme.LABEL_COLOR }}>
        Choose Robot
      </h3>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {robotsList.map((robot) => (
          <li
            key={robot.id}
            style={{
              margin: ".5rem 0",
              background:
                selectedId === robot.id ? Theme.ACTIVE_BG : Theme.HOVER_BG,
              color: selectedId === robot.id ? "white" : Theme.TEXT_ON_BG,
              borderRadius: ".5rem",
              boxShadow:
                selectedId === robot.id
                  ? `0 0 6px 1px ${Theme.CONTROL_ACCENT}55`
                  : "none",
              fontWeight: selectedId === robot.id ? 700 : 400,
              padding: ".5rem .75rem",
              cursor: "pointer",
              transition: "background 0.12s",
            }}
            onClick={() => handleSelect(robot)}
          >
            {robot.name}
          </li>
        ))}
      </ul>
      <hr style={{ opacity: 0.2, margin: "1rem 0" }} />
      <div style={{ color: Theme.FAINT, fontSize: ".9rem" }}>
        <strong>Tips:</strong>
        <ul style={{ margin: "0.6rem 1.2rem" }}>
          <li>Edit robot structure in left panel</li>
          <li>Switch robot here anytime</li>
        </ul>
      </div>
    </div>
  );
}