import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import api from '../services/api';

export default function StatisticsScreen() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/statistics');
      setStats(response.data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Chargement des statistiques...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Erreur de chargement</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.content}>
        <Text style={styles.title}>📊 Statistiques Familiales</Text>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Nombre total de membres</Text>
          <Text style={styles.statValue}>{stats.totalMembers}</Text>
        </View>

        <View style={styles.row}>
          <View style={[styles.statCard, styles.halfCard]}>
            <Text style={styles.statLabel}>Hommes</Text>
            <Text style={[styles.statValue, { color: '#2196F3' }]}>
              {stats.males}
            </Text>
          </View>

          <View style={[styles.statCard, styles.halfCard]}>
            <Text style={styles.statLabel}>Femmes</Text>
            <Text style={[styles.statValue, { color: '#E91E63' }]}>
              {stats.females}
            </Text>
          </View>
        </View>

        {stats.others > 0 && (
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Autres</Text>
            <Text style={[styles.statValue, { color: '#9C27B0' }]}>
              {stats.others}
            </Text>
          </View>
        )}

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Espérance de vie moyenne</Text>
          <Text style={styles.statValue}>{stats.avgLifespan} ans</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Nombre moyen d'enfants</Text>
          <Text style={styles.statValue}>{stats.avgChildren}</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Nombre de générations</Text>
          <Text style={styles.statValue}>{stats.generations}</Text>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Répartition par sexe</Text>
          <View style={styles.barChart}>
            <View style={styles.barRow}>
              <Text style={styles.barLabel}>Hommes</Text>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${(stats.males / stats.totalMembers) * 100}%`,
                    backgroundColor: '#2196F3',
                  },
                ]}
              />
              <Text style={styles.barValue}>{stats.males}</Text>
            </View>

            <View style={styles.barRow}>
              <Text style={styles.barLabel}>Femmes</Text>
              <View
                style={[
                  styles.bar,
                  {
                    width: `${(stats.females / stats.totalMembers) * 100}%`,
                    backgroundColor: '#E91E63',
                  },
                ]}
              />
              <Text style={styles.barValue}>{stats.females}</Text>
            </View>

            {stats.others > 0 && (
              <View style={styles.barRow}>
                <Text style={styles.barLabel}>Autres</Text>
                <View
                  style={[
                    styles.bar,
                    {
                      width: `${(stats.others / stats.totalMembers) * 100}%`,
                      backgroundColor: '#9C27B0',
                    },
                  ]}
                />
                <Text style={styles.barValue}>{stats.others}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
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
  errorText: {
    fontSize: 18,
    color: '#f44336',
  },
  content: {
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfCard: {
    width: '48%',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  chartContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  barChart: {
    marginTop: 10,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  barLabel: {
    width: 80,
    fontSize: 14,
    color: '#666',
  },
  bar: {
    height: 30,
    borderRadius: 5,
    marginRight: 10,
  },
  barValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});