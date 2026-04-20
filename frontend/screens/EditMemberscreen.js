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
  KeyboardAvoidingView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

export default function EditMemberScreen({ route, navigation }) {
  const { member } = route.params;

  const [firstName, setFirstName] = useState(member.firstName);
  const [lastName, setLastName] = useState(member.lastName);
  const [sex, setSex] = useState(member.sex);
  const [birthDate, setBirthDate] = useState(
    member.birthDate ? member.birthDate.split('T')[0] : ''
  );
  const [deathDate, setDeathDate] = useState(
    member.deathDate ? member.deathDate.split('T')[0] : ''
  );
  const [profession, setProfession] = useState(
    member.professions?.[0] || ''
  );
  const [phone, setPhone] = useState(member.phones?.[0] || '');
  const [email, setEmail] = useState(member.emails?.[0] || '');
  const [address, setAddress] = useState(member.addresses?.[0] || '');
  const [publicInfo, setPublicInfo] = useState(member.publicInfo || '');
  const [privateInfo, setPrivateInfo] = useState(member.privateInfo || '');
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

      await api.put(`/members/${member._id}`, memberData);
      Alert.alert('Succès', 'Membre modifié avec succès');
      navigation.goBack();
    } catch (error) {
      console.error('Erreur modification membre:', error);
      Alert.alert('Erreur', error.response?.data?.error || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  return (
     <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
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
            <Text style={styles.submitButtonText}>Enregistrer les modifications</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
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