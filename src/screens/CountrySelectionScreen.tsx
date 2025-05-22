import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import Icon from 'react-native-vector-icons/Ionicons'; // 아이콘 임포트

type Props = NativeStackScreenProps<RootStackParamList, 'Country'>;

const CountrySelectionScreen = ({navigation, route}: Props) => {
  const {movieId, countries} = route.params;

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    if (countries.length === 1) {
      setSelectedCountry(countries[0]);
    } else {
      setSelectedCountry(null);
    }
  }, [countries]);

  const handleNext = () => {
    if (selectedCountry) {
      navigation.navigate('TravelHours', {
        movieId,
        country: selectedCountry,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            style={styles.backButton}
            name="arrow-back"
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>1단계: 국가 선택</Text>
      </View>

      {/* 진행 바 */}
      <View style={styles.progressBar}>
        <View
          style={[styles.progressStep, {flex: 1, backgroundColor: '#007AFF'}]}
        />
        <View
          style={[styles.progressStep, {flex: 1, backgroundColor: '#eee'}]}
        />
        <View
          style={[styles.progressStep, {flex: 1, backgroundColor: '#eee'}]}
        />
      </View>

      {/* 안내 문구 */}
      <Text style={styles.prompt}>여행하고 싶은 나라를 선택해주세요!</Text>

      {/* 국가 선택 버튼 */}
      <ScrollView contentContainerStyle={styles.buttonsContainer}>
        {countries.map(item => (
          <TouchableOpacity
            key={item}
            style={[
              styles.selectButton,
              item === selectedCountry && styles.selectedButton,
            ]}
            onPress={() => setSelectedCountry(item)}>
            <Text
              style={[
                styles.buttonText,
                item === selectedCountry && styles.selectedText,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          selectedCountry === null && styles.disabledButton,
        ]}
        onPress={handleNext}
        disabled={selectedCountry === null}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CountrySelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    fontSize: 24,
    color: '#007AFF',
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressStep: {
    height: 8,
  },
  prompt: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonsContainer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  selectButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 6,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#e6f0ff',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
});
