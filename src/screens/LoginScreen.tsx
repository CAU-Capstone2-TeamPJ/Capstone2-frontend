import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
// import { GoogleSignin, User } from '@react-native-google-signin/google-signin';

const LoginScreen = () => {
  /*   useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
    });
  }, []);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: User = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);
      // 로그인 성공 후 처리 (예: 서버에 토큰 전달)
    } catch (error) {
      console.error('Google Sign-In error', error);
      Alert.alert('로그인 실패', 'Google 로그인에 실패했습니다.');
    }
  }; */

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Start Your Film Voyage!</Text>

      <TouchableOpacity
        style={styles.googleButton}
        /*         onPress={() => promptAsync()}
        disabled={!request} 
        */
      >
        <Text style={styles.googleButtonText}>Google로 시작하기</Text>
      </TouchableOpacity>

      {/*!request && <ActivityIndicator style={{marginTop: 20}} />*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
  },
  googleButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  googleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
