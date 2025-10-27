// File: app/DetailScreen.tsx (Perbaikan Tata Letak Bottom Bar)

import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react'; 
import {
    Dimensions,
    Image,
    ImageSourcePropType,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
// Pastikan Anda mengimpor 'NavigationProp' dari '@react-navigation/native'
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// --- HELPER FUNCTIONS ---
const cleanAndParsePrice = (priceString: string): number => {
    const cleanedString = priceString.replace(/[.,]/g, ''); 
    return parseInt(cleanedString, 10) || 0; 
};

const formatPrice = (price: number): string => {
    return price.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

// --- 1. DEFINISI TIPE & DATA LENGKAP ---

type DestinationDetail = {
    id: number;
    name: string;
    rating: string;
    description: string;
    country: string;
    image: ImageSourcePropType;
    reviews: { id: number, user: string, comment: string }[];
    recommendation: { name: string, details: string, price: number, recomImage: ImageSourcePropType };
};

// ASUMSI: File gambar ada di app/assets/ (Pastikan path ini benar)
const IMAGE_LABUAN_BAJO = require('./assets/labuan-bajo.jpg'); 
const IMAGE_VENICE = require('./assets/venice.jpg'); 
const IMAGE_REVIEWER_AVATAR = require('./assets/jiwoo.jpg'); 
const IMAGE_PHINISI = require('./assets/Liveaboard.jpg'); 
const IMAGE_GONDOLA = require('./assets/gondola.jpg'); 

const ALL_DESTINATION_DETAILS: DestinationDetail[] = [
    {
        id: 1,
        name: 'Labuan Bajo',
        rating: '5.0',
        description: "Dari perairan yang jernih hingga matahari terbenam yang memukau, Labuan Bajo memanggil! Jelajahi pulau-pulau tersembunyi, berenang bersama pari manta, dan ciptakan kenangan seumur hidup.",
        country: 'Indonesia',
        image: IMAGE_LABUAN_BAJO,
        reviews: [
            { id: 1, user: 'Rifqi starboy', comment: 'Wow amazing yahh, best experience in my life very very worth it i like it!' }
        ],
        recommendation: {
            name: 'Phinisi Luxury Private Trip',
            details: 'Termasuk penjemputan & makan malam',
            price: 10000, 
            recomImage: IMAGE_PHINISI
        }
    },
    {
        id: 2,
        name: 'Venesia',
        rating: '4.7',
        description: "Menjelajahi kota kanal yang romantis, Venesia menawarkan arsitektur bersejarah yang indah dan pengalaman naik gondola yang tak terlupakan. Sangat cocok untuk pasangan!",
        country: 'Italia',
        image: IMAGE_VENICE,
        reviews: [
            { id: 1, user: 'Marco Polo', comment: 'Pengalaman gondola terbaik! Kota ini penuh dengan sejarah dan pesona, sangat romantis.' }
        ],
        recommendation: {
            name: 'Grand Canal Gondola Ride',
            details: 'Gondola pribadi dengan serenata',
            price: 5500, 
            recomImage: IMAGE_GONDOLA 
        }
    }
];


// Tipe Navigation - **DITAMBAHKAN TICKETSSCREEN**
type RootStackParamList = {
    HomeScreen: undefined;
    DetailScreen: { destinationId?: number }; 
    TicketsScreen: undefined; // <--- DITAMBAHKAN DI SINI
    index: undefined;
};
type DetailScreenRouteProp = RouteProp<RootStackParamList, 'DetailScreen'>;
// Ubah tipe navigasi untuk menyertakan kemampuan menavigasi ke TicketsScreen
type DetailScreenNavigationProp = NavigationProp<RootStackParamList, 'DetailScreen'> & NavigationProp<RootStackParamList, 'TicketsScreen'>;

// --- 2. KOMPONEN UTAMA ---
const DetailScreen: React.FC = () => {
    // Navigasi yang digunakan sekarang memiliki akses ke TicketsScreen
    const navigation = useNavigation<DetailScreenNavigationProp>(); 
    
    // MENGAMBIL ID DARI PARAMETER NAVIGASI
    const route = useRoute<DetailScreenRouteProp>();
    const destinationId = route.params?.destinationId || 0; 
    const fallbackId = (destinationId === 0) ? 1 : destinationId;
    const detailData = ALL_DESTINATION_DETAILS.find(item => item.id === fallbackId);

    if (!detailData) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 18, paddingHorizontal: 30 }}>
                    Error: Destinasi tidak ditemukan. Silakan kembali ke halaman utama.
                </Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 20, alignSelf: 'center', marginTop: 20 }}>
                    <Text style={{ color: '#FF5733', fontWeight: 'bold' }}>Kembali ke Home</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
    
    // State Count
    const [count, setCount] = useState(1);

    const handleIncrement = () => setCount(prev => prev + 1);
    const handleDecrement = () => setCount(prev => (prev > 1 ? prev - 1 : 1)); 

    // Menghitung total harga secara dinamis
    const calculatedTotal = useMemo(() => {
        const basePrice = detailData.recommendation.price;
        return basePrice * count;
    }, [count, detailData.recommendation.price]);

    // **FUNGSI NAVIGASI BARU**
    const handleBookNow = () => {
        // Logika tambahan sebelum navigasi (opsional)
        console.log(`Booking ${count} tiket untuk ${detailData.name}. Total: $${formatPrice(calculatedTotal)}`);
        
        // Melakukan navigasi ke TicketsScreen
        // Pastikan nama rute 'TicketsScreen' sesuai dengan yang Anda daftarkan di navigator
        navigation.navigate('TicketsScreen' as never); 
        // Menggunakan 'as never' untuk mengatasi masalah tipe TypeScript yang kompleks
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
            
            {/* Bagian Atas: Gambar Latar Belakang & Info Cuaca */}
            <View style={styles.imageContainer}>
                <Image source={detailData.image} style={styles.mainImage} />
                <View style={styles.headerOverlay}>
                    {/* Tombol Back */}
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    {/* Badge Cuaca */}
                    <View style={styles.weatherBadge}>
                        <Ionicons name="sunny" size={20} color="#333" />
                        <Text style={styles.weatherText}>24° C</Text>
                    </View>
                </View>
                
                {/* Info Destinasi di Bawah Gambar */}
                <View style={styles.destinationInfo}>
                    <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={18} color="white" />
                        <Text style={styles.ratingText}>{detailData.rating}</Text>
                    </View>
                    <Text style={styles.destinationName}>{detailData.name}</Text>
                    <Text style={styles.description}>{detailData.description}</Text>
                </View>
            </View>

            {/* Konten Utama */}
            <ScrollView contentContainerStyle={styles.contentScroll}>
                <Text style={styles.countryLabel}>
                    <Text style={styles.flagIcon}>{detailData.country === 'Indonesia' ? '🇮🇩' : '🇮🇹'}</Text> {detailData.country}
                </Text>

                <Text style={styles.sectionTitle}>Discover the Beauty of {detailData.name}</Text>

                {/* Review Section */}
                <View style={styles.reviewContainer}>
                    <View style={styles.reviewHeader}>
                        <Image source={IMAGE_REVIEWER_AVATAR} style={styles.reviewerAvatar} /> 
                        <View style={{flexShrink: 1}}>
                            <Text style={styles.reviewerName}>By {detailData.reviews[0].user}</Text>
                            <Text style={styles.reviewComment}>{detailData.reviews[0].comment}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.viewAllButton}>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.sectionTitle}>Recomendation in {detailData.name.split(' ')[0]}</Text>

                {/* Recommendation Card */}
                <View style={styles.recommendationCard}>
                    <Image source={detailData.recommendation.recomImage} style={styles.recomImage} />
                    <View style={styles.recomTextContainer}>
                        <Text style={styles.recomName}>{detailData.recommendation.name}</Text>
                        <Text style={styles.recomDetail}>{detailData.recommendation.details}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Booking Bar (Fixed) */}
            <View style={styles.bookingBar}>
                {/* Baris Atas: Counter dan Total Amount (Horizontal) */}
                <View style={styles.bookingBarTopRow}>
                    <View style={styles.counter}>
                        {/* Tombol Kurang */}
                        <TouchableOpacity onPress={handleDecrement} style={styles.counterButton}>
                            <Ionicons name="remove" size={20} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.counterText}>{count}</Text>
                        {/* Tombol Tambah */}
                        <TouchableOpacity onPress={handleIncrement} style={styles.counterButton}>
                            <Ionicons name="add" size={20} color="#333" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalAmountLabel}>Total Amount</Text>
                        <Text style={styles.totalAmountValue}>
                            ${formatPrice(calculatedTotal)}
                        </Text>
                    </View>
                </View>

                {/* Baris Bawah: Tombol Book Now (Full Width) */}
                {/* **ONPRESS DITAMBAHKAN DI SINI** */}
                <TouchableOpacity 
                    style={styles.bookButton}
                >
                    <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

// --- 3. STYLES ---
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    imageContainer: {
        height: width * 0.8, 
        overflow: 'hidden',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        position: 'absolute',
        top: 40, 
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 8,
        borderRadius: 15,
    },
    weatherBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 8,
        borderRadius: 15,
    },
    weatherText: {
        color: '#333',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    destinationInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 15,
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
    ratingText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    destinationName: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 3
    },
    description: {
        fontSize: 14,
        color: 'white',
        marginTop: 5,
    },
    contentScroll: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 120, 
    },
    countryLabel: {
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        fontWeight: '500',
    },
    flagIcon: {
        marginRight: 5,
        fontSize: 18,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    // Review Styles
    reviewContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    reviewHeader: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    reviewerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#DDD', 
        marginRight: 10,
    },
    reviewerName: {
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    reviewComment: {
        fontSize: 14,
        color: '#555',
    },
    viewAllButton: {
        alignSelf: 'center',
        backgroundColor: '#EBEBEB',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginTop: 10,
    },
    viewAllText: {
        color: '#333',
        fontWeight: 'bold',
    },
    // Recommendation Styles
    recommendationCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 20,
    },
    recomImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 10,
    },
    recomTextContainer: {
        flex: 1,
    },
    recomName: {
        fontWeight: 'bold',
        color: '#333',
        fontSize: 16,
    },
    recomDetail: {
        color: '#555',
        fontSize: 14,
    },
    // --- BOTTOM BOOKING BAR STYLES ---
    bookingBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1E232E', 
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'column', 
        alignItems: 'center',
    },
    bookingBarTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%', 
        marginBottom: 15, 
    },
    counter: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent', 
        borderRadius: 20,
    },
    counterButton: {
        backgroundColor: '#FF5733', 
        padding: 8,
        borderRadius: 20,
        width: 38, 
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    counterText: {
        fontSize: 24, 
        fontWeight: 'bold',
        marginHorizontal: 15,
        color: 'white', 
    },
    totalContainer: {
        alignItems: 'flex-end', 
    },
    totalAmountLabel: {
        fontSize: 12,
        color: '#BDBDBD', 
        marginBottom: 2,
    },
    totalAmountValue: {
        fontSize: 24, 
        fontWeight: 'bold',
        color: 'white', 
    },
    bookButton: {
        backgroundColor: '#FF5733', 
        paddingVertical: 15,
        width: '100%', 
        borderRadius: 30,
    },
    bookButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
    },
});

export default DetailScreen;