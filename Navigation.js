import React from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import Flashcards from './screens/Flashcards';
import VersionSelector from './screens/VersionSelector';

export default createAppContainer(createStackNavigator({
    VersionSelector: {screen: VersionSelector},
    Flashcards: {screen: Flashcards},
}, {
    initialRouteKey: 'VersionSelector',
    headerMode: 'none',
    navigationOptions: {
        header: null,
        headerVisible: false,
    }
}));
