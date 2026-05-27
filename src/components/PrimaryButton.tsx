import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
  style,
}: PrimaryButtonProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const shadowOpacity = useRef(new Animated.Value(1)).current;

  function handlePressIn() {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 4,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function handlePressOut() {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }

  if (disabled) {
    return (
      <View style={[styles.wrapper, style]}>
        <View style={[styles.button, styles.disabledButton]}>
          <Text style={[styles.label, styles.disabledLabel]}>{label}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, style]}>
      {/* Static shadow layer */}
      <Animated.View style={[styles.shadow, { opacity: shadowOpacity }]} />

      {/* Button layer */}
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[styles.button, { transform: [{ translateY }] }]}>
          <Text style={styles.label}>{label}</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    // Reserve space for the shadow (4px below)
    marginBottom: 4,
  },
  shadow: {
    position: 'absolute',
    top: 4, // offset matches Y4 shadow
    left: 0,
    right: 0,
    height: 55,
    borderRadius: 12,
    backgroundColor: '#E5A900',
  },
  button: {
    height: 55,
    borderRadius: 12,
    backgroundColor: '#FFC928',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
    letterSpacing: 14 * 0.05, // 5% of font size
    color: '#17202A',
  },
  disabledButton: {
    backgroundColor: '#D0D5DD',
  },
  disabledLabel: {
    color: '#667085',
  },
});
