import { Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import LoadingView from '../components/LoadingView';

export default function IndexScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingView />;
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
