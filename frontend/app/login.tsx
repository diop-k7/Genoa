import { View, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const res = await api.post('/auth/login', { email, password });

            await AsyncStorage.setItem('token', res.data.token);
            Alert.alert("Login réussi !");
            onLogin();

        } catch (err) {
            Alert.alert("Erreur login");
        }
    };

    return (
        <View style={{ marginTop: 50 }}>
            <TextInput placeholder="Email" onChangeText={setEmail} />
            <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
            <Button title="LOGIN" onPress={handleLogin} />
        </View>
    );
}