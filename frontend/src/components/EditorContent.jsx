import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Cookies from "js-cookie";
import "../styles/EditorLayout.css";
import { exportToPDF } from "../utils/exportPDF"; 
import ShareModal from "../components/ShareModal"; // ✅ new import

export default function Editor({ docId, content, onChange, readOnly = false, comments = [], setSelectedText }) {
  const [copiedText, setCopiedText] = useState("");
  const [shareLink, setShareLink] = useState("");
  const quillRef = useRef(null);
  const dropdownRef = useRef(null);
  const [showShareModal, setShowShareModal] = useState(false);

const handleOption = async (mode, recipientEmail = null) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      alert("You must be logged in to share");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/documents/${docId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          role: mode,
          recipientEmail: recipientEmail || null,
        }),
      });

      const data = await res.json();
      if (data.shareUrl) {
        setShareLink(data.shareUrl);

        navigator.clipboard.writeText(data.shareUrl).then(() => {
          setCopiedText(`${mode.toUpperCase()} link copied!`);
          setTimeout(() => setCopiedText(""), 2000);
        });

        if (recipientEmail) {
          alert(`✅ Link also sent to ${recipientEmail}`);
        }
      } else {
        alert(data.message || "Failed to generate share link");
      }
    } catch (err) {
      console.error("Share failed:", err);
      alert("Error sharing document");
    }
  };

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //       setShowShareModal(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  useEffect(() => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    quill.formatText(0, quill.getLength(), "background", false);

    comments.forEach((c) => {
      if (!c.resolved && c.selectedText) {
        const text = quill.getText();
        const index = text.indexOf(c.selectedText);
        if (index !== -1) {
          quill.formatText(index, c.selectedText.length, { background: "#fff9c4" });
        }
      }
    });
  }, [comments, content]);

  const handleMouseUp = () => {
    if (readOnly) return;
    const quill = quillRef.current?.getEditor();
    if (!quill) return;

    const selection = quill.getSelection();
    if (selection && selection.length > 0) {
      const selectedText = quill.getText(selection.index, selection.length);
      setSelectedText(selectedText);
    } else {
      setSelectedText(null);
    }
  };

  const handleDownloadPDF = () => {
    if (quillRef.current) {
      const editorContent = quillRef.current.editor.root; 
      exportToPDF(editorContent, `${document.title || "Document"}.pdf`);
    }
  };

  const modules = readOnly
    ? { toolbar: false }
    : { toolbar: "#custom-toolbar" };

  const formats = [
    "header", "font", "bold", "italic", "underline", "strike", "color", "background",
    "script", "list", "bullet", "indent", "align", "blockquote", "code-block", "link", "image"
  ];

  return (
    <div style={{ width: "100%" }}>
      {/* ✅ Top Toolbar (Quill + Share + PDF) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          background: "#f8f9fa",
          borderBottom: "1px solid #ddd",
        }}
        ref={dropdownRef}
      >
        {/* ✅ Quill Custom Toolbar */}
        <div id="custom-toolbar" style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <select className="ql-header" defaultValue="">
            <option value="1"></option>
            <option value="2"></option>
            <option value=""></option>
          </select>
          <select className="ql-font"></select>
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
          <select className="ql-color"></select>
          <select className="ql-background"></select>
          <select className="ql-align"></select>
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
          <button className="ql-indent" value="-1"></button>
          <button className="ql-indent" value="+1"></button>
          <button className="ql-link"></button>
          <button className="ql-image"></button>
          <button className="ql-video"></button>
        </div>

        {/* ✅ Share + Download PDF */}
        <div style={{ display: "flex", gap: "8px", position: "relative" }}>
          <button
            onClick={() => setShowShareModal(true)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4285F4",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Share
          </button>

          <button
            onClick={handleDownloadPDF}
            style={{
              padding: "8px 16px",
              backgroundColor: "#34A853",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Download as PDF
          </button>

          {copiedText && (
            <span
              style={{
                position: "absolute",
                top: "-30px",
                right: 0,
                backgroundColor: "#4caf50",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                whiteSpace: "nowrap",
              }}
            >
              {copiedText}
            </span>
          )}
        </div>
      </div>

     <ShareModal
  isOpen={showShareModal}
  onClose={() => setShowShareModal(false)}
  onShare={(mode, email) => {
    handleOption(mode, email);  // handle data
    setShowShareModal(false);    // close modal AFTER share
  }}
/>

      {/* ✅ Editor Content */}
      <div onMouseUp={handleMouseUp}>
        <ReactQuill
          ref={quillRef}
          value={content}
          onChange={onChange}
          modules={modules}
          formats={formats}
          readOnly={readOnly}
          className="editor-container"
        />
      </div>
    </div>
  );
}
