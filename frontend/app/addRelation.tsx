import { View, TextInput, Button } from 'react-native';
import { useState } from 'react';
import api from '../services/api';

export default function AddRelation({ onBack }) {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');

    const handleAdd = async () => {
        await api.post('/relations', {
            from,
            to,
            type: 'parent'
        });

        alert("Relation ajoutée");
        onBack();
    };

    return (
        <View style={{ marginTop: 50 }}>
            <TextInput placeholder="ID parent" onChangeText={setFrom} />
            <TextInput placeholder="ID enfant" onChangeText={setTo} />

            <Button title="Ajouter relation" onPress={handleAdd} />
            <Button title="Retour" onPress={onBack} />
        </View>
    );
}