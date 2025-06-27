import React, { useRef, useEffect, useState } from "react";
import { Theme } from "../Theme";
import Slider from "./Slider";

// --- Utility for smooth slow oscillation --- //
const oscillate = (t, min, max) => {
  // Smooth sine wave between min/max — period about 8 seconds
  return (max + min) / 2 + (max - min) / 2 * Math.sin(t);
};

const OSCILLATION_SPEED = 0.01; // Lower is slower, in radians per frame (try 0.05-0.15)

const ControlPanel = ({ partsList, onSliderChange }) => {
  const sliderMin = -Math.PI /2;
  const sliderMax = Math.PI /2;

  const [autoEnabled, setAutoEnabled] = useState({});
  const aniRefs = useRef({}); // { '<uid>_<axis>': time }

  useEffect(() => {
    let running = true;
    function animate() {
      if (!running) return;
      Object.keys(autoEnabled).forEach((key) => {
        if (autoEnabled[key]) {
          // Slower, smooth: increment time slowly!
          aniRefs.current[key] = (aniRefs.current[key] ?? 0) + OSCILLATION_SPEED;
          // Parse key into uid and axis index
          const [uid, ax] = key.split("_");
          const axis = Number(ax);
          const idx = partsList.findIndex((p) => p.uid === uid);
          const value = oscillate(aniRefs.current[key], sliderMin, sliderMax);
          onSliderChange(idx, axis, value);
        }
      });
      requestAnimationFrame(animate);
    }
    animate();
    return () => {
      running = false;
    };
    // eslint-disable-next-line
  }, [autoEnabled, partsList, onSliderChange]);

  // Only show controllable joints
  const filteredParts = partsList.filter(
    (part) => Array.isArray(part.rotationControl) && part.rotationControl.some(Boolean)
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
      {filteredParts.map((part) => (
        <div
          key={part.uid}
          style={{
            margin: "0.8em 0 .95em 0",
            padding: "12px 12px 10px 12px",
            background: Theme.PANEL_BG,
            borderRadius: "8px",
            border: `1px solid ${Theme.PANEL_BORDER}`,
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
            <span style={{ color: Theme.FAINT, fontSize: ".95em", fontWeight: 450 }}>
              UID:
            </span>
            <span style={{ color: "#e1e1ff", fontWeight: 400, marginLeft: "2px" }}>
              {part.uid}
            </span>
          </div>
          {["X", "Y", "Z"].map((label, axis) =>
            part.rotationControl && part.rotationControl[axis] ? (
              <div key={label} style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  style={{ marginRight: 10, accentColor: Theme.ACCENT || "#70f" }}
                  checked={!!autoEnabled[`${part.uid}_${axis}`]}
                  onChange={(e) => {
                    setAutoEnabled((prev) => ({
                      ...prev,
                      [`${part.uid}_${axis}`]: e.target.checked,
                    }));
                    // Optionally: reset or seed to current value when starting!
                    if (e.target.checked) {
                      // Seed sine phase from current value for smoothness
                      const currentValue = part.rotation?.[axis] ?? 0;
                      // Inverse sine mapping. Clamp to avoid NaN.
                      const vNorm = Math.min(Math.max(
                        (currentValue - (sliderMin + sliderMax) / 2) / ((sliderMax - sliderMin) / 2),
                        -1
                      ), 1);
                      aniRefs.current[`${part.uid}_${axis}`] = Math.asin(vNorm);
                    }
                  }}
                  title="Auto animate this axis"
                />
                <Slider
                  label={label}
                  axis={axis}
                  value={part.rotation?.[axis] ?? 0}
                  onChange={(e) =>
                    onSliderChange(
                      partsList.findIndex((p) => p.uid === part.uid),
                      axis,
                      parseFloat(e.target.value)
                    )
                  }
                  min={sliderMin}
                  max={sliderMax}
                  step={0.01}
                  enabled={part.rotationControl[axis] && !autoEnabled[`${part.uid}_${axis}`]}
                />
              </div>
            ) : null
          )}
        </div>
      ))}
    </div>
  );
};

export default ControlPanel;
