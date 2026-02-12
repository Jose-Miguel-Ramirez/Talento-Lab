import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ThemedText } from '@/components/themed-text';
import LandingPage from '@/components/LandingPage';
import TalentDashboard from '@/components/dashboard/TalentDashboard';
import ClientDashboard from '@/components/dashboard/ClientDashboard';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        await fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Check user error:', error);
      setErrorMsg(error.message);
      setIsLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile not found, try to recover
          console.log('Profile missing, attempting recovery...');
          return await recoverProfile();
        }
        throw error;
      }
      setProfile(data);
    } catch (error: any) {
      console.error('Fetch profile error:', error);
      setErrorMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const recoverProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { user } = session;
      const meta = user.user_metadata;

      // Attempt to insert profile from metadata
      const { error } = await supabase.from('profiles').insert({
        id: user.id,
        email: user.email,
        first_name: meta.first_name || 'Usuario',
        middle_name: meta.middle_name || '',
        last_name: meta.last_name || 'Desconocido',
        second_last_name: meta.second_last_name || '',
        phone: meta.phone || '',
        user_type: meta.user_type || 'client', // Default fallback
      });

      if (error) throw error;

      // If talent, create talent profile container if needed?
      if (meta.user_type === 'talent') {
        await supabase.from('talent_profiles').insert({
          id: user.id,
          profession: meta.profession || 'Sin especificar',
        });
      } else {
        await supabase.from('client_profiles').insert({ id: user.id });
      }

      // Fetch again
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) setProfile(data);

    } catch (err: any) {
      console.error('Recovery failed:', err);
      setErrorMsg('Fallo al recuperar perfil: ' + (err.message || 'Error desconocido'));
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color={Colors.brand.darkBlue} />
        <ThemedText style={{ marginTop: 20 }}>Cargando perfil...</ThemedText>
      </View>
    );
  }

  if (!session) {
    return <LandingPage />;
  }

  if (errorMsg) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 }}>
        <IconSymbol name="exclamationmark.triangle.fill" size={48} color="#EF4444" />
        <ThemedText style={{ marginTop: 20, textAlign: 'center', color: '#EF4444' }}>{errorMsg}</ThemedText>
        <ThemedText style={{ marginTop: 10, textAlign: 'center' }} type="defaultSemiBold">Intenta cerrar sesión o contactar soporte.</ThemedText>

        <View style={{ marginTop: 30, gap: 10 }}>
          <ThemedText
            style={{ color: Colors.brand.darkBlue, textDecorationLine: 'underline' }}
            onPress={() => { setErrorMsg(null); setIsLoading(true); checkUser(); }}
          >
            Reintentar
          </ThemedText>

          <ThemedText
            style={{ color: '#666', textDecorationLine: 'underline' }}
            onPress={async () => { await supabase.auth.signOut(); setSession(null); }}
          >
            Cerrar Sesión
          </ThemedText>
        </View>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 }}>
        <ActivityIndicator size="large" color={Colors.brand.darkBlue} />
        <ThemedText style={{ marginTop: 20, textAlign: 'center' }}>Configurando tu perfil...</ThemedText>
      </View>
    );
  }

  if (profile.user_type === 'talent') {
    return <TalentDashboard profile={profile} />;
  }

  return <ClientDashboard profile={profile} />;
}
