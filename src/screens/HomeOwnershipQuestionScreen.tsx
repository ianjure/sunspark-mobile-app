import { NativeStackScreenProps } from '@react-navigation/native-stack';

import QuestionScreenLayout from '@/src/components/QuestionScreenLayout';
import { RootStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'HomeOwnershipQuestion'
>;

export default function HomeOwnershipQuestionScreen({
  navigation,
  route,
}: Props) {
  const { result } = route.params;

  function handleSelect(answer: string) {
    navigation.replace('SunlightQuestion', {
      result: {
        ...result,
        assessment_answers: {
          ...result.assessment_answers,
          home_ownership: answer,
        },
      },
    });
  }

  return (
    <QuestionScreenLayout
      currentStep={1}
      totalSteps={5}
      progress={20}
      title="Do you own the house?"
      subtitle="This helps us recommend the right financing and installation options."
      options={[
        { label: 'Yes, I own it' },
        { label: 'Family-owned' },
        { label: 'Renting' },
        { label: 'Not sure' },
      ]}
      onSelect={handleSelect}
      onBack={() => navigation.replace('EditBill', { result })}
    />
  );
}
