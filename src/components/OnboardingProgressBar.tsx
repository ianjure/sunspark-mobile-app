import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

// 8-step onboarding flow:
// 1. Location
// 2. Scan Bill / Review Bill
// 3. Home Ownership Question
// 4. Sunlight Question
// 5. Roof Space Question
// 6. Payment Question
// 7. Timeline Question
// 8. Register
export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const TOTAL_STEPS = 8;

const TRACK_HEIGHT = 18;
const TRACK_BORDER_RADIUS = 10;
const TRACK_COLOR = '#D0D5DD';

const FILL_COLOR = '#58C33D';

const SHINE_TOP = 4;
const SHINE_HEIGHT = 6;
const SHINE_MARGIN_LEFT = 8;
const SHINE_MARGIN_RIGHT = 24;
const SHINE_COLOR = '#78D361';

// Module-level — persists across navigation.replace remounts within the same
// app session. Tracks the last step so each new screen knows where to start from.
let lastStep: OnboardingStep | null = null;

type Props = {
  step: OnboardingStep;
};

export default function OnboardingProgressBar({ step }: Props) {
  const progress = step / TOTAL_STEPS;

  const isSameStep = lastStep === step;

  // Seed from the previous step's progress so the animation starts from
  // where the bar visually was on the last screen, not from 0.
  // If same step (e.g. ScanBill → EditBill), seed at current progress — no animation.
  // If app just started (lastStep is null), seed at 0 for the initial fill.
  const previousProgress = lastStep !== null ? lastStep / TOTAL_STEPS : 0;
  const initialValue = isSameStep ? progress : previousProgress;

  const animatedWidth = useRef(new Animated.Value(initialValue)).current;

  useEffect(() => {
    lastStep = step;

    if (isSameStep) return;

    Animated.spring(animatedWidth, {
      toValue: progress,
      useNativeDriver: false,
      damping: 18,
      stiffness: 140,
      mass: 1,
    }).start();
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        >
          <View style={styles.shine} />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: TRACK_HEIGHT,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_BORDER_RADIUS,
    backgroundColor: TRACK_COLOR,
    overflow: 'hidden',
  },
  fill: {
    height: TRACK_HEIGHT,
    backgroundColor: FILL_COLOR,
    borderRadius: TRACK_BORDER_RADIUS,
    overflow: 'hidden',
    minWidth: TRACK_HEIGHT,
  },
  shine: {
    position: 'absolute',
    top: SHINE_TOP,
    left: SHINE_MARGIN_LEFT,
    right: SHINE_MARGIN_RIGHT,
    height: SHINE_HEIGHT,
    borderRadius: 3,
    backgroundColor: SHINE_COLOR,
  },
});
