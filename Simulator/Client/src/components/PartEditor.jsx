/* */
import React, { useState, useCallback, useEffect } from 'react';
import { Theme } from '../Theme';

const PartEditor = ({ json, onJsonChange }) => {
  const [editedJson, setEditedJson] = useState(JSON.parse(JSON.stringify(json))); // Deep copy
  const [selectedPart, setSelectedPart] = useState(null);
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

  const renderInputs = (part, path) => {
    if (!part) return <div>No part selected.</div>;

    return Object.entries(part).map(([key, value]) => {
      if (key === 'parts') return null;

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

  const renderTree = (part, path = []) => {
    return (
      <li key={part.uid || Math.random()}>
        <button
          onClick={() => setSelectedPart({part:part, path:path})}
          style={{
            background: Theme.HOVER_BG,
            color: Theme.TEXT_ON_BG,
            border: 'none',
            padding: '2px 5px',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            display: 'block',
            borderRadius: '3px',
            fontSize: '.75em',
            ...(selectedPart?.part === part ? { background: Theme.ACTIVE_BG, color: 'white' } : {}),
          }}
        >
          {part.model} ({part.uid})
        </button>
        {part.parts && part.parts.length > 0 && (
          <ul style={{ marginLeft: '10px' }}>
            {part.parts.map((child, index) => {
              const childPath = [...path, 'parts', index];
              return renderTree(child, childPath);
            })}
          </ul>
        )}
      </li>
    );
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
        height: "100%",
        overflowY: "auto",
        color: Theme.TEXT_ON_BG,
        fontSize: '0.8em',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{
        flex: 1,
        overflowY: 'auto',
        marginBottom: '10px',
        padding: '5px',
        border: `1px solid ${Theme.PANEL_BORDER}`,
        borderRadius: '3px',
        background: Theme.PANEL_BG,
      }}>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {Array.isArray(editedJson) ? (
            editedJson.map((part, index) => renderTree(part, [index]))
          ) : (
            renderTree(editedJson, [])
          )}
        </ul>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '5px',
        border: `1px solid ${Theme.PANEL_BORDER}`,
        borderRadius: '3px',
        background: Theme.PANEL_BG,
      }}>
        {selectedPart && renderInputs(selectedPart.part, selectedPart.path)}
        {!selectedPart && <div style={{fontSize: '.85em', color: Theme.FAINT}}>Select a part from the tree to view/edit its properties.</div>}
      </div>
    </div>
  );
};

export default PartEditor;