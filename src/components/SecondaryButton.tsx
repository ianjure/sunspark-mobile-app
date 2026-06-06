import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, ViewStyle } from 'react-native';

import {
  APP_BACKGROUND_COLOR,
  BORDER_COLOR,
  MUTED_TEXT_COLOR,
  PRIMARY_BLUE_COLOR,
} from '@/src/constants/colors';
import { FONT_NUNITO_BOLD } from '@/src/constants/fonts';

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
  const shadowOpacity = useRef(new Animated.Value(disabled ? 0 : 1)).current;
  const enabledOpacity = useRef(new Animated.Value(disabled ? 0 : 1)).current;
  const disabledOpacity = useRef(new Animated.Value(disabled ? 1 : 0)).current;
  const buttonColor = useRef(new Animated.Value(disabled ? 0 : 1)).current;
  const borderColor = useRef(new Animated.Value(disabled ? 0 : 1)).current;

  useEffect(() => {
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
        toValue: disabled ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: disabled ? 4 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // JS driver — backgroundColor and borderColor only
    Animated.parallel([
      Animated.timing(buttonColor, {
        toValue: disabled ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.timing(borderColor, {
        toValue: disabled ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [disabled]);

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
    outputRange: [APP_BACKGROUND_COLOR, APP_BACKGROUND_COLOR], // background stays the same
  });

  const animatedBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [BORDER_COLOR, BORDER_COLOR], // border stays the same
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
          {/* Inner: JS-driven backgroundColor and borderColor only */}
          <Animated.View
            style={[
              styles.button,
              {
                backgroundColor: animatedButtonColor,
                borderColor: animatedBorderColor,
              },
            ]}
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
    backgroundColor: BORDER_COLOR,
  },
  button: {
    height: 55,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  label: {
    fontFamily: FONT_NUNITO_BOLD,
    fontSize: 14,
    letterSpacing: 14 * 0.05,
    color: PRIMARY_BLUE_COLOR,
  },
  disabledLabel: {
    color: MUTED_TEXT_COLOR,
  },
  labelOverlay: {
    position: 'absolute',
  },
});
