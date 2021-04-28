import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'react-native';
import { Color, FontFamily, FontSize } from '../assets/stylesheets/base_style';

// screens
import HomeScreen from '../screens/home';
import WelcomeScreen from '../screens/welcome';
import OtherInfoScreen from '../screens/other_info';
import RegisterScreen from '../screens/register';
import Contact1280Screen from '../screens/contact1280';
import AboutScreen from '../screens/about';
import ProfileListScreen from '../screens/profile_list';
import SafeMigrationScreen from '../screens/safe_migration';
import TextInfoScreen from '../screens/text_info';
import ServiceDirectoryScreen from '../screens/service_directory';
import VideosScreen from '../screens/videos';
import ViewVideoScreen from '../screens/view_video';

import OtherDocScreen from '../screens/safe_migration/other_doc';

import ContactRelativeScreen from '../screens/text_info/contact_relative';
import MigrationAgencyScreen from '../screens/text_info/migration_agency';

import PdfViewScreen from '../screens/pdf_view';
import ImageViewScreen from '../screens/image_view';

import CustomHeaderHome from '../components/custom_header_home';
import CustomBottomTab from '../components/custom_bottom_tab';
import MoreScreen from '../screens/more';
import BeforeYouGoScreen from '../screens/before_you_go/before_you_go';
import MigrationScreen from '../screens/before_you_go/migration';
import PrepareYourTripScreen from '../screens/before_you_go/prepare_your_trip';

const Stack = createStackNavigator();
const BottomTab = createBottomTabNavigator();

function HomeTab() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={({ }) => ({
          header: () => <CustomHeaderHome />,
        })}
      />
    </Stack.Navigator>
  );
}

const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      tabBar={(props) => <CustomBottomTab {...props} />}
    >
      <BottomTab.Screen
        name="HomeScreen"
        component={HomeTab}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <BottomTab.Screen
        name="VideosScreen"
        component={VideosScreen}
        options={{
          tabBarLabel: 'Videos',
        }}
      />
      <BottomTab.Screen
        name="MoreScreen"
        component={MoreScreen}
        options={{
          tabBarLabel: 'More',
        }}
      />

    </BottomTab.Navigator>
  );
};

export default class AppNavigator extends Component {
  render() {
    return (
      <NavigationContainer>
        <StatusBar backgroundColor={Color.primary} />
        <Stack.Navigator
          initialRouteName="WelcomeScreen"
          screenOptions={{
            headerStyle: {
              backgroundColor: Color.primary,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontFamily: FontFamily.title,
            },
            headerTitleContainerStyle: {
              width: '75%'
            }
          }}
        >

          <Stack.Screen name="HomeScreen" component={BottomTabNavigator} options={{ headerShown: false }} />

          <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />


          <Stack.Screen name="BeforeYouGoScreen" component={BeforeYouGoScreen} options={{ headerShown: false }} />

          <Stack.Screen name="MigrationScreen" component={MigrationScreen} options={{ headerShown: false }} />
          
          <Stack.Screen name="PrepareYourTripScreen" component={PrepareYourTripScreen} options={{ headerShown: false }} />


          <Stack.Screen
            name="ProfileListScreen"
            component={ProfileListScreen}
            options={({ navigation, route }) => ({
              title: 'ប្រវត្តិចុះឈ្មោះ',
              headerLeft: () => (<HeaderBackButton tintColor={'white'} onPress={() => { navigation.popToTop() }} />),
              headerShown: false
            })}
          />

          <Stack.Screen name="Contact1280Screen" component={Contact1280Screen} options={{ title: "ទាក់ទងទៅលេខជំនួយ១២៨០", headerShown: false }} />
          <Stack.Screen name="OtherInfoScreen" component={OtherInfoScreen} options={{ title: "ចំណាកស្រុកសុវត្ថិភាព" }} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} options={{ title: "ចុះឈ្មោះ", headerShown: true }} />
          <Stack.Screen name="AboutScreen" component={AboutScreen} options={{ title: "អំពីកម្មវិធី", headerShown: false }} />
          <Stack.Screen name="SafeMigrationScreen" component={SafeMigrationScreen} options={{ title: "ចំណាកស្រុកសុវត្ថិភាព ត្រូវមានអ្វីខ្លះ?", headerShown: false }} />
          <Stack.Screen name="TextInfoScreen" component={TextInfoScreen} options={{ title: "ព័ត៌មានជាអក្សរ", headerShown: false }} />
          <Stack.Screen name="ServiceDirectoryScreen" component={ServiceDirectoryScreen} options={{ title: "សៀវភៅទូរស័ព្ទរកជំនួយ" }} />
          <Stack.Screen name="VideosScreen" component={VideosScreen} options={{ title: "វីដេអូ និងករណីចំណាកស្រុក", headerShown: false }} />
          <Stack.Screen name="ViewVideoScreen" component={ViewVideoScreen} options={{ title: "វីដេអូ" }} />

          <Stack.Screen name="OtherDocScreen" component={OtherDocScreen} options={{ title: "ឯកសារផ្សេងៗ" }} />

          <Stack.Screen name="ContactRelativeScreen" component={ContactRelativeScreen} options={{ title: "វិធីទំនាក់ទំនងសាច់ញាតិ" }} />
          <Stack.Screen name="MigrationAgencyScreen" component={MigrationAgencyScreen} options={{ title: "ភ្នាក់ងារចំណាកស្រុក", headerShown: false }} />

          <Stack.Screen name="PdfViewScreen" component={PdfViewScreen} options={({ route }) => ({ title: route.params.title })} />
          <Stack.Screen name="ImageViewScreen" component={ImageViewScreen} options={({ route }) => ({ title: route.params.title, headerShown: false })} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
