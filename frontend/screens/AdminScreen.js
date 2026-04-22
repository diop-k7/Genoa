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
  Platform, // <--- INDISPENSABLE
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
      console.error('Erreur chargement:', error);
      const msg = 'Impossible de charger les utilisateurs';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Erreur', msg);
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
      fetchUsers();
      const msg = 'Utilisateur validé';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Succès', msg);
    } catch (error) {
      const msg = error.response?.data?.error || 'Erreur de validation';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Erreur', msg);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await api.put(`/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (error) {
      const msg = 'Erreur de modification';
      Platform.OS === 'web' ? alert(msg) : Alert.alert('Erreur', msg);
    }
  };

  const handleDeleteUser = (userId) => {
    const performDelete = async () => {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers();
        const msg = 'Utilisateur supprimé';
        Platform.OS === 'web' ? alert(msg) : Alert.alert('Succès', msg);
      } catch (error) {
        const msg = 'Erreur de suppression';
        Platform.OS === 'web' ? alert(msg) : Alert.alert('Erreur', msg);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Voulez-vous supprimer cet utilisateur ?')) {
        performDelete();
      }
    } else {
      Alert.alert('Confirmation', 'Supprimer cet utilisateur ?', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Supprimer', style: 'destructive', onPress: performDelete },
      ]);
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={[styles.userStatus, { color: item.isValidated ? '#4CAF50' : '#FF9800' }]}>
          {item.isValidated ? '✅ Validé' : '⏳ En attente'}
        </Text>
      </View>

      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>Rôle:</Text>
        <View style={styles.pickerWrapper}>
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
          <TouchableOpacity style={styles.validateButton} onPress={() => handleValidateUser(item._id)}>
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteUser(item._id)}>
          <Text style={styles.buttonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun utilisateur</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    // Fix pour le scroll sur navigateur
    height: Platform.OS === 'web' ? '100vh' : undefined,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 15,
    paddingBottom: 40,
  },
  userCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userInfo: { marginBottom: 10 },
  userEmail: { fontSize: 16, fontWeight: 'bold' },
  userStatus: { fontSize: 13, fontWeight: '600' },
  roleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  roleLabel: { marginRight: 10, fontWeight: '600' },
  pickerWrapper: { flex: 1, backgroundColor: '#f9f9f9', borderRadius: 8 },
  picker: { height: 40 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  validateButton: { backgroundColor: '#4CAF50', padding: 8, borderRadius: 5, marginRight: 10 },
  deleteButton: { backgroundColor: '#f44336', padding: 8, borderRadius: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#999' },
});