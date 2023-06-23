import React, { useEffect, useState } from 'react'
import LoginForm from '../components/LoginForm'
import Account from '../components/Account'
import { useAuth } from '../context/AuthProvider'
import { Center } from 'native-base'

export default function LoginPage( {navigation} ) {
  const { user, session } = useAuth();

  return (
    <Center flex={1}>
      {session && user ? <Account /> : <LoginForm />}
    </Center>
  );
}
