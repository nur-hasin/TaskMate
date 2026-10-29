
import { Redirect, Tabs } from 'expo-router';
import {
  ChartNoAxesCombined,
  CheckCheck,
  ListTodo,
  UserRound,
} from 'lucide-react-native';
import { Platform } from 'react-native';

import LoadingView from '../../components/LoadingView';
import { useAuth } from '../../context/AuthContext';
import { TasksProvider } from '../../context/TasksContext';
import COLORS from '../../theme/colors';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingView />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <TasksProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarStyle: {
            backgroundColor: COLORS.surface,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
            paddingTop: 6,
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,
            height: Platform.OS === 'ios' ? 80 : 60,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color, focused }) => (
              <ListTodo
                color={color}
                size={23}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="completed"
          options={{
            title: 'Completed',
            tabBarIcon: ({ color, focused }) => (
              <CheckCheck
                color={color}
                size={23}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color, focused }) => (
              <ChartNoAxesCombined
                color={color}
                size={23}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <UserRound
                color={color}
                size={23}
                strokeWidth={focused ? 2.5 : 2}
              />
            ),
          }}
        />
      </Tabs>
    </TasksProvider>
  );
}
