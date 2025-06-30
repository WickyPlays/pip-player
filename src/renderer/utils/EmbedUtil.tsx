export const LinkType = {
  YOUTUBE: 'youtube',
  DAILYMOTION: 'dailymotion',
  FACEBOOK: 'facebook',
  TWITCH: 'twitch',
  OTHER: 'other'
};

export function convertEmbedLink(url: string) {
  console.log("Detecting video link type...");

  // YouTube
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  if (youtubeRegex.test(url)) {
    const youtubeUrlRegex = /(?:youtube\.com\/(?:.*v=|.*\/embed\/|.*\/v\/|.*\/watch\?.*&v=)|youtu\.be\/)([^#\&\?]*).*/;
    const match = url.match(youtubeUrlRegex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1`;
    }
  }

  // Dailymotion
  const dailymotionRegex = /^(https?:\/\/)?(www\.)?(dailymotion\.com\/video)\/([0-9a-zA-Z]+)\/?$/;
  if (dailymotionRegex.test(url)) {
    const match = url.match(dailymotionRegex);
    if (match && match[4]) {
      return `https://www.dailymotion.com/embed/video/${match[4]}`;
    }
  }

  // Facebook
  const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/;
  if (facebookRegex.test(url)) {
    const match = url.match(facebookRegex);
    if (match) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
    }
  }

  // Twitch
  const twitchRegex = /^(https?:\/\/)?(www\.)?twitch\.tv\/([a-zA-Z0-9_]+)(\/clip\/([a-zA-Z0-9_-]+))?/;
  if (twitchRegex.test(url)) {
    const match = url.match(twitchRegex);
    if (match) {
      // Handle Twitch clips
      if (match[4] && match[5]) {
        return `https://clips.twitch.tv/embed?clip=${match[5]}&parent=${window.location.hostname}`;
      }
      // Handle regular Twitch channels
      return `https://player.twitch.tv/?channel=${match[3]}&parent=${window.location.hostname}`;
    }
  }
  
  return url;
}

export function getLinkType(url: string) {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  if (youtubeRegex.test(url)) return LinkType.YOUTUBE;

  const dailymotionRegex = /^(https?:\/\/)?(www\.)?(dailymotion\.com\/video|dai\.ly)\/.+$/;
  if (dailymotionRegex.test(url)) return LinkType.DAILYMOTION;

  const facebookRegex = /^(https?:\/\/)?(www\.)?facebook\.com\/.+$/;
  if (facebookRegex.test(url)) return LinkType.FACEBOOK;

  const twitchRegex = /^(https?:\/\/)?(www\.)?twitch\.tv\/.+$/;
  if (twitchRegex.test(url)) return LinkType.TWITCH;
  
  return LinkType.OTHER;
}