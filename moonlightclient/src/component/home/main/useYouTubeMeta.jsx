"use client"
import { useEffect, useState } from "react";

/**
 * useYouTubeMeta — fetches a video's real title + thumbnail from YouTube's
 * oEmbed endpoint. No API key needed, works for any public video/link.
 *
 * Usage:
 *   const { title, thumbnail, loading } = useYouTubeMeta(videoUrl);
 */
export default function useYouTubeMeta(url) {
  const [data, setData] = useState({ title: null, thumbnail: null, author: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`oEmbed request failed: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setData({
          title: json.title,
          thumbnail: json.thumbnail_url,
          author: json.author_name,
        });
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { ...data, loading, error };
}