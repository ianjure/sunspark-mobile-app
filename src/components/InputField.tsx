import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { FONT_INTER_BOLD } from '@/src/constants/fonts';

type InputFieldProps = TextInputProps & {
  title?: string;
  style?: ViewStyle;
};

export default function InputField({
  title,
  style,
  ...textInputProps
}: InputFieldProps) {
  return (
    <View style={[styles.wrapper, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <TextInput
        style={styles.input}
        placeholderTextColor="#D0D5DD"
        {...textInputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
  },
  title: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 18,
    color: '#667085',
    marginBottom: 4,
  },
  input: {
    height: 55,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D0D5DD',
    paddingHorizontal: 16,
    fontFamily: FONT_INTER_BOLD,
    fontSize: 16,
    color: '#17202A',
  },
});
