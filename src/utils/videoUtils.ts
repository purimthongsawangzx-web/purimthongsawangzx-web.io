/**
 * Video helper utilities for embedding and parsing YouTube, Vimeo, and direct video links.
 */

export interface ParsedVideoInfo {
  type: 'youtube' | 'vimeo' | 'direct' | 'other';
  embedUrl: string;
  thumbnailUrl?: string;
  videoId?: string;
}

export function parseVideoUrl(url: string): ParsedVideoInfo {
  if (!url || typeof url !== 'string') {
    return { type: 'other', embedUrl: url };
  }

  const cleanUrl = url.trim();

  // YouTube matchers
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
  const ytMatch = cleanUrl.match(ytRegex);

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  }

  // Vimeo matchers
  const vimeoRegex = /(?:vimeo\.com\/(?:video\/)?)(\d+)/i;
  const vimeoMatch = cleanUrl.match(vimeoRegex);

  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?autoplay=1`
    };
  }

  // Direct video file formats
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(cleanUrl) || cleanUrl.startsWith('blob:') || cleanUrl.startsWith('data:video/')) {
    return {
      type: 'direct',
      embedUrl: cleanUrl
    };
  }

  return {
    type: 'other',
    embedUrl: cleanUrl
  };
}
