import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList } from "@/src/navigation/types";
import EditBillScreen from "@/src/screens/EditBillScreen";
import LoadingScreen from "@/src/screens/LoadingScreen";
import LocationScreen from "@/src/screens/LocationScreen";
import MainScreen from "@/src/screens/MainScreen";
import ScanBillScreen from "@/src/screens/ScanBillScreen";

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
          <Stack.Screen name="Main" component={MainScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}