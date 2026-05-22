import { Text, View } from 'react-native';

import { styles } from '@/src/styles/styles';

export default function AppTopBar() {
  return (
    <View style={styles.topBar}>
      <View style={styles.brandRow}>
        <View style={styles.brandIcon}>
          <Text style={styles.brandIconText}>☀️</Text>
        </View>

        <Text style={styles.brandText}>Sunspark</Text>
      </View>

      <View style={styles.notificationButton}>
        <Text style={styles.notificationIcon}>🔔</Text>
      </View>
    </View>
  );
}
