import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, ViewStyle } from 'react-native';

import { FONT_INTER_BOLD } from '@/src/constants/fonts';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
}: PrimaryButtonProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const shadowOpacity = useRef(new Animated.Value(disabled ? 0 : 1)).current;
  const enabledOpacity = useRef(new Animated.Value(disabled ? 0 : 1)).current;
  const disabledOpacity = useRef(new Animated.Value(disabled ? 1 : 0)).current;
  const buttonColor = useRef(new Animated.Value(disabled ? 0 : 1)).current;

  // Ref so press handlers always see the latest loading value
  const loadingRef = useRef(loading);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    // Stop any in-progress press animation before transitioning to disabled state
    translateY.stopAnimation();
    shadowOpacity.stopAnimation();

    // loading: sink + no shadow, but keep enabled colors
    // disabled: sink + no shadow + grey colors
    const shouldSink = disabled || loading;

    // Native driver — transform and opacity only
    Animated.parallel([
      Animated.timing(enabledOpacity, {
        toValue: disabled ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(disabledOpacity, {
        toValue: disabled ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(shadowOpacity, {
        toValue: shouldSink ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: shouldSink ? 4 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Only animate color when truly disabled, not during loading
    Animated.timing(buttonColor, {
      toValue: disabled ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [disabled, loading]);

  function handlePressIn() {
    if (disabled) return;
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
    if (disabled) return;
    // Stay sunk if loading kicked off when the finger lifted
    if (loadingRef.current) return;
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

  const animatedButtonColor = buttonColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#D0D5DD', '#FFC928'],
  });

  return (
    <Animated.View style={[styles.wrapper, style]}>
      {/* Shadow layer */}
      <Animated.View style={[styles.shadow, { opacity: shadowOpacity }]} />

      <Pressable
        onPress={disabled ? undefined : onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Outer: native-driven translateY only */}
        <Animated.View style={{ transform: [{ translateY }] }}>
          {/* Inner: JS-driven backgroundColor only */}
          <Animated.View
            style={[styles.button, { backgroundColor: animatedButtonColor }]}
          >
            {/* Enabled label */}
            <Animated.Text style={[styles.label, { opacity: enabledOpacity }]}>
              {label}
            </Animated.Text>
            {/* Disabled label */}
            <Animated.Text
              style={[
                styles.label,
                styles.disabledLabel,
                styles.labelOverlay,
                { opacity: disabledOpacity },
              ]}
            >
              {label}
            </Animated.Text>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
  },
  shadow: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    height: 55,
    borderRadius: 12,
    backgroundColor: '#E5A900',
  },
  button: {
    height: 55,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  label: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 14 * 0.05,
    color: '#17202A',
  },
  disabledLabel: {
    color: '#667085',
  },
  labelOverlay: {
    position: 'absolute',
  },
});
