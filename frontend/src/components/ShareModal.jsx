import React, { useState, useEffect } from "react";
import "../styles/ShareModal.css";

export default function ShareModal({ isOpen, onClose, onShare }) {
  const [step, setStep] = useState("select"); // "select" or "email"
  const [mode, setMode] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState("");

  // Log when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log("Modal opened");
      // Reset modal state when it opens
      setStep("select");
      setMode(null);
      setRecipientEmail("");
    }
  }, [isOpen]);

  if (!isOpen) return null; // modal hidden

  const handleModeSelect = (selectedMode) => {
    console.log("Mode selected:", selectedMode);
    setMode(selectedMode);
    setStep("email"); // go to email input step
  };

  const handleShare = () => {
    console.log("Share clicked with mode:", mode, "and email:", recipientEmail);
    onShare(mode, recipientEmail || null);
    // Close modal after sharing
    onClose();
  };

  const handleBack = () => {
    console.log("Back clicked");
    setStep("select");
    setMode(null);
    setRecipientEmail("");
  };

  const handleEmailChange = (e) => {
    console.log("Email changed:", e.target.value);
    setRecipientEmail(e.target.value);
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => {
        console.log("Overlay clicked");
        onClose(); // close modal when clicking outside
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => {
          console.log("Modal content clicked, stopping propagation");
          e.stopPropagation(); // prevent overlay click from firing
        }}
      >
        <h3>Share Document</h3>

        {step === "select" && (
          <div className="share-options">
            <button type="button" onClick={() => handleModeSelect("view")}>
              View Only
            </button>
            <button type="button" onClick={() => handleModeSelect("edit")}>
              Can Edit
            </button>
          </div>
        )}

        {step === "email" && (
          <>
            <p>
              Sharing as <strong>{mode.toUpperCase()}</strong>
            </p>
            <input
              type="email"
              value={recipientEmail}
              onChange={handleEmailChange}
              placeholder="Enter email (optional)"
              className="email-input"
            />
            <div className="share-options">
              <button type="button" onClick={handleShare}>
                Share
              </button>
              <button type="button" onClick={handleBack}>
                Back
              </button>
            </div>
          </>
        )}

        <button
          type="button"
          className="close-btn"
          onClick={() => {
            console.log("Close button clicked");
            onClose(); // close modal when clicking close
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
