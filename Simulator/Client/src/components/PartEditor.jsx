import React, { useState, useCallback, useEffect } from 'react';
import { Theme } from '../Theme';

const PartEditor = ({ json, onJsonChange }) => {
  const [editedJson, setEditedJson] = useState(JSON.parse(JSON.stringify(json))); // Deep copy

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

      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        inputElement = (
          <input
            type="text"
            style={{
              background: Theme.INPUT_BG,
              color: Theme.INPUT_TEXT,
              border: `1px solid ${Theme.INPUT_BORDER}`,
              borderRadius: '4px',
              padding: '4px',
              margin: '2px 0',
              width: '100%',
              boxSizing: 'border-box',
            }}
            value={value}
            onChange={onChange}
          />
        );
      } else if (Array.isArray(value)) {
        inputElement = (
          <div style={{ display: 'flex', gap: '5px' }}>
            {value.map((item, index) => (
              <input
                key={index}
                type="text"
                style={{
                  background: Theme.INPUT_BG,
                  color: Theme.INPUT_TEXT,
                  border: `1px solid ${Theme.INPUT_BORDER}`,
                  borderRadius: '4px',
                  padding: '4px',
                  margin: '2px 0',
                  width: '100%',
                  boxSizing: 'border-box',
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
          <div key={key} style={{ marginBottom: '8px' }}>
            <label style={{ color: Theme.LABEL_COLOR, fontSize: '0.9em' }}>{key}:</label>
            {inputElement}
          </div>
        );
      }

      return (
        <div key={key} style={{ marginBottom: '8px' }}>
          <label style={{ color: Theme.LABEL_COLOR, fontSize: '0.9em' }}>{key}:</label>
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
          padding: '10px',
          margin: '5px 0',
          border: `1px solid ${Theme.PANEL_BORDER}`,
          borderRadius: '5px',
          background: Theme.CONTROL_BG,
        }}
      >
        {renderInputs(path, part)}
        {part.parts && part.parts.length > 0 && (
          <div style={{ marginLeft: '20px' }}>
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
        margin: "0 0 15px 0",
        padding: "16px 16px 8px 16px",
        borderRadius: "14px",
        border: `1.3px solid ${Theme.PANEL_BORDER}`,
        boxShadow: "0 2.5px 10px #0002",
        height: "100%", // Changed from maxHeight to height
        overflowY: "auto",
        color: Theme.TEXT_ON_BG,
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