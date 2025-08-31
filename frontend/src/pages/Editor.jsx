import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import io from "socket.io-client";
import "../styles/Editor.css";

import DocsNavbar from "../components/DocsNavbar";
import EditorToolbar from "../components/EditorToolbar";
import EditorContent from "../components/EditorContent";

const socket = io("http://localhost:5000", { withCredentials: true });

export default function Editor() {
  const { id, token } = useParams(); // token will exist only for shared links
  const navigate = useNavigate();
  const location = useLocation();

  const [content, setContent] = useState("");
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState("edit");
  const [docId, setDocId] = useState("");
  const [isSharedLink, setIsSharedLink] = useState(false);

  useEffect(() => {
    const sharedMode = location.pathname.startsWith("/share");
    setIsSharedLink(sharedMode);

    if (sharedMode && token) {
      // ✅ Shared link mode (no auth required)
      fetch(`http://localhost:5000/api/documents/share/${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.document) {
            setContent(data.document.content);
            setDocId(data.document._id);
            setRole(data.role || "view"); // role from backend
            setMounted(true);
          } else {
            alert(data?.message || "Invalid or expired link");
            navigate("/");
          }
        })
        .catch((err) => console.error("Error loading shared document:", err));
    } else if (id) {
      // ✅ Normal mode (requires login)
      const authToken = Cookies.get("authToken");
      if (!authToken) {
        localStorage.setItem("redirectAfterLogin", location.pathname);
        navigate("/");
        return;
      }

      fetch(`http://localhost:5000/api/documents/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.document) {
            setContent(data.document.content);
            setDocId(data.document._id);
            setMounted(true);
          } else {
            alert(data?.message || "Document not found");
            navigate("/docs");
          }
        })
        .catch((err) => console.error("Error loading document:", err));
    }
  }, [id, token, location.pathname, navigate]);

  // ✅ Real-time collaboration with Socket.IO
  useEffect(() => {
    if (!docId) return;
    socket.emit("join-document", docId);

    socket.on("receive-changes", (newContent) => setContent(newContent));

    return () => {
      socket.off("receive-changes");
    };
  }, [docId]);

  const handleChange = useCallback(
    (value) => {
      if (role === "view") return; // prevent editing for view-only
      setContent(value);
      socket.emit("send-changes", { docId, content: value });
    },
    [docId, role]
  );

  // ✅ Auto-save every 1.5s
  useEffect(() => {
    if (!content || !docId || role === "view") return;

    const timer = setTimeout(() => {
      const saveUrl = `http://localhost:5000/api/documents/${docId}`;
      const headers = { "Content-Type": "application/json" };
      let body = { content };

      if (isSharedLink && token) {
        body.token = token;
      } else {
        const authToken = Cookies.get("authToken");
        if (!authToken) return;
        headers.Authorization = `Bearer ${authToken}`;
      }

      fetch(saveUrl, {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      }).catch((err) => console.error("Failed to save document:", err));
    }, 1500);

    return () => clearTimeout(timer);
  }, [content, docId, role, isSharedLink, token]);

  const generateCopyLink = () => {
    if (!docId) return "";
    return `${window.location.origin}/share/${docId}`;
  };

  return (
    <div className="editor-page">
      {!isSharedLink && <DocsNavbar />}

      {role !== "view" && !isSharedLink && (
        <EditorToolbar docId={docId} generateCopyLink={generateCopyLink} />
      )}

      {mounted ? (
        <>
          {role === "view" && (
            <p style={{ color: "red", margin: "10px 0" }}>
              This document is view-only. Request edit access from the owner.
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
