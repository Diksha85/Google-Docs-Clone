import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import io from "socket.io-client";
import "../styles/Editor.css";

import DocsNavbar from "../components/DocsNavbar";
import EditorContent from "../components/EditorContent";
import ConnectionStatus from "../components/ConnectionStatus";
import TitleModal from "../components/TitleModal";
import ReplyModal from "../components/ReplyModal";
import CommentsPanel from "../components/CommentsPanel";
import { exportToPDF } from "../utils/exportPDF"; 

export default function Editor() {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const editorRef = useRef(); 

  const [content, setContent] = useState("");
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState("edit");
  const [docId, setDocId] = useState("");
  const [isSharedLink, setIsSharedLink] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [socketInstance, setSocketInstance] = useState(null);
  const [pendingEdits, setPendingEdits] = useState([]);

 
  const [comments, setComments] = useState([]);
  const [selectedText, setSelectedText] = useState("");

  
  const [isTitleModalOpen, setIsTitleModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState("");
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [activeCommentId, setActiveCommentId] = useState(null);


  useEffect(() => {
    const sharedMode = location.pathname.startsWith("/share");
    setIsSharedLink(sharedMode);

    const fetchDocument = async () => {
      try {
        if (!id && !sharedMode) {
          setIsTitleModalOpen(true);
          return;
        }

        const authToken = Cookies.get("authToken");
        let url;
        if (sharedMode && token)
          url = `http://localhost:5000/api/documents/share/${token}`;
        else if (id) url = `http://localhost:5000/api/documents/${id}`;

        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
        const res = await fetch(url, { headers });
        const data = await res.json();

        if (data?.document) {
          setContent(data.document.content);
          setDocId(data.document._id);
          setDocTitle(data.document.title || "");
          setRole(data.role || "edit");
          setMounted(true);
        } else {
          setIsTitleModalOpen(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDocument();
  }, [id, token, location.pathname]);

  
  useEffect(() => {
    if (!docId) return;

    const fetchComments = async () => {
      try {
        const authToken = Cookies.get("authToken");
        const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
        const res = await fetch(`http://localhost:5000/api/comments/${docId}`, { headers });
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [docId]);

  useEffect(() => {
    if (!docId) return;

    const socket = io("http://localhost:5000", { withCredentials: true });
    setSocketInstance(socket);
    setIsConnected(socket.connected);

    socket.on("connect", () => {
      setIsConnected(true);
      if (pendingEdits.length > 0) {
        pendingEdits.forEach((edit) => {
          socket.emit("send-changes", { docId, content: edit });
        });
        setPendingEdits([]);
      }
    });

    socket.on("disconnect", () => setIsConnected(false));
    socket.emit("join-document", docId);
    socket.on("receive-changes", (newContent) => setContent(newContent));

    return () => {
      socket.emit("leave-document", docId);
      socket.disconnect();
    };
  }, [docId, pendingEdits]);

  const handleChange = useCallback(
    (value) => {
      if (role === "view") return;
      setContent(value);

      if (socketInstance?.connected) {
        socketInstance.emit("send-changes", { docId, content: value });
      } else {
        setPendingEdits((prev) => [...prev, value]);
      }
    },
    [docId, role, socketInstance]
  );


  useEffect(() => {
    if (!content || !docId || role === "view") return;

    const timer = setTimeout(() => {
      const saveUrl = `http://localhost:5000/api/documents/${docId}`;
      const headers = { "Content-Type": "application/json" };
      const body = { content, title: docTitle };
      if (!isSharedLink) headers.Authorization = `Bearer ${Cookies.get("authToken")}`;

      fetch(saveUrl, { method: "PUT", headers, body: JSON.stringify(body) }).catch((err) =>
        console.error(err)
      );
    }, 1500);

    return () => clearTimeout(timer);
  }, [content, docId, role, isSharedLink, docTitle]);


  const addComment = async () => {
    if (!selectedText) return;
    const text = document.getElementById("new-comment").value;
    if (!text) return;

    try {
      const authToken = Cookies.get("authToken");
      const res = await fetch(`http://localhost:5000/api/comments/${docId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ docId, selectedText, text }),
      });
      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      document.getElementById("new-comment").value = "";
    } catch (err) {
      console.error(err);
    }
  };


  const openReplyModal = (commentId) => {
    setActiveCommentId(commentId);
    setIsReplyModalOpen(true);
  };

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;
    try {
      const authToken = Cookies.get("authToken");
      const res = await fetch(`http://localhost:5000/api/comments/reply/${activeCommentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ text: replyText }),
      });
      const updatedComment = await res.json();
      setComments((prev) => prev.map((c) => (c._id === activeCommentId ? updatedComment : c)));
      setReplyText("");
      setIsReplyModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const resolveComment = async (commentId) => {
    try {
      const authToken = Cookies.get("authToken");
      const res = await fetch(`http://localhost:5000/api/comments/resolve/${commentId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const updatedComment = await res.json();
      setComments((prev) => prev.map((c) => (c._id === commentId ? updatedComment : c)));
    } catch (err) {
      console.error(err);
    }
  };


  const handleTitleSubmit = async () => {
    if (!docTitle.trim()) return;

    try {
      const authToken = Cookies.get("authToken");
      const res = await fetch(`http://localhost:5000/api/documents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ title: docTitle, content: "" }),
      });

      const data = await res.json();

      if (data?.document) {
        setDocId(data.document._id);
        setContent("");
        setMounted(true);
        setIsTitleModalOpen(false);
        navigate(`/editor/${data.document._id}`);
      } else {
        alert("Failed to create document");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating document");
    }
  };

  const handleDownloadPDF = () => {
    if (editorRef.current) {
      exportToPDF(editorRef.current, `${docTitle || "Document"}.pdf`);
    }
  };

  return (
    <div className="editor-page">
      {!isSharedLink && <DocsNavbar />}
      <ConnectionStatus isConnected={isConnected} />

      {mounted ? (
        <>
          {role === "view" && (
            <p style={{ color: "red", margin: "10px 0" }}>
              This document is view-only. Request edit access from the owner.
            </p>
          )}

          

          <div className="editor-main" ref={editorRef}>
            <div className="editor-content-wrapper">
              <EditorContent
                docId={docId}
                content={content}
                onChange={handleChange}
                readOnly={role === "view"}
                comments={comments}
                setSelectedText={setSelectedText}
              />
            </div>

           <CommentsPanel
  comments={comments}
  selectedText={selectedText}
  role={role}
  isSharedLink={isSharedLink}
  addComment={addComment}
  addReply={async (commentId, replyText) => {
    try {
      const authToken = Cookies.get("authToken");
      const res = await fetch(`http://localhost:5000/api/comments/reply/${commentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ text: replyText }),
      });
      const updatedComment = await res.json();
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? updatedComment : c))
      );
    } catch (err) {
      console.error(err);
    }
  }}
  resolveComment={resolveComment}
/>

          </div>
        </>
      ) : (
        <p>Loading document...</p>
      )}

      {isTitleModalOpen && (
        <TitleModal
          docTitle={docTitle}
          setDocTitle={setDocTitle}
          onSave={handleTitleSubmit}
          onCancel={() => setIsTitleModalOpen(false)}
        />
      )}

      {isReplyModalOpen && (
        <ReplyModal
          replyText={replyText}
          setReplyText={setReplyText}
          onClose={() => setIsReplyModalOpen(false)}
          onSubmit={handleReplySubmit}
        />
      )}
    </div>
  );
}
