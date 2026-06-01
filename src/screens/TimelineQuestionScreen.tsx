import { NativeStackScreenProps } from '@react-navigation/native-stack';

import QuestionScreenLayout from '@/src/components/QuestionScreenLayout';
import { RootStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'TimelineQuestion'>;

export default function TimelineQuestionScreen({ navigation, route }: Props) {
  const { result } = route.params;

  function handleSelect(answer: string) {
    const finalResult = {
      ...result,
      assessment_answers: {
        ...result.assessment_answers,
        installation_timeline: answer,
      },
    };

    navigation.replace('Register', { result: finalResult });
  }

  return (
    <QuestionScreenLayout
      onboardingStep={7}
      title="When are you thinking of installing solar?"
      subtitle="No pressure. This helps us personalize your next step."
      options={[
        { label: 'As soon as possible' },
        { label: 'Within 3 months' },
        { label: 'Within 6 months' },
        { label: 'Just researching' },
      ]}
      onSelect={handleSelect}
      onBack={() => navigation.replace('PaymentQuestion', { result })}
    />
  );
}
