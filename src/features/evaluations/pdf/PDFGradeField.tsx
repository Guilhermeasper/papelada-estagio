import { StyleSheet, Text } from '@react-pdf/renderer';
import { fonts } from '../../../components/pdf';

const styles = StyleSheet.create({
  text: {
    fontSize: 11,
    fontFamily: fonts.bold,
    marginTop: 20,
  },
});

interface PDFGradeFieldProps {
  label?: string;
  grade?: number;
  sectionNumber?: number | string;
}

export function PDFGradeField({
  label = 'Dê uma nota de 0 a 10 para o estagiário',
  grade,
  sectionNumber
}: PDFGradeFieldProps) {
  const prefix = sectionNumber ? `${sectionNumber}. ` : '';
  const gradeDisplay = grade !== undefined ? grade : '   ';

  return (
    <Text style={styles.text}>
      {prefix}{label}: {gradeDisplay}
    </Text>
  );
}
