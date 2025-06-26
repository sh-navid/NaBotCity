import { useState, useEffect } from "react";

const JsonPanel = ({ json, onJsonChange, onSendToLLM }) => {
  const [jsonString, setJsonString] = useState(JSON.stringify(json, null, 2));
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setJsonString(JSON.stringify(json, null, 2));
  }, [json]);

  const handleChange = (event) => {
    try {
      const parsedJson = JSON.parse(event.target.value);
      setJsonString(event.target.value);
      onJsonChange(parsedJson);
    } catch (error) {
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
        width: "300px",
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
          flex: 1,
          width: "100%",
          resize: "none",
          backgroundColor: "#353535",
          color: "white",
          border: "none",
          borderRadius: ".5rem",
          height: "100%",
          minHeight: 0,
        }}
      />
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