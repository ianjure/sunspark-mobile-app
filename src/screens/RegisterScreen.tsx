import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { RootStackParamList } from '@/src/navigation/types';
import { styles } from '@/src/styles/styles';
import { STORAGE_KEY } from '@/src/utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation, route }: Props) {
  const { result } = route.params;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <View style={registerStyles.screen}>
      {/* Header */}
      <View style={registerStyles.header}>
        <View style={styles.brandIcon}>
          <Text style={styles.brandIconText}>☀️</Text>
        </View>
        <Text style={styles.brandText}>Sunspark</Text>
      </View>

      {/* Hero */}
      <View style={registerStyles.hero}>
        <View style={registerStyles.mascotContainer}>
          <Image
            source={{
              uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtESJWK7KtBfRK8FsVWk3iajCPv1oAzxL4mGdKPeFz4lGBbwOqWmMF1RYIC6bzfMJeXLN-Kc1XvJYz0WG-t3UOAqsUtpv7Nd1PhXTiilqjV5C6koXchKCnwo2m_RVjD42zb5eMzZDMMl-x6JMotNhtWA6X04WKdqlbcuKfr23ktlwFx8TmrPTFpsbnyLP3VEX0yAmGEW4FmaXZTuG0G0233X9slyUy7dgWkHTaF07Q5Psbo5eJ6mz1iWMn43xBCQO-GBn1p_KYeEf6',
            }}
            style={registerStyles.mascot}
            resizeMode="contain"
          />
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
        <View style={registerStyles.inputCard}>
          <Text style={registerStyles.inputLabel}>Email Address</Text>
          <TextInput
            style={registerStyles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="juan@example.com"
            placeholderTextColor="#807660"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={registerStyles.inputCard}>
          <Text style={registerStyles.inputLabel}>Create Password</Text>
          <View style={registerStyles.passwordRow}>
            <TextInput
              style={[registerStyles.input, { flex: 1 }]}
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 8 characters"
              placeholderTextColor="#807660"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
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
    </View>
  );
}

const registerStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff8f1',
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
    backgroundColor: '#fff8f1',
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
