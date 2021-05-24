import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';

import { StackActions } from '@react-navigation/native';
import { withTranslation } from 'react-i18next';
import i18n from 'i18next';

import { Color, FontFamily, FontSize, Style } from '../../assets/stylesheets/base_style';
import CardItem from '../../components/SubCategory/CardItem';
import HintCard from '../../components/SubCategory/HintCard';
import ArrowDown from '../../components/SubCategory/ArrowDown';
import Departure from '../../models/Departure';
import Images from '../../utils/images';
import CategoryImage from '../../models/CategoryImage';

class SubCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: Departure.find(props.route.params['parent_id']),
      categories: Departure.getChildren(props.route.params['parent_id'])
    };
  }

  _onPress(item) {
    if (item.leaf || item.last) {
      if(!CategoryImage.byCategory(item.id).length) {
        return;
      }

      return this.props.navigation.navigate('ImageViewScreen', { title: item.name, category_id: item.id });
    }

    const pushAction = StackActions.push('SubCategoryScreen', { title: item.name, parent_id: item.id });
    this.props.navigation.dispatch(pushAction);
  }

  _renderCards() {
    let doms = this.state.categories.map((item, index) =>
      <CardItem
        key={index}
        onPress={() => this._onPress(item)}
        title={item.name}
        image={item.imageSource}
        audio={item.audio}
        number={index + 1}
        hideArrow={!CategoryImage.byCategory(item.id).length}
      />
    );

    return doms;
  }

  _renderHintCard() {
    const { category, categories } = this.state;
    return (
      <HintCard
        totalItem={ categories.length }
        label={ category.hint }
        image={ category.hintImageSource }
        audio={ category.hint_audio }
      />
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}>

          <View style={[Style.container, { flex: 1, marginBottom: 0 }]}>
            { this._renderHintCard() }

            <ArrowDown />

            { this._renderCards() }
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default withTranslation()(SubCategory);
