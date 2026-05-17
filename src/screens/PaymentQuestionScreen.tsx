import { NativeStackScreenProps } from "@react-navigation/native-stack";

import QuestionScreenLayout from "@/src/components/QuestionScreenLayout";
import { RootStackParamList } from "@/src/navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "PaymentQuestion">;

export default function PaymentQuestionScreen({ navigation, route }: Props) {
  const { result } = route.params;

  function handleSelect(answer: string) {
    navigation.replace("TimelineQuestion", {
      result: {
        ...result,
        assessment_answers: {
          ...result.assessment_answers,
          payment_preference: answer,
        },
      },
    });
  }

  return (
    <QuestionScreenLayout
      currentStep={3}
      totalSteps={4}
      progress={75}
      title="How would you prefer to pay for solar?"
      subtitle="This helps match you with the right providers."
      options={[
        { label: "Cash" },
        { label: "Installment or financing" },
        { label: "Lease-to-own" },
        { label: "Not sure yet" },
      ]}
      onSelect={handleSelect}
      onBack={() => navigation.replace("RoofSpaceQuestion", { result })}
    />
  );
}