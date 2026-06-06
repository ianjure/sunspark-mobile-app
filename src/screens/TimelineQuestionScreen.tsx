import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';

import TimelineQuestionIcon from '@/src/components/icons/TimelineQuestionIcon';
import LoadingOverlay from '@/src/components/LoadingOverlay';
import QuestionScreenLayout from '@/src/components/QuestionScreenLayout';
import Toast from '@/src/components/Toast';
import { RECOMPUTE_ESTIMATE_API } from '@/src/constants/api';
import { RootStackParamList } from '@/src/navigation/types';
import { SunsparkResult } from '@/src/types/sunspark';

type Props = NativeStackScreenProps<RootStackParamList, 'TimelineQuestion'>;

export default function TimelineQuestionScreen({ navigation, route }: Props) {
  const { result } = route.params;
  const [isRecomputing, setIsRecomputing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSelect(answer: string) {
    if (isRecomputing) return;

    const resultWithAnswer: SunsparkResult = {
      ...result,
      assessment_answers: {
        ...result.assessment_answers,
        installation_timeline: answer,
      },
    };

    try {
      setIsRecomputing(true);
      setErrorMsg(null);

      const response = await fetch(RECOMPUTE_ESTIMATE_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          monthly_bill: resultWithAnswer.monthly_bill,
          kwh_usage: resultWithAnswer.kwh_usage,
          avg_monthly_kwh: resultWithAnswer.avg_monthly_kwh,
          rate_per_kwh_found_on_bill:
            resultWithAnswer.rate_per_kwh_found_on_bill,
          effective_rate_per_kwh: resultWithAnswer.effective_rate_per_kwh,
          customer_type: resultWithAnswer.customer_type,
          solar: resultWithAnswer.solar,
          location: resultWithAnswer.location,
          assessment_answers: resultWithAnswer.assessment_answers,
          lat: resultWithAnswer.solar?.lat,
          lon: resultWithAnswer.solar?.lon,
        }),
      });
      const responseText = await response.text();

      let data: SunsparkResult;
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Server did not return JSON: ${responseText}`);
      }

      if (!response.ok || !data.success) {
        throw new Error('Failed to update estimate.');
      }

      navigation.replace('Register', { result: data });
    } catch (error: any) {
      console.log('Final estimate update error:', error);
      setErrorMsg(error.message || 'Something went wrong.');
    } finally {
      setIsRecomputing(false);
    }
  }

  return (
    <>
      <Toast message={errorMsg} onDismiss={() => setErrorMsg(null)} />
      <LoadingOverlay
        visible={isRecomputing}
        message="Finalizing your solar estimate..."
      />
      <QuestionScreenLayout
        onboardingStep={7}
        title={'When are you thinking\nof installing solar?'}
        subtitle={'No pressure. This helps us\npersonalize your next step.'}
        icon={<TimelineQuestionIcon height={100} />}
        options={[
          { label: 'As soon as possible' },
          { label: 'Within 3 months' },
          { label: 'Within 6 months' },
          { label: 'Just researching' },
        ]}
        onSelect={handleSelect}
        onBack={() => navigation.replace('PaymentQuestion', { result })}
      />
    </>
  );
}
