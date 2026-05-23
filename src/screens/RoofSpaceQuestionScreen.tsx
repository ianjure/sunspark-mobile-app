import { NativeStackScreenProps } from '@react-navigation/native-stack';

import QuestionScreenLayout from '@/src/components/QuestionScreenLayout';
import { RootStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'RoofSpaceQuestion'>;

export default function RoofSpaceQuestionScreen({ navigation, route }: Props) {
  const { result } = route.params;

  function handleSelect(answer: string) {
    navigation.replace('PaymentQuestion', {
      result: {
        ...result,
        assessment_answers: {
          ...result.assessment_answers,
          roof_space: answer,
        },
      },
    });
  }

  return (
    <QuestionScreenLayout
      currentStep={3}
      totalSteps={5}
      progress={60}
      title="How much usable roof space do you have?"
      subtitle="Roof space helps estimate possible system size."
      options={[
        { label: 'Large', description: 'Enough for 15+ panels' },
        { label: 'Medium', description: 'Enough for 8-12 panels' },
        { label: 'Small', description: 'Enough for 4-6 panels' },
        { label: 'Not sure', description: 'I need help measuring' },
      ]}
      onSelect={handleSelect}
      onBack={() => navigation.replace('SunlightQuestion', { result })}
    />
  );
}
