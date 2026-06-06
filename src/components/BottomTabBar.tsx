import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';

export type MainTab = 'home' | 'providers' | 'profile';

type Props = {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
};

const homeIconXml = `<svg width="45" height="40" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.450624 16.9621C-0.391324 17.9139 -0.00930259 19.2091 1.22907 19.4763C2.19871 19.6855 3.53154 19.9189 5.32701 20.1367C5.28432 21.5739 5.25828 23.2414 5.25828 25.1709C5.25828 30.3153 5.44336 33.5968 5.63573 35.6182C5.81221 37.4727 7.07029 38.8855 8.89769 39.1876C11.2732 39.5804 15.3836 40 22.1045 40C28.8254 40 32.9359 39.5804 35.3114 39.1876C37.1387 38.8855 38.3968 37.4727 38.5733 35.6182C38.7657 33.5968 38.9507 30.3153 38.9507 25.1709C38.9507 23.2416 38.9247 21.5741 38.882 20.1369C40.6781 19.9192 42.0113 19.6857 42.9813 19.4764C44.2199 19.2093 44.6019 17.9137 43.7597 16.9617C42.2819 15.2914 39.5342 12.4438 34.7402 8.22348C29.1886 3.33632 25.4662 1.21027 23.5736 0.328719C22.6325 -0.109629 21.5786 -0.109566 20.6376 0.328866C18.7453 1.2105 15.0233 3.33659 9.47095 8.22348C4.67572 12.4441 1.92803 15.2918 0.450624 16.9621Z" fill="#FFC928"/>
<path d="M13.6843 32.6307C13.6843 31.5781 14.5015 30.7092 15.5531 30.6642C17.0704 30.5995 19.3973 30.5254 22.1053 30.5254C24.8133 30.5254 27.1403 30.5995 28.6575 30.6642C29.7091 30.7092 30.5264 31.5781 30.5264 32.6307C30.5264 33.6832 29.7091 34.5521 28.6575 34.5971C27.1403 34.6618 24.8133 34.7359 22.1053 34.7359C19.3973 34.7359 17.0704 34.6618 15.5531 34.5971C14.5015 34.5521 13.6843 33.6832 13.6843 32.6307Z" fill="#EF4444"/>
</svg>`;

const providerIconXml = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M32.5737 26.6768C34.1906 24.0195 35.1219 20.899 35.1219 17.561C35.1219 7.86234 27.2596 0 17.561 0C7.86234 0 0 7.86234 0 17.561C0 27.2596 7.86234 35.1219 17.561 35.1219C20.899 35.1219 24.0195 34.1906 26.6768 32.5737C26.8372 32.7668 26.997 32.9597 27.1566 33.1522C28.8061 35.1423 30.4267 37.0975 32.2925 39.0226C33.4242 40.1903 35.1133 40.3591 36.3219 39.2713C36.7501 38.8859 37.2511 38.4125 37.8318 37.8318C38.4125 37.2511 38.8859 36.7501 39.2713 36.3219C40.3591 35.1133 40.1903 33.4242 39.0226 32.2925C37.0975 30.4267 35.1423 28.8061 33.1522 27.1566C32.9597 26.997 32.7668 26.8372 32.5737 26.6768Z" fill="#1E88E5"/>
<path d="M17.561 29.2677C24.0268 29.2677 29.2683 24.0261 29.2683 17.5603C29.2683 11.0946 24.0268 5.85303 17.561 5.85303C11.0952 5.85303 5.85367 11.0946 5.85367 17.5603C5.85367 24.0261 11.0952 29.2677 17.561 29.2677Z" fill="#A6CFFF"/>
</svg>`;

const profileIconXml = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.56198 35.315C0.73932 37.0322 1.86521 38.3915 3.55375 38.751C6.219 39.3184 11.2432 40 20 40C28.7568 40 33.781 39.3184 36.4463 38.751C38.1348 38.3915 39.2607 37.0322 39.438 35.315C39.701 32.7688 40 28.0939 40 20C40 11.9061 39.701 7.2312 39.438 4.68502C39.2607 2.96777 38.1348 1.60848 36.4462 1.24901C33.781 0.68162 28.7568 0 20 0C11.2432 0 6.219 0.68162 3.55375 1.24901C1.86521 1.60848 0.73932 2.96777 0.56198 4.68502C0.29904 7.2312 0 11.9061 0 20C0 28.0939 0.29904 32.7688 0.56198 35.315Z" fill="#58C33D"/>
<path d="M23.8764 23.7117C26.526 22.3165 28.3326 19.5359 28.3326 16.3333C28.3326 11.731 24.6015 8 19.9991 8C15.3968 8 11.6658 11.731 11.6658 16.3333C11.6658 19.536 13.4725 22.3168 16.1223 23.7119C12.5738 25.0639 9.86435 28.2184 9.02505 32.1058C8.90895 32.6438 9.20495 33.1961 9.74685 33.2942C11.6916 33.6461 14.9123 34 20.0012 34C25.09 34 28.3108 33.6461 30.2556 33.2942C30.7955 33.1965 31.0908 32.6463 30.9752 32.1102C30.137 28.2206 27.4265 25.0641 23.8764 23.7117Z" fill="#1F8F2E"/>
</svg>`;

const TABS: { id: MainTab; xml: string }[] = [
  { id: 'home', xml: homeIconXml },
  { id: 'providers', xml: providerIconXml },
  { id: 'profile', xml: profileIconXml },
];

export default function BottomTabBar({ activeTab, setActiveTab }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: insets.bottom }]}>
      <View style={styles.inner}>
        {TABS.map(({ id, xml }) => {
          const active = activeTab === id;
          return (
            <TouchableOpacity
              key={id}
              style={[styles.tabButton, active && styles.tabButtonActive]}
              onPress={() => setActiveTab(id)}
              activeOpacity={0.7}
            >
              <SvgXml xml={xml} width={34} height={34} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: APP_BACKGROUND_COLOR,
    borderTopWidth: 2,
    borderTopColor: '#D0D5DD',
  },
  inner: {
    height: 85,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
  },
  tabButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
  },
  tabButtonActive: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#D0D5DD',
  },
});
