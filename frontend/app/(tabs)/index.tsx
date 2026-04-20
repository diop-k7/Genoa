import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

export default function HomeScreen() {
  const [members, setMembers] = useState([]);
  const [relations, setRelations] = useState([]);

  // 🔥 FETCH DATA
  useEffect(() => {
    fetchMembers();
    fetchRelations();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('http://localhost:3000/members', {
        headers: {
          Authorization: 'Bearer TON_TOKEN'
        }
      });
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchRelations = async () => {
    try {
      const res = await fetch('http://localhost:3000/relations', {
        headers: {
          Authorization: 'Bearer TON_TOKEN'
        }
      });
      const data = await res.json();
      setRelations(data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 FONCTION CORRIGÉE
  function getChildren(parentId) {
    return relations
      .filter(r => r.type === 'parent' && r.from?._id === parentId)
      .map(r => r.to)
      .filter(c => c); // sécurité anti undefined
  }

  // 🔥 RENDER ITEM
  const renderItem = ({ item }) => {
    return (
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          {item.firstName} {item.lastName}
        </Text>

        {/* 🔥 ENFANTS */}
        {getChildren(item._id)
          ?.filter(c => c && c.firstName)
          .map(c => (
            <Text key={c._id}>→ {c.firstName}</Text>
          ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={members}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
}