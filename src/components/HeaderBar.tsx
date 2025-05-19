import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // 아이콘 임포트

interface HeaderBarProps {
  onMenuPress: () => void;
  onBackPress: () => void;
  title: string;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  onMenuPress,
  onBackPress,
  title,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.button}>
        <Icon name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onMenuPress} style={styles.button}>
        <Icon name="menu" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    padding: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default HeaderBar;
