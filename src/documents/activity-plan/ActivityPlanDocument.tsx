import {
  fonts,
  formatDatePtBr,
  formatFullDate,
  PDFFieldRow,
  PDFLogoHeader,
  PDFNumberedList,
  PDFPage,
  PDFSection,
  PDFTable,
  type ColumnConfig,
} from "@papelada-estagio/components/pdf";
import { PDF_CONTENT } from "@papelada-estagio/constants/pdf-content";
import type { IInternshipData } from "@papelada-estagio/types";
import { Document, Text } from "@react-pdf/renderer";
import {
  ActivityPlanEvaluationIndent,
  ActivityPlanEvaluationText,
  ActivityPlanFieldLabel,
  ActivityPlanFooterNote,
  ActivityPlanScheduleItem,
  ActivityPlanSignatureDate,
  ActivityPlanSignatureLine,
  ActivityPlanSignatureSection,
} from "./pdf";

interface ActivityPlanDocumentProps {
  data: IInternshipData;
}

export function ActivityPlanDocument({ data }: ActivityPlanDocumentProps) {
  const { student, company, general, content, supervision } = data;
  const { activityPlan, header } = PDF_CONTENT;

  const endDateObj = new Date(general.endDate);
  endDateObj.setDate(endDateObj.getDate() + 12);
  const evalDate = endDateObj.toISOString().split("T")[0];

  const evalColumns: ColumnConfig[] = [
    { key: "topic", header: "TÓPICO", width: 98 },
    { key: "description", header: "DESCRIÇÃO", width: 200 },
    { key: "weight", header: "PESO", width: 50, align: "center" },
  ];

  const headerTitle = [
    header.service,
    header.university,
    header.department,
    header.coordination,
  ].join("\n");

  const docSubtitle = [activityPlan.title, activityPlan.subtitle].join("\n");

  const logoHeight = 55;
  const widthHeightRatio = 1020 / 980;
  const logoWidth = logoHeight * widthHeightRatio;

  return (
    <Document>
      <PDFPage variant="activityPlan" wrap>
        <PDFLogoHeader
          logos={[{ src: "/image1.png", width: logoWidth, height: logoHeight }]}
          title={headerTitle}
          subtitle={docSubtitle}
        />

        <PDFSection title={activityPlan.sections.student} number="1">
          <PDFFieldRow label="Nome" value={student.fullName} />
          <PDFFieldRow label="E-mail" value={student.email} />
          <PDFFieldRow label="Endereço" value={student.address} />
          <PDFFieldRow label="Telefone" value={student.phone} />
          <PDFFieldRow label="Curso" value={student.course} />
          <PDFFieldRow label="Ano de Ingresso" value={student.enrollmentYear} />
          <PDFFieldRow label="Matrícula" value={student.studentId} />
        </PDFSection>

        <PDFSection title={activityPlan.sections.company} number="2">
          <PDFFieldRow label="Empresa" value={company.companyName} />
          <PDFFieldRow label="Endereço" value={company.companyAddress} />
          <PDFFieldRow label="CNPJ" value={company.companyCnpj} />
        </PDFSection>

        <PDFSection title={activityPlan.sections.program} number="3">
          <PDFSection
            title={activityPlan.subsections.generalInfo}
            titleStyle={{
              marginLeft: 32,
              fontFamily: fonts.regular,
              marginBottom: 12,
            }}
          >
            <PDFFieldRow
              label="Período"
              value={`${formatDatePtBr(general.startDate)} – ${formatDatePtBr(general.endDate)}`}
              marginLeft={60}
            />
            <PDFFieldRow
              label="Carga Horária"
              value={`${general.hoursPerDay}h/dia`}
              marginLeft={60}
            />
            <PDFFieldRow
              label="Dias"
              value={general.workDays}
              marginLeft={60}
            />
            <PDFFieldRow
              label="Horário"
              value={general.workSchedule}
              marginLeft={60}
            />
            <PDFFieldRow
              label="Modalidade"
              value={general.modality}
              marginLeft={60}
            />
          </PDFSection>

          <PDFSection
            title={activityPlan.subsections.activities}
            titleStyle={{
              marginLeft: 32,
              fontFamily: fonts.regular,
              marginBottom: 4,
              marginTop: 8,
            }}
          >
            <PDFNumberedList items={content.activities} marginLeft={60} />
          </PDFSection>

          <PDFSection
            title={activityPlan.subsections.objectives}
            titleStyle={{
              marginLeft: 32,
              fontFamily: fonts.regular,
              marginBottom: 4,
              marginTop: 8,
            }}
          >
            <PDFNumberedList items={content.objectives} marginLeft={60} />
          </PDFSection>

          <PDFSection
            title={activityPlan.subsections.schedule}
            titleStyle={{
              marginLeft: 32,
              fontFamily: fonts.regular,
              marginBottom: 4,
              marginTop: 8,
            }}
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

        <PDFSection title={activityPlan.sections.supervision} number="4">
          <ActivityPlanFieldLabel style={{ marginLeft: 0, marginBottom: 8 }}>
            SUPERVISOR:
          </ActivityPlanFieldLabel>
          <PDFFieldRow label="Nome" value={supervision.supervisorName} />
          <PDFFieldRow label="E-mail" value={supervision.supervisorEmail} />
          <PDFFieldRow label="Telefone" value={supervision.supervisorPhone} />
          <PDFFieldRow label="Cargo" value={supervision.supervisorPosition} />
          <PDFFieldRow label="CPF" value={supervision.supervisorCpf} />

          <ActivityPlanFieldLabel
            style={{ marginLeft: 0, marginTop: 15, marginBottom: 8 }}
          >
            PROFESSOR ORIENTADOR:
          </ActivityPlanFieldLabel>
          <PDFFieldRow label="Nome" value={supervision.advisorName} />
          <PDFFieldRow label="E-mail" value={supervision.advisorEmail} />
          <PDFFieldRow label="SIAPE" value={supervision.advisorSiape} />
          <PDFFieldRow label="Cargo" value={supervision.advisorPosition} />
        </PDFSection>

        <PDFSection
          title={`${activityPlan.sections.evaluation} ${activityPlan.evaluation.subtitle}`}
          number="5"
        >
          <ActivityPlanEvaluationText>
            {activityPlan.evaluation.text1}
          </ActivityPlanEvaluationText>
          <PDFFieldRow
            label="Data para emissão do parecer"
            value={formatDatePtBr(evalDate)}
          />
          <ActivityPlanEvaluationText>
            {activityPlan.evaluation.text2}
          </ActivityPlanEvaluationText>
          {activityPlan.evaluation.legends.map((legend, index) => (
            <ActivityPlanEvaluationIndent key={index}>
              {legend}
            </ActivityPlanEvaluationIndent>
          ))}

          <ActivityPlanEvaluationText style={{ marginTop: 10 }}>
            {activityPlan.evaluation.text3}
          </ActivityPlanEvaluationText>

          <PDFTable
            columns={evalColumns}
            rows={activityPlan.evaluation.criteria}
            marginLeft={35}
          />

          <ActivityPlanEvaluationText style={{ marginTop: 15 }}>
            {activityPlan.evaluation.text4}
          </ActivityPlanEvaluationText>
          <ActivityPlanEvaluationText>
            {activityPlan.evaluation.text5}
          </ActivityPlanEvaluationText>
        </PDFSection>

        <ActivityPlanSignatureSection>
          <ActivityPlanSignatureDate>
            Recife, {formatFullDate(evalDate)}
          </ActivityPlanSignatureDate>
          <Text style={{ fontFamily: fonts.bold }}>
            {activityPlan.signatures.title}
          </Text>

          <ActivityPlanSignatureLine
            label={activityPlan.signatures.student}
            style={{ marginTop: 20 }}
          />

          <ActivityPlanSignatureLine
            label={activityPlan.signatures.supervisor}
            line="_______________________________________"
            subLabel={`${activityPlan.signatures.fields.field}                                  (${supervision.supervisorName})`}
            style={{ marginTop: 20 }}
          />

          <ActivityPlanSignatureLine
            label={activityPlan.signatures.advisor}
            line="_______________________________________"
            subLabel={`${activityPlan.signatures.fields.ufpe}                                            (${supervision.advisorName})`}
            style={{ marginTop: 10 }}
          />

          <ActivityPlanSignatureLine
            label={activityPlan.signatures.coordinator}
            line="_________________________________"
            subLabel={`                                                                                                  ${activityPlan.signatures.coordinatorNote}`}
            style={{ marginTop: 10 }}
          />
        </ActivityPlanSignatureSection>

        <ActivityPlanFooterNote>{activityPlan.footer}</ActivityPlanFooterNote>
      </PDFPage>
    </Document>
  );
}
