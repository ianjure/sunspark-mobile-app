import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback, useMemo } from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import PrimaryButton from '@/src/components/PrimaryButton';
import SecondaryButton from '@/src/components/SecondaryButton';
import { APP_BACKGROUND_COLOR, MAIN_TEXT_COLOR } from '@/src/constants/colors';
import {
  FONT_INTER_BLACK,
  FONT_INTER_BOLD,
  FONT_INTER_REGULAR,
  FONT_INTER_SEMIBOLD,
} from '@/src/constants/fonts';
import { SolarDeveloper } from '@/src/types/provider';

type Props = {
  provider: SolarDeveloper | null;
  onClosePressed: () => void;
  onDismiss: () => void;
};

const SHEET_TOP_RADIUS = 20;
const BUTTON_GAP = 15;
const BOTTOM_PADDING = 22;

const ProviderProfileBottomSheet = forwardRef<BottomSheetModal, Props>(
  function ProviderProfileBottomSheet(
    { provider, onClosePressed, onDismiss },
    ref,
  ) {
    const insets = useSafeAreaInsets();

    const snapPoints = useMemo(() => ['84%'], []);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.45}
          pressBehavior="close"
        />
      ),
      [],
    );

    const renderHandle = useCallback(() => <View style={{ height: 0 }} />, []);

    function openEmail(email: string | null) {
      if (!email || email === 'N/A') return;
      Linking.openURL(`mailto:${email.split('/')[0].trim()}`);
    }

    function callProvider(phone: string | null) {
      if (!phone || phone === 'N/A') return;
      Linking.openURL(`tel:${phone.split('/')[0].trim()}`);
    }

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
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        enableContentPanningGesture={false}
        backdropComponent={renderBackdrop}
        handleComponent={renderHandle}
        backgroundStyle={styles.sheetBackground}
        onDismiss={onDismiss}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
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

          <View style={{ height: 25 }} />

          {/* Details section */}
          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Complete Address</Text>
            <Text style={styles.fieldValue}>
              {provider?.address ?? 'No address available'}
            </Text>

            <Text style={styles.fieldLabel}>Contact Number</Text>
            <View style={styles.fieldRow}>
              <Text style={[styles.fieldValue, { flex: 1, marginTop: 0 }]}>
                {provider?.contact_number ?? 'Not available'}
              </Text>
              {provider?.contact_number &&
                provider.contact_number !== 'N/A' && (
                  <TouchableOpacity
                    onPress={() =>
                      callProvider(provider.contact_number ?? null)
                    }
                    style={styles.callButton}
                  >
                    <Text style={{ fontSize: 17 }}>📞</Text>
                  </TouchableOpacity>
                )}
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
              Email Address
            </Text>
            <View style={styles.fieldRow}>
              <Text style={[styles.fieldValue, { flex: 1, marginTop: 0 }]}>
                {provider?.email ?? 'Not available'}
              </Text>
              {provider?.email && provider.email !== 'N/A' && (
                <TouchableOpacity
                  onPress={() => openEmail(provider.email ?? null)}
                  style={styles.emailButton}
                >
                  <Text style={{ fontSize: 17 }}>✉️</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.fieldLabel}>Region</Text>
            <Text style={styles.fieldValue}>
              {provider?.region ?? 'Not available'}
            </Text>
          </View>
        </BottomSheetScrollView>

        {/* Footer pinned outside the scroll — mirrors LocationMapPickerBottomSheet */}
        <View
          style={[
            styles.footer,
            { paddingBottom: insets.bottom + BOTTOM_PADDING },
          ]}
        >
          <PrimaryButton
            label="REQUEST A QUOTE"
            onPress={() => {}}
            style={styles.footerButton}
          />
          <View style={{ height: BUTTON_GAP }} />
          <SecondaryButton
            label="CLOSE"
            onPress={onClosePressed}
            style={styles.footerButton}
          />
        </View>
      </BottomSheetModal>
    );
  },
);

export default ProviderProfileBottomSheet;

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: APP_BACKGROUND_COLOR,
    borderTopLeftRadius: SHEET_TOP_RADIUS,
    borderTopRightRadius: SHEET_TOP_RADIUS,
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
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
    fontFamily: FONT_INTER_BOLD,
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  headerInfo: {
    flex: 1,
    paddingTop: 2,
  },
  providerName: {
    fontFamily: FONT_INTER_BLACK,
    fontSize: 22,
    fontWeight: '900',
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
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#D0D5DD',
    borderRadius: 18,
    padding: 16,
  },
  fieldLabel: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 15,
    color: MAIN_TEXT_COLOR,
    marginTop: 12,
  },
  fieldValue: {
    fontFamily: FONT_INTER_SEMIBOLD,
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
    color: MAIN_TEXT_COLOR,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  callButton: {
    marginLeft: 8,
    padding: 7,
    backgroundColor: '#D0D5DD',
    borderRadius: 10,
  },
  emailButton: {
    marginLeft: 8,
    padding: 7,
    backgroundColor: '#D0D5DD',
    borderRadius: 10,
  },
  footer: {
    paddingTop: 10,
    backgroundColor: APP_BACKGROUND_COLOR,
  },
  footerButton: {
    marginHorizontal: 20,
  },
});
