import { NativeStackScreenProps } from '@react-navigation/native-stack';

import SunlightQuestionIcon from '@/src/components/icons/SunlightQuestionIcon';
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
      onboardingStep={4}
      title={'How much sunlight\ndoes your roof get?'}
      subtitle={'More sunlight usually means\nbetter solar performance.'}
      icon={<SunlightQuestionIcon height={100} />}
      options={[
        { label: 'Mostly sunny' },
        { label: 'Partially shaded' },
        { label: 'Heavily shaded' },
        { label: 'Not sure' },
      ]}
      onSelect={handleSelect}
      onBack={() => navigation.replace('HomeOwnershipQuestion', { result })}
    />
  );
}
