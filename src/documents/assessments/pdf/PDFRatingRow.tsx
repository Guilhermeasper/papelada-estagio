import {
  fonts,
  type Rating,
  renderRating,
} from "@papelada-estagio/components/pdf";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  rating: {
    flexDirection: "row",
    fontSize: 11,
    marginBottom: 15,
  },
});

interface PDFRatingRowProps {
  label: string;
  selected?: Rating;
}

export function PDFRatingRow({ label, selected }: PDFRatingRowProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.rating}>{renderRating(selected)}</Text>
    </View>
  );
}
