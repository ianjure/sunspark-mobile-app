import { SunsparkResult } from '@/src/types/sunspark';

export type RootStackParamList = {
  Loading: undefined;
  Welcome: undefined;
  Location: undefined;
  ScanBill: {
    latitude: number;
    longitude: number;
  };
  EditBill: {
    result: SunsparkResult;
    latitude?: number;
    longitude?: number;
  };
  HomeOwnershipQuestion: {
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
  Register: {
    result: SunsparkResult;
  };
  Main:
    | {
        result?: SunsparkResult;
      }
    | undefined;
};
