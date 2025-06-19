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
import Icon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParamList, 'TravelHours'>;

const TravelHoursSelectionScreen: React.FC<Props> = ({navigation, route}) => {
  const {movieId, country} = route.params;
  const [selectedHours, setSelectedHours] = useState<number | null>(null);

  const travelHoursOptions = Array.from({length: 6}, (_, i) => i + 1); // 2~10

  const handleNext = () => {
    if (selectedHours !== null) {
      navigation.navigate('Concept', {
        movieId,
        country,
        travelHours: selectedHours,
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
            color="#009EFA"
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>2단계: 하루 이동 시간 선택</Text>
      </View>

      {/* 진행 바 */}
      <View style={styles.progressBar}>
        <View
          style={[styles.progressStep, {flex: 1, backgroundColor: '#009EFA'}]}
        />
        <View
          style={[styles.progressStep, {flex: 1, backgroundColor: '#009EFA'}]}
        />
        <View
          style={[styles.progressStep, {flex: 1, backgroundColor: '#eee'}]}
        />
      </View>

      {/* 안내 문구 */}
      <Text style={styles.prompt}>
        하루에 이동할 시간을 선택해주세요 (단위: 시간)
      </Text>

      {/* 시간 선택 버튼 */}
      <ScrollView contentContainerStyle={styles.buttonsContainer}>
        {travelHoursOptions.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.timeButton,
              selectedHours === option && styles.selectedButton,
            ]}
            onPress={() => setSelectedHours(option)}>
            <Text
              style={[
                styles.buttonText,
                selectedHours === option && styles.selectedText,
              ]}>
              {option}시간
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          selectedHours === null && styles.disabledButton,
        ]}
        onPress={handleNext}
        disabled={selectedHours === null}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default TravelHoursSelectionScreen;

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
    color: '#009EFA',
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
  timeButton: {
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
    borderColor: '#009EFA',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedText: {
    color: '#009EFA',
    fontWeight: 'bold',
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#009EFA',
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
