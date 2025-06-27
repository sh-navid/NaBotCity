import React, { useState, useCallback, useEffect } from 'react';
import { Theme } from '../Theme';

const PartEditor = ({ json, onJsonChange }) => {
  const [editedJson, setEditedJson] = useState(JSON.parse(JSON.stringify(json))); // Deep copy
  const modelOptions = ['Body2', 'JoinPart', 'Joint', 'Motor', 'Shaft', 'Wheel'];

  useEffect(() => {
    setEditedJson(JSON.parse(JSON.stringify(json)));
  }, [json]);

  const handleValueChange = useCallback((path, key, value) => {
    setEditedJson(prevJson => {
      const newJson = JSON.parse(JSON.stringify(prevJson)); // Deep copy
      let current = newJson;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]][key] = value;
      onJsonChange(newJson); // Notify parent component of the change
      return newJson;
    });
  }, [onJsonChange]); // Include onJsonChange in the dependency array

  const renderInputs = (path, part) => {
    return Object.entries(part).map(([key, value]) => {
      if (key === 'parts') return null; // Skip rendering 'parts' here, it will be handled recursively

      let inputElement = null;
      const currentPath = [...path];

      const onChange = (e) => {
        let parsedValue = e.target.value;
        if (typeof value === 'number') {
          parsedValue = parseFloat(e.target.value);
        } else if (typeof value === 'boolean') {
          parsedValue = e.target.value === 'true';
        }
        handleValueChange(currentPath, key, parsedValue);
      };

      if (key === 'model') {
        inputElement = (
          <select
            style={{
              background: Theme.INPUT_BG,
              color: Theme.INPUT_TEXT,
              border: `1px solid ${Theme.INPUT_BORDER}`,
              borderRadius: '3px',
              padding: '2px',
              margin: '1px 0',
              width: '100%',
              boxSizing: 'border-box',
              fontSize: '0.75em',
            }}
            value={value}
            onChange={(e) => {
              handleValueChange(currentPath, key, e.target.value);
            }}
          >
            {modelOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      }
      else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        inputElement = (
          <input
            type="text"
            style={{
              background: Theme.INPUT_BG,
              color: Theme.INPUT_TEXT,
              border: `1px solid ${Theme.INPUT_BORDER}`,
              borderRadius: '3px',
              padding: '2px',
              margin: '1px 0',
              width: '100%',
              boxSizing: 'border-box',
              fontSize: '0.75em',
            }}
            value={value}
            onChange={onChange}
          />
        );
      } else if (Array.isArray(value)) {
        inputElement = (
          <div style={{ display: 'flex', gap: '2px' }}>
            {value.map((item, index) => (
              <input
                key={index}
                type="text"
                style={{
                  background: Theme.INPUT_BG,
                  color: Theme.INPUT_TEXT,
                  border: `1px solid ${Theme.INPUT_BORDER}`,
                  borderRadius: '3px',
                  padding: '2px',
                  margin: '1px 0',
                  width: '100%',
                  boxSizing: 'border-box',
                  fontSize: '0.75em',
                }}
                value={item}
                onChange={(e) => {
                  const newArray = [...value];
                  newArray[index] = parseFloat(e.target.value);
                  handleValueChange(currentPath, key, newArray);
                }}
              />
            ))}
          </div>
        );
      }

      // Conditionally render labels and inputs in the same line for position, rotation, and scale
      if (['position', 'rotation', 'scale'].includes(key)) {
        return (
          <div key={key} style={{ marginBottom: '4px' }}>
            <label style={{ color: Theme.LABEL_COLOR, fontSize: '0.7em' }}>{key}:</label>
            {inputElement}
          </div>
        );
      }

      return (
        <div key={key} style={{ marginBottom: '4px' }}>
          <label style={{ color: Theme.LABEL_COLOR, fontSize: '0.7em' }}>{key}:</label>
          {inputElement}
        </div>
      );
    });
  };

  const renderPart = (part, path) => {
    const currentPath = [...path, part];
    return (
      <div
        key={part.uid || Math.random()}
        style={{
          padding: '5px',
          margin: '2px 0',
          border: `1px solid ${Theme.PANEL_BORDER}`,
          borderRadius: '3px',
          background: Theme.CONTROL_BG,
        }}
      >
        {renderInputs(path, part)}
        {part.parts && part.parts.length > 0 && (
          <div style={{ marginLeft: '10px' }}>
            {part.parts.map((child, index) => {
              const childPath = [...path, 'parts', index];
              return renderPart(child, childPath);
            })}
          </div>
        )}
      </div>
    );
  };

  const handleApplyChanges = () => {
    onJsonChange(editedJson);
  };

  return (
    <div
      style={{
        background: Theme.CONTROL_BG,
        margin: "0 0 10px 0",
        padding: "8px 8px 4px 8px",
        borderRadius: "10px",
        border: `1.3px solid ${Theme.PANEL_BORDER}`,
        boxShadow: "0 1.25px 5px #0002",
        height: "100%", // Changed from maxHeight to height
        overflowY: "auto",
        color: Theme.TEXT_ON_BG,
        fontSize: '0.8em',
      }}
    >
      {Array.isArray(editedJson) ? (
        editedJson.map((part, index) => renderPart(part, [index]))
      ) : (
        renderPart(editedJson, [])
      )}
      {/* <button
        onClick={handleApplyChanges}
        style={{
          background: Theme.CONTROL_ACCENT,
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '8px 16px',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Apply Changes
      </button> */}
    </div>
  );
};

export default PartEditor;