import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import api from "./api";

export default function Index() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔐 LOGIN
  const handleLogin = async () => {
    console.log("CLICK LOGIN");

    try {
      await api.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN OK");

      // 🔥 REDIRECTION VERS ARBRE
      router.replace("/(tabs)/explore");

    } catch (err) {
      console.log("ERREUR LOGIN:", err.response?.data || err.message);
      alert("Erreur connexion");
    }
  };

  // 📝 REGISTER
  const handleRegister = async () => {
    console.log("CLICK REGISTER");

    try {
      await api.post("/auth/register", {
        email,
        password,
      });

      console.log("REGISTER OK");

      alert("Compte créé ! Maintenant connecte-toi");

    } catch (err) {
      console.log("ERREUR REGISTER:", err.response?.data || err.message);
      alert("Erreur inscription");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GENOA</Text>

      <TextInput
        placeholder="Email"
        style={styles.input}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        style={styles.input}
        onChangeText={setPassword}
      />

      {/* 🔐 LOGIN */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.text}>Se connecter</Text>
      </TouchableOpacity>

      {/* 📝 REGISTER */}
      <TouchableOpacity style={styles.button2} onPress={handleRegister}>
        <Text style={styles.text}>S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "green",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  button2: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  text: {
    color: "white",
    textAlign: "center",
  },
});