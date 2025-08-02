import React from 'react';
import { View, Text } from 'react-native';
import { resultsStyles } from '../../styles/resultsStyles';

const FunFact = ({ didWin, gameMode }) => (
  <View style={resultsStyles.factSection}>
    <Text style={resultsStyles.factTitle}>💡 Fun Fact</Text>
    <Text style={resultsStyles.factText}>
      {didWin
        ? "You're in the minority! Studies show that over 80% of professional fund managers fail to beat the market consistently over long periods."
        : "You're in good company! Even professional fund managers struggle to beat a simple buy-and-hold strategy over the long term."}
      {gameMode === 'speedrun' && ' Time pressure makes market timing even harder!'}
      {gameMode === 'diversified' && ' Managing multiple stocks adds complexity to timing decisions.'}
    </Text>
  </View>
);

export default FunFact;
