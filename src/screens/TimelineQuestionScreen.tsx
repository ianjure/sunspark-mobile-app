import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import QuestionScreenLayout from "@/src/components/QuestionScreenLayout";
import { RootStackParamList } from "@/src/navigation/types";
import { STORAGE_KEY } from "@/src/utils/storage";

type Props = NativeStackScreenProps<RootStackParamList, "TimelineQuestion">;

export default function TimelineQuestionScreen({ navigation, route }: Props) {
  const { result } = route.params;

  async function handleSelect(answer: string) {
    const finalResult = {
      ...result,
      assessment_answers: {
        ...result.assessment_answers,
        installation_timeline: answer,
      },
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalResult));

    navigation.replace("Main", {
      result: finalResult,
    });
  }

  return (
    <QuestionScreenLayout
      currentStep={4}
      totalSteps={4}
      progress={100}
      title="When are you thinking of installing solar?"
      subtitle="No pressure. This helps us personalize your next step."
      options={[
        { label: "As soon as possible" },
        { label: "Within 3 months" },
        { label: "Within 6 months" },
        { label: "Just researching" },
      ]}
      onSelect={handleSelect}
      onBack={() => navigation.replace("PaymentQuestion", { result })}
    />
  );
}