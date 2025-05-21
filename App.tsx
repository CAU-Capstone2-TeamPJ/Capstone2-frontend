import React from 'react';
import {View, Text, Button} from 'react-native';
import {
  CompositeScreenProps,
  NavigationContainer,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FilmDetailScreen from './src/screens/FilmDetailScreen';
import CountrySelectionScreen from './src/screens/CountrySelectionScreen';
import DistanceSelectionScreen from './src/screens/TravelHoursSelectionScreen';
import ConceptSelectionScreen from './src/screens/ConceptSelectionScreen';
import PeriodSelectionScreen from './src/screens/PeriodSelectionScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import SearchScreen from './src/screens/SearchScreen';
import LikeListScreen from './src/screens/LikeListScreen';
import LoginScreen from './src/screens/LoginScreen';
import MapScreen from './src/screens/MapScreen';
import TravelHoursSelectionScreen from './src/screens/TravelHoursSelectionScreen';

// 1. 타입 정의
export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  FilmDetail: {filmId: number};
  Country: {movieId: number; countries: string[]};
  TravelHours: {movieId: number; country: string};
  Concept: {movieId: number; country: string; travelHours: number};
  Schedule: {
    movieId: number;
    country: string;
    travelHours: number;
    concepts: string[];
    originLat: number;
    originLng: number;
  };
  Map: undefined;
};

type MainTabsParamList = {
  Home: undefined;
  Search: undefined;
  LikeList: undefined;
  MyPage: undefined;
};

type Props = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

// 2. Stack & Tab 생성
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

// 3. 화면 컴포넌트 정의

// Tab Screens
type HomeScreenProps = BottomTabScreenProps<MainTabsParamList, 'Home'>;
const HomeScreen = ({navigation}: HomeScreenProps) => (
  <View>
    <Text>Home Screen</Text>
    <Button
      title="검색창으로 이동"
      onPress={() => navigation.navigate('Search')}
    />
  </View>
);

const MyPageScreen = () => (
  <View>
    <Text>My Page Screen</Text>
  </View>
);

// 4. 바텀 탭 네비게이터
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60, // 👈 높이 조절 (기본은 약 50~60)
          paddingTop: 10,
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName: string = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'LikeList') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'MyPage') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007aff', // 원하는 색상
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="LikeList" component={LikeListScreen} />
      <Tab.Screen name="MyPage" component={MyPageScreen} />
    </Tab.Navigator>
  );
}

// 5. 전체 네비게이션 구조
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="FilmDetail"
          component={FilmDetailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Country"
          component={CountrySelectionScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TravelHours"
          component={TravelHoursSelectionScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Concept"
          component={ConceptSelectionScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Schedule"
          component={ScheduleScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
