import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';
import api from '../services/api';

export default function AddMember({ onBack }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [gender, setGender] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [profession, setProfession] = useState('');
    const [isPrivate, setIsPrivate] = useState('');

    const handleAdd = async () => {
        try {
            await api.post('/members', {
                firstName,
                lastName,
                gender,
                birthDate,
                profession,
                isPrivate: isPrivate === 'true'
            });

            alert("Membre ajouté !");
            onBack();

        } catch (err) {
            console.log(err);
            alert("Erreur ajout");
        }
    };

    return (
        <View style={{ marginTop: 50 }}>
            <TextInput placeholder="Prénom" onChangeText={setFirstName} />
            <TextInput placeholder="Nom" onChangeText={setLastName} />
            <TextInput placeholder="Sexe" onChangeText={setGender} />
            <TextInput placeholder="Date YYYY-MM-DD" onChangeText={setBirthDate} />
            <TextInput placeholder="Profession" onChangeText={setProfession} />
            <TextInput placeholder="Privé true/false" onChangeText={setIsPrivate} />

            <Button title="Ajouter" onPress={handleAdd} />
            <Button title="Retour" onPress={onBack} />
        </View>
    );
}