import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons'; 
import { useNavigation, NavigationProp } from '@react-navigation/native'; // Import baru

const { width } = Dimensions.get('window');

// --- TIPE NAVIGASI (Disalin dari HomeScreen) ---
type RootStackParamList = {
    HomeScreen: undefined;
    DetailScreen: { destinationId: number }; 
    index: undefined;
};

// --- 1. KONSTANTA DAN DATA ---

const COLORS = {
  primary: '#FF5722', // Orange cerah
  selected: '#E55737', // Orange gelap untuk highlight
  offWhite: '#F0F0F0', // Latar belakang
  inactiveGray: '#9E9E9E',
  textGray: '#555',
  black: '#000',
  white: '#fff',
};

interface FlightTicket {
  originCode: string;
  originCity: string;
  destCode: string;
  destCity: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  price: string;
}

const DUMMY_TICKETS: FlightTicket[] = [
  {
    originCode: 'NL',
    originCity: 'Rotterdam',
    destCode: 'IDN',
    destCity: 'Labuan Bajo',
    departureTime: '5:30pm',
    arrivalTime: '3:30am',
    date: 'Mon, 23 Jun',
    price: '$1,700',
  },
  {
    originCode: 'NL',
    originCity: 'Rotterdam',
    destCode: 'IDN',
    destCity: 'Labuan Bajo',
    departureTime: '5:30pm',
    arrivalTime: '3:30am',
    date: 'Mon, 23 Jun',
    price: '$1,700',
  },
];

// --- 2. KOMPONEN PENDUKUNG ---

const CategoryButton: React.FC<{ text: string; isSelected: boolean }> = ({ text, isSelected }) => {
  const bgColor = isSelected ? COLORS.selected : COLORS.white;
  const textColor = isSelected ? COLORS.white : COLORS.black;

  return (
    <TouchableOpacity style={[styles.categoryButton, { backgroundColor: bgColor }]}>
      <Text style={{ color: textColor, fontWeight: 'bold' }}>{text}</Text>
    </TouchableOpacity>
  );
};

const DatePill: React.FC<{ day: string; date: string; isSelected: boolean }> = ({ day, date, isSelected }) => {
  const bgColor = isSelected ? COLORS.selected : COLORS.white;
  const dayColor = isSelected ? COLORS.white : COLORS.textGray;
  const dateColor = isSelected ? COLORS.white : COLORS.black;

  return (
    <TouchableOpacity style={[styles.datePill, { backgroundColor: bgColor }]}>
      <Text style={{ color: dayColor, fontSize: 14 }}>{day}</Text>
      <Text style={{ color: dateColor, fontSize: 20, fontWeight: 'bold', marginTop: 4 }}>{date}</Text>
    </TouchableOpacity>
  );
};

const FlightTicketCard: React.FC<{ ticket: FlightTicket }> = ({ ticket }) => (
  <View style={styles.ticketCard}>
    {/* Kolom Orange Kiri */}
    <View style={styles.ticketLeftBar}>
      <Text style={styles.ticketLeftBarText}>AIRLINES</Text>
    </View>

    {/* Ikon Pesawat Tengah Kecil */}
    <View style={styles.ticketIconContainer}>
      <Ionicons name="airplane" size={28} color={COLORS.textGray} />
    </View>

    {/* Detail Tiket Utama */}
    <View style={styles.ticketDetails}>
      {/* Baris Utama: Lokasi */}
      <View style={styles.ticketRow}>
        {/* Keberangkatan */}
        <View style={styles.ticketColumn}>
          <Text style={styles.codeText}>{ticket.originCode}</Text>
          <Text style={styles.cityText}>{ticket.originCity}</Text>
        </View>

        {/* Ikon Pesawat Tipis */}
        <Feather name="arrow-right" size={24} color={COLORS.black} style={{ opacity: 0.2 }} />

        {/* Tujuan */}
        <View style={[styles.ticketColumn, { alignItems: 'flex-start' }]}>
          <Text style={styles.codeText}>{ticket.destCode}</Text>
          <Text style={styles.cityText}>{ticket.destCity}</Text>
        </View>
      </View>

      {/* Baris Kedua: Waktu & Harga */}
      <View style={[styles.ticketRow, { marginTop: 15 }]}>
        {/* Waktu Keberangkatan */}
        <View style={styles.ticketColumn}>
          <Text style={styles.timeText}>{ticket.departureTime}</Text>
          <Text style={styles.dateSmallText}>{ticket.date}</Text>
          <Text style={styles.priceText}>{ticket.price}</Text>
        </View>

        {/* Spacer untuk Harga */}
        <View style={{ width: 24 }} /> 

        {/* Waktu Kedatangan */}
        <View style={[styles.ticketColumn, { alignItems: 'flex-start' }]}>
          <Text style={styles.timeText}>{ticket.arrivalTime}</Text>
          <Text style={styles.dateSmallText}>Tue, 24 Jun</Text>
          <View style={{ height: 25 }} /> 
        </View>
      </View>
    </View>
  </View>
);

// Navigasi Bawah Kustom BARU (Disalin dari HomeScreen)
const BottomNav: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    
    // Asumsi: Kita menyorot ikon 'Grid' atau 'Search' saat di layar Tiket
    const inactiveColor = '#AAAAAA';
    const activeColor = 'white';
    
    return (
        <View style={styles.bottomNav}>
            {/* 1. Home (Active in HomeScreen, Inactive here) */}
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('HomeScreen')}>
                <Ionicons name="home-outline" size={26} color={inactiveColor} />
            </TouchableOpacity>
            
            {/* 2. Grid/Tickets (Active/Highlighted for this screen's context) */}
            <TouchableOpacity style={styles.navItem} onPress={() => console.log('Grid/Ticket Pressed')}>
                <Ionicons name="grid" size={26} color={activeColor} />
            </TouchableOpacity>
            
            {/* 3. Profile (Inactive) */}
            <TouchableOpacity style={styles.navItem} onPress={() => console.log('Profile Pressed')}>
                <Ionicons name="person-outline" size={26} color={inactiveColor} />
            </TouchableOpacity>
        </View>
    );
};

// --- 3. LAYAR UTAMA: TicketsScreen ---

const TicketsScreen: React.FC = () => {
  // Tambahkan hook navigasi untuk tombol kembali
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header / AppBar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tickets</Text>
        <Ionicons name="ellipsis-vertical" size={24} color={COLORS.black} />
      </View>

      <ScrollView style={styles.container}>
        {/* Lokasi Saat Ini */}
        <Text style={styles.locationLabel}>Current locations</Text>
        <View style={styles.locationRow}>
          <Text style={styles.locationText}>Netherlands</Text>
          <Ionicons name="chevron-down" size={24} color={COLORS.black} />
        </View>

        {/* Pilihan Kategori */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
          <CategoryButton text="Hotel" isSelected={false} />
          <CategoryButton text="Aircraft" isSelected={true} />
          <CategoryButton text="Villa" isSelected={false} />
          <CategoryButton text="Attraction" isSelected={false} />
        </ScrollView>

        {/* Pemilih Bulan */}
        <View style={styles.monthRow}>
          <Text style={styles.monthText}>June, 2025</Text>
          <Ionicons name="chevron-down" size={24} color={COLORS.black} />
        </View>

        {/* Pemilih Tanggal */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          <DatePill day="S" date="22" isSelected={false} />
          <DatePill day="M" date="23" isSelected={true} />
          <DatePill day="T" date="24" isSelected={false} />
          <DatePill day="W" date="25" isSelected={false} />
          <DatePill day="T" date="26" isSelected={false} />
          <DatePill day="F" date="27" isSelected={false} />
          <DatePill day="S" date="28" isSelected={false} />
        </ScrollView>

        {/* Hasil Pencarian */}
        <Text style={styles.ticketsFoundText}>{DUMMY_TICKETS.length} Tickets Found</Text>

        {/* Daftar Tiket */}
        <View style={styles.ticketList}>
          {DUMMY_TICKETS.map((ticket, index) => (
            <FlightTicketCard key={index} ticket={ticket} />
          ))}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* PENGGANTIAN NAV BAR */}
      <BottomNav />
    </SafeAreaView>
  );
};

// --- 4. STYLING ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.offWhite,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.offWhite,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Lokasi
  locationLabel: {
    color: COLORS.textGray,
    marginTop: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 5,
  },

  // Kategori
  categoryScroll: {
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, 
  },

  // Bulan dan Tanggal
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  monthText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 5,
  },
  dateScroll: {
    marginBottom: 25,
  },
  datePill: {
    width: 50,
    height: 70,
    borderRadius: 12,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  // Daftar Tiket
  ticketsFoundText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  ticketList: {
    // container untuk kartu tiket
  },
  
  // Gaya Kartu Tiket
  ticketCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 20,
    height: 160,
    overflow: 'hidden', 
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  ticketLeftBar: {
    width: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketLeftBarText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    transform: [{ rotate: '-90deg' }], 
    width: 100, 
    textAlign: 'center',
  },
  ticketIconContainer: {
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  ticketDetails: {
    flex: 1,
    padding: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  ticketColumn: {
    flex: 1,
    alignItems: 'flex-start',
  },
  codeText: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 35,
  },
  cityText: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateSmallText: {
    fontSize: 14,
    color: COLORS.textGray,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 5,
  },
  
  // Gaya Navigasi Bawah BARU (Disalin dari HomeScreen)
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#333', // Warna latar belakang navbar
    paddingVertical: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 20, // Untuk mengakomodasi area aman (safe area)
  },
  navItem: {
    padding: 5,
  },
});

export default TicketsScreen;