import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

import type { TableQrPdfItem } from "../types/table-qr.types";

type TableQrPdfDocumentProps = {
  items: TableQrPdfItem[];
};

const styles = StyleSheet.create({
  page: {
    padding: 24,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 22,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 10,
    marginBottom: 20,
    color: "#555555",
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "31%",
    padding: 12,
    border: "1px solid #000000",
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  floorName: {
    fontSize: 9,
    color: "#555555",
    marginBottom: 4,
  },
  tableName: {
    fontSize: 15,
    marginBottom: 8,
  },
  qrImage: {
    width: 120,
    height: 120,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 9,
    marginBottom: 6,
  },
  url: {
    fontSize: 6,
    color: "#555555",
    textAlign: "center",
  },
});

export function TableQrPdfDocument({ items }: TableQrPdfDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>QR por mesa</Text>
        <Text style={styles.subtitle}>
          Imprimí estos códigos y colocalos en cada mesa.
        </Text>

        <View style={styles.grid}>
          {items.map((item) => (
            <View key={item.tableId} style={styles.card}>
              <Text style={styles.floorName}>{item.floorName}</Text>
              <Text style={styles.tableName}>{item.tableName}</Text>

              <Image src={item.qrImage} style={styles.qrImage} />

              <Text style={styles.helperText}>Escaneá para ver el menú</Text>
              <Text style={styles.url}>{item.qrUrl}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
