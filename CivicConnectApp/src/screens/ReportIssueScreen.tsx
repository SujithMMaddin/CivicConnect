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
    { id: "pothole", label: "Pothole", icon: "🕳️" },
    { id: "streetlight", label: "Street Light", icon: "💡" },
    { id: "sanitation", label: "Sanitation", icon: "🗑️" },
    { id: "water", label: "Water Leak", icon: "💧" },
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
      // Upload images to Cloudinary if any
      const imageUrls: string[] = [];
      for (const imageUri of capturedImages) {
        const secureUrl = await uploadToCloudinary(imageUri);
        imageUrls.push(secureUrl);
      }

      // Submit to backend with imageUrls
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
          imageUrls, // New field
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      Alert.alert("Success", "Your report has been submitted successfully!");

      // Reset form including images
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
          padding: theme.spacing.md,
          paddingBottom: theme.spacing.sm,
          justifyContent: "space-between",
          backgroundColor: "white",
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.slate[200],
        }}
      >
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 24, color: theme.colors.textLight }}>✕</Text>
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
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 24, color: theme.colors.textLight }}>
            ❓
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={{ padding: theme.spacing.md }}>
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
            height: 4,
            backgroundColor: theme.colors.slate[300],
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

      <ScrollView style={{ flex: 1 }}>
        {/* Category Selection */}
        <View style={{ padding: theme.spacing.md }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.colors.textLight,
              marginBottom: theme.spacing.sm,
            }}
          >
            What is the issue?
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: theme.spacing.sm,
            }}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={{
                  flex: 1,
                  minWidth: 140,
                  padding: theme.spacing.md,
                  borderRadius: theme.borderRadius.lg,
                  borderWidth: 2,
                  borderColor:
                    selectedCategory === category.id
                      ? theme.colors.primary
                      : theme.colors.slate[300],
                  backgroundColor:
                    selectedCategory === category.id
                      ? theme.colors.primary + "10"
                      : "white",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={{ fontSize: 32, marginBottom: theme.spacing.xs }}>
                  {category.icon}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "bold",
                    color:
                      selectedCategory === category.id
                        ? theme.colors.primary
                        : theme.colors.textLight,
                  }}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View style={{ padding: theme.spacing.md }}>
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
            }}
            placeholder="Describe the issue in detail..."
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Location */}
        <View style={{ padding: theme.spacing.md }}>
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
              marginBottom: theme.spacing.sm,
            }}
          >
            <Text style={{ fontSize: 20, marginRight: theme.spacing.sm }}>
              🔍
            </Text>
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                paddingVertical: theme.spacing.md,
              }}
              placeholder="Search for address..."
              value={address}
              onChangeText={setAddress}
            />
          </View>
          {locationPermission === false ? (
            <View
              style={{
                height: 200,
                borderWidth: 1,
                borderColor: theme.colors.slate[300],
                borderRadius: theme.borderRadius.lg,
                backgroundColor: theme.colors.slate[100],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 16, color: theme.colors.slate[600] }}>
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
                onPress={(e: {
                  nativeEvent: {
                    coordinate: { latitude: number; longitude: number };
                  };
                }) => {
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
            <View
              style={{
                height: 200,
                borderWidth: 1,
                borderColor: theme.colors.slate[300],
                borderRadius: theme.borderRadius.lg,
                backgroundColor: theme.colors.slate[100],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
                color: theme.colors.slate[600],
                marginTop: theme.spacing.sm,
              }}
            >
              Selected: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Text>
          )}
        </View>

        {/* Photos */}
        <View style={{ padding: theme.spacing.md }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.colors.textLight,
              marginBottom: theme.spacing.sm,
            }}
          >
            Add Photos
          </Text>
          {capturedImages.length > 0 && (
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: theme.spacing.sm,
                marginBottom: theme.spacing.md,
              }}
            >
              {capturedImages.map((uri, index) => (
                <View key={index} style={{ position: "relative" }}>
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
                      top: -5,
                      right: -5,
                      backgroundColor: theme.colors.slate[600],
                      borderRadius: 10,
                      width: 20,
                      height: 20,
                      alignItems: "center",
                      justifyContent: "center",
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
                      ×
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
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
            <Text style={{ fontSize: 48, marginBottom: theme.spacing.sm }}>
              📷
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: theme.colors.slate[600],
                fontWeight: "bold",
              }}
            >
              Take a photo
            </Text>
            <Text style={{ fontSize: 12, color: theme.colors.slate[500] }}>
              {capturedImages.length}/3 images
            </Text>
          </TouchableOpacity>
        </View>

        {/* Pro Tips */}
        <View
          style={{
            margin: theme.spacing.md,
            padding: theme.spacing.md,
            backgroundColor: theme.colors.primary + "10",
            borderRadius: theme.borderRadius.lg,
            borderWidth: 1,
            borderColor: theme.colors.primary + "20",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: theme.spacing.sm,
            }}
          >
            <Text style={{ fontSize: 20, marginRight: theme.spacing.sm }}>
              ℹ️
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "bold",
                color: theme.colors.textLight,
              }}
            >
              Pro Tips
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.slate[600],
              lineHeight: 20,
            }}
          >
            • Include clear, wide-angle photos of the surroundings.{"\n"}•
            Double-check the map pin for accuracy.{"\n"}• Be specific in your
            description (e.g., "Deep pothole in middle lane").
          </Text>
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View
        style={{
          padding: theme.spacing.md,
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: theme.colors.slate[200],
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor:
              isSubmitting || isUploading
                ? theme.colors.slate[400]
                : theme.colors.primary,
            paddingVertical: theme.spacing.md,
            borderRadius: theme.borderRadius.lg,
            alignItems: "center",
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={handleSubmit}
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
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

export default ReportIssueScreen;
