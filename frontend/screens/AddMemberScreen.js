import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

export default function AddMemberScreen({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex, setSex] = useState('M');
  const [birthDate, setBirthDate] = useState('');
  const [deathDate, setDeathDate] = useState('');
  const [profession, setProfession] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [publicInfo, setPublicInfo] = useState('');
  const [privateInfo, setPrivateInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!firstName || !lastName) {
      Alert.alert('Erreur', 'Le prénom et le nom sont obligatoires');
      return;
    }

    setLoading(true);
    try {
      const memberData = {
        firstName,
        lastName,
        sex,
        birthDate: birthDate || undefined,
        deathDate: deathDate || undefined,
        professions: profession ? [profession] : [],
        phones: phone ? [phone] : [],
        emails: email ? [email] : [],
        addresses: address ? [address] : [],
        publicInfo,
        privateInfo,
      };

      await api.post('/members', memberData);
      Alert.alert('Succès', 'Membre ajouté avec succès');
      navigation.goBack();
    } catch (error) {
      console.error('Erreur ajout membre:', error);
      Alert.alert('Erreur', error.response?.data?.error || 'Erreur lors de l\'ajout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Informations obligatoires</Text>

        <Text style={styles.label}>Prénom *</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Prénom"
        />

        <Text style={styles.label}>Nom *</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Nom"
        />

        <Text style={styles.label}>Sexe *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sex}
            onValueChange={setSex}
            style={styles.picker}
          >
            <Picker.Item label="Homme" value="M" />
            <Picker.Item label="Femme" value="F" />
            <Picker.Item label="Autre" value="Other" />
          </Picker>
        </View>

        <Text style={styles.sectionTitle}>Informations optionnelles</Text>

        <Text style={styles.label}>Date de naissance (AAAA-MM-JJ)</Text>
        <TextInput
          style={styles.input}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="1990-01-15"
        />

        <Text style={styles.label}>Date de décès (AAAA-MM-JJ)</Text>
        <TextInput
          style={styles.input}
          value={deathDate}
          onChangeText={setDeathDate}
          placeholder="2020-12-25"
        />

        <Text style={styles.label}>Profession</Text>
        <TextInput
          style={styles.input}
          value={profession}
          onChangeText={setProfession}
          placeholder="Ingénieur"
        />

        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+33 6 12 34 56 78"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Adresse</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="123 Rue de Paris, 75001 Paris"
        />

        <Text style={styles.label}>Informations publiques</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={publicInfo}
          onChangeText={setPublicInfo}
          placeholder="Informations visibles par tous"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Informations privées</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={privateInfo}
          onChangeText={setPrivateInfo}
          placeholder="Informations visibles uniquement par les administrateurs"
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Ajouter le membre</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});