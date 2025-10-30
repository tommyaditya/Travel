import { Feather, Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// --- 1. Definisi tipe Navigation ---
type RootStackParamList = {
    HomeScreen: undefined;
    DetailScreen: { destinationId: number }; 
    index: undefined;
};

// --- 2. Definisi tipe data Destination ---
interface Destination {
    id: number;
    location: string;
    name: string;
    rating: string;
    price: string;
    image: string; // dari API berupa URL string
}

// --- 3. Komponen Header ---
const Header: React.FC = () => (
    <View style={styles.header}>
        <Text style={styles.greeting}>Hi, Haikal</Text>
        <TouchableOpacity style={styles.notification}>
            <Ionicons name="heart" size={24} color="#FF5733" />
            <View style={styles.badge}>
                <Text style={styles.badgeText}>8</Text>
            </View>
        </TouchableOpacity>
    </View>
);

// --- 4. Komponen Promo Card ---
const PromoCard: React.FC = () => (
    <View style={styles.promoCard}>
        <Text style={styles.promoText}>Plan Your</Text>
        <Text style={styles.promoText}>Summer!</Text>
        <TouchableOpacity style={styles.arrowButton}>
            <Feather name="arrow-right" size={24} color="white" />
        </TouchableOpacity>
    </View>
);

// --- 5. Komponen Search Bar ---
const SearchBar: React.FC = () => (
    <View style={styles.searchSection}>
        <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#AAAAAA" style={styles.searchIcon} />
            <TextInput
                placeholder="Search destination..."
                placeholderTextColor="#AAAAAA"
                style={styles.input}
            />
        </View>
        <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>
    </View>
);

// --- 6. Komponen Destination Card ---
const DestinationCard: React.FC<{ item: Destination }> = ({ item }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('DetailScreen', { destinationId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardOverlay}>
                <View style={styles.cardTopRight}>
                    <TouchableOpacity>
                        <Ionicons name="heart-outline" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.cardBottom}>
                    <View>
                        <Feather name="map-pin" size={14} color="white" />
                        <Text style={styles.cardLocation}>{item.location}</Text>
                        <Text style={styles.cardName}>{item.name}</Text>
                    </View>
                    <View style={styles.cardBottomRight}>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={14} color="#FFC700" />
                            <Text style={styles.cardRating}>{item.rating}</Text>
                        </View>
                        <Text style={styles.cardPrice}>${item.price}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// --- 7. Komponen Popular Destinations ---
const PopularDestinations: React.FC<{ destinations: Destination[] }> = ({ destinations }) => (
    <View style={styles.popularSection}>
        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Destination</Text>
            <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
        </View>
        {destinations.map((item) => (
            <DestinationCard key={item.id} item={item} />
        ))}
    </View>
);

// --- 8. Komponen Bottom Navigation ---
const BottomNav: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    return (
        <View style={styles.bottomNav}>
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeScreen')}>
                <Ionicons name="home" size={26} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => console.log('Tickets Pressed')}>
                <Ionicons name="grid" size={26} color="#AAAAAA" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={() => console.log('Profile Pressed')}>
                <Ionicons name="person" size={26} color="#AAAAAA" />
            </TouchableOpacity>
        </View>
    );
};

// --- 9. Komponen Utama HomeScreen (connect ke API) ---
const HomeScreen: React.FC = () => {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const res = await fetch('https://69035071d0f10a340b239e2b.mockapi.io/api');
                const data = await res.json();
                const list = Array.isArray(data) ? data : [];
                setDestinations(list);
            } catch (err) {
                console.error('Gagal memuat data:', err);
                setDestinations([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
            <ScrollView style={styles.container}>
                <Header />
                <PromoCard />
                <SearchBar />
                {loading ? (
                    <ActivityIndicator size="large" color="#FF5733" style={{ marginTop: 30 }} />
                ) : (
                    <PopularDestinations destinations={destinations} />
                )}
            </ScrollView>
            <BottomNav />
        </SafeAreaView>
    );
};

// --- 10. Styling ---
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F5F5F5' },
    container: { flex: 1, paddingHorizontal: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15 },
    greeting: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    notification: { position: 'relative', padding: 5 },
    badge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#FF5733', borderRadius: 9, width: 18, height: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#F5F5F5' },
    badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
    promoCard: { backgroundColor: '#FF5733', padding: 20, borderRadius: 20, marginBottom: 20 },
    promoText: { fontSize: 32, fontWeight: 'bold', color: 'white', lineHeight: 35 },
    arrowButton: { position: 'absolute', right: 20, top: '50%', transform: [{ translateY: -12 }], backgroundColor: 'rgba(0,0,0,0.1)', padding: 10, borderRadius: 20 },
    searchSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 15, paddingHorizontal: 10, height: 50, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 1, elevation: 2 },
    searchIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 16 },
    filterButton: { marginLeft: 10, backgroundColor: '#333', borderRadius: 15, padding: 13, height: 50, justifyContent: 'center', alignItems: 'center' },
    popularSection: { marginBottom: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    viewAllText: { fontSize: 14, color: '#FF5733' },
    card: { height: 250, borderRadius: 20, overflow: 'hidden', marginBottom: 15 },
    cardImage: { width: '100%', height: '100%', position: 'absolute' },
    cardOverlay: { flex: 1, justifyContent: 'space-between', padding: 15, backgroundColor: 'rgba(0, 0, 0, 0.2)' },
    cardTopRight: { alignItems: 'flex-end' },
    cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
    cardLocation: { color: 'white', fontSize: 14, fontWeight: 'bold', marginTop: 5, marginBottom: 3 },
    cardName: { color: 'white', fontSize: 22, fontWeight: 'bold', textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: -1, height: 1 }, textShadowRadius: 10 },
    cardBottomRight: { alignItems: 'flex-end' },
    ratingContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.4)', padding: 5, borderRadius: 10, marginBottom: 5 },
    cardRating: { color: 'white', fontSize: 14, fontWeight: 'bold', marginLeft: 5 },
    cardPrice: { color: 'white', fontSize: 16, fontWeight: 'bold' },
    bottomNav: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#333', paddingVertical: 15, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 20 },
    navItem: { padding: 5 },
});

export default HomeScreen;
