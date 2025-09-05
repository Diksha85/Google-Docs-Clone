import React, { useState } from "react";
import "../styles/CommentSection.css";

export default function CommentsPanel({
  comments,
  selectedText,
  role,
  isSharedLink,
  addComment,
  addReply,
  resolveComment,
}) {
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  const handleReplySubmit = (commentId) => {
    if (replyText.trim() === "") return;
    addReply(commentId, replyText);
    setReplyText("");
    setReplyingTo(null);
  };

  const handleAddComment = () => {
    if (newCommentText.trim() === "") return;
    addComment(newCommentText);
    setNewCommentText("");
  };

  return (
    <div id="comment-panel">
      <h3>Comments</h3>
      <div id="comments-list">
        {(selectedText
          ? comments.filter((c) => c.selectedText === selectedText && !c.resolved)
          : comments.filter((c) => !c.resolved)
        ).map((c) => (
          <div key={c._id} className="comment">
            <p>
              <b>{c.userEmail}</b>: {c.text}
            </p>

            {role !== "view" && !isSharedLink && (
              <div className="comment-actions">
                <button onClick={() => setReplyingTo(c._id)}>Reply</button>
                <button onClick={() => resolveComment(c._id)}>Resolve</button>
              </div>
            )}

            {/* Replies */}
            {c.replies.length > 0 && (
              <div className="replies">
                {c.replies.map((r, i) => (
                  <div key={i} className="reply">
                    <p>
                      <b>{r.userEmail}</b>: {r.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Inline Reply Box */}
            {replyingTo === c._id && (
              <div className="reply-box">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply..."
                />
                <div className="reply-actions">
                  <button className="cancel-btn" onClick={() => setReplyingTo(null)}>
                    Cancel
                  </button>
                  <button
                    className="submit-btn"
                    onClick={() => handleReplySubmit(c._id)}
                  >
                    Reply
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {!selectedText && comments.filter((c) => !c.resolved).length === 0 && (
          <p style={{ color: "gray" }}>No comments yet</p>
        )}
      </div>

      {role !== "view" && !isSharedLink && (
        <div className="new-comment">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add comment..."
          />
          <button onClick={handleAddComment}>Comment</button>
        </div>
      )}
    </div>
  );
}
