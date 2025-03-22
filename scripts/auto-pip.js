// --- [ FUNCTION: Get video ] --- //
function getVideos() {
  const videos = Array.from(document.querySelectorAll('video'))
    .filter((video) => video.readyState != 0)
    .filter((video) => video.disablePictureInPicture == false)
    .filter((video) => video.currentTime > 0 && !video.paused && !video.ended) // Filter: Ensure Video is Playing
    .sort((v1, v2) => {
      const v1Rect = v1.getClientRects()[0] || { width: 0, height: 0 };
      const v2Rect = v2.getClientRects()[0] || { width: 0, height: 0 };
      return v2Rect.width * v2Rect.height - v1Rect.width * v1Rect.height;
    });

  if (videos.length === 0) {
    console.log('No playing video found');
    return null;
  }
  return videos[0];
}

// --- [ EXECUTE ] --- //
async function execute() {
  // Get video
  const video = getVideos();
  if (!video) return { video: null, setActionHandlerError: null };

  // Request automatic PiP
  // https://developer.chrome.com/blog/automatic-picture-in-picture-media-playback
  try {
    console.log('Playing video was found');
    // Request video to automatically enter picture-in-picture when eligible
    navigator.mediaSession.setActionHandler(
      'enterpictureinpicture',
      async () => {
        await video.requestPictureInPicture();
      }
    );
    return { video: video.baseURI, setActionHandlerError: null };
  } catch (err) {
    console.log('The enterpictureinpicture action is not yet supported');
    return { video: video.baseURI, setActionHandlerError: err };
  }
}

execute();
