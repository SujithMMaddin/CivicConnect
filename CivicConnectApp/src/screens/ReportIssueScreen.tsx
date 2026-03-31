import { useRef } from "react";
import { supabase } from "../api/supabase";
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
import { invalidateCache } from "../api/issues";
import { useTheme } from "../context/ThemeContext";

// ---------- Types ----------
type Category = {
  id: string;
  label: string;
  icon: (color: string) => React.ReactNode;
};

// ---------- Categories ----------
const CATEGORIES: Category[] = [
  {
    id: "Pothole",
    label: "Pothole",
    icon: (c) => <Construction size={28} color={c} />,
  },
  {
    id: "Streetlight",
    label: "Street Light",
    icon: (c) => <Lightbulb size={28} color={c} />,
  },
  {
    id: "Water",
    label: "Water",
    icon: (c) => <Droplets size={28} color={c} />,
  },
  { id: "Trash", label: "Trash", icon: (c) => <Trash2 size={28} color={c} /> },
  {
    id: "Graffiti",
    label: "Graffiti",
    icon: (c) => <Brush size={28} color={c} />,
  },
  {
    id: "Traffic Sign",
    label: "Traffic Sign",
    icon: (c) => <Signpost size={28} color={c} />,
  },
  {
    id: "Sidewalk",
    label: "Sidewalk",
    icon: (c) => <Footprints size={28} color={c} />,
  },
  { id: "Parking", label: "Parking", icon: (c) => <Car size={28} color={c} /> },
  { id: "Noise", label: "Noise", icon: (c) => <Volume2 size={28} color={c} /> },
  {
    id: "Other",
    label: "Other",
    icon: (c) => <HelpCircle size={28} color={c} />,
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
}) => {
  const { colors, isDark } = useTheme();
  return (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        What type of issue?
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
        Select the category that best describes the problem
      </Text>
      <View style={styles.categoryGrid}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryCard,
              { backgroundColor: colors.card, borderColor: "transparent" },
              selected === cat.id && {
                borderColor: "#1D4ED8",
                backgroundColor: isDark ? "#1e3a5f" : "#EFF6FF",
              },
            ]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.75}
          >
            <View
              style={[
                styles.categoryIconBox,
                { backgroundColor: isDark ? colors.border : "#F1F5F9" },
                selected === cat.id && {
                  backgroundColor: isDark ? "#1e3a5f" : "#DBEAFE",
                },
              ]}
            >
              {cat.icon(selected === cat.id ? "#1D4ED8" : colors.textSecondary)}
            </View>
            <Text
              style={[
                styles.categoryLabel,
                { color: colors.textSecondary },
                selected === cat.id && { color: "#1D4ED8" },
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
};

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
  const { colors } = useTheme();

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
      mapRef.current?.animateToRegion(
        {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        800,
      );
      const geocode = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      if (geocode.length > 0) {
        const g = geocode[0];
        setAddress([g.street, g.city, g.region].filter(Boolean).join(", "));
      }
    } catch (err) {
      Alert.alert("Error", "Could not get your location. Please try again.");
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={[styles.stepTitle, { color: colors.text }]}>
        Where is the issue?
      </Text>
      <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
        Enter the address or use the map to pinpoint the location
      </Text>
      <MapView
        ref={mapRef}
        style={{
          width: "100%",
          height: 200,
          borderRadius: 16,
          marginBottom: 20,
        }}
        initialRegion={{
          latitude: latitude || 12.9716,
          longitude: longitude || 77.5946,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={(e) => {
          setLatitude(e.nativeEvent.coordinate.latitude);
          setLongitude(e.nativeEvent.coordinate.longitude);
        }}
      >
        {latitude && longitude && (
          <Marker coordinate={{ latitude, longitude }} />
        )}
      </MapView>

      <Text style={[styles.fieldLabel, { color: colors.text }]}>Address</Text>
      <View
        style={[
          styles.inputRow,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <MapPin
          size={16}
          color={colors.textSecondary}
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={[styles.addressInput, { color: colors.text }]}
          placeholder="Enter street address..."
          placeholderTextColor={colors.textSecondary}
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
            borderColor: colors.border,
            backgroundColor: colors.card,
          }}
          onPress={() => {
            const lat = parseFloat(item.lat);
            const lon = parseFloat(item.lon);
            setAddress(item.display_name);
            setLatitude(lat);
            setLongitude(lon);
            setSuggestions([]);
            mapRef.current?.animateToRegion(
              {
                latitude: lat,
                longitude: lon,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              800,
            );
          }}
        >
          <Text style={{ fontSize: 13, color: colors.text }}>
            {item.display_name}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[
          styles.currentLocationBtn,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={handleUseCurrentLocation}
        activeOpacity={0.8}
        disabled={locationLoading}
      >
        {locationLoading ? (
          <ActivityIndicator size="small" color={colors.text} />
        ) : (
          <>
            <Navigation
              size={16}
              color={colors.text}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.currentLocationText, { color: colors.text }]}>
              Use Current Location
            </Text>
          </>
        )}
      </TouchableOpacity>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

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
  const { colors } = useTheme();
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
    if (!result.canceled && result.assets.length > 0)
      setPhotos([...photos, result.assets[0].uri]);
  };

  const handleChooseFromGallery = async () => {
    setPhotoModalVisible(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Photo library access is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0)
      setPhotos([...photos, result.assets[0].uri]);
  };

  return (
    <>
      <ScrollView
        style={styles.stepContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.stepTitle, { color: colors.text }]}>
          Describe the issue
        </Text>
        <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>
          Provide details to help us understand and address the problem
        </Text>

        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryKey, { color: colors.textSecondary }]}>
              Category:
            </Text>
            <Text style={[styles.summaryValue, { color: colors.text }]}>
              {categoryLabel}
            </Text>
          </View>
          <View
            style={[styles.summaryDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryKey, { color: colors.textSecondary }]}>
              Location:
            </Text>
            <Text
              style={[styles.summaryValue, { color: colors.text }]}
              numberOfLines={1}
            >
              {address || "Not specified"}
            </Text>
          </View>
        </View>

        <Text style={[styles.fieldLabel, { color: colors.text }]}>
          Description
        </Text>
        <View
          style={[
            styles.textAreaWrapper,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <TextInput
            style={[styles.textArea, { color: colors.text }]}
            placeholder="Describe the issue in detail..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={6}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />
          <Text style={[styles.charCount, { color: colors.textSecondary }]}>
            {description.length} characters
          </Text>
        </View>

        <Text style={[styles.fieldLabel, { color: colors.text }]}>
          Photos (optional)
        </Text>
        <View style={styles.photosRow}>
          {photos.map((uri, index) => (
            <View key={index} style={styles.photoThumb}>
              <Image source={{ uri }} style={styles.photoImage} />
              <TouchableOpacity
                style={styles.photoRemove}
                onPress={() => setPhotos(photos.filter((_, i) => i !== index))}
              >
                <X size={12} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ))}
          {photos.length < 3 && (
            <TouchableOpacity
              style={[
                styles.addPhotoBtn,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setPhotoModalVisible(true)}
              activeOpacity={0.8}
            >
              <Camera size={24} color={colors.textSecondary} />
              <Text
                style={[styles.addPhotoText, { color: colors.textSecondary }]}
              >
                Add
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.photoHint, { color: colors.textSecondary }]}>
          Max 3 photos. Tap to add.
        </Text>
        <View style={{ height: 100 }} />
      </ScrollView>

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
          <View style={[styles.bottomSheet, { backgroundColor: colors.card }]}>
            <View
              style={[
                styles.bottomSheetHandle,
                { backgroundColor: colors.border },
              ]}
            />
            <Text style={[styles.bottomSheetTitle, { color: colors.text }]}>
              Add Photo
            </Text>
            <Text
              style={[
                styles.bottomSheetSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              Choose how you'd like to add a photo
            </Text>
            <TouchableOpacity
              style={styles.bottomSheetOption}
              onPress={handleTakePhoto}
              activeOpacity={0.8}
            >
              <View style={styles.bottomSheetIconBox}>
                <Camera size={22} color="#1D4ED8" />
              </View>
              <View style={styles.bottomSheetOptionText}>
                <Text
                  style={[
                    styles.bottomSheetOptionTitle,
                    { color: colors.text },
                  ]}
                >
                  Take Photo
                </Text>
                <Text
                  style={[
                    styles.bottomSheetOptionSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Use your camera to capture the issue
                </Text>
              </View>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <View
              style={[
                styles.bottomSheetDivider,
                { backgroundColor: colors.border },
              ]}
            />
            <TouchableOpacity
              style={styles.bottomSheetOption}
              onPress={handleChooseFromGallery}
              activeOpacity={0.8}
            >
              <View style={styles.bottomSheetIconBox}>
                <ImageIcon size={22} color="#1D4ED8" />
              </View>
              <View style={styles.bottomSheetOptionText}>
                <Text
                  style={[
                    styles.bottomSheetOptionTitle,
                    { color: colors.text },
                  ]}
                >
                  Choose from Gallery
                </Text>
                <Text
                  style={[
                    styles.bottomSheetOptionSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Pick an existing photo from your device
                </Text>
              </View>
              <ChevronRight size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.bottomSheetCancel,
                { backgroundColor: colors.border },
              ]}
              onPress={() => setPhotoModalVisible(false)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.bottomSheetCancelText,
                  { color: colors.textSecondary },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

// ---------- Main Screen ----------
export default function ReportIssueScreen() {
  const { colors, isDark } = useTheme();
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5&lang=en`,
      );
      const data = await res.json();
      setSuggestions(
        data.features.map((f: any) => ({
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
        })),
      );
    } catch (err) {
      setSuggestions([]);
    }
  };

  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [category, setCategory] = useState("");
  const mapRef = useRef<MapView>(null);
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
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
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const payload = {
        category,
        description,
        latitude: latitude ?? 0,
        longitude: longitude ?? 0,
        status: "Pending",
        priority: category === "Water" ? "High" : "Medium",
        userId: user?.id ?? null,
      };
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/issues`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      invalidateCache();
      Alert.alert(
        "Issue Reported",
        "Your report has been submitted successfully. Thank you for helping improve your community!",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      Alert.alert(
        "Submission Failed",
        "Could not submit your report. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigation.goBack();
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={[styles.backButton, { backgroundColor: colors.card }]}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Report Issue
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            Step {step} of 3
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <StepIndicator currentStep={step} />

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

      <View
        style={[
          styles.bottomBar,
          { backgroundColor: colors.background, borderTopColor: colors.border },
        ]}
      >
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
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  bottomSheetTitle: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  bottomSheetSubtitle: { fontSize: 13, marginBottom: 20 },
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
  bottomSheetOptionText: { flex: 1 },
  bottomSheetOptionTitle: { fontSize: 15, fontWeight: "600", marginBottom: 2 },
  bottomSheetOptionSubtitle: { fontSize: 12 },
  bottomSheetDivider: { height: 1 },
  bottomSheetCancel: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  bottomSheetCancelText: { fontSize: 15, fontWeight: "600" },
  safeArea: { flex: 1 },
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
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700" },
  headerSubtitle: { fontSize: 12, marginTop: 1 },
  stepIndicator: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 6,
    marginBottom: 20,
  },
  stepBar: { flex: 1, height: 4, borderRadius: 2 },
  stepBarActive: { backgroundColor: "#1D4ED8" },
  stepBarInactive: { backgroundColor: "#CBD5E1" },
  stepContent: { flex: 1, paddingHorizontal: 16 },
  stepTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  stepSubtitle: { fontSize: 14, marginBottom: 24, lineHeight: 20 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  categoryCard: {
    width: "47%",
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryIconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryLabel: { fontSize: 13, fontWeight: "600", textAlign: "center" },
  fieldLabel: { fontSize: 14, fontWeight: "700", marginBottom: 8 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  addressInput: { flex: 1, fontSize: 14 },
  currentLocationBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
  },
  currentLocationText: { fontSize: 14, fontWeight: "600" },
  summaryCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  summaryDivider: { height: 1, marginVertical: 6 },
  summaryKey: { fontSize: 13, width: 80 },
  summaryValue: { fontSize: 13, fontWeight: "700", flex: 1 },
  textAreaWrapper: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
    padding: 14,
  },
  textArea: { fontSize: 14, minHeight: 120, lineHeight: 20 },
  charCount: { fontSize: 12, textAlign: "right", marginTop: 8 },
  photosRow: { flexDirection: "row", gap: 10, marginBottom: 8 },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  photoImage: { width: "100%", height: "100%" },
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
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  addPhotoText: { fontSize: 12, fontWeight: "500" },
  photoHint: { fontSize: 12, marginBottom: 8 },
  bottomBar: { padding: 16, borderTopWidth: 1 },
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
  continueBtnDisabled: { opacity: 0.7 },
  continueBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});
