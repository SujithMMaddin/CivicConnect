import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { theme } from "../styles/theme";

type ContactSupportScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ContactSupport"
>;

const ContactSupportScreen: React.FC = () => {
  const navigation = useNavigation<ContactSupportScreenNavigationProp>();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    Alert.alert("Success", "Your message has been sent successfully!");
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.backgroundLight }}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.backgroundLight}
      />

      {/* Top App Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: theme.spacing.md,
          justifyContent: "space-between",
          backgroundColor: "white",
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.slate[200],
        }}
      >
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: theme.borderRadius.full,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ fontSize: 24, color: theme.colors.textLight }}>←</Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: theme.colors.textLight,
            flex: 1,
            textAlign: "center",
            marginRight: 40,
          }}
        >
          Contact Support
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ padding: theme.spacing.md }}>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "bold",
              color: theme.colors.textLight,
              marginBottom: theme.spacing.sm,
            }}
          >
            Contact CivicConnect Support
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: theme.colors.slate[600],
              lineHeight: 24,
            }}
          >
            Have a question or need help with a civic issue? Our team is here to
            assist you with resolution and reporting.
          </Text>
        </View>

        {/* Form */}
        <View style={{ padding: theme.spacing.md, gap: theme.spacing.md }}>
          {/* Full Name */}
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "semibold",
                color: theme.colors.textLight,
                marginBottom: theme.spacing.xs,
              }}
            >
              Full Name
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: theme.colors.slate[300],
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.md,
                fontSize: 16,
                backgroundColor: "white",
              }}
              placeholder="Enter your name"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Email */}
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "semibold",
                color: theme.colors.textLight,
                marginBottom: theme.spacing.xs,
              }}
            >
              Email Address
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: theme.colors.slate[300],
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.md,
                fontSize: 16,
                backgroundColor: "white",
              }}
              placeholder="email@example.gov"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Message */}
          <View>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "semibold",
                color: theme.colors.textLight,
                marginBottom: theme.spacing.xs,
              }}
            >
              Message
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: theme.colors.slate[300],
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.md,
                fontSize: 16,
                backgroundColor: "white",
                minHeight: 120,
                textAlignVertical: "top",
              }}
              placeholder="How can we help?"
              multiline
              value={message}
              onChangeText={setMessage}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primary,
              paddingVertical: theme.spacing.md,
              borderRadius: theme.borderRadius.xl,
              alignItems: "center",
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
            onPress={handleSubmit}
          >
            <Text
              style={{
                color: "white",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Send Message
            </Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: theme.colors.slate[200],
            marginHorizontal: theme.spacing.md,
            marginVertical: theme.spacing.md,
          }}
        />

        {/* Official Contact Info */}
        <View style={{ padding: theme.spacing.md }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.colors.textLight,
              marginBottom: theme.spacing.md,
            }}
          >
            Official Contact Info
          </Text>

          <View style={{ gap: theme.spacing.md }}>
            {/* Office Address */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: theme.spacing.md,
                backgroundColor: "white",
                borderRadius: theme.borderRadius.xl,
                borderWidth: 1,
                borderColor: theme.colors.slate[100],
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: theme.borderRadius.full,
                  backgroundColor: theme.colors.primary + "10",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: theme.spacing.md,
                }}
              >
                <Text style={{ fontSize: 20, color: theme.colors.primary }}>
                  📍
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.colors.slate[500],
                    fontWeight: "medium",
                  }}
                >
                  Office Address
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "semibold",
                    color: theme.colors.textLight,
                  }}
                >
                  City Hall, 123 Civic Plaza
                </Text>
              </View>
            </View>

            {/* Phone */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: theme.spacing.md,
                backgroundColor: "white",
                borderRadius: theme.borderRadius.xl,
                borderWidth: 1,
                borderColor: theme.colors.slate[100],
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: theme.borderRadius.full,
                  backgroundColor: theme.colors.primary + "10",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: theme.spacing.md,
                }}
              >
                <Text style={{ fontSize: 20, color: theme.colors.primary }}>
                  📞
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.colors.slate[500],
                    fontWeight: "medium",
                  }}
                >
                  Official Phone
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "semibold",
                    color: theme.colors.textLight,
                  }}
                >
                  (555) 012-3456
                </Text>
              </View>
            </View>

            {/* Email */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: theme.spacing.md,
                backgroundColor: "white",
                borderRadius: theme.borderRadius.xl,
                borderWidth: 1,
                borderColor: theme.colors.slate[100],
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: theme.borderRadius.full,
                  backgroundColor: theme.colors.primary + "10",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: theme.spacing.md,
                }}
              >
                <Text style={{ fontSize: 20, color: theme.colors.primary }}>
                  ✉️
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.colors.slate[500],
                    fontWeight: "medium",
                  }}
                >
                  Support Email
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "semibold",
                    color: theme.colors.textLight,
                  }}
                >
                  support@civicconnect.gov
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* FAQ */}
        <View style={{ padding: theme.spacing.md }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: theme.colors.textLight,
              marginBottom: theme.spacing.md,
            }}
          >
            Common Questions
          </Text>

          <View style={{ gap: theme.spacing.sm }}>
            {[
              "How long until my report is reviewed?",
              "Can I edit a submitted report?",
              "How to track issue status?",
            ].map((question, index) => (
              <TouchableOpacity
                key={index}
                style={{
                  padding: theme.spacing.md,
                  backgroundColor: "white",
                  borderRadius: theme.borderRadius.lg,
                  borderWidth: 1,
                  borderColor: theme.colors.slate[200],
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "medium",
                    color: theme.colors.textLight,
                    flex: 1,
                    marginRight: theme.spacing.md,
                  }}
                >
                  {question}
                </Text>
                <Text style={{ fontSize: 20, color: theme.colors.slate[400] }}>
                  ⌄
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContactSupportScreen;
