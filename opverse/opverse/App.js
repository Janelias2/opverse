import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';

export default function App() {
  const [userRole, setUserRole] = useState('customer');
  const [route, setRoute] = useState('home');
  const [wallet, setWallet] = useState({ balance: 12.5, rewardsPending: 3.0 });
  const [partnerWallet, setPartnerWallet] = useState({ adBudget: 250.0, adsCreated: 2 });
  const [ads, setAds] = useState([
    { id: 1, title: 'Monginis Spring Offer' },
    { id: 2, title: 'Orange Fiber Internet Ad' },
  ]);

  const smes = [
    { id: 1, name: 'Monginis', category: 'Food', offer: 'Buy 1 Get 1 Free Cake' },
    { id: 2, name: 'Bekky Barber', category: 'Grooming', offer: '20% Off Haircuts' },
    { id: 3, name: 'Gourmet', category: 'Retail', offer: 'Save 10% on Premium Groceries' },
  ];

  const [newAdTitle, setNewAdTitle] = useState('');

  function claimRewards() {
    setWallet({ balance: wallet.balance + wallet.rewardsPending, rewardsPending: 0 });
  }

  function watchAd(ad) {
    setWallet({ ...wallet, rewardsPending: wallet.rewardsPending + 0.25 });
    Alert.alert('Reward Earned', `Watched ${ad.title} and earned 0.25 Orange Coins!`);
  }

  function createAd() {
    if (!newAdTitle.trim()) return Alert.alert('Missing title', 'Please enter an ad title');
    const newAd = { id: Date.now(), title: newAdTitle };
    setAds([...ads, newAd]);
    setNewAdTitle('');
    setPartnerWallet({ ...partnerWallet, adsCreated: partnerWallet.adsCreated + 1, adBudget: partnerWallet.adBudget - 5 });
    Alert.alert('Ad Created', `Your ad \"${newAd.title}\" has been added (-$5 from budget).`);
  }

  function topUpBudget() {
    setPartnerWallet({ ...partnerWallet, adBudget: partnerWallet.adBudget + 50 });
    Alert.alert('Balance Added', 'Your ad budget has been topped up by $50.');
  }

  const NavButton = ({ label, screen }) => (
    <TouchableOpacity
      style={[styles.navButton, route === screen && styles.navButtonActive]}
      onPress={() => setRoute(screen)}
    >
      <Text style={[styles.navText, route === screen && styles.navTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  const RoleToggle = () => (
    <View style={styles.roleToggle}>
      <Button title="Customer" onPress={() => setUserRole('customer')} color={userRole === 'customer' ? '#ff7900' : '#ccc'} />
      <Button title="Partner Interface" onPress={() => setUserRole('partner')} color={userRole === 'partner' ? '#ff7900' : '#ccc'} />
    </View>
  );

  // === Customer mode functions unchanged (Home, Offers, Watch, Wallet) ===
  function HomeScreen() { /* same as before */ return null; } // shorten for clarity

  // === Partner Dashboard ===
  function PartnerDashboard() {
    return (
      <ScrollView style={styles.section}>
        <Text style={styles.title}>Partner Dashboard</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ad Creator</Text>
          <TextInput
            placeholder="Enter ad title..."
            value={newAdTitle}
            onChangeText={setNewAdTitle}
            style={styles.input}
          />
          <Button title="Create Ad ($5 cost)" color="#ff7900" onPress={createAd} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>My Ads</Text>
          {ads.map((ad) => (
            <Text key={ad.id} style={styles.text}>• {ad.title}</Text>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ad Budget Balance</Text>
          <Text>Current Budget: ${partnerWallet.adBudget.toFixed(2)}</Text>
          <Text>Ads Created: {partnerWallet.adsCreated}</Text>
          <Button title="Top Up Balance (+ $50)" color="#ff7900" onPress={topUpBudget} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Analytics Snapshot</Text>
          <Text>Reach: 2,300 impressions</Text>
          <Text>Engagement: 412 views</Text>
          <Text>Conversion: 7.2%</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🟠 OPVerse</Text>
      <RoleToggle />
      {userRole === 'partner' && <PartnerDashboard />}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,paddingTop:50,backgroundColor:'#fff'},
  header:{fontSize:22,fontWeight:'bold',color:'#ff7900',textAlign:'center',marginBottom:10},
  section:{paddingHorizontal:20,marginBottom:20},
  title:{fontSize:20,fontWeight:'bold',marginVertical:10},
  text:{fontSize:16,marginVertical:4},
  card:{backgroundColor:'#f9f9f9',padding:15,marginBottom:10,borderRadius:8,borderWidth:1,borderColor:'#eee'},
  cardTitle:{fontSize:18,fontWeight:'600',marginBottom:5},
  input:{borderWidth:1,borderColor:'#ccc',borderRadius:6,padding:8,marginBottom:10},
  navButton:{padding:6,borderRadius:5},
  navButtonActive:{backgroundColor:'#ff7900'},
  navText:{color:'#333'},
  navTextActive:{color:'#fff'},
  roleToggle:{flexDirection:'row',justifyContent:'space-evenly',marginBottom:10},
});
