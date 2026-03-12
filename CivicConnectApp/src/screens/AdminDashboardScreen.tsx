import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { theme } from "../styles/theme";
import { API_CONFIG } from "../api/config";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

type ReportIssueScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ReportIssue"
>;

type Coordinate = {
  latitude: number;
  longitude: number;
};

const ReportIssueScreen: React.FC = () => {
  const navigation = useNavigation<ReportIssueScreenNavigationProp>();

  // Cloudinary config
  const CLOUDINARY_CLOUD_NAME = "drhzct1u1";
  const CLOUDINARY_UPLOAD_PRESET = "civicconnect_upload";

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(
    null,
  );
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null,
  );
  const [selectedLocation, setSelectedLocation] = useState<Coordinate | null>(
    null,
  );
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    null,
  );
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      // Request location permission
      const { status: locationStatus } =
        await Location.requestForegroundPermissionsAsync();
      setLocationPermission(locationStatus === "granted");

      if (locationStatus === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const coords = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentLocation(coords);
        setSelectedLocation(coords);
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
      }

      // Request camera permission
      const { status: cameraStatus } =
        await ImagePicker.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus === "granted");
    })();
  }, []);

  const categories = [
    { id: "Pothole", label: "Pothole" },
    { id: "Streetlight", label: "Street Light" },
    { id: "Water", label: "Water" },
    { id: "Trash", label: "Trash" },
    { id: "Graffiti", label: "Graffiti" },
    { id: "Traffic Sign", label: "Traffic Sign" },
    { id: "Sidewalk", label: "Sidewalk" },
    { id: "Parking", label: "Parking" },
    { id: "Noise", label: "Noise" },
    { id: "Other", label: "Other" },
  ];

  const takePhoto = async () => {
    if (cameraPermission === false) {
      Alert.alert(
        "Camera Permission Required",
        "Please enable camera permission in your device settings to take photos.",
      );
      return;
    }

    if (capturedImages.length >= 3) {
      Alert.alert("Limit Reached", "You can only add up to 3 photos.");
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
        allowsEditing: false,
        aspect: [4, 3],
      });

      if (!result.canceled) {
        setCapturedImages([...capturedImages, result.assets[0].uri]);
      }
    } catch (error) {
      console.error("Photo capture error:", error);
      Alert.alert("Error", "Failed to capture photo. Please try again.");
    }
  };

  const uploadToCloudinary = async (imageUri: string): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "image.jpg",
      } as any);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!selectedCategory || !description.trim()) {
      Alert.alert(
        "Error",
        "Please select a category and provide a description.",
      );
      return;
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      Alert.alert("Error", "Invalid location coordinates.");
      return;
    }

    if (capturedImages.length > 0) {
      setIsUploading(true);
    }

    setIsSubmitting(true);

    try {
      const imageUrls: string[] = [];
      for (const imageUri of capturedImages) {
        const secureUrl = await uploadToCloudinary(imageUri);
        imageUrls.push(secureUrl);
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: selectedCategory,
          description: description.trim(),
          latitude,
          longitude,
          imageUrls,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      Alert.alert("Success", "Your report has been submitted successfully!");

      // Reset form
      setSelectedCategory(null);
      setDescription("");
      setAddress("");
      setLatitude(0);
      setLongitude(0);
      setCapturedImages([]);
      navigation.goBack();
    } catch (error: any) {
      console.error("Submission error:", error);
      Alert.alert(
        "Error",
        error.message?.includes("Upload")
          ? `Image upload failed: ${error.message}. Please try again.`
          : "Failed to submit report. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Top App Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          justifyContent: "space-between",
          backgroundColor: "white",
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.slate[200],
        }}
      >
        <TouchableOpacity
          style={{ padding: theme.spacing.sm }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 22, color: theme.colors.textLight }}>✕</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.textLight,
            flex: 1,
            textAlign: "center",
          }}
        >
          Report an Issue
        </Text>
        <TouchableOpacity style={{ padding: theme.spacing.sm }}>
          <Text style={{ fontSize: 22, color: theme.colors.textLight }}>
            ❓
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={{ padding: theme.spacing.md, backgroundColor: "white" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: theme.spacing.sm,
          }}
        >
          <Text style={{ fontSize: 14, color: theme.colors.slate[600] }}>
            Step 1 of 4: Details & Location
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.primary,
              fontWeight: "bold",
            }}
          >
            25%
          </Text>
        </View>
        <View
          style={{
            height: 6,
            backgroundColor: theme.colors.slate[200],
            borderRadius: theme.borderRadius.sm,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              width: "25%",
              height: "100%",
              backgroundColor: theme.colors.primary,
              borderRadius: theme.borderRadius.sm,
            }}
          />
        </View>
      </View>

      {/* Content Body */}
      {/* ADDED: contentContainerStyle with bottom padding to prevent overlay issues */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Selection */}
        <View style={{ padding: theme.spacing.md }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.colors.textLight,
              marginBottom: theme.spacing.md,
            }}
          >
            What is the issue?
          </Text>

          {/* FIX: Replaced flexWrap and minWidth logic with a strict percentage layout */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {categories.map((category) => {
              const isSelected = selectedCategory === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={{
                    width: "48%", // Forces exactly 2 columns
                    marginBottom: theme.spacing.md,
                    paddingVertical: theme.spacing.md,
                    borderRadius: theme.borderRadius.lg,
                    borderWidth: 2,
                    borderColor: isSelected
                      ? theme.colors.primary
                      : theme.colors.slate[200],
                    backgroundColor: isSelected
                      ? theme.colors.primary + "10"
                      : "white",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: isSelected ? "bold" : "600",
                      color: isSelected
                        ? theme.colors.primary
                        : theme.colors.slate[600],
                    }}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Description */}
        <View
          style={{
            paddingHorizontal: theme.spacing.md,
            paddingBottom: theme.spacing.md,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.colors.textLight,
              marginBottom: theme.spacing.sm,
            }}
          >
            Tell us more
          </Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: theme.colors.slate[300],
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing.md,
              fontSize: 16,
              minHeight: 120,
              textAlignVertical: "top",
              backgroundColor: theme.colors.slate[50],
            }}
            placeholder="Describe the issue in detail..."
            placeholderTextColor={theme.colors.slate[400]}
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Location */}
        <View
          style={{
            paddingHorizontal: theme.spacing.md,
            paddingBottom: theme.spacing.md,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.colors.textLight,
              marginBottom: theme.spacing.sm,
            }}
          >
            Location
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: theme.colors.slate[300],
              borderRadius: theme.borderRadius.lg,
              paddingHorizontal: theme.spacing.md,
              marginBottom: theme.spacing.md,
              backgroundColor: theme.colors.slate[50],
            }}
          >
            <Text style={{ fontSize: 18, marginRight: theme.spacing.sm }}>
              🔍
            </Text>
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                paddingVertical: Platform.OS === "ios" ? 14 : 10,
              }}
              placeholder="Search for address..."
              placeholderTextColor={theme.colors.slate[400]}
              value={address}
              onChangeText={setAddress}
            />
          </View>

          {locationPermission === false ? (
            <View style={mapPlaceholderStyle}>
              <Text
                style={{
                  fontSize: 16,
                  color: theme.colors.slate[600],
                  textAlign: "center",
                  padding: 20,
                }}
              >
                Location permission denied. Please enable location services to
                use the map.
              </Text>
            </View>
          ) : currentLocation ? (
            <View
              style={{
                height: 200,
                borderWidth: 1,
                borderColor: theme.colors.slate[300],
                borderRadius: theme.borderRadius.lg,
                overflow: "hidden",
              }}
            >
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                onPress={(e: any) => {
                  const coords = e.nativeEvent.coordinate;
                  setSelectedLocation(coords);
                  setLatitude(coords.latitude);
                  setLongitude(coords.longitude);
                }}
              >
                {selectedLocation && <Marker coordinate={selectedLocation} />}
              </MapView>
            </View>
          ) : (
            <View style={mapPlaceholderStyle}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text
                style={{
                  fontSize: 16,
                  color: theme.colors.slate[600],
                  marginTop: theme.spacing.sm,
                }}
              >
                Loading map...
              </Text>
            </View>
          )}

          {selectedLocation && (
            <Text
              style={{
                fontSize: 14,
                color: theme.colors.slate[500],
                marginTop: theme.spacing.sm,
              }}
            >
              Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Text>
          )}
        </View>

        {/* Photos */}
        <View
          style={{
            paddingHorizontal: theme.spacing.md,
            paddingBottom: theme.spacing.md,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: theme.spacing.sm,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: theme.colors.textLight,
              }}
            >
              Add Photos
            </Text>
            <Text style={{ fontSize: 14, color: theme.colors.slate[500] }}>
              {capturedImages.length}/3 images
            </Text>
          </View>

          {/* Image Previews */}
          {capturedImages.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                marginBottom: theme.spacing.md,
              }}
            >
              {capturedImages.map((uri, index) => (
                <View
                  key={index}
                  style={{
                    marginRight: theme.spacing.md,
                    marginBottom: theme.spacing.md,
                    position: "relative",
                  }}
                >
                  <Image
                    source={{ uri }}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: theme.borderRadius.md,
                      borderWidth: 1,
                      borderColor: theme.colors.slate[300],
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      backgroundColor: theme.colors.slate[800],
                      borderRadius: 12,
                      width: 24,
                      height: 24,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 2,
                      borderColor: "white",
                    }}
                    onPress={() => {
                      const newImages = capturedImages.filter(
                        (_, i) => i !== index,
                      );
                      setCapturedImages(newImages);
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      ✕
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Capture Button */}
          {capturedImages.length < 3 && (
            <TouchableOpacity
              style={{
                borderWidth: 2,
                borderColor: theme.colors.slate[300],
                borderStyle: "dashed",
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.xl,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: theme.colors.slate[50],
              }}
              onPress={takePhoto}
            >
              <Text style={{ fontSize: 32, marginBottom: theme.spacing.sm }}>
                📷
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: theme.colors.slate[600],
                  fontWeight: "600",
                }}
              >
                Tap to take a photo
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Pro Tips */}
        <View
          style={{
            marginHorizontal: theme.spacing.md,
            marginBottom: theme.spacing.xl,
            padding: theme.spacing.md,
            backgroundColor: theme.colors.primary + "10",
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
            borderColor: theme.colors.primary + "30",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: theme.spacing.sm,
            }}
          >
            <Text style={{ fontSize: 18, marginRight: theme.spacing.xs }}>
              💡
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                color: theme.colors.primary,
              }}
            >
              Pro Tips
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.slate[700],
              lineHeight: 22,
            }}
          >
            • Include clear, wide-angle photos of the surroundings.{"\n"}•
            Double-check the map pin for accuracy.{"\n"}• Be specific in your
            description (e.g., "Deep pothole in middle lane").
          </Text>
        </View>
      </ScrollView>

      {/* Submit Button (Fixed at Bottom) */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: theme.spacing.md,
          paddingBottom: Platform.OS === "ios" ? 30 : theme.spacing.md, // Accommodate iOS home indicator
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: theme.colors.slate[200],
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor:
              isSubmitting || isUploading
                ? theme.colors.slate[400]
                : theme.colors.primary,
            paddingVertical: 16,
            borderRadius: theme.borderRadius.lg,
            alignItems: "center",
          }}
          onPress={handleSubmit}
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting || isUploading ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ActivityIndicator color="white" style={{ marginRight: 10 }} />
              <Text
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                {isUploading ? "Uploading Images..." : "Submitting..."}
              </Text>
            </View>
          ) : (
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
                letterSpacing: 0.5,
              }}
            >
              Submit Report
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Extracted style for cleaner render logic
const mapPlaceholderStyle = {
  height: 200,
  borderWidth: 1,
  borderColor: theme.colors.slate[300],
  borderRadius: theme.borderRadius.lg,
  backgroundColor: theme.colors.slate[50],
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

export default ReportIssueScreen;
