import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from './Colors';

const styles = StyleSheet.create({
  darkButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkButton: {
    backgroundColor: Colors.button,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 12,
    color: Colors.buttonText,
    fontSize: 24,
    fontWeight: 'bold',
    overflow: 'hidden',
    padding: 12,
    textAlign: 'center',
    width: 350,
  },
});

export const DarkButton = props => (
  <View style={styles.darkButtonContainer}>
    <TouchableOpacity onPress={props.onPress}>
      <Text style={styles.darkButton}>{props.title}</Text>
    </TouchableOpacity>
  </View>
);
