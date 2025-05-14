import React, {useState, useEffect} from 'react';
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

type Props = NativeStackScreenProps<RootStackParamList, 'Concept'>;

const ConceptSelectionScreen: React.FC<Props> = ({navigation, route}) => {
  const {id, country, distance} = route.params;

  // 서버에서 받아온다고 가정한 더미 응답
  const mockResponse = {
    id,
    country,
    distance,
    concepts: ['힐링', '먹방', '포토 스팟', '자연과 함께'],
    period: 4,
  };

  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);

  const toggleConcept = (concept: string) => {
    if (selectedConcepts.includes(concept)) {
      setSelectedConcepts(prev => prev.filter(c => c !== concept));
    } else {
      setSelectedConcepts(prev => [...prev, concept]);
    }
  };

  const handleNext = () => {
    if (selectedConcepts.length > 0) {
      navigation.navigate('Period', {
        id,
        country,
        distance,
        concepts: selectedConcepts,
        period: mockResponse.period, // 서버 응답 기반
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>3단계: 컨셉 선택</Text>
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
          style={[styles.progressStep, {flex: 1, backgroundColor: '#eee'}]}
        />
      </View>

      {/* 안내 문구 */}
      <Text style={styles.prompt}>여행의 컨셉을 선택해주세요 (중복 가능)</Text>

      {/* 컨셉 버튼 */}
      <ScrollView contentContainerStyle={styles.buttonsContainer}>
        {mockResponse.concepts.map(concept => (
          <TouchableOpacity
            key={concept}
            style={[
              styles.selectButton,
              selectedConcepts.includes(concept) && styles.selectedButton,
            ]}
            onPress={() => toggleConcept(concept)}>
            <Text
              style={[
                styles.buttonText,
                selectedConcepts.includes(concept) && styles.selectedText,
              ]}>
              {concept}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 다음 버튼 */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          selectedConcepts.length === 0 && styles.disabledButton,
        ]}
        onPress={handleNext}
        disabled={selectedConcepts.length === 0}>
        <Text style={styles.nextButtonText}>다음</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ConceptSelectionScreen;

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
