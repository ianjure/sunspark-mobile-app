import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

import {
  APP_BACKGROUND_COLOR,
  BORDER_COLOR,
  MAIN_TEXT_COLOR,
  MUTED_TEXT_COLOR,
} from '@/src/constants/colors';
import { FONT_INTER_BOLD } from '@/src/constants/fonts';

type ModalInputFieldProps = TextInputProps & {
  title?: string;
  style?: ViewStyle;
};

export default function ModalInputField({
  title,
  style,
  value,
  placeholder,
  onChangeText,
  ...textInputProps
}: ModalInputFieldProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const inputRef = useRef<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const snapPoints = useMemo(() => ['30%'], []);

  useEffect(() => {
    if (!isSheetOpen) return;

    // On Android, the first back press closes the keyboard without triggering
    // BackHandler. We listen for keyboard hide and dismiss the sheet then,
    // so the user doesn't need a second back press to close the modal.
    const keyboardSub = Keyboard.addListener('keyboardDidHide', () => {
      bottomSheetRef.current?.dismiss();
    });

    const backSub = BackHandler.addEventListener('hardwareBackPress', () => {
      inputRef.current?.blur();
      bottomSheetRef.current?.dismiss();
      return true;
    });

    return () => {
      keyboardSub.remove();
      backSub.remove();
    };
  }, [isSheetOpen]);

  const handleOpen = useCallback(() => {
    setIsSheetOpen(true);
    bottomSheetRef.current?.present();

    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
      />
    ),
    [],
  );

  return (
    <>
      <View style={[styles.wrapper, style]}>
        {title && <Text style={styles.title}>{title}</Text>}

        <Pressable onPress={handleOpen}>
          <View style={styles.input}>
            <Text style={[styles.inputText, !value && styles.placeholderText]}>
              {value || placeholder}
            </Text>
          </View>
        </Pressable>
      </View>

      <BottomSheetModal
        ref={bottomSheetRef}
        onDismiss={() => {
          inputRef.current?.blur();
          setIsSheetOpen(false);
        }}
        enableDynamicSizing
        keyboardBehavior="interactive"
        keyboardBlurBehavior="none"
        backdropComponent={renderBackdrop}
        handleComponent={() => null}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
      >
        <BottomSheetView style={styles.sheet}>
          {title && <Text style={styles.title}>{title}</Text>}

          <BottomSheetTextInput
            ref={inputRef}
            style={styles.input}
            value={value?.toString()}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={BORDER_COLOR}
            returnKeyType="done"
            onSubmitEditing={() => {
              inputRef.current?.blur();
              bottomSheetRef.current?.dismiss();
            }}
            {...textInputProps}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </>
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
    justifyContent: 'center',
  },
  inputText: {
    fontFamily: FONT_INTER_BOLD,
    fontSize: 16,
    color: MAIN_TEXT_COLOR,
  },
  placeholderText: {
    color: BORDER_COLOR,
  },
  sheetBackground: {
    backgroundColor: APP_BACKGROUND_COLOR,
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
});
