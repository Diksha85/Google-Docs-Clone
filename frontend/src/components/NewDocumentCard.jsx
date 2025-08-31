import React from "react";
import "../styles/DocsHome.css";

export default function NewDocumentCard({ handleNewDocument }) {
  return (
    <div
      className="docs-new-doc"
      onClick={handleNewDocument}
      style={{ cursor: "pointer" }}
    >
      <div className="docs-card">
        <span>+</span>
      </div>
      <div className="docs-card-text">Blank document</div>
    </div>
  );
}
