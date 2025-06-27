/* */
import React from "react";
import { Theme } from "../Theme";

const Slider = ({ label, axis, value, onChange, min, max, step, enabled }) => {
  const styles = `
  .jpanel-slider {
    width: 100%;
    accent-color: ${Theme.CONTROL_ACCENT};
    background: transparent;
    height: 24px;
    margin: 0 9px;
    border-radius: 4px;
  }
  .jpanel-slider::-webkit-slider-thumb {
    background: ${Theme.CONTROL_ACCENT};
    border: 1px solid ${Theme.PANEL_BORDER};
    border-radius: 50%;
    width: 20px;
    height: 20px;
    appearance: none;
    cursor: pointer;
  }
  .jpanel-slider::-webkit-slider-runnable-track {
    background: ${Theme.SLIDER_BG};
    height: 8px;
    border-radius: 4px;
  }
  .jpanel-slider::-moz-range-thumb {
    background: ${Theme.CONTROL_ACCENT};
    border: 1px solid ${Theme.PANEL_BORDER};
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .jpanel-slider::-moz-range-track {
    background: ${Theme.SLIDER_BG};
    height: 8px;
    border-radius: 4px;
  }
  .jpanel-slider:focus {
    outline: 1.5px solid ${Theme.CONTROL_ACCENT};
  }
  `;

  return (
    <div
      style={{
        margin: "7px 0",
        display: "flex",
        alignItems: "center",
        height: 24,
      }}
    >
      <style>{styles}</style>
      <span
        style={{
          width: "2.3em",
          color: Theme.CONTROL_ACCENT,
          fontWeight: 600,
          fontSize: "1em",
        }}
      >
        R{label}
      </span>
      <input
        className="jpanel-slider"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? 0}
        onChange={onChange}
        disabled={!enabled}
      />
      <span
        style={{
          minWidth: 48,
          color: Theme.LABEL_COLOR,
          fontSize: "0.96em",
          marginLeft: 7,
          textAlign: "right",
        }}
      >
        {(value ?? 0).toFixed(2)}
      </span>
    </div>
  );
};

export default Slider;
