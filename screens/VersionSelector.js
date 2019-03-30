import React from "react";
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

const styles = StyleSheet.create({
    screenContainer: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 200,
        height: 200,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#aaa',
    },
});

export default class VersionSelector extends React.Component {
    render() {
        return (
            <View style={styles.screenContainer}>
                <Text style={{fontSize: 22}}>Choose your adventure</Text>
                <View style={{height: 30}}></View>
                <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('Flashcards', {version: 'A'})}>
                    <Text>A</Text>
                </TouchableOpacity>
                <View style={{height: 30}}></View>
                <TouchableOpacity style={styles.button} onPress={() =>this.props.navigation.navigate('Flashcards', {version: 'B'})}>
                    <Text>B</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
