import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Svg, { Circle, Line, Text as SvgText, G } from 'react-native-svg';
import api from '../services/api';

const { width, height } = Dimensions.get('window');

export default function TreeScreen({ navigation }) {
  const [members, setMembers] = useState([]);
  const [relations, setRelations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [membersRes, relationsRes] = await Promise.all([
        api.get('/members'),
        api.get('/relations'),
      ]);
      setMembers(membersRes.data);
      setRelations(relationsRes.data);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const buildSimpleTree = () => {
    // Construction simplifiée de l'arbre pour l'affichage
    const nodes = [];
    const edges = [];

    // Position des nœuds en grille simple
    members.forEach((member, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;

      nodes.push({
        id: member._id,
        x: 150 + col * 200,
        y: 100 + row * 150,
        member,
      });
    });

    // Ajouter les relations
    relations.forEach((rel) => {
      if (rel.type === 'couple' && rel.member1 && rel.member2) {
        edges.push({
          source: rel.member1._id || rel.member1,
          target: rel.member2._id || rel.member2,
          type: 'couple',
        });
      } else if (rel.type === 'child' && rel.parent1 && rel.childId) {
        edges.push({
          source: rel.parent1._id || rel.parent1,
          target: rel.childId._id || rel.childId,
          type: 'parent',
        });
      }
    });

    return { nodes, edges };
  };

  const handleNodePress = (node) => {
    const member = node.member;
    Alert.alert(
      `${member.firstName} ${member.lastName}`,
      `Sexe: ${member.sex === 'M' ? 'Homme' : member.sex === 'F' ? 'Femme' : 'Autre'}\n` +
      `Né(e): ${member.birthDate ? new Date(member.birthDate).toLocaleDateString() : 'N/A'}\n` +
      `${member.deathDate ? `Décédé(e): ${new Date(member.deathDate).toLocaleDateString()}` : 'Vivant(e)'}\n` +
      `${member.professions?.length > 0 ? `Profession: ${member.professions[0]}` : ''}`,
      [
        { text: 'Fermer' },
        {
          text: 'Modifier',
          onPress: () => navigation.navigate('EditMember', { member }),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Chargement de l'arbre...</Text>
      </View>
    );
  }

  if (members.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Aucun membre dans l'arbre</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AddMember')}
        >
          <Text style={styles.buttonText}>Ajouter un membre</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { nodes, edges } = buildSimpleTree();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Svg width={width * 2} height={height * 2}>
            {/* Dessiner les arêtes */}
            {edges.map((edge, idx) => {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              const targetNode = nodes.find((n) => n.id === edge.target);

              if (sourceNode && targetNode) {
                return (
                  <Line
                    key={`edge-${idx}`}
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={edge.type === 'couple' ? '#FF1744' : '#999'}
                    strokeWidth="2"
                    strokeDasharray={edge.type === 'couple' ? '5,5' : '0'}
                  />
                );
              }
              return null;
            })}

            {/* Dessiner les nœuds */}
            {nodes.map((node) => {
              const color =
                node.member.sex === 'M'
                  ? '#2196F3'
                  : node.member.sex === 'F'
                  ? '#E91E63'
                  : '#9C27B0';

              return (
                <G key={node.id}>
                  <Circle
                    cx={node.x}
                    cy={node.y}
                    r="30"
                    fill={color}
                    stroke="#fff"
                    strokeWidth="3"
                    onPress={() => handleNodePress(node)}
                  />
                  <SvgText
                    x={node.x}
                    y={node.y + 50}
                    fontSize="14"
                    fill="#333"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    {node.member.firstName}
                  </SvgText>
                  <SvgText
                    x={node.x}
                    y={node.y + 68}
                    fontSize="14"
                    fill="#333"
                    textAnchor="middle"
                  >
                    {node.member.lastName}
                  </SvgText>
                </G>
              );
            })}
          </Svg>
        </ScrollView>
      </ScrollView>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.legendText}>Homme</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#E91E63' }]} />
          <Text style={styles.legendText}>Femme</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#9C27B0' }]} />
          <Text style={styles.legendText}>Autre</Text>
        </View>
      </View>
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
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
});