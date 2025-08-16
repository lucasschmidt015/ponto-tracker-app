import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';

import { Redirect } from "expo-router";

import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useColorScheme } from 'react-native';
import OpenDrawerButton from '@/components/OpenDrawerButton';
import LogoutButton from '@/components/LogoutButton';
import Loading from '@/components/Loading';


const History = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const styles = getStyles(isDarkMode);
  const { isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth)


  if (isLoading) {
    return (
      <View style={styles.container}>
        <OpenDrawerButton />
        <Loading/>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }
  return (
    <ScrollView contentContainerStyle={styles.container} scrollEnabled={false}>
      <OpenDrawerButton/>
      <LogoutButton/>
      <View style={styles.topContainer}>
        <View style={styles.semiCircle} />        
      </View>

      <View style={styles.dateRangeContainer}>
        <Text style={styles.sectionTitle}>Historic</Text>
        <Text style={styles.subTitle}>Select a range to start</Text>
        <View style={styles.dateButtons}>
          <TouchableOpacity style={styles.dateButton} onPress={() => {
            // Date picker functionality removed
            console.log('Start date picker would open here');
          }}>
            <Text>{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateButton} onPress={() => {
            // Date picker functionality removed
            console.log('End date picker would open here');
          }}>
            <Text>{endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.errorText}>End Date must be superior to Start Date</Text>
      </View>

      {[...Array(3)].map((_, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.cardTitle}>{`25/02/2025 - Time worked: 08:36`}</Text>
          <View style={styles.cardContent}>
            <View style={styles.timeContainer}>
              <Text style={styles.timeLabel}>{'\u2B24'} 07:45 ✅</Text>
              <Text style={styles.timeLabel}>{'\u2B24'} 12:00 ✅</Text>
              <Text style={styles.timeLabel}>{'\u2B24'} 13:30 ✅</Text>
              <Text style={styles.timeLabel}>{'\u2B24'} 18:00 ✅</Text>
            </View>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: -27.100,
                longitude: -52.615,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker
                coordinate={{
                  latitude: -27.100,
                  longitude: -52.615,
                }}
                title="Check-in"
              />
            </MapView>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}


const getStyles = (isDarkMode: boolean) => StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: isDarkMode ? '#000' : '#f9f9f9',
  },
  
  topContainer: {
    alignItems: 'center',
    width: '100%',
    height: 125
  },
  semiCircle: {
    width: '100%',
    height: '100%',
    backgroundColor: isDarkMode ? '#333' : '#d9d9d9',
    borderBottomLeftRadius: 170,
    borderBottomRightRadius: 170,
    overflow: 'hidden',
  },
  dateRangeContainer: {
    alignItems: 'center',
    padding: 16,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: isDarkMode ? '#fff' : '#000',
  },
  subTitle: {
    fontSize: 14,
    color: isDarkMode ? '#ccc' : '#444',
    marginBottom: 16,
  },
  dateButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: '#ccc',
    backgroundColor: isDarkMode ? '#111' : '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  card: {
    backgroundColor: isDarkMode ? '#222' : '#f1f1f1',
    margin: 12,
    borderRadius: 12,
    padding: 12,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 14,
    color: isDarkMode ? '#fff' : '#000',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeContainer: {
    justifyContent: 'center',
  },
  timeLabel: {
    color: isDarkMode ? '#fff' : '#000',
  },
  map: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});


export default History;