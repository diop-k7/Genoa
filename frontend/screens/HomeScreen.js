import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Erreur chargement user:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Bienvenue {user?.email}
      </Text>
      <Text style={styles.roleText}>
        Rôle: {user?.role === 'admin' ? 'Administrateur' : user?.role === 'editor' ? 'Éditeur' : 'Lecteur'}
      </Text>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('Tree')}
      >
        <Text style={styles.menuButtonText}>🌳 Voir l'arbre</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('Members')}
      >
        <Text style={styles.menuButtonText}>👥 Gérer les membres</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('Statistics')}
      >
        <Text style={styles.menuButtonText}>📊 Statistiques</Text>
      </TouchableOpacity>

      {user?.role === 'admin' && (
        <TouchableOpacity
          style={[styles.menuButton, styles.adminButton]}
          onPress={() => navigation.navigate('Admin')}
        >
          <Text style={styles.menuButtonText}>⚙️ Administration</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.menuButton, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Text style={styles.menuButtonText}>🚪 Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  roleText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  menuButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  adminButton: {
    backgroundColor: '#FF9800',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    marginTop: 20,
  },
});