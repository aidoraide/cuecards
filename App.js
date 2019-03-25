import React from "react";
import {
  Platform,
  Button,
  StyleSheet,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import CardFlip from "react-native-card-flip";
import SwiperFlatList from "react-native-swiper-flatlist";
import { DarkButton } from "./Buttons";
import Colors from "./Colors";
import { FontAwesome } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  cardContainer: {
    width: width,
    height: height * 0.5,
    padding: 25,
  },
  card: {
    flex: 1,
    marginLeft: 24,
    marginRight: 24,
    marginTop: 15,
    marginBottom: 60,
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.cuecardBackground,
    borderColor: Colors.cuecardBorder,
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: Colors.shadowColor,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 2,
    shadowOpacity: 0.8,
    elevation: 5
  },
  label: {
    textAlign: "center",
    fontSize: 35,
    fontFamily: "System",
    color: Colors.textOnLight,
    backgroundColor: "transparent"
  },
  statBar: {
    height: '100%',
    height: 30,
  }
});

const CUECARDS = [
  {
    id: 0,
    front: 'Viator',
    back: 'a wayfarer; traveler.',
  },
  {
    id: 1,
    front: 'Upper Crust',
    back: 'the highest social class.',
  },
  {
    id: 2,
    front: 'Green-Eyed',
    back: 'jealous; envious; distrustful',
  },
  {
    id: 3,
    front: 'Temporize',
    back: 'to be indecisive or evasive to gain time or delay acting.',
  },
  {
    id: 4,
    front: 'Obscurantism',
    back: 'opposition to the increase and spread of knowledge',
  },
  {
    id: 5,
    front: 'Diffidence',
    back: 'the quality or state of lacking confidence in one\'s ability, worth or fitness; timidity.',
  },
  {
    id: 6,
    front: 'Fantods',
    back: 'a state of extreme nervousness or restlessness; the willies; the fidgets (usually preceded by the).',
  },
  {
    id: 7,
    front: 'Facetiae',
    back: 'amusing or witty remarks or writings.',
  },
  {
    id: 8,
    front: 'Myopic',
    back: 'unable or unwilling to act prudently; shortsighted.',
  },
  {
    id: 9,
    front: 'Bracketology',
    back: 'a system of diagrammatically predicting and tracking the process of elimination among sequentially paired opponents in a tournament, especially an NCAA basketball tournament.',
  },
]

const QuestionView = props => (
  <View>
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 15 }}>Did you get it correct?</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      <FontAwesome
        name="check"
        size={55}
        onPress={props.onCorrect}
        color="green"
      />
      <View style={{ width: 75 }}/>
      <FontAwesome
        name="times"
        size={55}
        onPress={props.onInCorrect}
        color="red"
      />
    </View>
  </View>
);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.onCorrect = this.onCorrect.bind(this);
    this.onInCorrect = this.onInCorrect.bind(this);
    this.renderItemComponent = this.renderItemComponent.bind(this);
    this.flipCard = this.flipCard.bind(this);
    this.onViewableItemsChanged = this.onViewableItemsChanged.bind(this);
    this.cardRefs = {};
    this.idx = 0;
    this.cardStats = {};
    this.allCuecards = CUECARDS;
    this.state = {
      isFacingFront: true,
      cuecards: this.allCuecards,
      stats: {
        unknown: new Animated.Value(width),
        poor: new Animated.Value(0),
        decent: new Animated.Value(0),
        good: new Animated.Value(0),
      }
    };
  }

  recalculateStats() {
    const nCards = this.allCuecards.length;
    let counts = [0, 0, 0, 0];

    for (i in this.allCuecards) {
      cuecard = this.allCuecards[i];
      const stat = this.cardStats[cuecard.id];
      if (stat !== undefined) {
        counts[stat] += 1;
      } else {
        counts[3] += 1; // unknown
      }
    }

    const { unknown, poor, decent, good } = this.state.stats;
    const animatedValues = [poor, decent, good, unknown];
    for (i in animatedValues) {
      Animated.timing(animatedValues[i], {
        duration: 250,
        easing: Easing.linear(Easing.ease),
        toValue: counts[i] / nCards * width,
      }).start();
    }
  }

  renderItemComponent = ({ item }) => (
    <CardFlip
      style={styles.cardContainer}
      ref={card => (this.cardRefs[item.id] = card)}
      flipDirection="y"
    >
      <TouchableOpacity activeOpacity={1} style={styles.card}>
        <Text style={styles.label}>{item.front}</Text>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} style={styles.card}>
        <Text style={[styles.label, {fontSize: 18}]}>{item.back}</Text>
      </TouchableOpacity>
    </CardFlip>
  );

  swipeNext() {
    currentIndex = this.swiper.getCurrentIndex();
    if (currentIndex + 1 !== this.state.cuecards.length) {
      this.swiper.scrollToIndex(currentIndex + 1);
      this.setState({
        isFacingFront: true
      });
    } else {
      // Reshuffle
      const allGood = this.allCuecards.reduce((acc, cur) => acc && this.cardStats[cur.id] === 2, true)
      const PROB_INCLUDE_GOOD_CARD = 0.2;
      let cuecards = [];
      for (i in this.allCuecards) {
        const c = this.allCuecards[i];
        if (this.cardStats[c.id] < 2 || allGood || (Math.random() < PROB_INCLUDE_GOOD_CARD)) {
          cuecards.push(c);
        }
      }
      const stat2weight = [5, 2, 1];
      let keys = {};
      for (var i in cuecards) {
        const c = cuecards[i];
        keys[c.id] = -Math.pow(Math.random(), 1.0 / stat2weight[this.cardStats[c.id]]);
      }
      cuecards.sort((a, b) => keys[a.id] - keys[b.id]);

      this.swiper.scrollToIndex(0);
      this.setState({
        isFacingFront: true,
        cuecards,
      });
    }
  }

  onInCorrect() {
    this.cardStats[this.currentCard.id] = 0;
    this.recalculateStats()
    this.swipeNext();
  }

  onCorrect() {
    const prev = this.cardStats[this.currentCard.id];
    this.cardStats[this.currentCard.id] = prev === undefined ? 2 : Math.min(prev + 1, 2);
    const toFlip = this.cardRefs[this.currentCard.id];
    // setTimeout(() => toFlip.flip(), 500); // TODO Flip it back
    this.recalculateStats()
    this.swipeNext();
  }

  flipCard() {
    this.cardRefs[this.currentCard.id].flip();
    this.setState({
      isFacingFront: false
    });
  }

  onViewableItemsChanged(info) {
    this.currentCard = info.viewableItems[0].item;
  }

  render() {
    const { isFacingFront, cuecards } = this.state;
    return (
      <View style={{ justifyContent: 'center', height: '100%' }}>
        {cuecards.length > 0 && (
          <View>
            <SwiperFlatList
              data={cuecards}
              ref={swiper => (this.swiper = swiper)}
              renderItem={this.renderItemComponent}
              scrollEnabled={false}
              onViewableItemsChanged={this.onViewableItemsChanged}
            />
            <View style={{ height: 25 }}/>
            {isFacingFront ? (
              <DarkButton onPress={this.flipCard} title="FLIP" />
            ) : (
              <View>
                <QuestionView
                  onCorrect={this.onCorrect}
                  onInCorrect={this.onInCorrect}
                />
              </View>
            )}
          </View>
        )}
        <View style={{ position: 'absolute', flexDirection: 'row', bottom: 0 }}>
            <Animated.View style={[styles.statBar, { backgroundColor: 'red', width: this.state.stats.poor }]} />
            <Animated.View style={[styles.statBar, { backgroundColor: 'yellow', width: this.state.stats.decent }]} />
            <Animated.View style={[styles.statBar, { backgroundColor: 'green', width: this.state.stats.good }]} />
            <Animated.View style={[styles.statBar, { backgroundColor: '#d2e7ff', width: this.state.stats.unknown }]} />
        </View>
      </View>
    );
  }
}
