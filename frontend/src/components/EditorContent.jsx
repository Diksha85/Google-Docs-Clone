import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function EditorContent({ content, onChange, readOnly = false }) {
  const modules = readOnly
    ? { toolbar: false } 
    : {
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, false] }],
          [{ font: [] }, { size: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          ["link", "image", "video"],
          ["clean"],
        ],
      };

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "list",
    "bullet",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
    "image",
    "video",
  ];

  return (
    <ReactQuill
      value={content}
      onChange={onChange}
      modules={modules}
      formats={formats}
      readOnly={readOnly}
      className="editor-container"
    />
  );
}
