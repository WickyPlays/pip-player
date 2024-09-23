export function convertEmbedLink(url: string) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  console.log("Youtube link detecting...");

  if (youtubeRegex.test(url)) {
    console.log("Youtube link detected");
    let videoId = '';

    const youtubeUrlRegex = /(?:youtube\.com\/(?:.*v=|.*\/embed\/|.*\/v\/|.*\/watch\?.*&v=)|youtu\.be\/)([^#\&\?]*).*/;
    const match = url.match(youtubeUrlRegex);

    if (match && match[1]) {
      videoId = match[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }

  // If it's not a YouTube link or couldn't extract the video ID, return the original URL
  return url;
}
