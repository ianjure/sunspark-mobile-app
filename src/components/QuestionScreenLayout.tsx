import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackArrowButton from '@/src/components/icons/BackArrowButton';
import OnboardingProgressBar, {
  OnboardingStep,
} from '@/src/components/OnboardingProgressBar';
import TertiaryButton from '@/src/components/TertiaryButton';
import TextCombo from '@/src/components/TextCombo';
import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';

type QuestionOption = {
  label: string;
  description?: string;
};

type Props = {
  onboardingStep: OnboardingStep;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  options: QuestionOption[];
  onSelect: (value: string) => void;
  onBack?: () => void;
};

export default function QuestionScreenLayout({
  onboardingStep,
  title,
  subtitle,
  icon,
  options,
  onSelect,
  onBack,
}: Props) {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: APP_BACKGROUND_COLOR }}
      edges={['top', 'bottom']}
    >
      {/* Top bar */}
      <View style={{ flexDirection: 'row', marginRight: 20 }}>
        {onBack && <BackArrowButton onPress={onBack} />}
        <View
          style={{
            flex: 1,
            marginLeft: 20,
            paddingTop: 25,
            justifyContent: 'center',
          }}
        >
          <OnboardingProgressBar step={onboardingStep} />
        </View>
      </View>

      {/* Center icon + TextCombo in the remaining space above the buttons */}
      <View style={styles.textComboWrapper}>
        {icon}
        <TextCombo title={title} subtitle={subtitle ?? ''} />
      </View>

      {/* Buttons anchored to the bottom */}
      <View style={styles.optionList}>
        {options.map((option, index) => (
          <TertiaryButton
            key={option.label}
            label={option.label}
            onPress={() => onSelect(option.label)}
            style={
              index === options.length - 1
                ? styles.lastOption
                : undefined
            }
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textComboWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  optionList: {
    gap: 10,
  },
  lastOption: {
    marginBottom: 22,
  },
});
