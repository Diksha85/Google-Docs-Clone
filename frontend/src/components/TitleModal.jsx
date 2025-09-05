import React from "react";
import "../styles/TitleModal.css";

export default function TitleModal({ docTitle, setDocTitle, onSave, onCancel }) {
  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <span className="custom-modal-close" onClick={onCancel}>&times;</span>
        <h2>Enter Document Title</h2>
        <input
          type="text"
          value={docTitle}
          onChange={(e) => setDocTitle(e.target.value)}
          placeholder="Document title"
        />
        <div className="custom-modal-buttons">
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
          <button onClick={onSave} className="save-btn">Save</button>
        </div>
      </div>
    </div>
  );
}
