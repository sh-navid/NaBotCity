import { useState, useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.js";
import "prismjs/themes/prism-tomorrow.css";
import { Theme } from "../Theme";
import ControlPanel from "./ControlPanel";

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

const JsonPanel = ({ json, onJsonChange, onSendToLLM }) => {
  const [activeTab, setActiveTab] = useState("JsonViewer");
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
  .jpanel-scroll::-webkit-scrollbar {
    width: 8px;
    background: ${Theme.PANEL_BG};
  }
  .jpanel-scroll::-webkit-scrollbar-thumb {
    background: ${Theme.PANEL_BORDER};
    border-radius: 10px;
  }
  .tab-button {
    background: ${Theme.CONTROL_BG};
    color: ${Theme.TEXT_ON_BG};
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: background-color 0.3s;
    border-radius: 5px 5px 0 0;
  }

  .tab-button.active {
    background: ${Theme.PANEL_BG};
    border-bottom: 2px solid ${Theme.CONTROL_ACCENT};
    color: ${Theme.CONTROL_ACCENT};
  }

  .tab-button:hover {
    background: ${Theme.PANEL_BORDER};
  }
  `;

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "400px",
        height: "100%",
        background: Theme.PANEL_BG,
        borderRight: `1.5px solid ${Theme.PANEL_BORDER}`,
        overflow: "auto",
        padding: "14px 13px 7px 15px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
      className="jpanel-scroll"
    >
      <style>{styles}</style>
      <div
        style={{
          display: "flex",
          marginBottom: "10px",
        }}
      >
        <button
          className={`tab-button ${activeTab === "JsonViewer" ? "active" : ""}`}
          onClick={() => setActiveTab("JsonViewer")}
        >
          JsonViewer
        </button>
        <button
          className={`tab-button ${
            activeTab === "PartRotationControl" ? "active" : ""
          }`}
          onClick={() => setActiveTab("PartRotationControl")}
        >
          Robot Control
        </button>
        <button
          className={`tab-button ${activeTab === "PartEditor" ? "active" : ""}`}
          onClick={() => setActiveTab("PartEditor")}
        >
          PartEditor
        </button>
      </div>
      {activeTab === "JsonViewer" && (
        <>
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
              background: Theme.CONTROL_BG,
              color: Theme.TEXT_ON_BG,
              border: isValidJson
                ? `1.3px solid ${Theme.PANEL_BORDER}`
                : `1.3px solid ${Theme.WARNING}`,
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
              document
                .querySelector('textarea[aria-label="JSON Input"]')
                .focus();
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
                color: Theme.TEXT_ON_BG,
                caretColor: Theme.CONTROL_ACCENT,
                fontFamily: "JetBrains Mono,Consolas,monospace",
                minHeight: "250px",
                fontSize: "0.95rem",
              }}
              tabIndex={0}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) =>
                handleChange({ target: { value: e.currentTarget.innerText } })
              }
              spellCheck={false}
            >
              {jsonString}
            </code>
          </pre>
        </>
      )}
      {activeTab === "PartRotationControl" && (
        <ControlPanel partsList={partsList} onSliderChange={handleSlider} />
      )}
      {activeTab === "PartEditor" && <div>Part editor content here</div>}
      <div
        style={{
          display: "flex",
          gap: "6px",
          marginTop: "6px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Type message to LLM..."
          style={{
            flex: 1,
            borderRadius: "8px",
            border: `1.3px solid ${Theme.INPUT_BORDER}`,
            background: Theme.INPUT_BG,
            color: Theme.INPUT_TEXT,
            padding: "7px 9px",
            outline: "none",
            boxShadow: "0 0 2.3px #252525 inset",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            background: Theme.CONTROL_ACCENT,
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "7px 19px",
            cursor: "pointer",
            fontWeight: 600,
            boxShadow: "0 1.7px 8px #5c338a0a",
            fontSize: "1.04em",
            transition: "background 0.12s",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default JsonPanel;