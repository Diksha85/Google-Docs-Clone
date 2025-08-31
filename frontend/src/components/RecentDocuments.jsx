import React from "react";
import "../styles/DocsHome.css";

export default function RecentDocuments({ recentDocs, navigate }) {
  if (recentDocs.length === 0) return <p>No documents yet</p>;

  return (
    <div className="recent-docs-grid">
      {recentDocs.map((doc) => (
        <div
          key={doc._id}
          className="recent-doc-card"
          onClick={() => navigate(`/editor/${doc._id}`)}
        >
          <div className="recent-doc-thumbnail"></div>
          <div className="recent-doc-info">
            <p className="recent-doc-title">{doc.title || "Untitled document"}</p>
            <span className="recent-doc-date">Opened recently</span>
          </div>
        </div>
      ))}
    </div>
  );
}
