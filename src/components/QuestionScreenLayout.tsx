import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackArrowButton from '@/src/components/BackArrowButton';
import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';
import { styles } from '@/src/styles/styles';

type QuestionOption = {
  label: string;
  description?: string;
};

type Props = {
  progress: number;
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  options: QuestionOption[];
  onSelect: (value: string) => void;
  onBack?: () => void;
};

export default function QuestionScreenLayout({
  progress,
  currentStep,
  totalSteps,
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
      {onBack && <BackArrowButton onPress={onBack} />}

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Question {currentStep} of {totalSteps}
          </Text>
          <Text style={styles.progressText}>{progress}% Complete</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>

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
