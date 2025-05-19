import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from 'react-native';

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
  return (
    <Modal animationType="slide" transparent visible={visible}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>일정 선택</Text>
          <FlatList
            data={events}
            keyExtractor={item => item.date}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  onSelectDate(item.date);
                  onClose();
                }}>
                <Text style={styles.date}>{item.date}</Text>
                <Text style={styles.places}>
                  {item.places.map(p => p.title).join(', ')}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    flex: 1,
  },
  sheet: {
    width: '70%',
    backgroundColor: 'white',
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {width: -2, height: 0},
    elevation: 5,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    marginBottom: 15,
  },
  date: {
    fontSize: 16,
    fontWeight: '600',
  },
  places: {
    fontSize: 14,
    color: 'gray',
  },
});

export default SideSheet;
