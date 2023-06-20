import React from 'react'
import { View } from 'react-native'
import Account from '../components/Account';
import { useAuth } from '../context/Auth'

export default function ProfilePage() {
  const { session, user } = useAuth();
  return (
    <View>
      <Account key={user?.id}></Account>
    </View>
  );
}
