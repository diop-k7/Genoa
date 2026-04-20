import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import TreeScreen from './screens/TreeScreen';
import MemberScreen from './screens/MemberScreen';
import AddMemberScreen from './screens/AddMemberScreen';
import EditMemberscreen from './screens/EditMemberscreen';
import StatisticsScreen from './screens/StatisticsScreen';
import AdminScreen from './screens/AdminScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Tree"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Inscription' }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: '🌳 Genoa',
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Tree"
          component={TreeScreen}
          options={{ title: 'Arbre Généalogique' }}
        />
        <Stack.Screen
          name="Members"
          component={MemberScreen}
          options={{ title: 'Membres de la Famille' }}
        />
        <Stack.Screen
          name="AddMember"
          component={AddMemberScreen}
          options={{ title: 'Ajouter un Membre' }}
        />
        <Stack.Screen
          name="EditMember"
          component={EditMemberscreen}
          options={{ title: 'Modifier un Membre' }}
        />
        <Stack.Screen
          name="Statistics"
          component={StatisticsScreen}
          options={{ title: 'Statistiques' }}
        />
        <Stack.Screen
          name="Admin"
          component={AdminScreen}
          options={{ title: 'Administration' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}