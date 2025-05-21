import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {getUserProfile} from '../api/api';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  picture: string;
  role: string;
}

const MyPageScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (err) {
        console.error('유저 프로필 로드 실패:', err);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: () => {
          // TODO: 로그아웃 로직
          console.log('로그아웃 됨');
        },
      },
    ]);
  };

  const renderTab = (label: string, onPress: () => void) => (
    <TouchableOpacity style={styles.tab} onPress={onPress}>
      <Text style={styles.tabText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {user && (
          <>
            <Image source={{uri: user.picture}} style={styles.profileImage} />
            <Text style={styles.name}>{user.name}</Text>

            {renderTab('내 정보 보기', () => {
              navigation.navigate('MyProfile', {user});
            })}
            {renderTab('내 여행 보기', () => navigation.navigate('MyTravels'))}
            {renderTab('내 리뷰 보기', () => navigation.navigate('MyReviews'))}
            {renderTab('로그아웃', handleLogout)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  tab: {
    width: '90%',
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
});

export default MyPageScreen;
