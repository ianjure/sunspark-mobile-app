import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Badge from '@/src/components/Badge';
import PrimaryButton from '@/src/components/PrimaryButton';
import OffRatingIcon from '@/src/components/icons/OffRatingIcon';
import OnRatingIcon from '@/src/components/icons/OnRatingIcon';
import { MAIN_TEXT_COLOR } from '@/src/constants/colors';
import { FONT_INTER_BOLD, FONT_INTER_REGULAR } from '@/src/constants/fonts';
import { SolarDeveloper } from '@/src/types/provider';

const MAX_RATING = 5;

// Display-only mapping of star rating -> badge label/colors.
const RATING_BADGES: Record<
  number,
  { label: string; color: string; textColor?: string }
> = {
  5: { label: 'TOP RATED', color: '#1E88E5' },
  4: { label: 'RECOMMENDED', color: '#22C55E' },
  3: { label: 'RELIABLE', color: '#FFC928' },
  2: { label: 'BELOW AVERAGE', color: '#F59E0B' },
  1: { label: 'LOW RATED', color: '#EF4444' },
  0: { label: 'NOT RATED', color: '#D0D5DD', textColor: MAIN_TEXT_COLOR },
};

const getRatingBadge = (ratingValue: number) => {
  const rounded = Math.min(MAX_RATING, Math.max(0, Math.round(ratingValue)));
  return RATING_BADGES[rounded];
};

type Props = {
  provider: SolarDeveloper;
  onViewProfile: (provider: SolarDeveloper) => void;
};

export default function ProviderCard({ provider, onViewProfile }: Props) {
  const rating = provider.rating ?? 0;
  const location = provider.city_municipality ?? '';
  const badge = getRatingBadge(rating);

  const renderRatingIcons = (ratingValue: number) => {
    return Array.from({ length: MAX_RATING }, (_, index) =>
      index < ratingValue ? (
        <OnRatingIcon key={index} />
      ) : (
        <OffRatingIcon key={index} />
      ),
    );
  };

  return (
    <View style={styles.card}>
      {/* Top section: info + rating */}
      <View style={styles.topRow}>
        {/* Company info */}
        <View style={styles.info}>
          <Text style={styles.companyName} numberOfLines={3}>
            {provider.name}
          </Text>
          {location ? (
            <Text style={styles.companyLocation}>{location}</Text>
          ) : null}
        </View>

        {/* Star rating + badge */}
        <View style={styles.ratingColumn}>
          <Badge
            label={badge.label}
            color={badge.color}
            textColor={badge.textColor}
          />
          <View style={styles.ratingRow}>{renderRatingIcons(rating)}</View>
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
    minHeight: 200,
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
  ratingColumn: {
    alignItems: 'flex-end',
    gap: 15,
    flexShrink: 0,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  button: {
    marginHorizontal: 0,
    marginBottom: 2,
    marginTop: 20,
  },
});
