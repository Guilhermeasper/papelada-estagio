/**
 * ReportDocument - Relatório de Estágio Obrigatório PDF Component
 * Renders the internship report using @react-pdf/renderer
 */

import { Document, Text } from '@react-pdf/renderer';
import {
  formatDatePtBr,
  getMonthName,
  PDFBulletList,
  PDFKeyValueTable,
  PDFLogoHeader,
  PDFSection,
  PDFTable,
  type ColumnConfig,
  type KeyValueItem,
} from '../../shared/components/pdf';
import { PDF_CONTENT } from '../../shared/constants/pdf-content';
import type { IInternshipData } from '../../shared/domain/types';
import {
  ReportCoverFooter,
  ReportCoverPage,
  reportH1Style,
  ReportH2,
  ReportPage,
  ReportParagraph,
  ReportTocItem,
  ReportTocSubItem,
  ReportTocTitle,
} from './pdf-components';

// ============================================
// Props Interface
// ============================================
interface ReportDocumentProps {
  data: IInternshipData;
}

// ============================================
// Main Component
// ============================================
export function ReportDocument({ data }: ReportDocumentProps) {
  const { student, company, general, content, evaluation, supervision } = data;
  const { report, header } = PDF_CONTENT;

  // Get current date for cover
  const endDate = new Date(general.endDate);
  const coverMonth = getMonthName(endDate.getMonth() + 1);
  const coverYear = endDate.getFullYear();

  // Calculate weekly hours
  const weeklyHours = general.hoursPerDay * 5;

  // ID table items using shared component
  const idItems: KeyValueItem[] = [
    { label: 'Nome', value: student.fullName },
    { label: 'Ano/Semestre de ingresso no curso', value: student.enrollmentYear },
    { label: 'Instituição concedente do estágio', value: company.companyName },
    { label: 'Supervisor na instituição concedente', value: supervision.supervisorName },
    { label: 'Email do supervisor', value: supervision.supervisorEmail },
    { label: 'Telefone para contato (supervisor)', value: supervision.supervisorPhone },
    { label: 'Data de início do estágio', value: formatDatePtBr(general.startDate) },
    { label: 'Data de término do estágio', value: formatDatePtBr(general.endDate) },
    { label: 'Carga horária semanal', value: `${weeklyHours} horas` },
    { label: 'Professor Orientador', value: supervision.advisorName },
  ];

  // Evaluation table columns
  const evalColumns: ColumnConfig[] = [
    { key: 'item', header: 'Item', width: 175 },
    { key: 'grade', header: 'Nota', width: 47, align: 'center', bold: true },
    { key: 'observation', header: 'Observação', width: 214 },
  ];

  // Evaluation rows: combine grades and yes/no questions
  const evalRows = [
    ...evaluation.grades.map((g) => ({
      item: g.item,
      grade: String(g.grade),
      observation: g.observation,
    })),
    {
      item: report.evaluationQuestions[0],
      grade: evaluation.flexibleSchedule ? 'sim' : 'não',
      observation: '',
    },
    {
      item: report.evaluationQuestions[1],
      grade: evaluation.reducedDuringExams ? 'sim' : 'não',
      observation: '',
    },
    {
      item: report.evaluationQuestions[2],
      grade: evaluation.requiresCompensation ? 'sim' : 'não',
      observation: '',
    },
    {
      item: report.evaluationQuestions[3],
      grade: evaluation.caresAboutAcademics ? 'sim' : 'não',
      observation: '',
    },
    {
      item: report.evaluationQuestions[4],
      grade: evaluation.recommendsPartnership ? 'sim' : 'não',
      observation: '',
    },
  ];

  return (
    <Document>
      {/* Cover Page */}
      <ReportCoverPage>
        <PDFLogoHeader 
           logos={[
             { src: '/logo_cin.png', width: 97, height: 97 },
             { src: '/logo_ufpe.png', width: 76, height: 120 }
           ]}
        />
        
        <Text style={{ fontSize: 18, textAlign: 'center', marginTop: 10 }}>{header.university}</Text>
        <Text style={{ fontSize: 18, textAlign: 'center', marginLeft: 30 }}>{header.institution}</Text>

        <Text style={{ fontSize: 16, textAlign: 'center', marginTop: 80 }}>{report.title}</Text>
        
        <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 40 }}>Graduação em {student.course}</Text>

        <ReportCoverFooter>
          <Text>Recife</Text>
          <Text>{coverMonth}, {coverYear}</Text>
        </ReportCoverFooter>
      </ReportCoverPage>

      {/* Table of Contents */}
      <ReportPage>
        <ReportTocTitle>{report.toc.title}</ReportTocTitle>
        
        {report.toc.items.map((item, index) => {
           if (item.indent) {
             return (
               <ReportTocSubItem key={index} label={item.label} page={item.page} />
             );
           }
           return (
             <ReportTocItem key={index} label={item.label} page={item.page} />
           );
        })}
      </ReportPage>

      {/* Identificação - using PDFKeyValueTable */}
      <ReportPage>
        <PDFSection title={report.sections.identification} titleStyle={reportH1Style}>
             <PDFKeyValueTable items={idItems} labelWidth={200} />
        </PDFSection>
      </ReportPage>

      {/* Introdução */}
      <ReportPage>
        <PDFSection title={report.sections.introduction} titleStyle={reportH1Style}>
            <ReportParagraph>{content.introduction}</ReportParagraph>
        </PDFSection>
      </ReportPage>

      {/* Objetivos - using PDFBulletList */}
      <ReportPage>
        <PDFSection title={report.sections.objectives} titleStyle={reportH1Style}>
            <ReportH2>{report.sections.generalObjectives}</ReportH2>
            <ReportParagraph>{content.generalObjectives}</ReportParagraph>
            
            <ReportH2>{report.sections.specificObjectives}</ReportH2>
            <ReportParagraph>
              {report.text.specificObjectivesIntro}
            </ReportParagraph>
            <PDFBulletList items={content.objectives} />
        </PDFSection>
      </ReportPage>

      {/* Cronograma */}
      <ReportPage>
        <PDFSection title={report.sections.schedule} titleStyle={reportH1Style}>
            <ReportParagraph>
              {report.text.scheduleIntro}
            </ReportParagraph>
            {content.schedule.map((item, index) => (
              <ReportParagraph key={index}>
                {item.period}: {item.description}
              </ReportParagraph>
            ))}
        </PDFSection>
      </ReportPage>

      {/* Material e Método */}
      <ReportPage>
         <PDFSection title={report.sections.methodology} titleStyle={reportH1Style}>
            <ReportParagraph>{content.methodology}</ReportParagraph>
         </PDFSection>
      </ReportPage>

      {/* Desenvolvimento */}
      <ReportPage>
         <PDFSection title={report.sections.development} titleStyle={reportH1Style}>
            <ReportParagraph>{content.development}</ReportParagraph>
         </PDFSection>
      </ReportPage>

      {/* Avaliação do Estágio - using PDFTable */}
      <ReportPage>
         <PDFSection title={report.sections.evaluation} titleStyle={reportH1Style}>
            <PDFTable columns={evalColumns} rows={evalRows} />
         </PDFSection>
      </ReportPage>

      {/* Conclusão */}
      <ReportPage>
         <PDFSection title={report.sections.conclusion} titleStyle={reportH1Style}>
            <ReportParagraph>{content.conclusion}</ReportParagraph>
         </PDFSection>
      </ReportPage>
    </Document>
  );
}
