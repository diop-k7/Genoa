import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

export default function AdminScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur chargement users:', error);
      Alert.alert('Erreur', 'Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const handleValidateUser = async (userId) => {
    try {
      await api.put(`/users/${userId}/validate`);
      Alert.alert('Succès', 'Utilisateur validé');
      fetchUsers();
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.error || 'Erreur de validation');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      Alert.alert('Succès', 'Rôle modifié');
      fetchUsers();
    } catch (error) {
      Alert.alert('Erreur', error.response?.data?.error || 'Erreur de modification');
    }
  };

  const handleDeleteUser = (userId) => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/users/${userId}`);
              Alert.alert('Succès', 'Utilisateur supprimé');
              fetchUsers();
            } catch (error) {
              Alert.alert('Erreur', error.response?.data?.error || 'Erreur de suppression');
            }
          },
        },
      ]
    );
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userStatus}>
          {item.isValidated ? '✅ Validé' : '⏳ En attente'}
        </Text>
      </View>

      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Rôle:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={item.role}
            onValueChange={(value) => handleChangeRole(item._id, value)}
            style={styles.picker}
          >
            <Picker.Item label="Lecteur" value="reader" />
            <Picker.Item label="Éditeur" value="editor" />
            <Picker.Item label="Admin" value="admin" />
          </Picker>
        </View>
      </View>

      <View style={styles.actions}>
        {!item.isValidated && (
          <TouchableOpacity
            style={styles.validateButton}
            onPress={() => handleValidateUser(item._id)}
          >
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteUser(item._id)}
        >
          <Text style={styles.buttonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Chargement des utilisateurs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun utilisateur</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 15,
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    marginBottom: 10,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userStatus: {
    fontSize: 14,
    color: '#666',
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  roleLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginRight: 10,
  },
  pickerContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  picker: {
    height: 40,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  validateButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
  },
});