import { SunsparkResult } from "@/src/types/sunspark";

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
  Main:
    | {
        result?: SunsparkResult;
      }
    | undefined;
};