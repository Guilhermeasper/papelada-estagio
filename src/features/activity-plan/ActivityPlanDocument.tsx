/**
 * ActivityPlanDocument - Plano de Atividades PDF Component
 * Renders the internship activity plan using @react-pdf/renderer
 */

import {
  Document,
  Image,
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
  PDFNumberedList,
  PDFTable,
  type ColumnConfig,
} from '../../shared/components/pdf';
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
  // Header
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 76,
    height: 73,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 10,
    fontFamily: fonts.bold,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  documentTitle: {
    fontSize: 10,
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 8,
  },
  // Sections
  sectionTitle: {
    fontSize: 10,
    fontFamily: fonts.bold,
    marginTop: 12,
    marginBottom: 6,
  },
  subsectionTitle: {
    fontSize: 10,
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 32,
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
// Evaluation Table Data
// ============================================
const evaluationCriteria = [
  { topic: 'Assiduidade', description: 'Frequência e participação', weight: '2' },
  { topic: 'Comprometimento', description: 'Aderência a prazos e objetivos acordados', weight: '2' },
  { topic: 'Independência', description: 'Evolução autônoma', weight: '1' },
  { topic: 'Criatividade', description: 'Encontrar soluções inovadoras', weight: '1' },
  { topic: 'Liderança', description: 'Defesa do ponto de vista', weight: '1' },
  { topic: 'Relacionamento', description: 'Trabalho em equipe', weight: '3' },
  { topic: 'Domínio Teórico', description: 'Capacidade técnica', weight: '3' },
  { topic: 'Iniciativa', description: 'Ação proativa', weight: '2' },
];

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

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image
            style={styles.logo}
            src="/image1.png"
          />
          <Text style={styles.headerTitle}>
            SERVIÇO PÚBLICO FEDERAL{'\n'}
            UNIVERSIDADE FEDERAL DE PERNAMBUCO{'\n'}
            PRÓ-REITORIA PARA ASSUNTOS ACADÊMICOS{'\n'}
            Coordenação de Apoio Acadêmico
          </Text>
          <Text style={styles.documentTitle}>
            ESTÁGIO CURRICULAR OBRIGATÓRIO
          </Text>
          <Text style={styles.documentTitle}>
            PLANO DE ATIVIDADES
          </Text>
        </View>

        {/* Section 1: Student Data */}
        <Text style={styles.sectionTitle}>1. DADOS DE IDENTIFICAÇÃO DO ESTAGIÁRIO</Text>
        <PDFFieldRow label="Nome" value={student.fullName} />
        <PDFFieldRow label="E-mail" value={student.email} />
        <PDFFieldRow label="Endereço" value={student.address} />
        <PDFFieldRow label="Telefone" value={student.phone} />
        <PDFFieldRow label="Curso" value={student.course} />
        <PDFFieldRow label="Ano de Ingresso" value={student.enrollmentYear} />
        <PDFFieldRow label="Matrícula" value={student.studentId} />

        {/* Section 2: Company Data */}
        <Text style={styles.sectionTitle}>2. IDENTIFICAÇÃO DA EMPRESA</Text>
        <PDFFieldRow label="Empresa" value={company.companyName} />
        <PDFFieldRow label="Endereço" value={company.companyAddress} />
        <PDFFieldRow label="CNPJ" value={company.companyCnpj} />

        {/* Section 3: Internship Program */}
        <Text style={styles.sectionTitle}>3. PROGRAMA DE ESTÁGIO</Text>
        
        <Text style={styles.subsectionTitle}>
          3.1. Informações Gerais: Período (Vigência), Carga Horária, Dias e horário
        </Text>
        <PDFFieldRow label="Período" value={`${formatDatePtBr(general.startDate)} – ${formatDatePtBr(general.endDate)}`} marginLeft={60} />
        <PDFFieldRow label="Carga Horária" value={`${general.hoursPerDay}h/dia`} marginLeft={60} />
        <PDFFieldRow label="Dias" value={general.workDays} marginLeft={60} />
        <PDFFieldRow label="Horário" value={general.workSchedule} marginLeft={60} />
        <PDFFieldRow label="Modalidade" value={general.modality} marginLeft={60} />

        <Text style={styles.subsectionTitle}>3.2. Atividades a serem desenvolvidas</Text>
        <PDFNumberedList items={content.activities} marginLeft={60} />

        <Text style={styles.subsectionTitle}>3.3. Objetivos / metas a serem atingidas</Text>
        <PDFNumberedList items={content.objectives} marginLeft={60} />

        <Text style={styles.subsectionTitle}>3.4. Cronograma</Text>
        {content.schedule.map((item, index) => (
          <View key={index} style={styles.scheduleItem}>
            <Text style={styles.scheduleNumber}>{index + 1}.</Text>
            <Text style={styles.scheduleContent}>
              {item.period} – {item.description}
            </Text>
          </View>
        ))}

        {/* Section 4: Supervision */}
        <Text style={styles.sectionTitle}>4. ORIENTAÇÃO E SUPERVISÃO</Text>
        
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

        {/* Section 5: Evaluation */}
        <Text style={styles.sectionTitle}>
          <Text style={styles.fieldLabel}>5. AVALIAÇÃO </Text>
          <Text>(critérios, formas, datas)</Text>
        </Text>

        <Text style={styles.evaluationText}>
          Ao fim do segundo período o supervisor produzirá um relatório acerca da integração 
          do estagiário com a rotina da corporação e sua interação intra e extra departamental.
        </Text>
        <PDFFieldRow label="Data para emissão do parecer" value={formatDatePtBr(evalDate)} />
        <Text style={styles.evaluationText}>
          Para cada um dos itens abaixo será emitida uma nota de 1 a 5, sendo:
        </Text>
        <Text style={styles.evaluationIndent}>1 – Insatisfatório</Text>
        <Text style={styles.evaluationIndent}>2 – Pouco desenvolvido</Text>
        <Text style={styles.evaluationIndent}>3 – Satisfatório</Text>
        <Text style={styles.evaluationIndent}>4 – Atende acima das expectativas</Text>
        <Text style={styles.evaluationIndent}>5 – Acima das expectativas</Text>

        <Text style={[styles.evaluationText, { marginTop: 10 }]}>
          Farão parte do relatório:
        </Text>

        {/* Evaluation Table using shared PDFTable */}
        <PDFTable columns={evalColumns} rows={evaluationCriteria} marginLeft={35} />

        <Text style={[styles.evaluationText, { marginTop: 15 }]}>
          O objetivo do terceiro período é a entrega das aplicações e a avaliação da técnica 
          e clareza do código fonte.
        </Text>
        <Text style={styles.evaluationText}>
          Será objeto desta avaliação o cumprimento das fases de Levantamento dos Requisitos, 
          Projeto, Especificação, Codificação, Testes e Integração.
        </Text>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <Text style={styles.signatureDate}>
            Recife, {formatFullDate(evalDate)}
          </Text>
          <Text style={[styles.signatureLine, { marginLeft: 0 }]}>
            <Text style={styles.signatureLabel}>Assinaturas:</Text>
          </Text>

          <Text style={[styles.signatureLine, { marginTop: 20 }]}>
            <Text style={styles.signatureLabel}>Estagiário: </Text>
            ___________________________________________
          </Text>

          <Text style={[styles.signatureLine, { marginTop: 20 }]}>
            <Text style={styles.signatureLabel}>Supervisor de Estágio: </Text>
            _______________________________________
          </Text>
          <Text style={styles.signatureSubLabel}>
            (Campo de Estágio)                        ({supervision.supervisorName})
          </Text>

          <Text style={[styles.signatureLine, { marginTop: 10 }]}>
            <Text style={styles.signatureLabel}>Orientador de Estágio: </Text>
            _______________________________________
          </Text>
          <Text style={styles.signatureSubLabel}>
            (UFPE)                                    ({supervision.advisorName})
          </Text>

          <Text style={[styles.signatureLine, { marginTop: 10 }]}>
            <Text style={styles.signatureLabel}>Coordenador de Estágio ou do Curso: </Text>
            _________________________________
          </Text>
          <Text style={styles.signatureSubLabel}>
                                                             (Não colocar nome)
          </Text>
        </View>

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          O Plano de Atividades deverá ser elaborado em conformidade com as especificidades 
          do Curso e deve ser parte integrante do Termo de Compromisso e deverá conter, 
          obrigatoriamente, todas as assinaturas.
        </Text>
      </Page>
    </Document>
  );
}
