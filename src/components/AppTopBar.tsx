import { styles } from '@/src/styles/styles';
import { Text, View } from 'react-native';

import Logo from '@/src/components/Logo';

export default function AppTopBar() {
  return (
    <View style={styles.topBar}>
      <View style={styles.brandRow}>
        <Logo width={150} height={25} />
      </View>

      <View style={styles.notificationButton}>
        <Text style={styles.notificationIcon}>🔔</Text>
      </View>
    </View>
  );
}
