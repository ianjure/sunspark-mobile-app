import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { styles } from "@/src/styles/styles";

const PROVIDERS = [
  {
    name: "SolarPH",
    location: "Manila, Metro Manila",
    rating: "4.9",
    reviews: "128 reviews",
    tags: ["Residential", "Zero Downpayment"],
  },
  {
    name: "EcoVolt",
    location: "Quezon City, Metro Manila",
    rating: "4.7",
    reviews: "85 reviews",
    tags: ["Commercial", "Fast Install"],
  },
  {
    name: "SunPower Manila",
    location: "Makati, Metro Manila",
    rating: "4.8",
    reviews: "210 reviews",
    tags: ["Premium Panels", "Financing"],
  },
];

export default function ProvidersTab() {
  return (
    <>
      <View style={styles.providerHeroCard}>
        <Text style={styles.providerHeroIcon}>💡</Text>

        <View style={{ flex: 1 }}>
          <Text style={styles.providerHeroTitle}>Solar developers near you</Text>
          <Text style={styles.providerHeroSubtitle}>
            Verified providers serving your area. Choose a partner to start your
            solar journey.
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterChipRow}
      >
        <View style={styles.activeFilterChip}>
          <Text style={styles.activeFilterText}>All</Text>
        </View>

        <View style={styles.filterChip}>
          <Text style={styles.filterText}>Financing</Text>
        </View>

        <View style={styles.filterChip}>
          <Text style={styles.filterText}>Residential</Text>
        </View>

        <View style={styles.filterChip}>
          <Text style={styles.filterText}>Highly rated</Text>
        </View>
      </ScrollView>

      <View style={styles.providerList}>
        {PROVIDERS.map((provider) => (
          <View key={provider.name} style={styles.providerCard}>
            <View style={styles.providerHeaderRow}>
              <View style={styles.providerLogo}>
                <Text style={styles.providerLogoText}>☀️</Text>
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.providerNameRow}>
                  <Text style={styles.providerName}>{provider.name}</Text>

                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedBadgeText}>✓ Verified</Text>
                  </View>
                </View>

                <Text style={styles.providerLocation}>📍 {provider.location}</Text>

                <Text style={styles.providerRating}>
                  ⭐ {provider.rating}{" "}
                  <Text style={styles.providerReviews}>
                    ({provider.reviews})
                  </Text>
                </Text>
              </View>
            </View>

            <View style={styles.providerTagRow}>
              {provider.tags.map((tag) => (
                <View key={tag} style={styles.providerTag}>
                  <Text style={styles.providerTagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.viewProfileButton}>
              <Text style={styles.viewProfileButtonText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.protectionCard}>
        <Text style={styles.protectionIcon}>🛡️</Text>

        <View style={{ flex: 1 }}>
          <Text style={styles.protectionTitle}>Sunspark Protection</Text>
          <Text style={styles.protectionText}>
            All developers are background checked and verified for Philippine
            standards.
          </Text>
        </View>
      </View>
    </>
  );
}