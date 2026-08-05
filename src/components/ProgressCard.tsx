import { StyleSheet, Text, View } from 'react-native';

import DoneIcon from '@/src/components/icons/DoneIcon';
import NoneIcon from '@/src/components/icons/NoneIcon';
import PendingIcon from '@/src/components/icons/PendingIcon';
import { FONT_NUNITO_BOLD } from '@/src/constants/fonts';

type Status = 'done' | 'pending' | 'none';

type Props = {
  label: string;
  status: Status;
};

const STATUS_STYLES: Record<
  Status,
  { borderColor: string; backgroundColor: string }
> = {
  done: { borderColor: '#22C55E', backgroundColor: '#DCFCE7' },
  pending: { borderColor: '#F59E0B', backgroundColor: '#FEF3C7' },
  none: { borderColor: '#667085', backgroundColor: '#D0D5DD' },
};

const STATUS_ICONS: Record<Status, React.ReactNode> = {
  done: <DoneIcon />,
  pending: <PendingIcon />,
  none: <NoneIcon />,
};

export default function ProgressCard({ label, status }: Props) {
  const { borderColor, backgroundColor } = STATUS_STYLES[status];

  return (
    <View style={[styles.card, { borderColor, backgroundColor }]}>
      <View style={styles.iconContainer}>{STATUS_ICONS[status]}</View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginTop: 15,
    marginLeft: 15,
    marginBottom: 15,
    flexShrink: 0,
  },
  labelContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 15,
  },
  label: {
    fontFamily: FONT_NUNITO_BOLD,
    fontSize: 16,
    color: '#17202A',
  },
});
