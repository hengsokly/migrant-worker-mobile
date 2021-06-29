import React, { useRef, useState } from 'react';
import { View, Dimensions } from 'react-native';
import YouTube from 'react-native-youtube';

import { environment } from '../config/environment';

const ViewVideo = ({ route, navigation }) => {
  const { videoId } = route.params;
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const { width, height } = Dimensions.get('window');

  return (
    <View style={{ backgroundColor: '#000', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <YouTube
        apiKey={environment.youtube_api_key}
        style={{ height: 200, width: width }}
        ref={playerRef}
        play={playing}
        videoId={videoId}
      />
    </View>
  );
};

export default ViewVideo;
