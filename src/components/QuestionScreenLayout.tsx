import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackArrowButton from '@/src/components/BackArrowButton';
import OnboardingProgressBar, {
  OnboardingStep,
} from '@/src/components/OnboardingProgressBar';
import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';
import { styles } from '@/src/styles/styles';

type QuestionOption = {
  label: string;
  description?: string;
};

type Props = {
  onboardingStep: OnboardingStep;
  title: string;
  subtitle?: string;
  options: QuestionOption[];
  onSelect: (value: string) => void;
  onBack?: () => void;
};

export default function QuestionScreenLayout({
  onboardingStep,
  title,
  subtitle,
  options,
  onSelect,
  onBack,
}: Props) {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: APP_BACKGROUND_COLOR }}
      edges={['top', 'bottom']}
    >
      <View style={questionLayoutStyles.header}>
        {onBack && <BackArrowButton onPress={onBack} />}
        <View style={questionLayoutStyles.progressBarWrapper}>
          <OnboardingProgressBar step={onboardingStep} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>{title}</Text>
          {subtitle && <Text style={styles.questionSubtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.optionList}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.label}
              style={styles.optionButton}
              onPress={() => onSelect(option.label)}
            >
              <View>
                <Text style={styles.optionLabel}>{option.label}</Text>
                {option.description && (
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const questionLayoutStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginRight: 20,
  },
  progressBarWrapper: {
    flex: 1,
    marginLeft: 20,
    paddingTop: 25,
    justifyContent: 'center',
  },
});
