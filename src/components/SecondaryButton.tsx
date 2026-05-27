import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function SecondaryButton({
  label,
  onPress,
  disabled = false,
  style,
}: SecondaryButtonProps) {
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
    marginBottom: 4,
  },
  shadow: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    height: 55,
    borderRadius: 12,
    backgroundColor: '#D0D5DD',
  },
  button: {
    height: 55,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
    borderWidth: 2,
    borderColor: '#D0D5DD',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 14 * 0.05,
    color: '#1E88E5',
  },
  disabledButton: {
    backgroundColor: '#F5F7FA',
    borderColor: '#D0D5DD',
  },
  disabledLabel: {
    color: '#667085',
  },
});
