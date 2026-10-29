import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import LoadingView from '../../components/LoadingView';

export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingView />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
