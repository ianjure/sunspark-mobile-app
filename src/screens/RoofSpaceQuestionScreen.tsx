import { NativeStackScreenProps } from '@react-navigation/native-stack';

import RoofSpaceQuestionIcon from '@/src/components/icons/RoofSpaceQuestionIcon';
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
      onboardingStep={5}
      title={'How much usable roof\nspace do you have?'}
      subtitle={'Roof space helps estimate\npossible system size.'}
      icon={<RoofSpaceQuestionIcon height={100} />}
      options={[
        { label: 'Large' },
        { label: 'Medium' },
        { label: 'Small' },
        { label: 'Not sure' },
      ]}
      onSelect={handleSelect}
      onBack={() => navigation.replace('SunlightQuestion', { result })}
    />
  );
}
