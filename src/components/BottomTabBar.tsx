import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from '@/src/styles/styles';

export type MainTab = 'home' | 'providers' | 'profile';

type Props = {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
};

export default function BottomTabBar({ activeTab, setActiveTab }: Props) {
  return (
    <View style={styles.bottomTabBar}>
      <TabButton
        label="Home"
        icon="🏠"
        active={activeTab === 'home'}
        onPress={() => setActiveTab('home')}
      />

      <TabButton
        label="Providers"
        icon="🏪"
        active={activeTab === 'providers'}
        onPress={() => setActiveTab('providers')}
      />

      <TabButton
        label="Profile"
        icon="👤"
        active={activeTab === 'profile'}
        onPress={() => setActiveTab('profile')}
      />
    </View>
  );
}

function TabButton({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={active ? styles.bottomTabActive : styles.bottomTabItem}
      onPress={onPress}
    >
      <Text style={active ? styles.bottomTabActiveIcon : styles.bottomTabIcon}>
        {icon}
      </Text>

      <Text style={active ? styles.bottomTabActiveText : styles.bottomTabText}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
