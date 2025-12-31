import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';

export function FireworkDecoration({
  top,
  left,
  right,
  width,
  height,
  opacity = 1,
}) {
  return (
    <View style={[styles.firework, { top, left, right, width, height }]}>
      <LottieView
        source={require('../../assets/images/Fireworks Teal and Red.json')}
        autoPlay
        loop
        style={[styles.lottieAnimation, { opacity }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  firework: {
    position: 'absolute',
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
});
