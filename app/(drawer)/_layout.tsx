import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, Image, StyleSheet, useColorScheme } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import ProfilePicture from '@/assets/images/profile.png';
import EmptyProfile from '@/assets/images/EmptyProfile.jpeg';

function CustomDrawerContent(props: any) {
  const colorScheme = useColorScheme();
  const themeStyles = {
    textColor: colorScheme === 'dark' ? '#fff' : '#000',
    subTextColor: colorScheme === 'dark' ? '#aaa' : '#666',
    borderColor: colorScheme === 'dark' ? '#555' : '#ccc',
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={[styles.profileContainer, { borderBottomColor: themeStyles.borderColor }]}>
        <Image
          source={ProfilePicture}
          style={styles.profileImage}
        />
        <View style={styles.infoContainer}>
          <Text style={[styles.profileName, { color: themeStyles.textColor }]}>Lucas Torchelsen Schmidt</Text>
          <Text style={[styles.profileEmail, { color: themeStyles.subTextColor }]}>lucas.schmidt015@gmail.com</Text>
        </View>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="(home)"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="(home)"
          options={{
            drawerLabel: 'Home',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="history"
          options={{
            drawerLabel: 'History',
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="reports"
          options={{
            drawerLabel: 'Reports',
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    padding: 20,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  infoContainer: {
    marginLeft: 15,
    justifyContent: 'flex-end',
    paddingBottom: 15
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
  },
});