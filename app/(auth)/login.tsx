import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import { RootState, AppDispatch } from '@/store';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  ColorSchemeName,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Redirect } from 'expo-router';
import Toast from 'react-native-toast-message';


const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const scheme: ColorSchemeName = useColorScheme();
  const isDark = scheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
      })
      return;
    }
  
    if (password.length < 5) {      
      Toast.show({
        type: 'error',
        text1: 'Invalid Password',
        text2: 'Password must be at least 5 characters long.',
      })
      return;
    }
  
    try {    
      setLoading(true);
      const response = await dispatch(login({ email, password })); 

      if (response.payload) {
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back!',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Please check your credentials and try again.',
        });
      }

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: 'An error occurred while trying to log in. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log('Forgot password tapped');
  };

  const themedStyles = getStyles(isDark);

  if (isAuthenticated) {
    return <Redirect href="/(drawer)/(home)" />;
  }

  return (
    <SafeAreaView style={themedStyles.container}>
      <Text style={themedStyles.appName}>Ponto Tracker</Text>

      <Text style={themedStyles.title}>Welcome back 👋</Text>

      <TextInput
        style={themedStyles.input}
        placeholder="Email"
        placeholderTextColor={isDark ? '#aaa' : '#888'}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <View style={themedStyles.passwordContainer}>
        <TextInput
          style={themedStyles.passwordInput}
          placeholder="Password"
          placeholderTextColor={isDark ? '#aaa' : '#888'}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color={isDark ? '#aaa' : '#888'}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={themedStyles.forgotText}>Forgot your password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={themedStyles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={themedStyles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Login;

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: isDark ? '#121212' : '#fff',
      justifyContent: 'center',
    },
    appName: {
      fontSize: 32,
      fontWeight: '800',
      alignSelf: 'center',
      marginBottom: 10,
      color: isDark ? '#1E90FF' : '#1E90FF',
    },
    title: {
      fontSize: 28,
      fontWeight: '600',
      marginBottom: 32,
      alignSelf: 'center',
      color: isDark ? '#fff' : '#000',
    },
    input: {
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#ccc',
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
      backgroundColor: isDark ? '#1E1E1E' : '#fff',
      marginHorizontal: 20,
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: isDark ? '#444' : '#ccc',
      borderRadius: 12,
      paddingHorizontal: 14,
      marginBottom: 12,
      marginHorizontal: 20,
      backgroundColor: isDark ? '#1E1E1E' : '#fff',
    },
    passwordInput: {
      flex: 1,
      height: 50,
      fontSize: 16,
      color: isDark ? '#fff' : '#000',
    },
    forgotText: {
      color: '#1E90FF',
      alignSelf: 'flex-end',
      marginBottom: 24,
      marginHorizontal: 23,
    },
    loginButton: {
      backgroundColor: '#1E90FF',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 16,
      marginHorizontal: 20,
    },
    loginButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#fff',
    },
  });