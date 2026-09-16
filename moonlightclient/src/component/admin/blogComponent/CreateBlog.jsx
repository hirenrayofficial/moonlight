import React, { useState, useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "./editorTools";
import "./createblog.scss";
// import "@fontsource-variable/inter/wght.css";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const editorRef = useRef(null);
  const api = process.env.REACT_APP_API_END_POINT;

  // Initialize Editor.js on mount
  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editorjs",
        tools: EDITOR_JS_TOOLS,
        placeholder: "Write your article story here...",
      });
      editorRef.current = editor;
    }

    return () => {
      if (
        editorRef.current &&
        typeof editorRef.current.destroy === "function"
      ) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // Helper function to find the first image in Editor.js content
  const extractFirstImage = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return null;

    const imageBlock = blocks.find((block) => block.type === "image");
    if (imageBlock && imageBlock.data) {
      // Handles both direct URL or file object structures from Editor.js image tool
      return imageBlock.data.file?.url || imageBlock.data.url || null;
    }
    return null;
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a blog title.");
      return;
    }

    try {
      setIsPublishing(true);

      // Save output data from Editor.js
      const contentData = await editorRef.current.save();

      // Automatically extract the first image inserted in the content body
      const extractedImage = extractFirstImage(contentData?.blocks);
      const finalImageUrl =
        extractedImage || "/aurora-gradient-1788443208608.webp";

      const payload = {
        blog_title: title,
        blog_description: description,
        imageUrl: finalImageUrl, // First image from content body
        createAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        content: contentData,
      };

      // API Call
      const response = await fetch("/api/admin/blog/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to publish blog post.");
      }

      const result = await response.json();
      alert("Blog post published successfully!");
    } catch (error) {
      console.error("Publishing error:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="editor-container">
      <form onSubmit={handlePublish}>
        {/* Header Bar */}
        <header className="editor-header">
          <span className="editor-label">Draft</span>
          <button type="submit" className="publish-btn" disabled={isPublishing}>
            {isPublishing ? "Publishing..." : "Publish Post →"}
          </button>
        </header>

        {/* Post Metadata Inputs */}
        <div className="meta-inputs">
          <input
            type="text"
            className="input-title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="input-description"
            placeholder="Subtitle / Short excerpt..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Editor.js Container */}
        <div id="editorjs" className="editor-workspace"></div>
      </form>
    </div>
  );
}
