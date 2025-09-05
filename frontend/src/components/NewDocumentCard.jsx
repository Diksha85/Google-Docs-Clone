import React from "react";
import "../styles/DocsHome.css";

export default function NewDocumentCard({ openTitleModal }) {
  return (
    <div
      className="docs-new-doc"
      onClick={openTitleModal}
      style={{ cursor: "pointer" }}
    >
      <div className="docs-card">
        <span>+</span>
      </div>
      <div className="docs-card-text">Blank document</div>
    </div>
  );
}
