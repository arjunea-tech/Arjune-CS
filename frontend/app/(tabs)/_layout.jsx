import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Tabs } from 'expo-router'
import { Text } from 'react-native'

export default function _layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B00',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text 
              style={{
                fontSize: 12,
                fontWeight: focused ? '700' : '400',
                color,
              }}
            >
              Home
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'home' : 'home-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Cart"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontSize: 12,
                fontWeight: focused ? '700' : '400',
                color,
              }}
            >
              Cart
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'cart' : 'cart-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Orders"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontSize: 12,
                fontWeight: focused ? '700' : '400',
                color,
              }}
            >
              Orders
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'clipboard-text' : 'clipboard-text-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Chit"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontSize: 12,
                fontWeight: focused ? '700' : '400',
                color,
              }}
            >
              Chit
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'wallet' : 'wallet-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text
              style={{
                fontSize: 12,
                fontWeight: focused ? '700' : '400',
                color,
              }}
            >
              Profile
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'account' : 'account-outline'}
              size={28}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  )
}
