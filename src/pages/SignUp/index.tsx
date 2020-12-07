import React, { useCallback, useRef } from 'react';
import {
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import * as Yup from 'yup';
import Icon from 'react-native-vector-icons/Feather';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import { StackActions, useNavigation } from '@react-navigation/native';

import Input from '../../components/Input';
import Button from '../../components/Button';
import logoImg from '../../assets/logo.png';
import api from '../../services/api';

import {
  Container,
  Title,
  BackToSignInButton,
  BackToSignInButtonText,
} from './styles';
import getValidationErrors from '../../utils/getValidationErrors';

interface SignUpFormDataProps {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const navigation = useNavigation();
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const handleSignUp = useCallback(async (formData: SignUpFormDataProps) => {
    try {
      formRef.current?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome obrigatório'),
        email: Yup.string()
          .required('E-mail obrigatório')
          .email('Digite um e-mail válido'),
        password: Yup.string().required().min(6, 'No mínimo 6 caracteres'),
      });

      await schema.validate(formData, { abortEarly: false });

      await api.post('users', formData);
      navigation.dispatch(StackActions.replace('SignUpConfirmation'));
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors = getValidationErrors(err);
        formRef.current?.setErrors(validationErrors);
        return;
      }
      Alert.alert(
        'Erro no cadastro',
        'Ocorreu um erro ao realizar seu cadastro, tente novamente',
      );
    }
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flex: 1 }}
        >
          <Container>
            <Image source={logoImg} style={{ marginTop: 24 }} />
            <View>
              <Title>Crie sua conta</Title>
            </View>
            <Form
              onSubmit={handleSignUp}
              ref={formRef}
              style={{ width: '100%' }}
            >
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
              <Input
                ref={emailInputRef}
                name="email"
                icon="mail"
                placeholder="E-mail"
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                returnKeyType="next"
                onSubmitEditing={() => passwordInputRef.current?.focus()}
              />
              <Input
                ref={passwordInputRef}
                name="password"
                icon="lock"
                placeholder="Senha"
                secureTextEntry
                returnKeyType="send"
                textContentType="newPassword"
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />
              <Button
                onPress={() => {
                  formRef.current?.submitForm();
                }}
              >
                Cadastrar
              </Button>
            </Form>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
      <BackToSignInButton onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" color="#f4ede8" size={20} />
        <BackToSignInButtonText>Voltar para o login</BackToSignInButtonText>
      </BackToSignInButton>
    </>
  );
};

export default SignUp;
