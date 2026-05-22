import { NativeStackScreenProps } from '@react-navigation/native-stack';

import QuestionScreenLayout from '@/src/components/QuestionScreenLayout';
import { RootStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'SunlightQuestion'>;

export default function SunlightQuestionScreen({ navigation, route }: Props) {
  const { result } = route.params;

  function handleSelect(answer: string) {
    navigation.replace('RoofSpaceQuestion', {
      result: {
        ...result,
        assessment_answers: {
          ...result.assessment_answers,
          sunlight: answer,
        },
      },
    });
  }

  return (
    <QuestionScreenLayout
      currentStep={1}
      totalSteps={4}
      progress={25}
      title="How much sunlight does your roof get?"
      subtitle="More sunlight usually means better solar performance."
      options={[
        { label: 'Mostly sunny' },
        { label: 'Partially shaded' },
        { label: 'Heavily shaded' },
        { label: 'Not sure' },
      ]}
      onSelect={handleSelect}
      onBack={() => navigation.replace('EditBill', { result })}
    />
  );
}
