import i18n from "../i18n";

export const getPdfContent = () => ({
  header: {
    service: i18n.t("pdf.header.service"),
    university: i18n.t("pdf.header.university"),
    department: i18n.t("pdf.header.department"),
    coordination: i18n.t("pdf.header.coordination"),
    institution: i18n.t("pdf.header.institution"),
  },
  activityPlan: {
    title: i18n.t("pdf.activityPlan.title"),
    subtitle: i18n.t("pdf.activityPlan.subtitle"),
    sections: {
      student: i18n.t("pdf.activityPlan.sections.student"),
      company: i18n.t("pdf.activityPlan.sections.company"),
      program: i18n.t("pdf.activityPlan.sections.program"),
      supervision: i18n.t("pdf.activityPlan.sections.supervision"),
      evaluation: i18n.t("pdf.activityPlan.sections.evaluation"),
    },
    subsections: {
      generalInfo: i18n.t("pdf.activityPlan.subsections.generalInfo"),
      activities: i18n.t("pdf.activityPlan.subsections.activities"),
      objectives: i18n.t("pdf.activityPlan.subsections.objectives"),
      schedule: i18n.t("pdf.activityPlan.subsections.schedule"),
    },
    evaluation: {
      subtitle: i18n.t("pdf.activityPlan.evaluation.subtitle"),
      text1: i18n.t("pdf.activityPlan.evaluation.text1"),
      text2: i18n.t("pdf.activityPlan.evaluation.text2"),
      legends: i18n.t("pdf.activityPlan.evaluation.legends", {
        returnObjects: true,
      }) as string[],
      text3: i18n.t("pdf.activityPlan.evaluation.text3"),
      criteria: [
        {
          topic: i18n.t(
            "pdf.activityPlan.evaluation.criteria.assiduidade.topic",
          ),
          description: i18n.t(
            "pdf.activityPlan.evaluation.criteria.assiduidade.description",
          ),
          weight: "2",
        },
        {
          topic: i18n.t(
            "pdf.activityPlan.evaluation.criteria.comprometimento.topic",
          ),
          description: i18n.t(
            "pdf.activityPlan.evaluation.criteria.comprometimento.description",
          ),
          weight: "2",
        },
        {
          topic: i18n.t(
            "pdf.activityPlan.evaluation.criteria.independencia.topic",
          ),
          description: i18n.t(
            "pdf.activityPlan.evaluation.criteria.independencia.description",
          ),
          weight: "1",
        },
        {
          topic: i18n.t(
            "pdf.activityPlan.evaluation.criteria.criatividade.topic",
          ),
          description: i18n.t(
            "pdf.activityPlan.evaluation.criteria.criatividade.description",
          ),
          weight: "1",
        },
        {
          topic: i18n.t(
            "pdf.activityPlan.evaluation.criteria.lideranca.topic",
          ),
          description: i18n.t(
            "pdf.activityPlan.evaluation.criteria.lideranca.description",
          ),
          weight: "1",
        },
        {
          topic: i18n.t(
            "pdf.activityPlan.evaluation.criteria.relacionamento.topic",
          ),
          description: i18n.t(
            "pdf.activityPlan.evaluation.criteria.relacionamento.description",
          ),
          weight: "3",
        },
        {
          topic: i18n.t(
            "pdf.activityPlan.evaluation.criteria.dominioTeorico.topic",
          ),
          description: i18n.t(
            "pdf.activityPlan.evaluation.criteria.dominioTeorico.description",
          ),
          weight: "3",
        },
        {
          topic: i18n.t(
            "pdf.activityPlan.evaluation.criteria.iniciativa.topic",
          ),
          description: i18n.t(
            "pdf.activityPlan.evaluation.criteria.iniciativa.description",
          ),
          weight: "2",
        },
      ],
      text4: i18n.t("pdf.activityPlan.evaluation.text4"),
      text5: i18n.t("pdf.activityPlan.evaluation.text5"),
    },
    signatures: {
      title: i18n.t("pdf.activityPlan.signatures.title"),
      student: i18n.t("pdf.activityPlan.signatures.student"),
      supervisor: i18n.t("pdf.activityPlan.signatures.supervisor"),
      advisor: i18n.t("pdf.activityPlan.signatures.advisor"),
      coordinator: i18n.t("pdf.activityPlan.signatures.coordinator"),
      coordinatorNote: i18n.t("pdf.activityPlan.signatures.coordinatorNote"),
      fields: {
        field: i18n.t("pdf.activityPlan.signatures.fields.field"),
        ufpe: i18n.t("pdf.activityPlan.signatures.fields.ufpe"),
      },
    },
    footer: i18n.t("pdf.activityPlan.footer"),
  },
  report: {
    title: i18n.t("pdf.report.title"),
    toc: {
      title: i18n.t("pdf.report.tocTitle"),
      items: [
        { label: i18n.t("pdf.report.tocItems.identification"), page: 3 },
        { label: i18n.t("pdf.report.tocItems.introduction"), page: 4 },
        { label: i18n.t("pdf.report.tocItems.objectives"), page: 5 },
        {
          label: i18n.t("pdf.report.tocItems.generalObjectives"),
          page: 5,
          indent: true,
        },
        {
          label: i18n.t("pdf.report.tocItems.specificObjectives"),
          page: 5,
          indent: true,
        },
        { label: i18n.t("pdf.report.tocItems.schedule"), page: 6 },
        { label: i18n.t("pdf.report.tocItems.methodology"), page: 7 },
        { label: i18n.t("pdf.report.tocItems.development"), page: 8 },
        { label: i18n.t("pdf.report.tocItems.evaluation"), page: 9 },
        { label: i18n.t("pdf.report.tocItems.conclusion"), page: 10 },
      ],
    },
    sections: {
      identification: i18n.t("pdf.report.sections.identification"),
      introduction: i18n.t("pdf.report.sections.introduction"),
      objectives: i18n.t("pdf.report.sections.objectives"),
      generalObjectives: i18n.t("pdf.report.sections.generalObjectives"),
      specificObjectives: i18n.t("pdf.report.sections.specificObjectives"),
      schedule: i18n.t("pdf.report.sections.schedule"),
      methodology: i18n.t("pdf.report.sections.methodology"),
      development: i18n.t("pdf.report.sections.development"),
      evaluation: i18n.t("pdf.report.sections.evaluation"),
      conclusion: i18n.t("pdf.report.sections.conclusion"),
    },
    text: {
      specificObjectivesIntro: i18n.t(
        "pdf.report.text.specificObjectivesIntro",
      ),
      scheduleIntro: i18n.t("pdf.report.text.scheduleIntro"),
    },
    evaluationQuestions: i18n.t("pdf.report.evaluationQuestions", {
      returnObjects: true,
    }) as string[],
  },
  evaluationDocument: {
    supervisor: {
      title: i18n.t("pdf.evaluationDocument.supervisorTitle"),
      lastRowLabel: i18n.t("pdf.evaluationDocument.supervisorLastRow"),
      signatureLabel: i18n.t("pdf.evaluationDocument.supervisorSignature"),
    },
    advisor: {
      title: i18n.t("pdf.evaluationDocument.advisorTitle"),
      lastRowLabel: i18n.t("pdf.evaluationDocument.advisorLastRow"),
      signatureLabel: i18n.t("pdf.evaluationDocument.advisorSignature"),
    },
    shared: {
      subtitle: i18n.t("pdf.evaluationDocument.shared.subtitle"),
      sections: {
        identification: i18n.t(
          "pdf.evaluationDocument.shared.identification",
        ),
        evaluation: i18n.t("pdf.evaluationDocument.shared.evaluation"),
      },
      intro: i18n.t("pdf.evaluationDocument.shared.intro"),
      criteria: [
        {
          key: "communication",
          label: i18n.t(
            "pdf.evaluationDocument.shared.criteria.communication",
          ),
        },
        {
          key: "attendance",
          label: i18n.t("pdf.evaluationDocument.shared.criteria.attendance"),
        },
        {
          key: "cooperation",
          label: i18n.t("pdf.evaluationDocument.shared.criteria.cooperation"),
        },
        {
          key: "independence",
          label: i18n.t(
            "pdf.evaluationDocument.shared.criteria.independence",
          ),
        },
        {
          key: "knowledgeLevel",
          label: i18n.t(
            "pdf.evaluationDocument.shared.criteria.knowledgeLevel",
          ),
        },
        {
          key: "overallPerformance",
          label: i18n.t(
            "pdf.evaluationDocument.shared.criteria.overallPerformance",
          ),
        },
      ],
      comments: {
        title: i18n.t("pdf.evaluationDocument.shared.commentsTitle"),
      },
      datePrefix: i18n.t("pdf.evaluationDocument.shared.datePrefix"),
    },
  },
});

export const PDF_CONTENT = new Proxy({} as ReturnType<typeof getPdfContent>, {
  get(_target, prop: keyof ReturnType<typeof getPdfContent>) {
    return getPdfContent()[prop];
  },
});
