import {
  fonts,
  formatDatePtBr,
  formatFullDate,
  PDFFieldRow,
  PDFLayout,
  PDFLogoHeader,
  PDFNumberedList,
  PDFParagraph,
  PDFSection,
  PDFSignatureDate,
  PDFSignatureLine,
  PDFSignatureSection,
  PDFTable,
  type ColumnConfig,
} from "@papelada-estagio/components/pdf";
import { PDF_CONTENT } from "@papelada-estagio/constants/pdf-content";
import type { IInternshipData } from "@papelada-estagio/types";
import { Text } from "@react-pdf/renderer";
import { getAssetPath } from "../../utils/asset";
import { formatPeriod } from "../../utils/dateUtils";
import { formatWorkDays } from "../../utils/workDays";
import { formatWorkSchedule } from "../../utils/workSchedule";

interface ActivityPlanDocumentProps {
  data: IInternshipData;
}

export function ActivityPlanDocument({ data }: ActivityPlanDocumentProps) {
  const { framing, student, company, general, content, supervision } = data;
  const { activityPlan, header } = PDF_CONTENT;

  const evalDate = supervision.evaluationDeadline;

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

  const sectionTitleStyle = {
    marginLeft: 32,
    fontFamily: fonts.regular,
    marginBottom: 4,
    marginTop: 8,
  };

  return (
    <PDFLayout variant="activityPlan" wrap>
      <PDFLogoHeader
        logos={[
          {
            src: getAssetPath("/image1.png"),
            width: logoWidth,
            height: logoHeight,
          },
        ]}
        title={headerTitle}
        subtitle={docSubtitle}
      />

      <PDFSection title={activityPlan.sections.student} number="1">
        <PDFFieldRow label="Nome" value={student.fullName} />
        <PDFFieldRow label="E-mail" value={student.email} />
        <PDFFieldRow label="Endereço" value={student.address} />
        <PDFFieldRow label="Telefone" value={student.phone} />
        <PDFFieldRow label="Curso" value={framing.course} />
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
            ...sectionTitleStyle,
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
            value={formatWorkDays(general.workDays)}
            marginLeft={60}
          />
          <PDFFieldRow
            label="Horário"
            value={formatWorkSchedule(general.workSchedule)}
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
          titleStyle={sectionTitleStyle}
        >
          <PDFNumberedList items={content.activities} marginLeft={60} />
        </PDFSection>

        <PDFSection
          title={activityPlan.subsections.objectives}
          titleStyle={sectionTitleStyle}
        >
          <PDFNumberedList items={content.objectives} marginLeft={60} />
        </PDFSection>

        <PDFSection
          title={activityPlan.subsections.schedule}
          titleStyle={sectionTitleStyle}
        >
          {content.schedule.map((item, index) => (
            <PDFFieldRow
              key={index}
              label={`${index + 1}. ${formatPeriod(item.periodStart, item.periodEnd)}`}
              value={item.description}
              marginLeft={60}
              labelStyle={{ fontFamily: fonts.regular }}
            />
          ))}
        </PDFSection>
      </PDFSection>

      <PDFSection title={activityPlan.sections.supervision} number="4">
        <Text
          style={{ fontFamily: fonts.bold, marginLeft: 0, marginBottom: 8 }}
        >
          SUPERVISOR:
        </Text>
        <PDFFieldRow label="Nome" value={supervision.supervisorName} />
        <PDFFieldRow label="E-mail" value={supervision.supervisorEmail} />
        <PDFFieldRow label="Telefone" value={supervision.supervisorPhone} />
        <PDFFieldRow label="Cargo" value={supervision.supervisorPosition} />
        <PDFFieldRow label="CPF" value={supervision.supervisorCpf} />

        <Text
          style={{
            fontFamily: fonts.bold,
            marginLeft: 0,
            marginTop: 15,
            marginBottom: 8,
          }}
        >
          PROFESSOR ORIENTADOR:
        </Text>
        <PDFFieldRow label="Nome" value={supervision.advisorName} />
        <PDFFieldRow label="E-mail" value={supervision.advisorEmail} />
        <PDFFieldRow label="SIAPE" value={supervision.advisorSiape} />
        <PDFFieldRow label="Cargo" value={supervision.advisorPosition} />
      </PDFSection>

      <PDFSection
        title={`${activityPlan.sections.evaluation} ${activityPlan.evaluation.subtitle}`}
        number="5"
      >
        <PDFParagraph marginLeft={35}>
          {activityPlan.evaluation.text1}
        </PDFParagraph>
        <PDFFieldRow
          label="Data para emissão do parecer"
          value={formatDatePtBr(evalDate)}
        />
        <PDFParagraph marginLeft={35}>
          {activityPlan.evaluation.text2}
        </PDFParagraph>
        {activityPlan.evaluation.legends.map((legend, index) => (
          <PDFParagraph key={index} marginLeft={55}>
            {legend}
          </PDFParagraph>
        ))}

        <PDFParagraph marginLeft={35} style={{ marginTop: 10 }}>
          {activityPlan.evaluation.text3}
        </PDFParagraph>

        <PDFTable
          columns={evalColumns}
          rows={activityPlan.evaluation.criteria}
          marginLeft={35}
        />

        <PDFParagraph marginLeft={35} style={{ marginTop: 15 }}>
          {activityPlan.evaluation.text4}
        </PDFParagraph>
        <PDFParagraph marginLeft={35}>
          {activityPlan.evaluation.text5}
        </PDFParagraph>
      </PDFSection>

      <PDFSignatureSection>
        <PDFSignatureDate>
          {`Recife, ${formatFullDate(evalDate)}`}
        </PDFSignatureDate>
        <Text style={{ fontFamily: fonts.bold }}>
          {activityPlan.signatures.title}
        </Text>

        <PDFSignatureLine
          label={activityPlan.signatures.student}
          style={{ marginTop: 20 }}
        />

        <PDFSignatureLine
          label={activityPlan.signatures.supervisor}
          line="_______________________________________"
          subLabel={`${activityPlan.signatures.fields.field}                                  (${supervision.supervisorName})`}
          style={{ marginTop: 20 }}
        />

        <PDFSignatureLine
          label={activityPlan.signatures.advisor}
          line="_______________________________________"
          subLabel={`${activityPlan.signatures.fields.ufpe}                                            (${supervision.advisorName})`}
          style={{ marginTop: 10 }}
        />

        <PDFSignatureLine
          label={activityPlan.signatures.coordinator}
          line="_________________________________"
          subLabel={`\u00A0                                                                                                 ${activityPlan.signatures.coordinatorNote}`}
          style={{ marginTop: 10 }}
        />
      </PDFSignatureSection>

      <PDFParagraph style={{ fontSize: 8, marginTop: 8, marginBottom: 0 }}>
        {activityPlan.footer}
      </PDFParagraph>
    </PDFLayout>
  );
}
