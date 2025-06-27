import React from "react";
import { Theme } from "../Theme";
import Slider from "./Slider";

const ControlPanel = ({ partsList, onSliderChange }) => {
  const sliderMin = -Math.PI * 2;
  const sliderMax = Math.PI * 2;

  // Filter to only include parts with at least one true in rotationControl
  const filteredParts = partsList.filter(
    (part) =>
      Array.isArray(part.rotationControl) &&
      part.rotationControl.some(Boolean)
  );

  return (
    <div
      style={{
        background: Theme.CONTROL_BG,
        margin: "0 0 15px 0",
        padding: "16px 16px 8px 16px",
        borderRadius: "14px",
        border: `1.3px solid ${Theme.PANEL_BORDER}`,
        boxShadow: "0 2.5px 10px #0002",
        height: "100%",
        overflowY: "auto",
        color: Theme.TEXT_ON_BG,
      }}
    >
      {filteredParts.length === 0 && (
        <div style={{ color: Theme.FAINT, marginTop: 6, fontSize: ".99rem" }}>
          No controllable robot joints found.
        </div>
      )}
      {filteredParts.map((part, fi) => (
        <div
          key={part.uid}
          style={{
            margin: "0.8em 0 .95em 0",
            padding: "12px 12px 10px 12px",
            background: Theme.PANEL_BG,
            borderRadius: "8px",
            border: `1px solid ${Theme.PANEL_BORDER}`,
            boxShadow: "none",
          }}
        >
          <div
            style={{
              color: Theme.LABEL_COLOR,
              fontWeight: 500,
              fontSize: "0.96em",
              marginBottom: "0.6em",
              letterSpacing: ".01em",
            }}
          >
            <span style={{ color: Theme.CONTROL_ACCENT }}>{part.model}</span>
            &nbsp;
            <span
              style={{ color: Theme.FAINT, fontSize: ".95em", fontWeight: 450 }}
            >
              UID:
            </span>
            <span
              style={{ color: "#e1e1ff", fontWeight: 400, marginLeft: "2px" }}
            >
              {part.uid}
            </span>
          </div>
          {["X", "Y", "Z"].map((label, axis) =>
            part.rotationControl && part.rotationControl[axis] ? (
              <Slider
                key={label}
                label={label}
                axis={axis}
                value={part.rotation?.[axis] ?? 0}
                onChange={(e) =>
                  onSliderChange(
                    // Find the *original* index from partsList for callback
                    partsList.findIndex(p => p.uid === part.uid),
                    axis,
                    parseFloat(e.target.value)
                  )
                }
                min={sliderMin}
                max={sliderMax}
                step={0.01}
                enabled={part.rotationControl[axis]}
              />
            ) : null
          )}
        </div>
      ))}
    </div>
  );
};

export default ControlPanel;
