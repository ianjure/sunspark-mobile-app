import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/src/navigation/types';
import EditBillScreen from '@/src/screens/EditBillScreen';
import HomeOwnershipQuestionScreen from '@/src/screens/HomeOwnershipQuestionScreen';
import LoadingScreen from '@/src/screens/LoadingScreen';
import LocationScreen from '@/src/screens/LocationScreen';
import MainScreen from '@/src/screens/MainScreen';
import PaymentQuestionScreen from '@/src/screens/PaymentQuestionScreen';
import RoofSpaceQuestionScreen from '@/src/screens/RoofSpaceQuestionScreen';
import ScanBillScreen from '@/src/screens/ScanBillScreen';
import SunlightQuestionScreen from '@/src/screens/SunlightQuestionScreen';
import TimelineQuestionScreen from '@/src/screens/TimelineQuestionScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Loading"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Loading" component={LoadingScreen} />
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
          <Stack.Screen name="Main" component={MainScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}
