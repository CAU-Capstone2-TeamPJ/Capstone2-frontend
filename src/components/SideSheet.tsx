import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface Place {
  latitude: number;
  longitude: number;
  title: string;
}

interface SideSheetProps {
  visible: boolean;
  onClose: () => void;
  events: {date: string; places: Place[]}[];
  onSelectDate: (date: string) => void;
  onSelectPlace: (place: Place) => void; // 새 prop
}

const SideSheet: React.FC<SideSheetProps> = ({
  visible,
  onClose,
  events,
  onSelectDate,
  onSelectPlace,
}) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.sheetTitle}>일자 선택</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* 전체 일정 항목 추가 */}
          <TouchableOpacity
            style={[styles.item, {backgroundColor: '#d0e8ff'}]}
            onPress={() => {
              onSelectDate('all'); // 'all'은 전체 일정 선택 의미
              onClose();
            }}>
            <Text style={[styles.date, {fontWeight: 'bold'}]}>전체 일정</Text>
          </TouchableOpacity>

          {/* 일정 리스트 */}
          <FlatList
            data={events}
            keyExtractor={item => item.date}
            renderItem={({item}) => {
              const isExpanded = expandedDate === item.date;

              return (
                <View style={styles.item}>
                  <View style={styles.dateRow}>
                    <TouchableOpacity
                      onPress={() => {
                        onSelectDate(item.date);
                        onClose();
                      }}
                      style={styles.dateTouchable}>
                      <Text style={styles.date}>{item.date}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        setExpandedDate(prev =>
                          prev === item.date ? null : item.date,
                        )
                      }>
                      <Icon
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color="#009EFA"
                      />
                    </TouchableOpacity>
                  </View>

                  {isExpanded && (
                    <View style={styles.placeList}>
                      {item.places.map((place, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={styles.placeItem}
                          onPress={() => {
                            onSelectDate(item.date);
                            onSelectPlace(place);
                            onClose();
                          }}>
                          <Text style={styles.placeText}>• {place.title}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    width: width * 0.75,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: -2, height: 2},
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#009EFA',
  },
  item: {
    backgroundColor: '#F2F4F5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  dateTouchable: {
    flex: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  placeList: {
    marginTop: 8,
    paddingLeft: 8,
  },
  placeItem: {
    paddingVertical: 6,
  },
  placeText: {
    fontSize: 14,
    color: '#444',
  },
});

export default SideSheet;
