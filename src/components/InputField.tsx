import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import {
  BORDER_COLOR,
  MAIN_TEXT_COLOR,
  MUTED_TEXT_COLOR,
} from '@/src/constants/colors';
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
  const isDisabled = textInputProps.editable === false;

  return (
    <View style={[styles.wrapper, style]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <TextInput
        style={[styles.input, isDisabled && styles.inputDisabled]}
        placeholderTextColor={BORDER_COLOR}
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
    color: MUTED_TEXT_COLOR,
    marginBottom: 4,
  },
  input: {
    height: 55,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    paddingHorizontal: 16,
    fontFamily: FONT_INTER_BOLD,
    fontSize: 16,
    color: MAIN_TEXT_COLOR,
  },
  inputDisabled: {
    color: MUTED_TEXT_COLOR,
    backgroundColor: BORDER_COLOR,
  },
});
