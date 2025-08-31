import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "../styles/Editor.css";

import EditorContent from "../components/EditorContent";

const socket = io("http://localhost:5000", { withCredentials: true });

export default function ShareEditor() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState("");
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState("view");
  const [docId, setDocId] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch(`http://localhost:5000/api/documents/share/${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.document) {
          setContent(data.document.content);
          setDocId(data.document._id);
          setRole(data.role || "view");
          setMounted(true);
        } else {
          alert(data?.message || "Invalid or expired link");
          navigate("/");
        }
      })
      .catch((err) => console.error("Failed to load shared document:", err));
  }, [token, navigate]);

  // ✅ Real-time updates
  useEffect(() => {
    if (!docId) return;
    socket.emit("join-document", docId);
    socket.on("receive-changes", (newContent) => setContent(newContent));
    return () => socket.off("receive-changes");
  }, [docId]);

  const handleChange = useCallback(
    (value) => {
      if (role === "view") return;
      setContent(value);
      socket.emit("send-changes", { docId, content: value });
    },
    [docId, role]
  );

  // ✅ Auto-save for shared document
  useEffect(() => {
    if (!content || role === "view" || !docId) return;

    const timer = setTimeout(() => {
      fetch(`http://localhost:5000/api/documents/${docId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, token }),
      }).catch((err) => console.error("Failed to save shared document:", err));
    }, 1500);

    return () => clearTimeout(timer);
  }, [content, docId, role, token]);

  return (
    <div className="editor-page">
      <h3>Shared Document</h3>
      {mounted ? (
        <>
          {role === "view" && (
            <p style={{ color: "red", margin: "10px 0" }}>
              This is a view-only shared link.
            </p>
          )}
          <EditorContent
            content={content}
            onChange={handleChange}
            readOnly={role === "view"}
          />
        </>
      ) : (
        <p>Loading document...</p>
      )}
    </div>
  );
}
