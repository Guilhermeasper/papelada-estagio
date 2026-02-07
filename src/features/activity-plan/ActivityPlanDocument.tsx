/**
 * ActivityPlanDocument - Plano de Atividades PDF Component
 * Renders the internship activity plan using @react-pdf/renderer
 */

import {
  Document,
  Page,
  StyleSheet,
  Text,
  View
} from '@react-pdf/renderer';
import {
  colors,
  fonts,
  formatDatePtBr,
  formatFullDate,
  PDFFieldRow,
  PDFLogoHeader,
  PDFNumberedList,
  PDFSection,
  PDFTable,
  type ColumnConfig,
} from '../../shared/components/pdf';
import { PDF_CONTENT } from '../../shared/constants/pdf-content';
import type { IInternshipData } from '../../shared/domain/types';

// ============================================
// Styles
// ============================================
const styles = StyleSheet.create({
  page: {
    paddingTop: 70,
    paddingBottom: 70,
    paddingLeft: 85,
    paddingRight: 56,
    fontFamily: fonts.regular,
    fontSize: 10,
    color: colors.textBlack,
    lineHeight: 1.0,
  },
  // Evaluation text
  evaluationText: {
    marginLeft: 35,
    marginBottom: 4,
    textAlign: 'justify',
  },
  evaluationIndent: {
    marginLeft: 70,
    marginBottom: 2,
  },
  // Signatures
  signatureSection: {
    marginTop: 30,
  },
  signatureDate: {
    textAlign: 'center',
    marginBottom: 15,
  },
  signatureLine: {
    marginLeft: 35,
    marginBottom: 3,
  },
  signatureLabel: {
    fontFamily: fonts.bold,
  },
  signatureSubLabel: {
    marginLeft: 35,
    fontSize: 9,
    marginBottom: 15,
  },
  fieldLabel: {
    fontFamily: fonts.bold,
  },
  // Footer
  footerNote: {
    marginTop: 30,
    fontSize: 8,
    borderTopWidth: 1,
    borderTopColor: colors.textBlack,
    paddingTop: 8,
    textAlign: 'justify',
  },
  // Schedule item (custom for period - description format)
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 4,
    marginLeft: 60,
    paddingRight: 20,
  },
  scheduleNumber: {
    width: 18,
  },
  scheduleContent: {
    flex: 1,
    textAlign: 'justify',
  },
});

// ============================================
// Props Interface
// ============================================
interface ActivityPlanDocumentProps {
  data: IInternshipData;
}

// ============================================
// Main Component
// ============================================
export function ActivityPlanDocument({ data }: ActivityPlanDocumentProps) {
  const { student, company, general, content, supervision } = data;
  const { activityPlan, header } = PDF_CONTENT;
  
  // Calculate evaluation date (12 days after end date)
  const endDateObj = new Date(general.endDate);
  endDateObj.setDate(endDateObj.getDate() + 12);
  const evalDate = endDateObj.toISOString().split('T')[0];

  // Evaluation table columns
  const evalColumns: ColumnConfig[] = [
    { key: 'topic', header: 'TÓPICO', width: 98 },
    { key: 'description', header: 'DESCRIÇÃO', width: 205 },
    { key: 'weight', header: 'PESO', width: 44, align: 'center' },
  ];

  const headerTitle = [
    header.service,
    header.university,
    header.department,
    header.coordination
  ].join('\n');

  const docSubtitle = [
    activityPlan.title,
    activityPlan.subtitle
  ].join('\n');

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <PDFLogoHeader 
          logos={[{ src: '/image1.png', width: 76, height: 73 }]}
          title={headerTitle}
          subtitle={docSubtitle}
        />

        {/* Section 1: Student Data */}
        <PDFSection title={activityPlan.sections.student} number="1">
          <PDFFieldRow label="Nome" value={student.fullName} />
          <PDFFieldRow label="E-mail" value={student.email} />
          <PDFFieldRow label="Endereço" value={student.address} />
          <PDFFieldRow label="Telefone" value={student.phone} />
          <PDFFieldRow label="Curso" value={student.course} />
          <PDFFieldRow label="Ano de Ingresso" value={student.enrollmentYear} />
          <PDFFieldRow label="Matrícula" value={student.studentId} />
        </PDFSection>

        {/* Section 2: Company Data */}
        <PDFSection title={activityPlan.sections.company} number="2">
          <PDFFieldRow label="Empresa" value={company.companyName} />
          <PDFFieldRow label="Endereço" value={company.companyAddress} />
          <PDFFieldRow label="CNPJ" value={company.companyCnpj} />
        </PDFSection>

        {/* Section 3: Internship Program */}
        <PDFSection title={activityPlan.sections.program} number="3">
          <PDFSection 
            title={activityPlan.subsections.generalInfo} 
            titleStyle={{ marginLeft: 32, fontFamily: fonts.regular, marginBottom: 4, marginTop: 8 }}
          >
            <PDFFieldRow label="Período" value={`${formatDatePtBr(general.startDate)} – ${formatDatePtBr(general.endDate)}`} marginLeft={60} />
            <PDFFieldRow label="Carga Horária" value={`${general.hoursPerDay}h/dia`} marginLeft={60} />
            <PDFFieldRow label="Dias" value={general.workDays} marginLeft={60} />
            <PDFFieldRow label="Horário" value={general.workSchedule} marginLeft={60} />
            <PDFFieldRow label="Modalidade" value={general.modality} marginLeft={60} />
          </PDFSection>

          <PDFSection 
            title={activityPlan.subsections.activities}
            titleStyle={{ marginLeft: 32, fontFamily: fonts.regular, marginBottom: 4, marginTop: 8 }}
          >
            <PDFNumberedList items={content.activities} marginLeft={60} />
          </PDFSection>

          <PDFSection 
            title={activityPlan.subsections.objectives}
            titleStyle={{ marginLeft: 32, fontFamily: fonts.regular, marginBottom: 4, marginTop: 8 }}
          >
            <PDFNumberedList items={content.objectives} marginLeft={60} />
          </PDFSection>

          <PDFSection 
            title={activityPlan.subsections.schedule}
            titleStyle={{ marginLeft: 32, fontFamily: fonts.regular, marginBottom: 4, marginTop: 8 }}
          >
            {content.schedule.map((item, index) => (
              <View key={index} style={styles.scheduleItem}>
                <Text style={styles.scheduleNumber}>{index + 1}.</Text>
                <Text style={styles.scheduleContent}>
                  {item.period} – {item.description}
                </Text>
              </View>
            ))}
          </PDFSection>
        </PDFSection>
        
        {/* Section 4: Supervision */}
        <PDFSection title={activityPlan.sections.supervision} number="4">
          <Text style={[styles.fieldLabel, { marginLeft: 0, marginBottom: 8 }]}>SUPERVISOR:</Text>
          <PDFFieldRow label="Nome" value={supervision.supervisorName} />
          <PDFFieldRow label="E-mail" value={supervision.supervisorEmail} />
          <PDFFieldRow label="Telefone" value={supervision.supervisorPhone} />
          <PDFFieldRow label="Cargo" value={supervision.supervisorPosition} />
          <PDFFieldRow label="CPF" value={supervision.supervisorCpf} />

          <Text style={[styles.fieldLabel, { marginLeft: 0, marginTop: 15, marginBottom: 8 }]}>
            PROFESSOR ORIENTADOR:
          </Text>
          <PDFFieldRow label="Nome" value={supervision.advisorName} />
          <PDFFieldRow label="E-mail" value={supervision.advisorEmail} />
          <PDFFieldRow label="SIAPE" value={supervision.advisorSiape} />
          <PDFFieldRow label="Cargo" value={supervision.advisorPosition} />
        </PDFSection>

        {/* Section 5: Evaluation */}
        <PDFSection title={`${activityPlan.sections.evaluation} ${activityPlan.evaluation.subtitle}`} number="5">
          <Text style={styles.evaluationText}>
            {activityPlan.evaluation.text1}
          </Text>
          <PDFFieldRow label="Data para emissão do parecer" value={formatDatePtBr(evalDate)} />
          <Text style={styles.evaluationText}>
            {activityPlan.evaluation.text2}
          </Text>
          {activityPlan.evaluation.legends.map((legend, index) => (
             <Text key={index} style={styles.evaluationIndent}>{legend}</Text>
          ))}

          <Text style={[styles.evaluationText, { marginTop: 10 }]}>
            {activityPlan.evaluation.text3}
          </Text>

          {/* Evaluation Table using shared PDFTable */}
          <PDFTable columns={evalColumns} rows={activityPlan.evaluation.criteria} marginLeft={35} />

          <Text style={[styles.evaluationText, { marginTop: 15 }]}>
            {activityPlan.evaluation.text4}
          </Text>
          <Text style={styles.evaluationText}>
            {activityPlan.evaluation.text5}
          </Text>
        </PDFSection>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureDate}>
            Recife, {formatFullDate(evalDate)}
          </Text>
          <Text style={[styles.signatureLine, { marginLeft: 0 }]}>
            <Text style={styles.signatureLabel}>{activityPlan.signatures.title}</Text>
          </Text>

          <Text style={[styles.signatureLine, { marginTop: 20 }]}>
            <Text style={styles.signatureLabel}>{activityPlan.signatures.student} </Text>
            ___________________________________________
          </Text>

          <Text style={[styles.signatureLine, { marginTop: 20 }]}>
            <Text style={styles.signatureLabel}>{activityPlan.signatures.supervisor} </Text>
            _______________________________________
          </Text>
          <Text style={styles.signatureSubLabel}>
            {activityPlan.signatures.fields.field}                        ({supervision.supervisorName})
          </Text>

          <Text style={[styles.signatureLine, { marginTop: 10 }]}>
            <Text style={styles.signatureLabel}>{activityPlan.signatures.advisor} </Text>
            _______________________________________
          </Text>
          <Text style={styles.signatureSubLabel}>
            {activityPlan.signatures.fields.ufpe}                                    ({supervision.advisorName})
          </Text>

          <Text style={[styles.signatureLine, { marginTop: 10 }]}>
            <Text style={styles.signatureLabel}>{activityPlan.signatures.coordinator} </Text>
            _________________________________
          </Text>
          <Text style={styles.signatureSubLabel}>
                                                             {activityPlan.signatures.coordinatorNote}
          </Text>
        </View>

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          {activityPlan.footer}
        </Text>
      </Page>
    </Document>
  );
}
