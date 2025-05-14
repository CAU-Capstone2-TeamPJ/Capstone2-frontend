import React, {useState} from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Period'>;

const PeriodSelectionScreen: React.FC<Props> = ({navigation, route}) => {
  const {id, country, distance, concepts, period} = route.params;

  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);

  // 라벨 생성
  const periodOptions = Array.from({length: period}, (_, index) => {
    if (index === 0) return '당일치기';
    return `${index}박 ${index + 1}일`;
  });

  const handleNext = () => {
    if (selectedPeriod !== null) {
      // TODO: 서버 전송 and 다음 화면 연결 (추후 구현)
      navigation.navigate('Schedule');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>4단계: 여행 기간 선택</Text>
      </View>

      {/* 진행 바 */}
      <View style={styles.progressBar}>
        <View
          style={[styles.progressStep, {flex: 1, backgroundColor: '#007AFF'}]}
        />
        <View
          style={[styles.progressStep, {flex: 1, backgroundColor: '#007AFF'}]}
        />
        <View
          style={[styles.progressStep, {flex: 1, backgroundColor: '#007AFF'}]}
        />
        <View
          style={[styles.progressStep, {flex: 1, backgroundColor: '#007AFF'}]}
        />
      </View>

      {/* 안내 문구 */}
      <Text style={styles.prompt}>여행 기간을 선택해주세요!</Text>

      {/* 기간 선택 버튼 */}
      <ScrollView contentContainerStyle={styles.buttonsContainer}>
        {periodOptions.map((label, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.selectButton,
              selectedPeriod === index && styles.selectedButton,
            ]}
            onPress={() => setSelectedPeriod(index)}>
            <Text
              style={[
                styles.buttonText,
                selectedPeriod === index && styles.selectedText,
              ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 일정 만들기 버튼 */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          selectedPeriod === null && styles.disabledButton,
        ]}
        onPress={handleNext}
        disabled={selectedPeriod === null}>
        <Text style={styles.nextButtonText}>일정 만들기!</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default PeriodSelectionScreen;

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
