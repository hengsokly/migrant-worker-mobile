import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import NetInfo from "@react-native-community/netinfo";
import { Icon, Toolbar } from 'react-native-material-ui';
import { Color, FontFamily, FontSize, Style } from '../assets/stylesheets/base_style';
import PlaySound from '../components/play_sound';
import uuidv4 from '../utils/uuidv4';
import realm from '../schemas/schema';
import pdfList from '../data/json/pdf_list';
import { ApiBlob } from '../utils/api';
import { addStatistic } from '../utils/statistic';

export default class PdfCards extends React.Component {
  listData = (!!this.props.route && !!this.props.route.params && this.props.route.params.list) || pdfList[0].subList;
  state = {
    agencyList: this.listData
  };

  _onPress(item) {
    if (item.routeName != 'PdfViewScreen' ) {
      addStatistic(`goTo${item.routeName.split('Screen')[0]}`);
      return this.props.navigation.navigate(item.routeName, { title: item.title, hint: item.hint, list: item.subList });
    }

    addStatistic(this.props.statisticKey, { pdfFile: item.pdfFile});

    let pdf = realm.objects('Pdf').filtered('name="' + item.pdfFile + '"')[0];
    if (!!pdf) {
      return this.props.navigation.navigate(item.routeName, {title: item.title, pdfFilepath: pdf.uri});
    }

    NetInfo.fetch().then(state => {
      if(!state.isConnected) {
        return alert('សូមភ្ជាប់បណ្តាញអ៊ីនធឺណេតជាមុនសិន!');
      }

      this._downloadFile(item);
    });
  }

  _downloadFile(item) {
    !!this.props.onDownload && this.props.onDownload();

    ApiBlob.downloadPdf(item.pdfFile).then((res) => {
      !!this.props.onFinishDownload && this.props.onFinishDownload();

      if (res.respInfo.status != 200) {
        return alert('ការទាញយកមិនជោគជ័យ');
      }

      realm.write(() => {
        realm.create('Pdf', {code: uuidv4(), name: item.pdfFile, uri: res.data}, true);
      });

      this.props.navigation.navigate(item.routeName, {title: item.title, pdfFilepath: res.data});
    });
  }

  _isPdfExist(pdfFile) {
    return !!realm.objects('Pdf').filtered('name="' + pdfFile + '"').length;
  }

  _renderCard(screen) {
    let label = 'ចូលមើល';
    let textStyle = {};
    let icon = 'visibility';
    let iconColor = Color.primary;

    if (screen.routeName == 'PdfViewScreen' && !this._isPdfExist(screen.pdfFile)) {
      label = 'ទាញយក';
      textStyle = { color: Color.red };
      icon = 'cloud-download';
      iconColor = Color.red;
    }

    return (
      <TouchableOpacity
        key={ uuidv4() }
        style={Style.card}
        onPress={() => this._onPress(screen)}
        >
        <View style={Style.cardContent}>
          <View style={{flex: 1, marginRight: 16, justifyContent: 'center'}}>
            <Text>{screen.title}</Text>
          </View>

          <PlaySound
            style={{paddingLeft: 10}}
            fileName={screen.audioFilename || 'register'}
            activePlaying={this.state.activePlaying}
            onPress={(fileName) => this.setState({activePlaying: fileName})}/>
        </View>

        <View style={{flexDirection: 'row'}}>
          <Icon name={icon} size={24} color={iconColor} style={{marginRight: 5}} />
          <Text style={[styles.goDetailText, textStyle]}>{label}</Text>
          <Icon name='keyboard-arrow-right' size={24} />
        </View>
      </TouchableOpacity>
    );
  }

  _renderCardList() {
    return this.props.list.map(item => this._renderCard(item));
  }

  _renderHint() {
    let { route } = this.props;
    let hint = this.props.hint;

    if(!hint) { return(null); }

    return(<Text>{hint}</Text>);
  }

  _onChangeText(val) {
    if (!val) {
      this._onRefresh();
    }

    if (val.length > 1) {
      let list = this.listData.filter((agency) => {
        return agency.title.toLowerCase().indexOf(val.toLowerCase()) > -1
      })
      this.setState({agencyList: list});
    }
  }

  _onRefresh() {
    this.setState({agencyList: this.listData});
  }

  render() {
    return (
      <View>
        { this._renderHint() }
        { this._renderCardList() }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  goDetailText: {
    flex: 1,
    fontFamily: FontFamily.title,
    color: Color.primary
  }
});
