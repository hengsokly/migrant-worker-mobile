import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  Image,
  TouchableOpacity,
} from 'react-native';

import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Sound from 'react-native-sound';
import { AudioUtils } from 'react-native-audio';
import {Recorder} from '@react-native-community/audio-toolkit';

import uuidv4 from '../../utils/uuidv4';
import { environment } from '../../config/environment';
import * as Progress from 'react-native-progress';
import { Color, Style } from '../../assets/stylesheets/base_style';

export default class Audio extends Component {
  constructor(props) {
    super(props);

    let audioPath = props.audioPath || (AudioUtils.DocumentDirectoryPath + '/' + props.user.uuid + '.aac');

    this.state = {
      audioPath: audioPath,
      recordedTime: 0.0,
      recording: false,
      isPlaying: false,
      hasPermission: undefined,
      visiblePlayButton: false,
      visibleProgressBar: false,
      playSeconds: 0,
    }
  }

  componentWillUnmount() {
    if (!!this.sound) {
      this.sound.stop();
      this.sound.release();
    }
  }

  componentDidMount() {
    this._checkPermission().then((hasPermission) => {
      this.setState({ hasPermission });
    });

    this._handleRenderingPlayButton();
  }

  _handleRenderingPlayButton() {
    if(!!this.props.audioPath) {

      // 1e2108e6-e35d-49ad-aade-5411462e51c3

      this.sound = new Sound('/data/user/0/org.ilabsea.safemigration/files/1e2108e6-e35d-49ad-aade-5411462e51c3', '', (error) => {
        if (error) {
          return console.log('failed to load the sound', error);
        }

        let seconds = Math.ceil(this.sound.getDuration());
        this.setState({visiblePlayButton: true, recordedTime: seconds});
      });
    }
  }

  _checkPermission() {
    if (Platform.OS !== 'android') {
      return Promise.resolve(true);
    }

    const rationale = {
      'title': 'ការអនុញ្ញាតប្ើរមីក្រូហ្វូន',
      'message': 'កម្មវិធីនេះ សុំសិទ្ធិចូលប្រើមីក្រូហ្វូនរបស់អ្នក ដូច្នេះទើបអ្នកអាចថតសំលេង។'
    };

    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale)
      .then((result) => {
        console.log('Permission result:', result);
        return (result === true || result === PermissionsAndroid.RESULTS.GRANTED);
      });
  }

  _stopRecord() {
    if (this.recorder === null) {
      console.warn('Can\'t stop, not recording!');
      return;
    }

    clearInterval(this.recorderInterval);
    this.recorder.stop(() => {
      this.setState({
        recording: false,
        playSeconds: this.state.recordedTime,
        audioPath: this.recorder.fsPath,
        visibleProgressBar: false,
        visiblePlayButton: true,
      });

      this.props.callback(this.recorder.fsPath);
    });
  }

  _stopPlaying() {
    this.sound.stop();
    this.setState({isPlaying: false});
  }

  _countPlaySeconds = () => {
    this.countInterval = setInterval(() => {
      if (this.sound) {
        this.sound.getCurrentTime((seconds) => {
          if (Math.ceil(seconds) >= Math.ceil(this.sound.getDuration()))
            return clearInterval(this.countInterval);

          this.setState({ playSeconds: Math.ceil(seconds) });
        });
      }
    }, 1000);
  };

  _play() {
    if (this.recorder) {
      this.sound = new Sound(this.recorder.fsPath, '', (error) => {
        if (error)
          return console.log('failed to load the sound', error);

        this._countPlaySeconds();
        this.setState({ isPlaying: true });

        this.sound.play((success) => {
          if (success) {
            this.setState({
              isPlaying: false,
              playSeconds: this.state.recordedTime
            });
          }
          else
            this.sound.release();
        });
      });
    }
  }

  _record() {
    if (!this.state.hasPermission) {
      console.warn('Can\'t record, no permission granted!');
      return;
    }

    const fileName = `${this.props.user.uuid}.mp3`;

    this.recorder = new Recorder(fileName, {format: 'mp3'});
    this.recorder.prepare(() => {
      this.recorder.record(() => {
        this.setState({recording: true});

        this.recorderInterval = setInterval(() => {
          if (this.state.recordedTime == environment.record_audio_limit_time)
            return this._stopRecord();

          this.setState({
            recordedTime: this.state.recordedTime + 1,
          });
        }, 1000);
      });
    });
  }

  _handleRecording = () => {
    this._showProgressBar();
    this._record();
  }

  _showProgressBar() {
    this.setState({
      visibleProgressBar: true,
      visiblePlayButton: false
    });
  }

  _onPress() {
    this.setState({showHint: true})
    let self = this;
    setTimeout(function() {
      self.setState({showHint: false});
    }, 3000);
  }

  _onLongPress() {
    this.setState({showHint: false});
    this.longPress = true;
    this._handleRecording();
  }

  _onPressOut() {
    if(!this.longPress) { return }

    this.longPress = false
    this._stopRecord();
  }

  _renderButtonMicrophone() {
    if (this.state.visiblePlayButton) {
      return;
    }

    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        { this.state.showHint && <Text style={styles.hint}>ចុចនិងសង្កត់ដើម្បីថតសំលេង</Text> }

        <TouchableOpacity
          style={[styles.button]}
          onPress={() => this._onPress()}
          onLongPress={() => this._onLongPress()}
          onPressOut={() => this._onPressOut()}
        >
          <AwesomeIcon name={'microphone'} color='#fff' size={36} />
        </TouchableOpacity>
      </View>
    )
  }

  // _onSaveRecord() {
  //   this.setState({
  //     visibleProgressBar: false,
  //     visiblePlayButton: true
  //   });

  //   this.props.callback(this.state.audioPath);
  // }

  _onDeleteRecord() {
    this.setState({
      visiblePlayButton: false,
      recordedTime: 0.0,
      recording: false,
      isPlaying: false,
      playSeconds: 0,
    })

    this.props.callback('');
  }

  _renderProgressBar() {
    return (
      <View style={{marginTop: 20}}>
        <Progress.Bar progress={this.state.recordedTime / environment.record_audio_limit_time} width={null} color={Color.primary} unfilledColor='rgb(216, 216, 216)' borderColor='transparent' />
        <Text style={[styles.progressText, {textAlign: 'center'}]}>{this._renderTime(this.state.recordedTime) }</Text>
      </View>
    )
  }

  _renderTime(duration) {
    let date = new Date(null);
    date.setSeconds(duration);
    let time = date.toISOString().substr(14, 5);

    return time;
  }

  _handlePlaying() {
    if (this.state.isPlaying) {
      return this._stopPlaying();
    }
    this._play();
  }

  _renderButtonPlay() {
    return (
      <View style={[Style.boxShadow, {marginTop: 13, marginHorizontal: 0, flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#fff', borderRadius: 8}]}>
        <TouchableOpacity onPress={() => this._handlePlaying()}>
          { this.state.isPlaying &&
            <View style={{backgroundColor: Color.delete, width: 32, height: 32, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginHorizontal: 3}}>
              <MaterialIcon style={styles.icon} name='stop' size={20} color='white'/>
            </View>
          }
          { !this.state.isPlaying &&
            <MaterialIcon style={styles.icon} name='play-circle-filled' size={38} color={Color.primary}/>
          }
        </TouchableOpacity>

        <View style={{flex: 1, paddingHorizontal: 10}}>
          <Text>លេង</Text>
          <Text>{ this._renderTime(this.state.playSeconds) }</Text>
        </View>

        <TouchableOpacity onPress={ () => this._onDeleteRecord() }>
          <MaterialIcon style={styles.icon} name='delete' size={40} color='rgb(228, 74, 74)'/>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={{height: 180}}>
        { this.state.visiblePlayButton && this._renderButtonPlay() }
        { this.state.visibleProgressBar && this._renderProgressBar() }

        <View style={{flex: 1}}></View>
        <View style={styles.controls}>
          { this._renderButtonMicrophone() }
        </View>
      </View>
    )
  }
}

var styles = StyleSheet.create({
  controls: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  progressText: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    padding: Platform.OS === 'ios' ? 15 : 20,
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: Color.primary
  },
  icon: {
    height: 50,
    lineHeight: 50
  },
  hint: {
    backgroundColor: '#111',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 4
  }
});