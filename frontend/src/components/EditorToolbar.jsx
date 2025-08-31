import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";

export default function EditorToolbar({ docId }) {
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copiedText, setCopiedText] = useState("");
  const [shareLink, setShareLink] = useState(""); // ✅ New state to store link
  const dropdownRef = useRef(null);

  const handleShareClick = () => setShowShareOptions((prev) => !prev);

  const handleOption = async (mode) => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      alert("You must be logged in to share");
      return;
    }

    // Ask for recipient email (optional)
    const recipientEmail = prompt(
      "Enter email to share with (or leave empty to just copy link):"
    );

    try {
      const res = await fetch(
        `http://localhost:5000/api/documents/${docId}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            role: mode,
            recipientEmail: recipientEmail || null,
          }),
        }
      );

      const data = await res.json();
      if (data.shareUrl) {
        setShareLink(data.shareUrl); // ✅ Set link in state

        // Copy link
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

    setShowShareOptions(false);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowShareOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 12px",
        borderBottom: "1px solid #ddd",
        backgroundColor: "#f9f9f9",
      }}
      ref={dropdownRef}
    >
      {/* Show Shareable Link if generated */}
      {shareLink && (
        <div
          style={{
            background: "#fff",
            padding: "6px 10px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            maxWidth: "70%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <input
            type="text"
            value={shareLink}
            readOnly
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: "14px",
            }}
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareLink);
              setCopiedText("Link copied!");
              setTimeout(() => setCopiedText(""), 2000);
            }}
            style={{
              padding: "6px 10px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Copy
          </button>
        </div>
      )}

      {/* Share Button */}
      <div style={{ position: "relative" }}>
        <button
          onClick={handleShareClick}
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

        {/* Dropdown options */}
        {showShareOptions && (
          <div
            style={{
              position: "absolute",
              top: "50px",
              right: 0,
              background: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              borderRadius: "6px",
              overflow: "hidden",
              zIndex: 1000,
            }}
          >
            {["view", "edit"].map((mode) => (
              <div
                key={mode}
                style={{
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontSize: "14px",
                  transition: "background 0.2s",
                }}
                onClick={() => handleOption(mode)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f1f1f1")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
