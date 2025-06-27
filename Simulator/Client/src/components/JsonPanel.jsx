/**/
import { useState, useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/themes/prism-tomorrow.css";

function getAllPartsWithUid(json) {
  let result = [];
  function recur(parts, path = []) {
    if (!parts) return;
    parts.forEach((part, idx) => {
      if (part.uid && Array.isArray(part.rotationControl)) {
        result.push({ ...part, path: [...path, idx] });
      }
      if (Array.isArray(part.parts)) {
        recur(part.parts, [...path, idx, "parts"]);
      }
    });
  }
  if (Array.isArray(json)) recur(json);
  else if (typeof json === "object" && json !== null) recur([json]);
  return result;
}

const PANEL_BG = "#212121";
const PANEL_BORDER = "#323232";
const CONTROL_BG = "#232323";
const CONTROL_ACCENT = "#a259e6";
const LABEL_COLOR = "#ece8f8";
const FAINT = "#ababab";
const SLIDER_COL = "#424242";
const SLIDER_BG = "#292929";
const TEXT_ON_BG = "#efebfd";

const JsonPanel = ({ json, onJsonChange, onSendToLLM }) => {
  const [jsonString, setJsonString] = useState(JSON.stringify(json, null, 2));
  const [inputValue, setInputValue] = useState("");
  const [isValidJson, setIsValidJson] = useState(true);
  const codeRef = useRef(null);
  const [partsList, setPartsList] = useState([]);

  useEffect(() => {
    setJsonString(JSON.stringify(json, null, 2));
    setPartsList(getAllPartsWithUid(json));
  }, [json]);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [jsonString]);

  const handleChange = (event) => {
    setJsonString(event.target.value);
    try {
      const parsedJson = JSON.parse(event.target.value);
      setIsValidJson(true);
      onJsonChange(parsedJson);
    } catch (error) {
      setIsValidJson(false);
    }
  };

  const handleInputChange = (event) => setInputValue(event.target.value);
  const handleSend = () => {
    if (onSendToLLM && inputValue.trim()) {
      onSendToLLM(inputValue);
      setInputValue("");
    }
  };
  const handleInputKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSlider = (partIndex, axis, value) => {
    const jsonCopy = JSON.parse(JSON.stringify(json));
    const partData = partsList[partIndex];
    const path = partData.path;
    let currentPart = jsonCopy;
    for (let i = 0; i < path.length - 1; i++) {
      currentPart = currentPart[path[i]];
    }
    const partIdx = path[path.length - 1];
    let rotation = currentPart[partIdx].rotation
      ? [...currentPart[partIdx].rotation]
      : [0, 0, 0];
    rotation[axis] = value;
    currentPart[partIdx].rotation = rotation;
    setJsonString(JSON.stringify(jsonCopy, null, 2));
    onJsonChange(jsonCopy);
  };

  const styles = `
  .jpanel-slider {
    width: 100%;
    accent-color: ${CONTROL_ACCENT};
    background: transparent;
    height: 24px;
    margin: 0 9px;
    border-radius: 4px;
  }
  .jpanel-slider::-webkit-slider-thumb {
    background: ${CONTROL_ACCENT};
    border: 1px solid ${PANEL_BORDER};
    border-radius: 50%;
    width: 20px;
    height: 20px;
    appearance: none;
    cursor: pointer;
  }
  .jpanel-slider::-webkit-slider-runnable-track {
    background: ${SLIDER_BG};
    height: 8px;
    border-radius: 4px;
  }
  .jpanel-slider::-moz-range-thumb {
    background: ${CONTROL_ACCENT};
    border: 1px solid ${PANEL_BORDER};
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .jpanel-slider::-moz-range-track {
    background: ${SLIDER_BG};
    height: 8px;
    border-radius: 4px;
  }
  .jpanel-slider:focus {
    outline: 1.5px solid ${CONTROL_ACCENT};
  }
  .jpanel-scroll::-webkit-scrollbar {
    width: 8px;
    background: ${PANEL_BG};
  }
  .jpanel-scroll::-webkit-scrollbar-thumb {
    background: ${PANEL_BORDER};
    border-radius: 10px;
  }
  `;

  const sliderMin = -Math.PI * 2;
  const sliderMax = Math.PI * 2;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "400px",
        height: "100%",
        background: PANEL_BG,
        borderRight: `1.5px solid ${PANEL_BORDER}`,
        overflow: "auto",
        padding: "14px 13px 7px 15px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
      className="jpanel-scroll"
    >
      <style>{styles}</style>
      <div style={{
        background: CONTROL_BG,
        margin: "0 0 15px 0",
        padding: "16px 16px 8px 16px",
        borderRadius: "14px",
        border: `1.3px solid ${PANEL_BORDER}`,
        boxShadow: "0 2.5px 10px #0002",
        maxHeight: "260px",
        overflowY: "auto",
        color: TEXT_ON_BG
      }}>
        <div style={{
          color: LABEL_COLOR, fontSize: "1.06rem", fontWeight: 550
        }}>Parts Rotation Control</div>
        <div style={{
            borderTop: `1px solid ${PANEL_BORDER}`,
            margin: "9px 0 8px 0"
        }} />
        {partsList.length === 0 && (
          <div style={{ color: FAINT, marginTop: 6, fontSize: ".99rem" }}>
            No robot parts found.
          </div>
        )}
        {partsList.map((part, i) => (
          <div key={part.uid} style={{
            margin: "0.8em 0 .95em 0",
            padding: "12px 12px 10px 12px",
            background: PANEL_BG,
            borderRadius: "8px",
            border: `1px solid ${PANEL_BORDER}`,
            boxShadow: "none",
          }}>
            <div style={{
              color: LABEL_COLOR, fontWeight: 500, fontSize: "0.96em", marginBottom: "0.6em",
              letterSpacing: ".01em"
            }}>
              <span style={{ color: CONTROL_ACCENT }}>{part.model}</span>
              &nbsp; <span style={{ color: FAINT, fontSize: ".95em", fontWeight: 450 }}>UID:</span>
              <span style={{ color: "#e1e1ff", fontWeight: 400, marginLeft: "2px" }}>{part.uid}</span>
            </div>
            {["X", "Y", "Z"].map((label, axis) =>
              (part.rotationControl && part.rotationControl[axis]) ? (
                <div key={label} style={{
                  margin: "7px 0", display: "flex", alignItems: "center", height: 24
                }}>
                  <span style={{
                    width: "2.3em", color: CONTROL_ACCENT, fontWeight: 600, fontSize: "1em"
                  }}>R{label}</span>
                  <input
                    className="jpanel-slider"
                    type="range"
                    min={sliderMin}
                    max={sliderMax}
                    step={0.01}
                    value={part.rotation?.[axis] ?? 0}
                    onChange={e => handleSlider(i, axis, parseFloat(e.target.value))}
                  />
                  <span style={{
                    minWidth: 48, color: LABEL_COLOR,
                    fontSize: "0.96em", marginLeft: 7, textAlign: 'right'
                  }}>
                    {(part.rotation?.[axis] ?? 0).toFixed(2)}
                  </span>
                </div>
              ) : null
            )}
          </div>
        ))}
      </div>
      <textarea
        value={jsonString}
        onChange={handleChange}
        style={{ display: "none" }}
        aria-label="JSON Input"
      />
      <pre
        className="line-numbers"
        style={{
          flex: 1,
          width: "100%",
          background: CONTROL_BG,
          color: TEXT_ON_BG,
          border: isValidJson ? `1.3px solid ${PANEL_BORDER}` : "1.3px solid #e44f69",
          borderRadius: "0.6rem",
          height: "100%",
          minHeight: 0,
          margin: 0,
          overflow: "auto",
          fontSize: "0.95rem",
          position: "relative",
          boxShadow: "inset 0 2px 9px #21212130",
        }}
        onClick={() => {
          document.querySelector('textarea[aria-label="JSON Input"]').focus();
        }}
        title="Click to edit"
      >
        <code
          ref={codeRef}
          className="language-json"
          style={{
            width: "100%",
            display: "block",
            background: "transparent",
            color: TEXT_ON_BG,
            caretColor: CONTROL_ACCENT,
            fontFamily: "JetBrains Mono,Consolas,monospace",
            minHeight: "250px",
            fontSize: "0.95rem"
          }}
          tabIndex={0}
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => handleChange({ target: { value: e.currentTarget.innerText } })}
          spellCheck={false}
        >
          {jsonString}
        </code>
      </pre>
      <div style={{ display: "flex", gap: "6px", marginTop: "6px", alignItems: 'center' }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Type message to LLM..."
          style={{
            flex: 1,
            borderRadius: "8px",
            border: `1.3px solid ${PANEL_BORDER}`,
            background: CONTROL_BG,
            color: TEXT_ON_BG,
            padding: "7px 9px",
            outline: "none",
            boxShadow: "0 0 2.3px #252525 inset"
          }}
        />
        <button
          onClick={handleSend}
          style={{
            background: CONTROL_ACCENT,
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "7px 19px",
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 1.7px 8px #5c338a0a",
            fontSize: "1.04em",
            transition: "background 0.12s"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default JsonPanel;