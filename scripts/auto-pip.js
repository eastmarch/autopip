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

  if (videos.length === 0) return null;
  return videos[0];
}

async function execute() {
  // Build response
  let response = {
    video: {
      source: null,
      page: null,
    },
    error: null,
  };

  // Get video
  const video = getVideos();
  if (!video) return null;
  response.video.source = video.currentSrc;
  response.video.page = video.baseURI;

  // Request automatic PiP
  // https://developer.chrome.com/blog/automatic-picture-in-picture-media-playback
  try {
    console.log('Playing video was found');
    video.setAttribute('__pip__', true);
    // Request video to automatically enter picture-in-picture when eligible
    navigator.mediaSession.setActionHandler(
      'enterpictureinpicture',
      async () => {
        await video.requestPictureInPicture();
      }
    );
  } catch (err) {
    console.log('The enterpictureinpicture action is not yet supported');
    response.error = err;
  }
  return response;
}

execute();
