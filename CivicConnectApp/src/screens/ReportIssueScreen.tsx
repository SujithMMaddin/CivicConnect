import { useRef } from "react";

import { Modal } from "react-native";
import { ChevronRight, Image as ImageIcon } from "lucide-react-native";
import MapView, { Marker } from "react-native-maps";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import {
  ArrowLeft,
  MapPin,
  Camera,
  X,
  Construction,
  Trash2,
  Droplets,
  Zap,
  Wrench,
  Lightbulb,
  HelpCircle,
  Navigation,
  Brush,
  Signpost,
  Footprints,
  Volume2,
  Car,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { API_CONFIG } from "../api/config";

// ---------- Types ----------
type Category = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

// ---------- Categories ----------
const CATEGORIES: Category[] = [
  {
    id: "Pothole",
    label: "Pothole",
    icon: <Construction size={28} color="#334155" />,
  },
  {
    id: "Streetlight",
    label: "Street Light",
    icon: <Lightbulb size={28} color="#334155" />,
  },
  {
    id: "Water",
    label: "Water",
    icon: <Droplets size={28} color="#334155" />,
  },
  {
    id: "Trash",
    label: "Trash",
    icon: <Trash2 size={28} color="#334155" />,
  },
  {
    id: "Graffiti",
    label: "Graffiti",
    icon: <Brush size={28} color="#334155" />,
  },
  {
    id: "Traffic Sign",
    label: "Traffic Sign",
    icon: <Signpost size={28} color="#334155" />,
  },
  {
    id: "Sidewalk",
    label: "Sidewalk",
    icon: <Footprints size={28} color="#334155" />,
  },
  {
    id: "Parking",
    label: "Parking",
    icon: <Car size={28} color="#334155" />,
  },
  {
    id: "Noise",
    label: "Noise",
    icon: <Volume2 size={28} color="#334155" />,
  },
  {
    id: "Other",
    label: "Other",
    icon: <HelpCircle size={28} color="#334155" />,
  },
];

// ---------- Step Indicator ----------
const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <View style={styles.stepIndicator}>
    {[1, 2, 3].map((step) => (
      <View
        key={step}
        style={[
          styles.stepBar,
          step <= currentStep ? styles.stepBarActive : styles.stepBarInactive,
        ]}
      />
    ))}
  </View>
);

// ---------- Step 1: Category ----------
const Step1 = ({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) => (
  <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
    <Text style={styles.stepTitle}>What type of issue?</Text>
    <Text style={styles.stepSubtitle}>
      Select the category that best describes the problem
    </Text>
    <View style={styles.categoryGrid}>
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[
            styles.categoryCard,
            selected === cat.id && styles.categoryCardSelected,
          ]}
          onPress={() => onSelect(cat.id)}
          activeOpacity={0.75}
        >
          <View
            style={[
              styles.categoryIconBox,
              selected === cat.id && styles.categoryIconBoxSelected,
            ]}
          >
            {cat.icon}
          </View>
          <Text
            style={[
              styles.categoryLabel,
              selected === cat.id && styles.categoryLabelSelected,
            ]}
          >
            {cat.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
    <View style={{ height: 100 }} />
  </ScrollView>
);

// ---------- Step 2: Location ----------
const Step2 = ({
  address,
  setAddress,
  latitude,
  setLatitude,
  longitude,
  setLongitude,
  locationLoading,
  setLocationLoading,
  suggestions,
  setSuggestions,
  fetchSuggestions,
  
}: {
  address: string;
  setAddress: (v: string) => void;
  latitude: number | null;
  setLatitude: (v: number) => void;
  longitude: number | null;
  setLongitude: (v: number) => void;
  locationLoading: boolean;
  setLocationLoading: (v: boolean) => void;
  suggestions: any[];
  setSuggestions: (v: any[]) => void;
  fetchSuggestions: (q: string) => void;
  
}) => {
  const mapRef = useRef<MapView>(null);
  const handleUseCurrentLocation = async () => {
  setLocationLoading(true);
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }
    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    setLatitude(loc.coords.latitude);
    setLongitude(loc.coords.longitude);

    // Animate map to current location
    mapRef.current?.animateToRegion({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 800);

    const geocode = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });
    if (geocode.length > 0) {
      const g = geocode[0];
      const addr = [g.street, g.city, g.region].filter(Boolean).join(", ");
      setAddress(addr);
    }
  } catch (err) {
    Alert.alert("Error", "Could not get your location. Please try again.");
  } finally {
    setLocationLoading(false);
  }
};

  return (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Where is the issue?</Text>
      <Text style={styles.stepSubtitle}>
        Enter the address or use the map to pinpoint the location
      </Text>

      {/* Map Placeholder */}
     <MapView
  ref={mapRef}
  style={{ width: "100%", height: 200, borderRadius: 16, marginBottom: 20 }}
  initialRegion={{
    latitude: latitude || 12.9716,
    longitude: longitude || 77.5946,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }}
  onPress={(e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLatitude(latitude);
    setLongitude(longitude);
  }}
>
  {latitude && longitude && (
    <Marker coordinate={{ latitude, longitude }} />
  )}
</MapView>

      {/* Address Input */}
      <Text style={styles.fieldLabel}>Address</Text>
      <View style={styles.inputRow}>
        <MapPin size={16} color="#94A3B8" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.addressInput}
          placeholder="Enter street address..."
          placeholderTextColor="#94A3B8"
          value={address}
          onChangeText={(text) => {
  setAddress(text);
  fetchSuggestions(text);
}}
        />
      </View>

      {suggestions.map((item: any, index: number) => (
  <TouchableOpacity
    key={index}
    style={{
      padding: 10,
      borderBottomWidth: 1,
      borderColor: "#eee",
      backgroundColor: "#fff",
    }}
    onPress={() => {
  const lat = parseFloat(item.lat);
  const lon = parseFloat(item.lon);
  setAddress(item.display_name);
  setLatitude(lat);
  setLongitude(lon);
  setSuggestions([]);
  // Animate map to new location
  mapRef.current?.animateToRegion({
    latitude: lat,
    longitude: lon,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  }, 800);
}}
  >
    <Text style={{ fontSize: 13 }}>{item.display_name}</Text>
  </TouchableOpacity>
))}

      {/* Use Current Location */}
      <TouchableOpacity
        style={styles.currentLocationBtn}
        onPress={handleUseCurrentLocation}
        activeOpacity={0.8}
        disabled={locationLoading}
      >
        {locationLoading ? (
          <ActivityIndicator size="small" color="#334155" />
        ) : (
          <>
            <Navigation size={16} color="#334155" style={{ marginRight: 8 }} />
            <Text style={styles.currentLocationText}>Use Current Location</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

// ---------- Step 3: Description + Photos ----------
// ---------- Step 3: Description + Photos ----------
const Step3 = ({
  category,
  address,
  description,
  setDescription,
  photos,
  setPhotos,
}: {
  category: string;
  address: string;
  description: string;
  setDescription: (v: string) => void;
  photos: string[];
  setPhotos: (v: string[]) => void;
}) => {
  const categoryLabel =
    CATEGORIES.find((c) => c.id === category)?.label || "Other";
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const handleTakePhoto = async () => {
    setPhotoModalVisible(false);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera access is required.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const handleChooseFromGallery = async () => {
    setPhotoModalVisible(false);
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Photo library access is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <>
      <ScrollView
        style={styles.stepContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.stepTitle}>Describe the issue</Text>
        <Text style={styles.stepSubtitle}>
          Provide details to help us understand and address the problem
        </Text>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Category:</Text>
            <Text style={styles.summaryValue}>{categoryLabel}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Location:</Text>
            <Text style={styles.summaryValue} numberOfLines={1}>
              {address || "Not specified"}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.fieldLabel}>Description</Text>
        <View style={styles.textAreaWrapper}>
          <TextInput
            style={styles.textArea}
            placeholder="Describe the issue in detail..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={6}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{description.length} characters</Text>
        </View>

        {/* Photos */}
        <Text style={styles.fieldLabel}>Photos (optional)</Text>
        <View style={styles.photosRow}>
          {photos.map((uri, index) => (
            <View key={index} style={styles.photoThumb}>
              <Image source={{ uri }} style={styles.photoImage} />
              <TouchableOpacity
                style={styles.photoRemove}
                onPress={() => handleRemovePhoto(index)}
              >
                <X size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
          {photos.length < 3 && (
            <TouchableOpacity
              style={styles.addPhotoBtn}
              onPress={() => setPhotoModalVisible(true)}
              activeOpacity={0.8}
            >
              <Camera size={24} color="#94A3B8" />
              <Text style={styles.addPhotoText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.photoHint}>Max 3 photos. Tap to add.</Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Photo Picker Bottom Sheet */}
      <Modal
        visible={photoModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPhotoModalVisible(false)}
        >
          <View style={styles.bottomSheet}>
            {/* Handle bar */}
            <View style={styles.bottomSheetHandle} />

            <Text style={styles.bottomSheetTitle}>Add Photo</Text>
            <Text style={styles.bottomSheetSubtitle}>
              Choose how you'd like to add a photo
            </Text>

            {/* Take Photo Option */}
            <TouchableOpacity
              style={styles.bottomSheetOption}
              onPress={handleTakePhoto}
              activeOpacity={0.8}
            >
              <View style={styles.bottomSheetIconBox}>
                <Camera size={22} color="#1D4ED8" />
              </View>
              <View style={styles.bottomSheetOptionText}>
                <Text style={styles.bottomSheetOptionTitle}>Take Photo</Text>
                <Text style={styles.bottomSheetOptionSubtitle}>
                  Use your camera to capture the issue
                </Text>
              </View>
              <ChevronRight size={18} color="#CBD5E1" />
            </TouchableOpacity>

            <View style={styles.bottomSheetDivider} />

            {/* Gallery Option */}
            <TouchableOpacity
              style={styles.bottomSheetOption}
              onPress={handleChooseFromGallery}
              activeOpacity={0.8}
            >
              <View style={styles.bottomSheetIconBox}>
                <ImageIcon size={22} color="#1D4ED8" />
              </View>
              <View style={styles.bottomSheetOptionText}>
                <Text style={styles.bottomSheetOptionTitle}>
                  Choose from Gallery
                </Text>
                <Text style={styles.bottomSheetOptionSubtitle}>
                  Pick an existing photo from your device
                </Text>
              </View>
              <ChevronRight size={18} color="#CBD5E1" />
            </TouchableOpacity>

            {/* Cancel */}
            <TouchableOpacity
              style={styles.bottomSheetCancel}
              onPress={() => setPhotoModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.bottomSheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

// ---------- Main Screen ----------
export default function ReportIssueScreen() {
  const [suggestions, setSuggestions] = useState<any[]>([]);
 const fetchSuggestions = async (query: string) => {
  if (query.length < 3) {
    setSuggestions([]);
    return;
  }
  try {
    const res = await fetch(
      `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en`
    );
    const data = await res.json();
    const mapped = data.features.map((f: any) => ({
      display_name: [
        f.properties.name,
        f.properties.city,
        f.properties.state,
        f.properties.country,
      ]
        .filter(Boolean)
        .join(", "),
      lat: f.geometry.coordinates[1].toString(),
      lon: f.geometry.coordinates[0].toString(),
    }));
    setSuggestions(mapped);
  } catch (err) {
    console.error("Error fetching suggestions:", err);
    setSuggestions([]);
  }
};
  const [region, setRegion] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
  });
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1
  const [category, setCategory] = useState("");

  // Step 2
    const mapRef = useRef<MapView>(null);

  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);


  // Step 3
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const handleContinue = () => {
    if (step === 1) {
      if (!category) {
        Alert.alert("Select Category", "Please select a category to continue.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!address && (!latitude || !longitude)) {
        Alert.alert(
          "Location Required",
          "Please enter an address or use your current location.",
        );
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      Alert.alert("Description Required", "Please describe the issue.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        category,
        description,
        latitude: latitude ?? 0,
        longitude: longitude ?? 0,
        status: "Pending",
        priority: category === "water" ? "High" : "Medium",
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      Alert.alert(
        "Issue Reported! ✅",
        "Your report has been submitted successfully. Thank you for helping improve your community!",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      Alert.alert(
        "Submission Failed",
        "Could not submit your report. Please try again.",
      );
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#EFF4FB" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="#0F172A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Report Issue</Text>
          <Text style={styles.headerSubtitle}>Step {step} of 3</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Step Indicator */}
      <StepIndicator currentStep={step} />

      {/* Step Content */}
      {step === 1 && <Step1 selected={category} onSelect={setCategory} />}
      {step === 2 && (
  <Step2
    address={address}
    setAddress={setAddress}
    latitude={latitude}
    setLatitude={setLatitude}
    longitude={longitude}
    setLongitude={setLongitude}
    locationLoading={locationLoading}
    setLocationLoading={setLocationLoading}
    suggestions={suggestions}
    setSuggestions={setSuggestions}
    fetchSuggestions={fetchSuggestions}
  />
)}
      {step === 3 && (
        <Step3
          category={category}
          address={address}
          description={description}
          setDescription={setDescription}
          photos={photos}
          setPhotos={setPhotos}
        />
      )}

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        {step < 3 ? (
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={handleContinue}
            activeOpacity={0.85}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.continueBtn,
              submitting && styles.continueBtnDisabled,
            ]}
            onPress={handleSubmit}
            activeOpacity={0.85}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.continueBtnText}>Submit Report</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  modalOverlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
},
bottomSheet: {
  backgroundColor: "#FFFFFF",
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  padding: 24,
  paddingBottom: 36,
},
bottomSheetHandle: {
  width: 40,
  height: 4,
  borderRadius: 2,
  backgroundColor: "#E2E8F0",
  alignSelf: "center",
  marginBottom: 20,
},
bottomSheetTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#0F172A",
  marginBottom: 4,
},
bottomSheetSubtitle: {
  fontSize: 13,
  color: "#64748B",
  marginBottom: 20,
},
bottomSheetOption: {
  flexDirection: "row",
  alignItems: "center",
  paddingVertical: 14,
  gap: 14,
},
bottomSheetIconBox: {
  width: 46,
  height: 46,
  borderRadius: 12,
  backgroundColor: "#EFF6FF",
  justifyContent: "center",
  alignItems: "center",
},
bottomSheetOptionText: {
  flex: 1,
},
bottomSheetOptionTitle: {
  fontSize: 15,
  fontWeight: "600",
  color: "#0F172A",
  marginBottom: 2,
},
bottomSheetOptionSubtitle: {
  fontSize: 12,
  color: "#64748B",
},
bottomSheetDivider: {
  height: 1,
  backgroundColor: "#F1F5F9",
},
bottomSheetCancel: {
  marginTop: 16,
  paddingVertical: 14,
  borderRadius: 12,
  backgroundColor: "#F1F5F9",
  alignItems: "center",
},
bottomSheetCancelText: {
  fontSize: 15,
  fontWeight: "600",
  color: "#64748B",
},
  safeArea: {
    flex: 1,
    backgroundColor: "#EFF4FB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 1,
  },
  stepIndicator: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 20,
  },
  stepBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  stepBarActive: {
    backgroundColor: "#1D4ED8",
  },
  stepBarInactive: {
    backgroundColor: "#CBD5E1",
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  stepSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 24,
    lineHeight: 20,
  },

  // Category Grid
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryCardSelected: {
    borderColor: "#1D4ED8",
    backgroundColor: "#EFF6FF",
  },
  categoryIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  categoryIconBoxSelected: {
    backgroundColor: "#DBEAFE",
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },
  categoryLabelSelected: {
    color: "#1D4ED8",
  },

  // Location
  mapPlaceholder: {
    backgroundColor: "#E2E8F0",
    borderRadius: 16,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  mapPlaceholderInner: {
    alignItems: "center",
    gap: 10,
  },
  mapPinOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholderText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  locationConfirmed: {
    alignItems: "center",
    gap: 6,
  },
  locationConfirmedText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D4ED8",
  },
  locationCoords: {
    fontSize: 12,
    color: "#64748B",
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  addressInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },
  currentLocationBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  currentLocationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },

  // Step 3
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 6,
  },
  summaryKey: {
    fontSize: 13,
    color: "#64748B",
    width: 80,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    flex: 1,
  },
  textAreaWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
    padding: 14,
  },
  textArea: {
    fontSize: 14,
    color: "#0F172A",
    minHeight: 120,
    lineHeight: 20,
  },
  charCount: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "right",
    marginTop: 8,
  },
  photosRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 8,
  },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  photoImage: {
    width: "100%",
    height: "100%",
  },
  photoRemove: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  addPhotoBtn: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
  },
  addPhotoText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "500",
  },
  photoHint: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 8,
  },

  // Bottom Bar
  bottomBar: {
    padding: 16,
    backgroundColor: "#EFF4FB",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  continueBtn: {
    backgroundColor: "#1D4ED8",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1D4ED8",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueBtnDisabled: {
    opacity: 0.7,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});
