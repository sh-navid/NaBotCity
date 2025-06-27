import { useState, useEffect } from "react";
import cloneDeep from "lodash/cloneDeep";
import { Theme } from "../Theme";

const PartEditor = ({ json, onJsonChange }) => {
  const [editedJson, setEditedJson] = useState(cloneDeep(json));
  const [selectedPath, setSelectedPath] = useState(null);
  const modelOptions = [
    "Body2",
    "JoinPart",
    "Joint",
    "Motor",
    "Shaft",
    "Wheel",
  ];

  useEffect(() => {
    setEditedJson(cloneDeep(json));
  }, [json]);

  const generateUid = () => Math.random().toString(36).slice(2, 10);

  const findPartByPath = (root, path) => {
    let arr = Array.isArray(root) ? root : [root];
    let part = arr[path[0]];
    for (let i = 1; i < path.length; i++) {
      part = part.parts[path[i]];
    }
    return part;
  };

  const handleValueChange = (path, key, value) => {
    setEditedJson((prev) => {
      const next = cloneDeep(prev);
      const part = findPartByPath(next, path);
      part[key] = value;
      onJsonChange(next);
      return next;
    });
  };

  const handleRotationControlChange = (path, index, value) => {
    setEditedJson((prev) => {
      const next = cloneDeep(prev);
      const part = findPartByPath(next, path);
      if (Array.isArray(part.rotationControl)) {
        const newRotationControl = [...part.rotationControl];
        newRotationControl[index] = value;
        part.rotationControl = newRotationControl;
        onJsonChange(next);
      }
      return next;
    });
  };

  const handleAddPart = (mode, path) => {
    setEditedJson((prev) => {
      const next = cloneDeep(prev);
      const newPart = {
        model: "Body2",
        uid: generateUid(),
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        rotationControl: [false, false, false],
        parts: [],
      };
      if (mode === "child") {
        const parent = findPartByPath(next, path);
        parent.parts.push(newPart);
      } else {
        const idx = path[path.length - 1];
        const parentArr =
          path.length === 1
            ? Array.isArray(next)
              ? next
              : next.parts
            : findPartByPath(next, path.slice(0, -1)).parts;
        parentArr.splice(idx + 1, 0, newPart);
      }
      onJsonChange(next);
      return next;
    });
  };

  const renderTree = (part, path = []) => {
    const isSel = JSON.stringify(path) === JSON.stringify(selectedPath);
    return (
      <li key={part.uid} style={{ marginBottom: "2px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            onClick={() => setSelectedPath(path)}
            style={{
              flexGrow: 1,
              fontSize: "0.8em",
              background: isSel ? Theme.ACTIVE_BG : Theme.HOVER_BG,
              color: isSel ? "#fff" : Theme.TEXT_ON_BG,
              border: "none",
              padding: "4px 8px",
              borderRadius: "4px",
              textAlign: "left",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {part.model} ({part.uid})
          </button>
          {isSel && (
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                onClick={() => handleAddPart("child", path)}
                style={{
                  ...buttonStyle,
                  fontSize: "0.7em",
                  padding: "3px 6px",
                }}
              >
                + Child
              </button>
              <button
                onClick={() => handleAddPart("sibling", path)}
                style={{
                  ...buttonStyle,
                  fontSize: "0.7em",
                  padding: "3px 6px",
                }}
              >
                + Sibling
              </button>
            </div>
          )}
        </div>
        {part.parts.length > 0 && (
          <ul style={{ listStyle: "none", paddingLeft: "12px" }}>
            {part.parts.map((c, i) => renderTree(c, [...path, i]))}
          </ul>
        )}
      </li>
    );
  };

  const renderInputs = () => {
    if (!selectedPath)
      return <div style={{ color: Theme.FAINT }}>Select a part...</div>;
    const part = findPartByPath(editedJson, selectedPath);
    return Object.entries(part).map(([k, v]) => {
      if (k === "parts") return null;
      const label = (
        <label style={{ color: Theme.LABEL_COLOR, fontSize: "0.8em" }}>
          {k}:
        </label>
      );
      let inp;

      if (k === "model") {
        inp = (
          <select
            value={v}
            onChange={(e) => handleValueChange(selectedPath, k, e.target.value)}
            style={inputStyle}
          >
            {modelOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        );
      } else if (k === "rotationControl" && Array.isArray(v)) {
        inp = (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {v.map((val, i) => (
              <label
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.75em",
                  color: Theme.LABEL_COLOR,
                }}
              >
                <input
                  type="checkbox"
                  checked={!!val}
                  onChange={(e) =>
                    handleRotationControlChange(
                      selectedPath,
                      i,
                      e.target.checked
                    )
                  }
                  style={{ marginRight: 4 }}
                />
                {["x", "y", "z"][i]}
              </label>
            ))}
          </div>
        );
      } else if (Array.isArray(v)) {
        inp = (
          <div style={{ display: "flex", gap: 2 }}>
            {v.map((val, i) => (
              <input
                key={i}
                type="number"
                value={val}
                onChange={(e) => {
                  const arr = [...v];
                  arr[i] = parseFloat(e.target.value) || 0;
                  handleValueChange(selectedPath, k, arr);
                }}
                style={inputStyle}
              />
            ))}
          </div>
        );
      } else if (typeof v === "boolean") {
        inp = (
          <select
            value={v.toString()}
            onChange={(e) =>
              handleValueChange(selectedPath, k, e.target.value === "true")
            }
            style={inputStyle}
          >
            <option value="true">true</option>
            <option value="false">false</option>
          </select>
        );
      } else {
        inp = (
          <input
            type={typeof v === "number" ? "number" : "text"}
            value={v}
            onChange={(e) => {
              const val =
                typeof v === "number"
                  ? parseFloat(e.target.value) || 0
                  : e.target.value;
              handleValueChange(selectedPath, k, val);
            }}
            style={inputStyle}
          />
        );
      }

      return (
        <div key={k} style={{ marginBottom: 4 }}>
          {label}
          {inp}
        </div>
      );
    });
  };

  return (
    <div style={containerStyle}>
      <div style={treeStyle}>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {Array.isArray(editedJson)
            ? editedJson.map((p, i) => renderTree(p, [i]))
            : renderTree(editedJson, [0])}
        </ul>
      </div>
      {selectedPath && <div style={propsStyle}>{renderInputs()}</div>}
    </div>
  );
};

const buttonStyle = {
  background: Theme.BUTTON_BG,
  color: Theme.BUTTON_TEXT,
  border: "none",
  padding: "2px 5px",
  marginLeft: 5,
  borderRadius: 3,
  fontSize: ".65em",
  cursor: "pointer",
};

const inputStyle = {
  background: Theme.INPUT_BG,
  color: Theme.INPUT_TEXT,
  border: `1px solid ${Theme.INPUT_BORDER}`,
  borderRadius: 3,
  padding: "2px",
  margin: "1px 0",
  width: "100%",
  boxSizing: "border-box",
  fontSize: ".75em",
};

const containerStyle = {
  background: Theme.CONTROL_BG,
  display: "flex",
  flexDirection: "column",
  padding: 8,
  border: `1.3px solid ${Theme.PANEL_BORDER}`,
  borderRadius: 10,
  boxShadow: "0 1.25px 5px #0002",
  height: "100%",
};

const treeStyle = {
  flex: 1,
  overflowY: "auto",
  marginBottom: 10,
  padding: 4,
  border: `1px solid ${Theme.PANEL_BORDER}`,
  borderRadius: 3,
  background: Theme.PANEL_BG,
};

const propsStyle = {
  flex: 1,
  overflowY: "auto",
  padding: 5,
  border: `1px solid ${Theme.PANEL_BORDER}`,
  borderRadius: 3,
  background: Theme.PANEL_BG,
};

export default PartEditor;
