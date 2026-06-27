import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { CameraView, type BarcodeScanningResult, useCameraPermissions } from "expo-camera";
import { mockParts } from "./src/data/mockParts";
import { evaluatePart, type PartCondition } from "./src/lib/partsEvaluator";
import { checkVinTitle, type TitleCheckResult } from "./src/lib/titleCheck";
import { extractVin } from "./src/lib/vin";

export default function App() {
  const [partName, setPartName] = useState("OEM Headlight Assembly");
  const [vin, setVin] = useState("");
  const [price, setPrice] = useState("280");
  const [condition, setCondition] = useState("8");
  const [demand, setDemand] = useState("0.74");
  const [daysOnShelf, setDaysOnShelf] = useState("21");
  const [returnsRisk, setReturnsRisk] = useState("0.12");
  const [photoQuality, setPhotoQuality] = useState("0.85");
  const [hasFitment, setHasFitment] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerLocked, setScannerLocked] = useState(false);
  const [scannerMessage, setScannerMessage] = useState("");
  const [titleCheck, setTitleCheck] = useState<TitleCheckResult | null>(null);
  const [titleCheckLoading, setTitleCheckLoading] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const parsedCondition = Number(condition) as PartCondition;
  const result = useMemo(
    () =>
      evaluatePart({
        estimatedRetailPrice: Number(price) || 0,
        conditionScore: Number.isFinite(parsedCondition) ? parsedCondition : 5,
        demandIndex: Number(demand) || 0,
        daysOnShelf: Number(daysOnShelf) || 0,
        hasFitmentDetails: hasFitment,
        photoQualityScore: Number(photoQuality) || 0,
        returnsRisk: Number(returnsRisk) || 0,
      }),
    [daysOnShelf, demand, hasFitment, parsedCondition, photoQuality, price, returnsRisk],
  );

  const requestScanner = async () => {
    const result = permission?.granted ? permission : await requestPermission();
    if (!result?.granted) {
      setScannerMessage("Camera permission is required to scan VIN.");
      return;
    }
    setScannerMessage("");
    setScannerLocked(false);
    setScannerOpen(true);
  };

  const onScanned = async ({ data }: BarcodeScanningResult) => {
    if (scannerLocked) {
      return;
    }

    setScannerLocked(true);
    const scannedVin = extractVin(data);

    if (!scannedVin) {
      setScannerMessage("Scan a VIN barcode with 17 valid VIN characters.");
      setTimeout(() => setScannerLocked(false), 1200);
      return;
    }

    setVin(scannedVin);
    setTitleCheckLoading(true);
    try {
      const checked = await checkVinTitle(scannedVin);
      setTitleCheck(checked);
    } catch {
      setTitleCheck({
        status: "unknown",
        confidence: 0.2,
        note: "Title provider request failed. Check EXPO_PUBLIC_TITLE_CHECK_API_URL and network access.",
        source: "local",
      });
    } finally {
      setTitleCheckLoading(false);
    }
    setScannerMessage("VIN captured.");
    setScannerOpen(false);
  };

  const onRunTitleCheck = async () => {
    setTitleCheckLoading(true);
    try {
      const result = await checkVinTitle(vin);
      setTitleCheck(result);
      setScannerMessage("Title check completed.");
    } catch {
      setTitleCheck({
        status: "unknown",
        confidence: 0.2,
        note: "Title provider request failed. Check EXPO_PUBLIC_TITLE_CHECK_API_URL and network access.",
        source: "local",
      });
      setScannerMessage("Title check failed.");
    } finally {
      setTitleCheckLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView style={styles.page} contentContainerStyle={styles.content}>
        <Text style={styles.brand}>OfferOnlyApp</Text>
        <Text style={styles.title}>Parts Offer Estimator</Text>
        <Text style={styles.subtitle}>
          Price used auto parts faster with a mobile-first intake and recommendation engine.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Part Intake</Text>

          <Field label="Part Name" value={partName} onChangeText={setPartName} />
          <Field label="VIN (optional)" value={vin} onChangeText={setVin} />
          <View style={styles.rowBetween}>
            <Text style={styles.helperText}>Scan VIN barcode with camera</Text>
            <Pressable style={styles.secondaryButton} onPress={requestScanner}>
              <Text style={styles.secondaryButtonText}>Scan VIN</Text>
            </Pressable>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.helperText}>Run local title check from VIN</Text>
            <Pressable style={styles.secondaryButton} onPress={onRunTitleCheck}>
              <Text style={styles.secondaryButtonText}>{titleCheckLoading ? "Checking..." : "Title Check"}</Text>
            </Pressable>
          </View>
          <Field label="Estimated Retail Price ($)" value={price} onChangeText={setPrice} keyboardType="numeric" />
          <Field label="Condition (1-10)" value={condition} onChangeText={setCondition} keyboardType="numeric" />
          <Field label="Demand Index (0-1)" value={demand} onChangeText={setDemand} keyboardType="numeric" />
          <Field
            label="Days On Shelf"
            value={daysOnShelf}
            onChangeText={setDaysOnShelf}
            keyboardType="numeric"
          />
          <Field
            label="Photo Quality (0-1)"
            value={photoQuality}
            onChangeText={setPhotoQuality}
            keyboardType="numeric"
          />
          <Field
            label="Returns Risk (0-1)"
            value={returnsRisk}
            onChangeText={setReturnsRisk}
            keyboardType="numeric"
          />

          <View style={styles.rowBetween}>
            <Text style={styles.label}>Fitment Details Included</Text>
            <Switch value={hasFitment} onValueChange={setHasFitment} />
          </View>

          <Pressable style={styles.primaryButton} onPress={() => setSubmitted(true)}>
            <Text style={styles.primaryButtonText}>Calculate Offer</Text>
          </Pressable>
        </View>

        {submitted ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Recommendation</Text>
            <Text style={styles.highlightText}>{partName || "Unnamed Part"}</Text>
            {vin ? <Text style={styles.metric}>VIN: {vin}</Text> : null}
            {titleCheck ? (
              <View style={styles.titleCheckBox}>
                <Text style={styles.metric}>
                  Title Check: {titleCheck.status.toUpperCase()} ({(titleCheck.confidence * 100).toFixed(0)}%)
                </Text>
                <Text style={styles.titleCheckSource}>Source: {titleCheck.source}</Text>
                <Text style={styles.titleCheckNote}>{titleCheck.note}</Text>
              </View>
            ) : null}
            <Text style={styles.metric}>Score: {result.score}/100</Text>
            <Text style={styles.metric}>Recommendation: {result.recommendation.toUpperCase()}</Text>
            <Text style={styles.metric}>Confidence: {(result.confidence * 100).toFixed(0)}%</Text>
            <Text style={styles.metric}>
              Offer Band: ${result.offerBand.low} - ${result.offerBand.target} - ${result.offerBand.high}
            </Text>

            <Text style={styles.reasonHeader}>Top Reasons</Text>
            {result.reasons.map((reason) => (
              <Text key={reason} style={styles.reasonItem}>
                - {reason}
              </Text>
            ))}
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Live Part Feed</Text>
          {mockParts.map((part) => {
            const scored = evaluatePart(part);
            return (
              <View key={part.id} style={styles.feedItem}>
                <Text style={styles.feedTitle}>{part.title}</Text>
                <Text style={styles.feedMeta}>Retail ${part.estimatedRetailPrice}</Text>
                <Text style={styles.feedMeta}>Target Offer ${scored.offerBand.target}</Text>
                <Text style={styles.feedMeta}>Action {scored.recommendation.toUpperCase()}</Text>
              </View>
            );
          })}
        </View>

        {scannerMessage ? <Text style={styles.infoText}>{scannerMessage}</Text> : null}
      </ScrollView>

      <Modal visible={scannerOpen} animationType="slide" onRequestClose={() => setScannerOpen(false)}>
        <SafeAreaView style={styles.scannerRoot}>
          <View style={styles.scannerHeader}>
            <Text style={styles.scannerTitle}>Scan VIN Barcode</Text>
            <Pressable style={styles.secondaryButton} onPress={() => setScannerOpen(false)}>
              <Text style={styles.secondaryButtonText}>Close</Text>
            </Pressable>
          </View>

          <Text style={styles.scannerHint}>
            Point camera at door-jamb or windshield VIN barcode. Scanner reads Code39/PDF417/Code128.
          </Text>

          {Platform.OS === "web" ? (
            <View style={styles.webFallback}>
              <Text style={styles.infoText}>VIN camera scan is optimized for iOS and Android. Use manual entry on web.</Text>
            </View>
          ) : (
            <CameraView
              style={styles.scannerView}
              onBarcodeScanned={onScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["code39", "code128", "pdf417", "qr"],
              }}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "numeric";
};

function Field({ label, value, onChangeText, keyboardType = "default" }: FieldProps) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor="#6f7b88"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b1723",
  },
  page: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 14,
    paddingBottom: 40,
  },
  brand: {
    color: "#73e2a7",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: "#f4f7fb",
    fontSize: 30,
    fontWeight: "800",
  },
  subtitle: {
    color: "#bdccda",
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#122336",
    borderColor: "#21405f",
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  sectionTitle: {
    color: "#f4f7fb",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  fieldWrap: {
    gap: 6,
  },
  label: {
    color: "#d8e3ee",
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#2d4a67",
    borderRadius: 10,
    color: "#f4f7fb",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#0f1d2c",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  helperText: {
    color: "#bbcbdb",
    fontSize: 12,
  },
  secondaryButton: {
    borderColor: "#2d4a67",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#0f1d2c",
  },
  secondaryButtonText: {
    color: "#c7d6e6",
    fontSize: 13,
    fontWeight: "700",
  },
  primaryButton: {
    marginTop: 8,
    backgroundColor: "#1fda90",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#06301f",
    fontSize: 15,
    fontWeight: "800",
  },
  highlightText: {
    color: "#f4f7fb",
    fontSize: 16,
    fontWeight: "700",
  },
  metric: {
    color: "#d5e2ee",
    fontSize: 14,
  },
  titleCheckBox: {
    borderWidth: 1,
    borderColor: "#2b4f70",
    backgroundColor: "#0f1f30",
    borderRadius: 10,
    padding: 10,
    gap: 4,
  },
  titleCheckNote: {
    color: "#9bc0df",
    fontSize: 12,
  },
  titleCheckSource: {
    color: "#a7c9e5",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  reasonHeader: {
    color: "#f4f7fb",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },
  reasonItem: {
    color: "#bbcbdb",
    fontSize: 13,
  },
  feedItem: {
    borderWidth: 1,
    borderColor: "#2a4a66",
    borderRadius: 10,
    padding: 10,
    gap: 2,
  },
  feedTitle: {
    color: "#eff5fc",
    fontSize: 14,
    fontWeight: "700",
  },
  feedMeta: {
    color: "#bbcbdb",
    fontSize: 13,
  },
  infoText: {
    color: "#9bc0df",
    fontSize: 12,
  },
  scannerRoot: {
    flex: 1,
    backgroundColor: "#0b1723",
    padding: 14,
    gap: 10,
  },
  scannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scannerTitle: {
    color: "#eff5fc",
    fontSize: 20,
    fontWeight: "800",
  },
  scannerHint: {
    color: "#bbcbdb",
    fontSize: 13,
  },
  scannerView: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#244460",
  },
  webFallback: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#244460",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
