import { SunsparkResult } from '@/src/types/sunspark';

export type RootStackParamList = {
  Loading: undefined;
  Location: undefined;
  ScanBill: {
    latitude: number;
    longitude: number;
  };
  EditBill: {
    result: SunsparkResult;
  };
  SunlightQuestion: {
    result: SunsparkResult;
  };
  RoofSpaceQuestion: {
    result: SunsparkResult;
  };
  PaymentQuestion: {
    result: SunsparkResult;
  };
  TimelineQuestion: {
    result: SunsparkResult;
  };
  Main:
    | {
        result?: SunsparkResult;
      }
    | undefined;
};
