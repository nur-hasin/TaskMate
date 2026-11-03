import { Redirect, Tabs } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Platform, Pressable } from 'react-native';

import {
  ChartNoAxesCombined,
  CheckCheck,
  ListTodo,
  UserRound,
} from 'lucide-react-native';

import LoadingView from '../../components/LoadingView';
import { useAuth } from '../../context/AuthContext';
import { TasksProvider } from '../../context/TasksContext';
import COLORS from '../../theme/colors';

function AnimatedTabIcon({ Icon, color, focused }) {
  const [scale] = useState(
    () => new Animated.Value(focused ? 1.13 : 1)
  );

  const [translateY] = useState(
    () => new Animated.Value(focused ? -2 : 0)
  );

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.13 : 1,
        damping: 13,
        stiffness: 180,
        mass: 0.7,
        useNativeDriver: true,
      }),

      Animated.spring(translateY, {
        toValue: focused ? -2 : 0,
        damping: 13,
        stiffness: 180,
        mass: 0.7,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => animation.stop();
  }, [focused, scale, translateY]);

  return (
    <Animated.View
      style={{
        transform: [
          { translateY },
          { scale },
        ],
      }}
    >
      <Icon
        color={color}
        size={23}
        strokeWidth={focused ? 2.6 : 2}
      />
    </Animated.View>
  );
}


function NoFeedbackTabButton({ style, ...props }) {
  const staticStyle =
    typeof style === 'function'
      ? style({ pressed: false })
      : style;

  return (
    <Pressable
      {...props}
      style={staticStyle}
      android_ripple={null}
      android_disableSound
    />
  );
}

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

          tabBarButton: (props) => (
            <NoFeedbackTabButton {...props} />
          ),

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
              <AnimatedTabIcon
                Icon={ListTodo}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="completed"
          options={{
            title: 'Completed',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon
                Icon={CheckCheck}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="analytics"
          options={{
            title: 'Analytics',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon
                Icon={ChartNoAxesCombined}
                color={color}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <AnimatedTabIcon
                Icon={UserRound}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </TasksProvider>
  );
}
