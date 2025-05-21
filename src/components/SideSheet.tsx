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

interface SideSheetProps {
  visible: boolean;
  onClose: () => void;
  events: {date: string; places: {title: string}[]}[];
  onSelectDate: (date: string) => void;
}

const SideSheet: React.FC<SideSheetProps> = ({
  visible,
  onClose,
  events,
  onSelectDate,
}) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.sheetTitle}>일정 선택</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* 일정 리스트 */}
          <FlatList
            data={events}
            keyExtractor={item => item.date}
            renderItem={({item}) => {
              const isExpanded = expandedDate === item.date;

              return (
                <View style={styles.item}>
                  <TouchableOpacity
                    style={styles.dateRow}
                    onPress={() => {
                      setExpandedDate(prev =>
                        prev === item.date ? null : item.date,
                      );
                    }}>
                    <Text style={styles.date}>{item.date}</Text>
                    <Icon
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color="#007AFF"
                    />
                  </TouchableOpacity>

                  {isExpanded && (
                    <View style={styles.placeList}>
                      {item.places.map((place, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={styles.placeItem}
                          onPress={() => {
                            onSelectDate(item.date);
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
    color: '#007AFF',
  },
  item: {
    backgroundColor: '#F2F4F5',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  places: {
    fontSize: 13,
    color: '#555',
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
