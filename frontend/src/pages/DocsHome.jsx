import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "../styles/DocsHome.css";
import DocsNavbar from "../components/DocsNavbar";
import NewDocumentCard from "../components/NewDocumentCard";
import RecentDocuments from "../components/RecentDocuments";
import ThemeToggle from "../components/ThemeToggle";

export default function DocsHome() {
  const navigate = useNavigate();
  const [recentDocs, setRecentDocs] = useState([]);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (!token) {
      navigate("/");
      return;
    }

    fetch("http://localhost:5000/api/documents", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.documents) setRecentDocs(data.documents);
      })
      .catch((err) => console.error("Failed to load documents:", err));
  }, [navigate]);

  const handleNewDocument = async () => {
    const title = prompt("Enter document title:");
    if (!title) return;

    try {
      const token = Cookies.get("authToken");
      const res = await fetch("http://localhost:5000/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate(`/editor/${data.document._id}`);
      } else {
        alert(data.message || "Failed to create document");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating document");
    }
  };

  return (
    <div className="docs-home">
      <DocsNavbar rightElement={<ThemeToggle />} />

      <div className="docs-content">
        <div className="docs-section">
          <h2 className="docs-section-title">Start a new document</h2>
          <NewDocumentCard handleNewDocument={handleNewDocument} />
        </div>

        <div className="docs-section">
          <h2 className="docs-section-title">Recent Documents</h2>
          <RecentDocuments recentDocs={recentDocs} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}
