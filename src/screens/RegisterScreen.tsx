import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootStackParamList } from '@/src/navigation/types';
import { STORAGE_KEY } from '@/src/utils/storage';

import Logo from '@/src/components/Logo';
import { APP_BACKGROUND_COLOR } from '@/src/constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation, route }: Props) {
  const { result } = route.params;

  const [fullName, setFullName] = useState('Juan dela Cruz');
  const [email, setEmail] = useState('jcruz@example.com');
  const [password, setPassword] = useState('1234juan');
  const [showPassword, setShowPassword] = useState(false);
  const [consent, setConsent] = useState(false);

  async function handleSubmit() {
    if (!fullName.trim()) {
      Alert.alert('Missing name', 'Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Invalid email', 'Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak password', 'Password must be at least 8 characters.');
      return;
    }
    if (!consent) {
      Alert.alert('Consent required', 'Please agree to the terms to continue.');
      return;
    }

    const finalResult = {
      ...result,
      user_name: fullName.trim(),
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalResult));

    navigation.replace('Main', { result: finalResult });
  }

  return (
    <SafeAreaView style={registerStyles.screen} edges={['top', 'bottom']}>
      {/* Hero */}
      <View style={registerStyles.hero}>
        <View style={registerStyles.mascotContainer}>
          <Logo width={100} height={200} />
          <View style={registerStyles.readyBadge}>
            <Text style={registerStyles.readyBadgeText}>Ready! ☀️</Text>
          </View>
        </View>

        <Text style={registerStyles.title}>Your solar assessment is ready</Text>
        <Text style={registerStyles.subtitle}>
          Create your free account to save your report and view trusted
          providers near you.
        </Text>
      </View>

      {/* Form */}
      <View style={registerStyles.form}>
        {/* Full Name */}
        <View style={registerStyles.inputCard}>
          <Text style={registerStyles.inputLabel}>Full Name</Text>
          <TextInput
            style={registerStyles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Juan dela Cruz"
            placeholderTextColor="#807660"
            autoCapitalize="words"
          />
        </View>

        {/* Email */}
        <View
          style={[registerStyles.inputCard, registerStyles.inputCardDisabled]}
        >
          <Text style={registerStyles.inputLabel}>Email Address</Text>
          <TextInput
            style={[registerStyles.input, registerStyles.inputDisabled]}
            value={email}
            onChangeText={setEmail}
            placeholder="juan@example.com"
            placeholderTextColor="#807660"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={false}
          />
        </View>

        {/* Password */}
        <View
          style={[registerStyles.inputCard, registerStyles.inputCardDisabled]}
        >
          <Text style={registerStyles.inputLabel}>Create Password</Text>
          <View style={registerStyles.passwordRow}>
            <TextInput
              style={[
                registerStyles.input,
                registerStyles.inputDisabled,
                { flex: 1 },
              ]}
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 8 characters"
              placeholderTextColor="#807660"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              editable={false}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={registerStyles.eyeIcon}>
                {showPassword ? '🙈' : '👁️'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Consent */}
        <TouchableOpacity
          style={registerStyles.consentRow}
          onPress={() => setConsent(!consent)}
          activeOpacity={0.7}
        >
          <View
            style={[
              registerStyles.checkbox,
              consent && registerStyles.checkboxChecked,
            ]}
          >
            {consent && <Text style={registerStyles.checkmark}>✓</Text>}
          </View>
          <Text style={registerStyles.consentText}>
            I agree to receive my solar assessment and helpful energy-saving
            tips from Sunspark.
          </Text>
        </TouchableOpacity>

        {/* CTA */}
        <TouchableOpacity
          style={registerStyles.ctaButton}
          onPress={handleSubmit}
        >
          <Text style={registerStyles.ctaText}>View My Solar Assessment →</Text>
        </TouchableOpacity>

        <Text style={registerStyles.termsText}>
          By signing up, you agree to our{' '}
          <Text style={registerStyles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={registerStyles.termsLink}>Privacy Policy</Text>.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const registerStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: APP_BACKGROUND_COLOR,
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#d2c5ac',
    marginBottom: 20,
    marginHorizontal: -20,
    paddingHorizontal: 20,
    backgroundColor: APP_BACKGROUND_COLOR,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mascotContainer: {
    position: 'relative',
    width: 110,
    height: 110,
    marginBottom: 10,
  },
  mascot: {
    width: 110,
    height: 110,
  },
  readyBadge: {
    position: 'absolute',
    top: -8,
    right: -14,
    backgroundColor: '#8efc6e',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  readyBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#177500',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#201b11',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 14,
    color: '#4e4633',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  form: {
    flex: 1,
    gap: 12,
  },
  inputCard: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#d2c5ac',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  inputCardDisabled: {
    backgroundColor: '#f0ebe3',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4e4633',
    marginBottom: 4,
  },
  input: {
    fontSize: 16,
    color: '#201b11',
    padding: 0,
  },
  inputDisabled: {
    color: '#807660',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 18,
    paddingLeft: 8,
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#807660',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: '#765a00',
    borderColor: '#765a00',
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
  consentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4e4633',
    lineHeight: 18,
    flex: 1,
  },
  ctaButton: {
    backgroundColor: '#ffc928',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#d9a400',
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#201b11',
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#807660',
  },
  termsLink: {
    color: '#765a00',
    textDecorationLine: 'underline',
  },
});
