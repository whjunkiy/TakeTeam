import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import CategoriesList from './pages/CategoriesList';
import GridScreen from './pages/GridScreen';
import Authing from "./pages/Authing";
import Profile from "./pages/Profile";
import Messages from './pages/Messages';
import newPost from './pages/newPost';
import Search from './pages/Search';
import SinglePost from './pages/SinglePost';
import CreateEvent from './pages/CreateEvent';
import EditPost from "./pages/EditPost";
import Settings from "./pages/Settings";
import Constants from 'expo-constants';

const Stack = createStackNavigator({
        MainList: {
            screen: CategoriesList,
            navigationOptions: {
                title: 'Events screen'
            }
        },
        ImagesGrid: {
            screen: GridScreen,
            navigationOptions: ({ navigation }) => {
                return {
                    title: navigation.state.params.title
                };
            }
        },
        authing: {
            screen: Authing,
            navigationOptions: ({ navigation }) => {
                return {
                    title: 'Авторизация'
                };
            }
        },
        profile: {
            screen: Profile,
            navigationOptions: ({ navigation }) => {
                return {
                    title: navigation.state.params.title
                };
            }
        },
        profile2: {
            screen: Profile,
            navigationOptions: ({ navigation }) => {
                return {
                    title: navigation.state.params.title
                };
            }
        },
        singlePost: {
            screen: SinglePost,
            navigationOptions: ({ navigation }) => {
                return {
                    title: navigation.state.params.title
                };
            }
        },
        settings: {
            screen: Settings,
            navigationOptions: ({ navigation }) => {
                return {
                    title: navigation.state.params.title
                };
            }
        },
        editPost: {
            screen: EditPost,
            navigationOptions: ({ navigation }) => {
                return {
                    title: navigation.state.params.title
                };
            }
        },
        messages: {
            screen: Messages,
            navigationOptions: ({ navigation }) => {
                return {
                    title: navigation.state.params.title
                };
            }
        },
        newPost: {
            screen: newPost,
            navigationOptions: ({ navigation }) => {
                return {
                    title: navigation.state.params.title
                };
            }
        },
        search: {
            screen: Search,
            navigationOptions: ({ navigation }) => {
                return {
                    title: navigation.state.params.title
                };
            }
        },
        createEvent: {
            screen: CreateEvent,
            navigationOptions: ({ navigation }) => {
                return {
                    title: navigation.state.params.title
                };
            }
        }
    },
    {
        initialRouteName: 'MainList',
        headerMode: 'none',
        headerShown: false,
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#f4511e',
                maxHeight: 0,
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bolder',
            },
        },
    });

export default createAppContainer(Stack);


/*

import * as React from 'react';
import { Button, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';


enableScreens();

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Profile')}
      />
    </View>
  );
}

function ProfileScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to Notifications"
        onPress={() => navigation.navigate('Notifications')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to Settings"
        onPress={() => navigation.navigate('Settings')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function Navigator() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
*/