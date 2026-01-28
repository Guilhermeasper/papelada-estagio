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
import type { IInternshipData } from '../../shared/domain/types';

// ============================================
// Font Registration - Using Helvetica (built-in, closest to Tahoma)
// ============================================
// Note: Tahoma is not available as a web font. Helvetica is a built-in
// PDF font that closely resembles Tahoma's appearance.

// ============================================
// CIn-UFPE Visual Identity
// ============================================
const colors = {
  primaryRed: '#DB1E2F',
  textBlack: '#231F20',
  borderGray: '#E0E1E0',
  white: '#FFFFFF',
};

// ============================================
// Styles
// ============================================
const styles = StyleSheet.create({
  page: {
    paddingTop: 70,
    paddingBottom: 70,
    paddingLeft: 85,
    paddingRight: 56,
    fontFamily: 'Helvetica',
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
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  documentTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 8,
  },
  // Sections
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    marginTop: 12,
    marginBottom: 6,
  },
  subsectionTitle: {
    fontSize: 10,
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 32,
  },
  // Field rows
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 3,
    marginLeft: 35,
    flexWrap: 'wrap',
  },
  fieldLabel: {
    fontFamily: 'Helvetica-Bold',
  },
  fieldValue: {
    fontWeight: 400,
    flex: 1,
  },
  // Numbered lists
  listItem: {
    flexDirection: 'row',
    marginBottom: 4,
    marginLeft: 60,
    paddingRight: 20,
  },
  listNumber: {
    width: 18,
    fontWeight: 400,
  },
  listContent: {
    flex: 1,
    textAlign: 'justify',
  },
  // Table
  table: {
    marginTop: 10,
    marginLeft: 35,
    borderWidth: 1,
    borderColor: colors.textBlack,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.textBlack,
  },
  tableRowLast: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: colors.white,
  },
  tableColTopic: {
    width: 98,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: colors.textBlack,
  },
  tableColDesc: {
    width: 205,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: colors.textBlack,
  },
  tableColWeight: {
    width: 44,
    padding: 4,
    textAlign: 'center',
  },
  tableHeaderText: {
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  tableCellText: {
    fontFamily: 'Helvetica',
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
    fontFamily: 'Helvetica-Bold',
  },
  signatureSubLabel: {
    marginLeft: 35,
    fontSize: 9,
    marginBottom: 15,
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
});

// ============================================
// Props Interface
// ============================================
interface ActivityPlanDocumentProps {
  data: IInternshipData;
}

// ============================================
// Helper Components
// ============================================
interface FieldRowProps {
  label: string;
  value: string;
}

function FieldRow({ label, value }: FieldRowProps) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}: </Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

interface NumberedListProps {
  items: string[];
}

function NumberedList({ items }: NumberedListProps) {
  return (
    <View>
      {items.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.listNumber}>{index + 1}.</Text>
          <Text style={styles.listContent}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

// ============================================
// Evaluation Table Data
// ============================================
const evaluationCriteria = [
  { topic: 'Assiduidade', description: 'Frequência e participação', weight: 2 },
  { topic: 'Comprometimento', description: 'Aderência a prazos e objetivos acordados', weight: 2 },
  { topic: 'Independência', description: 'Evolução autônoma', weight: 1 },
  { topic: 'Criatividade', description: 'Encontrar soluções inovadoras', weight: 1 },
  { topic: 'Liderança', description: 'Defesa do ponto de vista', weight: 1 },
  { topic: 'Relacionamento', description: 'Trabalho em equipe', weight: 3 },
  { topic: 'Domínio Teórico', description: 'Capacidade técnica', weight: 3 },
  { topic: 'Iniciativa', description: 'Ação proativa', weight: 2 },
];

// ============================================
// Date Formatting Helper
// ============================================
function formatDatePtBr(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}

function getMonthName(month: number): string {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];
  return months[month - 1] || '';
}

function formatFullDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return `${day} de ${getMonthName(month)} de ${year}`;
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
        <FieldRow label="Nome" value={student.fullName} />
        <FieldRow label="E-mail" value={student.email} />
        <FieldRow label="Endereço" value={student.address} />
        <FieldRow label="Telefone" value={student.phone} />
        <FieldRow label="Curso" value={student.course} />
        <FieldRow label="Ano de Ingresso" value={student.enrollmentYear} />
        <FieldRow label="Matrícula" value={student.studentId} />

        {/* Section 2: Company Data */}
        <Text style={styles.sectionTitle}>2. IDENTIFICAÇÃO DA EMPRESA</Text>
        <FieldRow label="Empresa" value={company.companyName} />
        <FieldRow label="Endereço" value={company.companyAddress} />
        <FieldRow label="CNPJ" value={company.companyCnpj} />

        {/* Section 3: Internship Program */}
        <Text style={styles.sectionTitle}>3. PROGRAMA DE ESTÁGIO</Text>
        
        <Text style={styles.subsectionTitle}>
          3.1. Informações Gerais: Período (Vigência), Carga Horária, Dias e horário
        </Text>
        <View style={[styles.fieldRow, { marginLeft: 60 }]}>
          <Text style={styles.fieldLabel}>Período: </Text>
          <Text style={styles.fieldValue}>
            {formatDatePtBr(general.startDate)} – {formatDatePtBr(general.endDate)}
          </Text>
        </View>
        <View style={[styles.fieldRow, { marginLeft: 60 }]}>
          <Text style={styles.fieldLabel}>Carga Horária: </Text>
          <Text style={styles.fieldValue}>{general.hoursPerDay}h/dia</Text>
        </View>
        <View style={[styles.fieldRow, { marginLeft: 60 }]}>
          <Text style={styles.fieldLabel}>Dias: </Text>
          <Text style={styles.fieldValue}>{general.workDays}</Text>
        </View>
        <View style={[styles.fieldRow, { marginLeft: 60 }]}>
          <Text style={styles.fieldLabel}>Horário: </Text>
          <Text style={styles.fieldValue}>{general.workSchedule}</Text>
        </View>
        <View style={[styles.fieldRow, { marginLeft: 60 }]}>
          <Text style={styles.fieldLabel}>Modalidade: </Text>
          <Text style={styles.fieldValue}>{general.modality}</Text>
        </View>

        <Text style={styles.subsectionTitle}>3.2. Atividades a serem desenvolvidas</Text>
        <NumberedList items={content.activities} />

        <Text style={styles.subsectionTitle}>3.3. Objetivos / metas a serem atingidas</Text>
        <NumberedList items={content.objectives} />

        <Text style={styles.subsectionTitle}>3.4. Cronograma</Text>
        {content.schedule.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.listNumber}>{index + 1}.</Text>
            <Text style={styles.listContent}>
              {item.period} – {item.description}
            </Text>
          </View>
        ))}

        {/* Section 4: Supervision */}
        <Text style={styles.sectionTitle}>4. ORIENTAÇÃO E SUPERVISÃO</Text>
        
        <Text style={[styles.fieldLabel, { marginLeft: 0, marginBottom: 8 }]}>SUPERVISOR:</Text>
        <FieldRow label="Nome" value={supervision.supervisorName} />
        <FieldRow label="E-mail" value={supervision.supervisorEmail} />
        <FieldRow label="Telefone" value={supervision.supervisorPhone} />
        <FieldRow label="Cargo" value={supervision.supervisorPosition} />
        <FieldRow label="CPF" value={supervision.supervisorCpf} />

        <Text style={[styles.fieldLabel, { marginLeft: 0, marginTop: 15, marginBottom: 8 }]}>
          PROFESSOR ORIENTADOR:
        </Text>
        <FieldRow label="Nome" value={supervision.advisorName} />
        <FieldRow label="E-mail" value={supervision.advisorEmail} />
        <FieldRow label="SIAPE" value={supervision.advisorSiape} />
        <FieldRow label="Cargo" value={supervision.advisorPosition} />

        {/* Section 5: Evaluation */}
        <Text style={styles.sectionTitle}>
          <Text style={styles.fieldLabel}>5. AVALIAÇÃO </Text>
          <Text>(critérios, formas, datas)</Text>
        </Text>

        <Text style={styles.evaluationText}>
          Ao fim do segundo período o supervisor produzirá um relatório acerca da integração 
          do estagiário com a rotina da corporação e sua interação intra e extra departamental.
        </Text>
        <View style={[styles.fieldRow, { marginBottom: 8 }]}>
          <Text>Data para emissão do parecer: </Text>
          <Text>{formatDatePtBr(evalDate)}</Text>
        </View>
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

        {/* Evaluation Table */}
        <View style={styles.table}>
          {/* Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableColTopic}>
              <Text style={styles.tableHeaderText}>TÓPICO</Text>
            </View>
            <View style={styles.tableColDesc}>
              <Text style={styles.tableHeaderText}>DESCRIÇÃO</Text>
            </View>
            <View style={styles.tableColWeight}>
              <Text style={styles.tableHeaderText}>PESO</Text>
            </View>
          </View>
          {/* Rows */}
          {evaluationCriteria.map((criterion, index) => (
            <View 
              key={index} 
              style={index === evaluationCriteria.length - 1 ? styles.tableRowLast : styles.tableRow}
            >
              <View style={styles.tableColTopic}>
                <Text style={styles.tableCellText}>{criterion.topic}</Text>
              </View>
              <View style={styles.tableColDesc}>
                <Text style={styles.tableCellText}>{criterion.description}</Text>
              </View>
              <View style={styles.tableColWeight}>
                <Text style={styles.tableCellText}>{criterion.weight}</Text>
              </View>
            </View>
          ))}
        </View>

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
