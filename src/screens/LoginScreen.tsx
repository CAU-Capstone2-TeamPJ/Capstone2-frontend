import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {WebView} from 'react-native-webview'; // WebView import

const LoginScreen = () => {
  const [showWebView, setShowWebView] = useState(false);
  const [authToken, setAuthToken] = useState('');

  // 구글 로그인 URL
  const googleLoginUrl = `https://86f0-221-150-84-108.ngrok-free.app/oauth2/authorization/google`;

  // 구글 로그인 후 리디렉션된 URL에서 토큰 추출
  const handleNavigationStateChange = (event: {url: any}) => {
    const {url} = event;

    console.log('현재 URL:', url); // 디버깅: 현재 URL 출력

    if (url.includes('86f0-221-150-84-108.ngrok-free.app')) {
      const token = new URLSearchParams(url.split('?')[1]).get('token');
      console.log('추출된 토큰:', token); // 디버깅: 추출된 토큰 출력

      if (token) {
        setAuthToken(token);
        setShowWebView(false); // 웹뷰를 닫고 로그인 완료 처리
        Alert.alert('로그인 성공', 'Google 로그인에 성공했습니다!');
      } else {
        Alert.alert('로그인 실패', '토큰 추출에 실패했습니다.');
      }
    }
  };

  // 구글 로그인 버튼 클릭 시 웹뷰 표시
  const signInWithGoogle = () => {
    setShowWebView(true); // 구글 로그인 웹뷰 표시
  };

  return (
    <View style={styles.container}>
      {showWebView ? (
        <WebView
          source={{uri: googleLoginUrl}}
          onNavigationStateChange={handleNavigationStateChange} // 리디렉션 URL 체크
          startInLoadingState={true} // 로딩 상태 표시
          javaScriptEnabled={true} // JavaScript 실행 허용
          domStorageEnabled={true} // 로컬 스토리지 허용
          onShouldStartLoadWithRequest={request => {
            // 디버깅: WebView가 로드하려는 URL 출력
            console.log('WebView 로드 요청 URL:', request.url);

            // 리디렉션 URL을 찾으면 WebView가 새 창을 열지 않도록 처리
            if (request.url.startsWith('https://accounts.google.com')) {
              console.log('구글 로그인 페이지로 리디렉션됨');
              return true; // WebView가 새 URL을 처리하도록 허용
            }

            // 그 외의 URL은 기본적으로 허용
            return true;
          }}
        />
      ) : (
        <>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <Text style={styles.title}>Start Your Film Voyage!</Text>

          <TouchableOpacity
            style={styles.googleButton}
            onPress={signInWithGoogle} // 구글 로그인 버튼 클릭 시 웹뷰로 이동
          >
            <Text style={styles.googleButtonText}>Google로 시작하기</Text>
          </TouchableOpacity>
        </>
      )}
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
