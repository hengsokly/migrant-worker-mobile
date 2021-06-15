import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Dimensions,
  StyleSheet,
} from 'react-native';

import { StackActions } from '@react-navigation/native';
import { withTranslation } from 'react-i18next';
import i18n from 'i18next';
import * as Progress from 'react-native-progress';
import { Color, FontFamily, FontSize, Style } from '../../assets/stylesheets/base_style';
import Images from '../../utils/images';
import Departure from '../../models/Departure';
import SoundPlayer from '../../components/sound_player';
import RenderHtml from 'react-native-render-html';

const tagsStyles = {
  h2: {
    fontFamily: FontFamily.title,
    fontWeight: "400",
    fontSize: 18
  },
  div: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.body
  },
  li: {
    marginRight: 10
  }
}

class LeafCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: Departure.find(props.route.params['parent_id']),
    };
  }

  _renderTitle() {
    return (
      <View style={{alignItems: 'center'}}>
        <Text style={{fontFamily: FontFamily.title, fontSize: 18, textAlign: 'center'}}>
          {this.state.category.name}
        </Text>
      </View>
    )
  }

  _renderPlayAudio() {
    return (
      <SoundPlayer
        filePath={this.state.category.audio}
        containerStyle={{flex: 1}}
        iconStyle={{tintColor: Color.white, color: 'black'}}
        iconSize={35}
        progressBarContainerStyle={{width: '100%'}}
      />
    )
  }

  render() {
    let image = this.state.category.imageSource || Images.default;

    return (
      <View style={[Style.container, { flex: 1, marginBottom: 0, borderWidth: 0 }]}>
        <ImageBackground
          source={image}
          style={[styles.cateImage]}
          resizeMode='contain'
        />

        { this._renderPlayAudio() }

        <ScrollView style={{flex:1}}>
          { this._renderTitle() }
          { !!this.state.category.description &&
            <RenderHtml
              source={{html: this.state.category.description}}
              contentWidth={Dimensions.get('screen').width}
              tagsStyles={tagsStyles}
            />
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cateImage: {
    minHeight: 160,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  }
});

export default withTranslation()(LeafCategory);
