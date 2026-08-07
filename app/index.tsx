import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';
import { RootStackParamList } from '@/src/navigation/types';
import EditBillScreen from '@/src/screens/EditBillScreen';
import HomeOwnershipQuestionScreen from '@/src/screens/HomeOwnershipQuestionScreen';
import LoadingScreen from '@/src/screens/LoadingScreen';
import LocationScreen from '@/src/screens/LocationScreen';
import MainScreen from '@/src/screens/MainScreen';
import PaymentQuestionScreen from '@/src/screens/PaymentQuestionScreen';
import QuoteScreen from '@/src/screens/QuoteScreen';
import RegisterScreen from '@/src/screens/RegisterScreen';
import RoofSpaceQuestionScreen from '@/src/screens/RoofSpaceQuestionScreen';
import ScanBillScreen from '@/src/screens/ScanBillScreen';
import SunlightQuestionScreen from '@/src/screens/SunlightQuestionScreen';
import TimelineQuestionScreen from '@/src/screens/TimelineQuestionScreen';
import WelcomeScreen from '@/src/screens/WelcomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <BottomSheetModalProvider>
          <Stack.Navigator
            initialRouteName="Loading"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: APP_BACKGROUND_COLOR },
            }}
          >
            <Stack.Screen name="Loading" component={LoadingScreen} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Location" component={LocationScreen} />
            <Stack.Screen name="ScanBill" component={ScanBillScreen} />
            <Stack.Screen name="EditBill" component={EditBillScreen} />
            <Stack.Screen
              name="HomeOwnershipQuestion"
              component={HomeOwnershipQuestionScreen}
            />
            <Stack.Screen
              name="SunlightQuestion"
              component={SunlightQuestionScreen}
            />
            <Stack.Screen
              name="RoofSpaceQuestion"
              component={RoofSpaceQuestionScreen}
            />
            <Stack.Screen
              name="PaymentQuestion"
              component={PaymentQuestionScreen}
            />
            <Stack.Screen
              name="TimelineQuestion"
              component={TimelineQuestionScreen}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="QuoteScreen" component={QuoteScreen} />
          </Stack.Navigator>
        </BottomSheetModalProvider>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
