/**
 * ActivityPlanDocument - Plano de Atividades PDF Component
 * Renders the internship activity plan using @react-pdf/renderer
 */

import { Document, Text } from '@react-pdf/renderer';
import {
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
import {
  ActivityPlanEvaluationIndent,
  ActivityPlanEvaluationText,
  ActivityPlanFieldLabel,
  ActivityPlanFooterNote,
  ActivityPlanPage,
  ActivityPlanScheduleItem,
  ActivityPlanSignatureDate,
  ActivityPlanSignatureLine,
  ActivityPlanSignatureSection,
} from './pdf-components';

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
      <ActivityPlanPage>
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
              <ActivityPlanScheduleItem 
                key={index}
                number={index + 1}
                period={item.period}
                description={item.description}
              />
            ))}
          </PDFSection>
        </PDFSection>
        
        {/* Section 4: Supervision */}
        <PDFSection title={activityPlan.sections.supervision} number="4">
          <ActivityPlanFieldLabel style={{ marginLeft: 0, marginBottom: 8 }}>SUPERVISOR:</ActivityPlanFieldLabel>
          <PDFFieldRow label="Nome" value={supervision.supervisorName} />
          <PDFFieldRow label="E-mail" value={supervision.supervisorEmail} />
          <PDFFieldRow label="Telefone" value={supervision.supervisorPhone} />
          <PDFFieldRow label="Cargo" value={supervision.supervisorPosition} />
          <PDFFieldRow label="CPF" value={supervision.supervisorCpf} />

          <ActivityPlanFieldLabel style={{ marginLeft: 0, marginTop: 15, marginBottom: 8 }}>
            PROFESSOR ORIENTADOR:
          </ActivityPlanFieldLabel>
          <PDFFieldRow label="Nome" value={supervision.advisorName} />
          <PDFFieldRow label="E-mail" value={supervision.advisorEmail} />
          <PDFFieldRow label="SIAPE" value={supervision.advisorSiape} />
          <PDFFieldRow label="Cargo" value={supervision.advisorPosition} />
        </PDFSection>

        {/* Section 5: Evaluation */}
        <PDFSection title={`${activityPlan.sections.evaluation} ${activityPlan.evaluation.subtitle}`} number="5">
          <ActivityPlanEvaluationText>
            {activityPlan.evaluation.text1}
          </ActivityPlanEvaluationText>
          <PDFFieldRow label="Data para emissão do parecer" value={formatDatePtBr(evalDate)} />
          <ActivityPlanEvaluationText>
            {activityPlan.evaluation.text2}
          </ActivityPlanEvaluationText>
          {activityPlan.evaluation.legends.map((legend, index) => (
             <ActivityPlanEvaluationIndent key={index}>{legend}</ActivityPlanEvaluationIndent>
          ))}

          <ActivityPlanEvaluationText style={{ marginTop: 10 }}>
            {activityPlan.evaluation.text3}
          </ActivityPlanEvaluationText>

          {/* Evaluation Table using shared PDFTable */}
          <PDFTable columns={evalColumns} rows={activityPlan.evaluation.criteria} marginLeft={35} />

          <ActivityPlanEvaluationText style={{ marginTop: 15 }}>
            {activityPlan.evaluation.text4}
          </ActivityPlanEvaluationText>
          <ActivityPlanEvaluationText>
            {activityPlan.evaluation.text5}
          </ActivityPlanEvaluationText>
        </PDFSection>

        {/* Signatures */}
        <ActivityPlanSignatureSection>
          <ActivityPlanSignatureDate>
            Recife, {formatFullDate(evalDate)}
          </ActivityPlanSignatureDate>
          <Text style={{ fontFamily: fonts.bold }}>
            {activityPlan.signatures.title}
          </Text>

          <ActivityPlanSignatureLine 
            label={activityPlan.signatures.student}
            style={{ marginLeft: 0, marginTop: 20 }}
          />

          <ActivityPlanSignatureLine 
            label={activityPlan.signatures.supervisor}
            line="_______________________________________"
            subLabel={`${activityPlan.signatures.fields.field}                        (${supervision.supervisorName})`}
            style={{ marginTop: 20 }}
          />

          <ActivityPlanSignatureLine 
            label={activityPlan.signatures.advisor}
            line="_______________________________________"
            subLabel={`${activityPlan.signatures.fields.ufpe}                                    (${supervision.advisorName})`}
            style={{ marginTop: 10 }}
          />

          <ActivityPlanSignatureLine 
            label={activityPlan.signatures.coordinator}
            line="_________________________________"
            subLabel={`                                                             ${activityPlan.signatures.coordinatorNote}`}
            style={{ marginTop: 10 }}
          />
        </ActivityPlanSignatureSection>

        {/* Footer Note */}
        <ActivityPlanFooterNote>
          {activityPlan.footer}
        </ActivityPlanFooterNote>
      </ActivityPlanPage>
    </Document>
  );
}
