import * as React from 'react';
import {
  View,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  Button,
  ActivityIndicator,
  FlatList
} from 'react-native';

import { Color, FontFamily, Style } from '../assets/stylesheets/base_style';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Icon } from 'react-native-material-ui';
import listData from '../data/json/list_videos';

import { addStatistic } from '../utils/statistic';
import Thumbnail from '../components/thumbnail';
import { getVideoId } from '../utils/youtube';
import { useNavigation } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";
import Toast, { DURATION } from 'react-native-easy-toast';
import { useTranslation } from 'react-i18next';

export default function ListVideos(props) {
  const { t, i18n } = useTranslation();
  const stepIndex = !!props.route.params && !!props.route.params.type ? listData.findIndex(d => d.stepCode == props.route.params.type) : 0;

  const [index, setIndex] = React.useState(stepIndex);
  const initialLayout = { width: Dimensions.get('window').width };
  const states = listData.map((item) => ({ key: item.stepCode, title_en: item.stepTitle_en, title_km: item.stepTitle_km }));
  const [routes] = React.useState(states);
  const [isConnected, setIsConnected] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(false);
  const navigation = useNavigation();

  React.useEffect(() => {
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
    });

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe
    }
  }, [NetInfo]);

  const renderNoInternetConnection = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
          <Icon name='info-outline' color='#111' size={24} style={{ marginRight: 8 }} iconSet='MaterialIcons' />
          <Text>{t('InternetConnection.NoInternetConnection')}</Text>
        </View>
        <Text>{t('InternetConnection.PleaseRetry')}</Text>

        { showLoading && <ActivityIndicator size="small" />}

        <View style={{ marginTop: 20 }}>
          <Button title={t('InternetConnection.PleaseRetry')} onPress={() => retryConnection()} />
        </View>
      </View>
    )
  }

  const retryConnection = () => {
    setShowLoading(true);
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      setShowLoading(false)
    });
  }

  const onPressItem = (video) => {
    addStatistic('ViewVideo', { videoId: getVideoId(video.url), title: video[`title_${i18n.language}`] });
    navigation.navigate('ViewVideoScreen', { videoId: getVideoId(video.url) });
  }

  const _renderItem = (video, index) => {
    return (
      <View
        key={index}
        style={[Style.card, { flexDirection: 'column', margin: 8, marginBottom: 8 }]}>
        <Thumbnail
          onPress={() => onPressItem(video)}
          imageWidth={'100%'}
          imageHeight={150}
          url={video.url} />

        <View style={{ flex: 1, marginLeft: 12, marginRight: 12, marginTop: 10, marginBottom: 12 }}>
          <TouchableOpacity onPress={() => onPressItem(video)}>
            <Text style={{ fontFamily: FontFamily.title }}>{video[`title_${i18n.language}`]}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const sreenList = (props) => {
    let step = listData.filter(l => l.stepCode == props.route.key)[0];

    if (!isConnected && !showLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', marginTop: 170 }}>
          { renderNoInternetConnection() }
        </View>
      )
    }

    return (
      <FlatList
        data={step.list}
        renderItem={(item, i) => _renderItem(item.item, i)}
        keyExtractor={item => item.stepCode}
        contentContainerStyle={{padding: 8}}
      />
    )
  };

  const scenMap = () => {
    let obj = {};
    for (let i = 0; i < states.length; i++) {
      obj[states[i].key] = sreenList
    }
    return obj;
  }

  const renderScene = SceneMap(scenMap());

  const renderTabBar = props => (
    <TabBar
      {...props}
      getLabelText={({ route }) => route[`title_${i18n.language}`]}
      indicatorStyle={{ backgroundColor: Color.primary, height: 4 }}
      style={{ backgroundColor: '#fff' }}
      pressColor={'rgba(0,0,0,0.2)'}
      activeColor={Color.primary}
      inactiveColor={'#121212'}
      labelStyle={{ fontFamily: FontFamily.title }}
      scrollEnabled={true}
      tabStyle={{ width: 'auto' }}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={renderTabBar}
      />
    </View>
  );
}
