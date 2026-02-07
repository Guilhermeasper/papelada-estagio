/**
 * PDFLogoHeader - Header with logos for cover pages and formal documents
 */

import { Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import { fonts } from './styles';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 10,
    fontFamily: fonts.bold,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 8,
  },
});

interface LogoConfig {
  src: string;
  width: number;
  height: number;
}

interface PDFLogoHeaderProps {
  logos: LogoConfig[];
  title?: string;
  subtitle?: string;
}

export function PDFLogoHeader({ logos, title, subtitle }: PDFLogoHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        {logos.map((logo, index) => (
          <Image
            key={index}
            src={logo.src}
            style={{ width: logo.width, height: logo.height }}
          />
        ))}
      </View>
      {title && <Text style={styles.title}>{title}</Text>}
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}
