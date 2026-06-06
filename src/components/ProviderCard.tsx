import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import PrimaryButton from '@/src/components/PrimaryButton';
import {
  FONT_INTER_BOLD,
  FONT_INTER_EXTRABOLD,
  FONT_INTER_REGULAR,
} from '@/src/constants/fonts';
import { SolarDeveloper } from '@/src/types/provider';

type Props = {
  provider: SolarDeveloper;
  onViewProfile: (provider: SolarDeveloper) => void;
};

export default function ProviderCard({ provider, onViewProfile }: Props) {
  const initials = provider.name
    ? provider.name
        .split(' ')
        .slice(0, 2)
        .map((word) => word[0]?.toUpperCase() ?? '')
        .join('')
    : '☀';

  const location = [provider.city_municipality, provider.province]
    .filter(Boolean)
    .join(',\n');

  return (
    <View style={styles.card}>
      {/* Top section: avatar + info */}
      <View style={styles.topRow}>
        {/* Profile pic */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>

        {/* Company info */}
        <View style={styles.info}>
          <Text style={styles.companyName} numberOfLines={2}>
            {provider.name}
          </Text>
          {location ? (
            <Text style={styles.companyLocation}>{location}</Text>
          ) : null}
        </View>
      </View>

      {/* Primary button pinned to bottom */}
      <PrimaryButton
        label="VIEW PROFILE"
        onPress={() => onViewProfile(provider)}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 200,
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
  info: {
    flex: 1,
  },
  companyName: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 18,
    color: '#17202A',
    lineHeight: 24,
  },
  companyLocation: {
    fontFamily: FONT_INTER_REGULAR,
    fontSize: 12,
    color: '#667085',
    marginTop: 5,
    lineHeight: 16,
  },
  button: {
    marginHorizontal: 0,
    marginBottom: 2,
  },
});
