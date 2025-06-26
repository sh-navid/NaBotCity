/**/
import { useState, useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css"; // You can use any Prism theme you like

const JsonPanel = ({ json, onJsonChange, onSendToLLM }) => {
  const [jsonString, setJsonString] = useState(JSON.stringify(json, null, 2));
  const [inputValue, setInputValue] = useState("");
  const [isValidJson, setIsValidJson] = useState(true);
  const codeRef = useRef(null);

  useEffect(() => {
    setJsonString(JSON.stringify(json, null, 2));
  }, [json]);

  // Highlight on update
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
      // Optionally, handle invalid JSON here
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

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

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "400px",
        height: "100%",
        background: "#212121",
        overflow: "auto",
        padding: "10px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <textarea
        value={jsonString}
        onChange={handleChange}
        style={{
          display: "none",
        }}
        aria-label="JSON Input"
      />
      <pre
        style={{
          flex: 1,
          width: "100%",
          backgroundColor: "#353535",
          color: "white",
          border: isValidJson ? "none" : "1px solid #ff4d4f",
          borderRadius: ".5rem",
          height: "100%",
          minHeight: 0,
          margin: 0,
          overflow: "auto",
          fontSize: ".85rem",
          position: "relative",
        }}
        onClick={() => {
          // Focus hidden textarea for editing
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
      <div style={{ display: "flex", gap: "4px", marginTop: "8px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Type message to LLM..."
          style={{
            flex: 1,
            borderRadius: ".25rem",
            border: "1px solid #444",
            background: "#282828",
            color: "white",
            padding: "4px 8px",
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            background: "#5468ff",
            color: "white",
            border: "none",
            borderRadius: ".25rem",
            padding: "4px 12px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default JsonPanel;