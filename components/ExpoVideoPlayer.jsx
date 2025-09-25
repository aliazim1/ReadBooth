import { VideoView, useVideoPlayer } from "expo-video";

const ExpoVideoPlayer = ({ videoUri, style }) => {
  // Create or retrieve a player instance for the video
  const player = useVideoPlayer(videoUri, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <VideoView
      style={style}
      player={player}
      fullscreenOptions={true}
      allowsPictureInPicture={true}
    />
  );
};

export default ExpoVideoPlayer;
