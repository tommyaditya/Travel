import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  StatusBar, 
} from 'react-native';

// Import hook navigasi yang diperlukan dan tipe
import { useNavigation, NavigationProp } from '@react-navigation/native';

// --- DEFINISI TIPE UNTUK NAVIGATION (WAJIB di TSX) ---
// Tentukan nama-nama rute yang ada di Stack Navigator Anda
type RootStackParamList = {
    HomeScreen: undefined; // Rute HomeScreen
    WelcomeScreen: undefined; // Rute WelcomeScreen
    // Tambahkan rute lain seperti 'DetailScreen: { id: number }' jika ada
};

// Tipe untuk object navigation
type WelcomeScreenNavigationProp = NavigationProp<RootStackParamList, 'WelcomeScreen'>;
// ----------------------------------------------------


// Dapatkan tinggi layar
const { height } = Dimensions.get('window');

// Ganti dengan path ke gambar Anda
const BACKGROUND_IMAGE = require('./assets/bg.jpg'); 

const WelcomeScreen: React.FC = () => {
  // Panggil hook useNavigation dengan tipe yang spesifik
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <ImageBackground
      source={BACKGROUND_IMAGE}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
      <View style={styles.overlay}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            Your Next Adventure Starts Here
          </Text>
          <Text style={styles.subtitle}>
            Life's too short to stay in one place. Find your next favorite city, beach, or mountain and let's get moving!
          </Text>
          <TouchableOpacity 
            style={styles.button}
            // KESALAHAN MERAH HILANG karena TypeScript mengenali 'HomeScreen'
            onPress={() => navigation.navigate('HomeScreen')}
          >
            <Text style={styles.buttonText}>Start Exploring</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

// ... (Styles sama)
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, 
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', 
    justifyContent: 'flex-end', 
    paddingHorizontal: 20,
    paddingBottom: 40, 
  },
  contentContainer: {
    paddingBottom: 30, 
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#00D1B5', 
    paddingVertical: 15,
    borderRadius: 30, 
    alignItems: 'center',
    width: '100%', 
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;