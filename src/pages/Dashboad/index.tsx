import React from 'react';
import { View, Text } from 'react-native';

import { useAuth } from '../../hooks/auth';
import Button from '../../components/Button';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Button onPress={signOut}>Sign Out</Button>
    </View>
  );
};

export default Dashboard;
