import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import PrimaryButton from '@/src/components/PrimaryButton';
import { FONT_INTER_BOLD, FONT_INTER_MEDIUM } from '@/src/constants/fonts';
import { FinancingPartner } from '@/src/types/financer';

// Static require map: bank name -> logo asset.
// RN require() calls must be static, so this map is necessary
// instead of dynamically building the path from bankName.
const BANK_LOGOS: Record<string, any> = {
  BPI: require('@/assets/images/bpi-logo.png'),
  RCBC: require('@/assets/images/rcbc-logo.png'),
  'Security Bank': require('@/assets/images/security-bank-logo.png'),
  // Add additional banks here as they're onboarded.
};

const formatMonthlyPayment = (amount: number) => {
  const rounded = Math.round(amount);
  return `₱${rounded.toLocaleString('en-PH')}/month`;
};

type Props = {
  partner: FinancingPartner;
  bankName: string;
  monthlyPayment: number;
  onApply: (partner: FinancingPartner) => void;
  style?: StyleProp<ViewStyle>;
};

export default function LoanCard({
  partner,
  bankName,
  monthlyPayment,
  onApply,
  style,
}: Props) {
  const logoSource = BANK_LOGOS[bankName];

  return (
    <View style={[styles.card, style]}>
      {/* Top section: product name + logo/bank vs monthly payment */}
      <View style={styles.topRow}>
        <View style={styles.info}>
          {logoSource ? (
            <Image
              source={logoSource}
              style={styles.bankLogo}
              resizeMode="contain"
            />
          ) : null}
          <Text style={styles.productName} numberOfLines={2}>
            {partner.product_name}
          </Text>
        </View>

        <Text style={styles.monthlyPayment}>
          {formatMonthlyPayment(monthlyPayment)}
        </Text>
      </View>

      {/* Primary button pinned to bottom */}
      <PrimaryButton
        label="APPLY FOR FINANCING"
        onPress={() => onApply(partner)}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 150,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D0D5DD',
    padding: 20,
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 20,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  productName: {
    flex: 1,
    fontFamily: FONT_INTER_MEDIUM,
    fontSize: 16,
    color: '#17202A',
    lineHeight: 24,
  },
  bankLogo: {
    height: 25,
    width: undefined,
    aspectRatio: 1, // overridden per-image via intrinsic size below
    flexShrink: 0,
  },
  monthlyPayment: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 16,
    color: '#17202A',
    flexShrink: 0,
  },
  button: {
    marginHorizontal: 0,
    marginBottom: 2,
    marginTop: 0,
  },
});
