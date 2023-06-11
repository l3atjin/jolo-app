import "react-native-gesture-handler";
import "react-native-url-polyfill/auto";
import React, { useState, useEffect } from "react";
import { supabase } from "./src/api/supabase";
import { Session } from "@supabase/supabase-js";
import { PaperProvider } from 'react-native-paper';
import RootNavigator from "./src/navigations/RootNavigator";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </PaperProvider>
  );
}
