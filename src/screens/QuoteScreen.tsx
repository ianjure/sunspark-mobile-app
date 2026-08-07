import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import BackArrowButton from '@/src/components/icons/BackArrowButton';
import { APP_BACKGROUND_COLOR, MAIN_TEXT_COLOR } from '@/src/constants/colors';
import {
  FONT_INTER_EXTRABOLD,
  FONT_INTER_REGULAR,
  FONT_INTER_SEMIBOLD,
} from '@/src/constants/fonts';
import { RootStackParamList } from '@/src/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'QuoteScreen'>;

export default function QuoteScreen({ navigation, route }: Props) {
  const { provider } = route.params;

  const initials = provider?.name
    ? provider.name
        .split(' ')
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? '')
        .join('')
    : '☀';

  const location = [provider?.city_municipality, provider?.province]
    .filter(Boolean)
    .join(', ');

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: APP_BACKGROUND_COLOR }}
      edges={['top', 'bottom']}
    >
      {/* Top navbar — same pattern as ScanBillScreen */}
      <View style={{ flexDirection: 'row', marginRight: 20 }}>
        <BackArrowButton onPress={() => navigation.goBack()} />
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Your quote is ready!</Text>

        <View style={{ height: 20 }} />

        {/* Header — copied from ProviderProfileBottomSheet */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.providerName} numberOfLines={2}>
              {provider?.name}
            </Text>
            {location ? (
              <Text style={styles.providerLocation} numberOfLines={1}>
                {location}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={{ height: 20 }} />

        {/* Details section — copied from ProviderProfileBottomSheet */}
        <View style={styles.section}>
          <Text style={styles.fieldLabel}>Complete Address</Text>
          <Text style={styles.fieldValue}>
            {provider?.address ?? 'No address available'}
          </Text>

          <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
            Contact Number
          </Text>
          <Text style={styles.fieldValue}>
            {provider?.contact_number ?? 'Not available'}
          </Text>

          <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
            Email Address
          </Text>
          <Text style={styles.fieldValue}>
            {provider?.email ?? 'Not available'}
          </Text>

          <Text style={[styles.fieldLabel, styles.fieldLabelSpaced]}>
            Region
          </Text>
          <Text style={styles.fieldValue}>
            {provider?.region ?? 'Not available'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 30,
  },
  title: {
    fontFamily: FONT_INTER_EXTRABOLD,
    fontSize: 24,
    color: MAIN_TEXT_COLOR,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 12,
    backgroundColor: '#1F8F2E',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: FONT_INTER_EXTRABOLD,
    fontSize: 28,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerInfo: {
    flex: 1,
    paddingTop: 2,
  },
  providerName: {
    fontFamily: FONT_INTER_EXTRABOLD,
    fontSize: 22,
    color: MAIN_TEXT_COLOR,
    lineHeight: 28,
  },
  providerLocation: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 13,
    color: MAIN_TEXT_COLOR,
    marginTop: 5,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#D0D5DD',
    borderRadius: 20,
    padding: 15,
  },
  fieldLabel: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 12,
    color: MAIN_TEXT_COLOR,
  },
  fieldValue: {
    fontFamily: FONT_INTER_SEMIBOLD,
    fontSize: 15,
    color: MAIN_TEXT_COLOR,
  },
  fieldLabelSpaced: {
    marginTop: 15,
  },
});
