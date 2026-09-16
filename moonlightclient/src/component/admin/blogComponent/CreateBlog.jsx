import React, { useState, useEffect, useRef } from "react";
import { EDITOR_JS_TOOLS } from "./editorTools";
import "./createblog.scss";

export default function CreateBlog() {
  const [isClient, setIsClient] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const editorRef = useRef(null);
  const api = process.env.NEXT_PUBLIC_API_END_POINT;

  // Ensures this code only executes on the client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Dynamically require/import EditorJS only on the client side to bypass Node.js SSR evaluation
    import("@editorjs/editorjs").then((module) => {
      const EditorJS = module.default;
      
      if (!editorRef.current) {
        const editor = new EditorJS({
          holder: "editorjs",
          tools: EDITOR_JS_TOOLS,
          placeholder: "Write your article story here...",
        });
        editorRef.current = editor;
      }
    });

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [isClient]);

  // Helper function to find the first image in Editor.js content
  const extractFirstImage = (blocks) => {
    if (!blocks || !Array.isArray(blocks)) return null;
    const imageBlock = blocks.find((block) => block.type === "image");
    if (imageBlock && imageBlock.data) {
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
      const contentData = await editorRef.current.save();
      const extractedImage = extractFirstImage(contentData?.blocks);
      const finalImageUrl = extractedImage || "/aurora-gradient-1788443208608.webp";

      const payload = {
        blog_title: title,
        blog_description: description,
        imageUrl: finalImageUrl,
        createAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        content: contentData,
      };

      const response = await fetch("/api/admin/blog/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to publish blog post.");
      }

      await response.json();
      alert("Blog post published successfully!");
    } catch (error) {
      console.error("Publishing error:", error);
      alert(error.message || "Something went wrong.");
    } finally {
      setIsPublishing(false);
    }
  };

  // Prevent server-side rendering execution
  if (!isClient) {
    return <div className="rm-empty-msg rm-mono">LOADING EDITOR WORKSPACE...</div>;
  }

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