import { useNavigation, StackActions } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import Button from '../../components/Button';
import { Container, Title, SubTitle } from './styles';

const SignUpConfimation: React.FC = () => {
  const navigation = useNavigation();
  const goToSignIn = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Container>
      <Icon name="check" size={60} style={{ color: '#04D361' }} />
      <Title>Cadastro concluído</Title>
      <SubTitle>Agora só fazer seu login</SubTitle>
      <Button onPress={goToSignIn}>Ok</Button>
    </Container>
  );
};

export default SignUpConfimation;
