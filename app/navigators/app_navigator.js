import 'react-native-gesture-handler';
import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar, View, Text } from 'react-native';
import { Color, FontFamily, FontSize } from '../assets/stylesheets/base_style';

// screens
import HomeScreen from '../screens/home';
import OtherInfoScreen from '../screens/other_info';
import RegisterScreen from '../screens/register';
import ChcScreen from '../screens/chc';
import AboutScreen from '../screens/about';

const Stack = createStackNavigator();

export default class AppNavigator extends Component {
  render() {
    return (
      <NavigationContainer>
        <StatusBar backgroundColor={Color.primary} translucent={true} />
        <Stack.Navigator initialRouteName="RegisterScreen">
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerShown: false
            }}
          />

          <Stack.Screen name="ChcScreen" component={ChcScreen} />
          <Stack.Screen name="OtherInfoScreen" component={OtherInfoScreen} />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{
              title: "ចុះឈ្មោះ",
              headerStyle: {
                backgroundColor: Color.primary,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontFamily: FontFamily.title,
              },
            }}
          />
          <Stack.Screen name="AboutScreen" component={AboutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
