export interface ValidatedAnswer {
  isCorrect: boolean
  feedback: string
  expectedExplanation?: string
}

// ─── Answer key: maps quest IDs to expected answers ─────────────────────────

const answerKey: Record<string, { answer: string; explanation: string }> = {
  // Module 1: Intro to Data Analytics
  "q-task-1-1-1a": {
    answer: "weather app temperature, grocery receipt prices, social media likes, step counter, email inbox",
    explanation: "Good data sources include anything that collects facts: weather apps (temperature), receipts (prices), social media (engagement), fitness trackers (steps), and email (communication patterns).",
  },
  "q-task-1-1-1b": {
    answer: "raw data: temperature 72, customer id 4521, product weight 2.5kg. information: average temperature 68, total sales 50k",
    explanation: "Raw data is unprocessed individual facts. Information is data that has been processed, organized, and given context to make it meaningful.",
  },
  "q-task-1-1-2a": {
    answer: "customer satisfaction: ordinal. page load time: continuous. department: nominal. monthly revenue: time-series. shoe sizes: discrete",
    explanation: "Ordinal has ordered categories, continuous has infinite values, nominal is named categories, time-series is ordered by time, discrete is countable whole numbers.",
  },
  "q-task-1-1-2b": {
    answer: "blood type: nominal. heart rate: continuous. admission date: time-series. bed number: discrete. pain level: ordinal. insurance: nominal",
    explanation: "Blood type and insurance are categories with no order. Heart rate has continuous values. Admission date is time-ordered. Bed numbers are countable. Pain level has a meaningful order.",
  },
  "q-task-1-1-3a": {
    answer: "ask: why are dropouts increasing. collect: enrollment and graduation data. clean: remove duplicates. analyze: find patterns. interpret: identify causes. present: recommend solutions",
    explanation: "The six-step framework: Ask (define problem), Collect (gather data), Clean (prepare data), Analyze (find patterns), Interpret (draw conclusions), Present (communicate insights).",
  },

  // Module 2: Business Thinking
  "q-task-1-2-1a": {
    answer: "customer happiness: customer satisfaction score nps. operational costs: cost per unit. market share: market share percentage. product quality: defect rate. employee productivity: revenue per employee",
    explanation: "Each KPI directly measures the specific goal: CSAT/NPS for happiness, cost metrics for efficiency, market share for growth, quality metrics for product improvement, and productivity metrics for employee output.",
  },
  "q-task-1-2-1b": {
    answer: "monthly recurring revenue: lagging. sales calls made: leading. customer satisfaction: lagging. training hours: leading. annual profit: lagging",
    explanation: "Leading indicators predict future performance (sales calls, training). Lagging indicators show past results (revenue, satisfaction, profit).",
  },
  "q-task-1-2-2a": {
    answer: "goal: improve customer satisfaction. objective: reduce response time. kpi: average response time. metric: hours to first response. data point: timestamp of each ticket",
    explanation: "The hierarchy flows from broad goal → measurable objective → tracked KPI → specific metric → individual data point.",
  },
  "q-task-1-2-2b": {
    answer: "website visits: vanity. conversion rate: actionable. social followers: vanity. revenue per customer: actionable. app downloads: vanity. daily active users: actionable",
    explanation: "Vanity metrics look good but don't drive decisions (visits, followers, downloads). Actionable metrics directly inform business decisions (conversion, revenue, engagement).",
  },
  "q-task-1-2-3a": {
    answer: "ceo: one paragraph with impact. support manager: detailed process. data team: technical methodology",
    explanation: "Tailor communication to audience: executives want bottom-line impact, managers need actionable details, technical teams require methodology.",
  },
  "q-task-1-2-3b": {
    answer: "sales dropped 12 percent in q3 driven by 18-25 age group. competitor launched student discount. recommend student pricing",
    explanation: "A good executive summary states the finding, the cause, and the recommendation in 3-4 concise sentences.",
  },

  // Module 3: Problem Solving
  "q-task-1-3-1a": {
    answer: "customer service: average response time is 48 hours exceeding 24 hour target. website: page load time is 4.2 seconds exceeding 2 second benchmark. morale: employee satisfaction score dropped 15 percent. marketing: conversion rate declined 2 percent. product: return rate increased 5 percent",
    explanation: "Good problem definitions are specific and measurable. 'Bad' is vague — '48 hours vs 24 hour target' is actionable.",
  },
  "q-task-1-3-1b": {
    answer: "hypothesis 1: price increase caused drop. data: pricing change dates. hypothesis 2: new competitor entered market. data: competitor analysis. hypothesis 3: seasonal decline. data: historical trends. hypothesis 4: poor service. data: satisfaction scores",
    explanation: "Each hypothesis should be testable with data. Good hypotheses identify specific causes that can be confirmed or ruled out with evidence.",
  },
  "q-task-1-3-2a": {
    answer: "1: survivorship bias. 2: anchoring. 3: confirmation bias. 4: overconfidence bias",
    explanation: "Survivorship bias focuses only on successes. Anchoring over-relies on initial information. Confirmation bias seeks confirming evidence. Overconfidence dismisses contrary opinions.",
  },
  "q-task-1-3-2b": {
    answer: "create matrix with cost features ease-of-use support columns. score each 1-5. highest total wins",
    explanation: "A decision matrix systematically compares options across multiple criteria. Weight criteria by importance and score each option to find the best choice.",
  },
  "q-task-1-3-3a": {
    answer: "1: third factor summer. 2: education causes salary. 3: exercise causes health. 4: third factor age",
    explanation: "Ice cream and sunburn both increase in summer (confounding). Education improves skills (direct causation). Exercise improves health (direct). Shoe size and reading correlate with age in children (confounding).",
  },
  "q-task-1-3-3b": {
    answer: "sample size. funding source. methodology. response bias. definition of recommend",
    explanation: "Critical questions: Who was surveyed? Who funded it? How was data collected? Were responses biased? How was 'recommend' defined?",
  },

  // Module 4: Dashboards & Reporting
  "q-task-1-4-1a": {
    answer: "1: revenue grew 15 percent in 2024 driven by enterprise segment. 2: satisfaction is highest in north region but declining. 3: turnover rate increased 3 percent among junior staff. 4: organic search is top traffic source at 45 percent. 5: electronics category leads returns at 8 percent",
    explanation: "Insight titles state the conclusion, not just describe the data. 'Monthly Revenue 2024' becomes 'Revenue grew 15% in 2024 driven by Enterprise segment.'",
  },
  "q-task-1-4-1b": {
    answer: "setting: company satisfaction is 72 out of 100. conflict: support department is lowest at 58 with high overtime. resolution: hire temporary support staff and recruit new manager",
    explanation: "The story arc: Setting (current state), Conflict (the problem), Resolution (recommended action). Each element builds on the previous.",
  },
  "q-task-1-4-2a": {
    answer: "hospital: operational daily census bed occupancy. ceo: strategic quarterly revenue growth. marketer: analytical campaign roi. warehouse: operational shipments per hour",
    explanation: "Operational dashboards monitor daily operations. Strategic dashboards track long-term goals. Analytical dashboards enable deep exploration.",
  },
  "q-task-1-4-2b": {
    answer: "1: bar chart. 2: line chart. 3: pie chart. 4: scatter plot. 5: histogram",
    explanation: "Bar charts compare categories. Line charts show trends over time. Pie charts show composition. Scatter plots reveal relationships. Histograms show distributions.",
  },
  "q-task-1-4-3a": {
    answer: "users who don't engage in first 7 days have 80 percent churn. recommend an onboarding sequence within the first week",
    explanation: "An executive summary should state the key finding and the recommended action in 2-3 sentences. Lead with the insight, follow with the recommendation.",
  },
  "q-task-1-4-3b": {
    answer: "executive summary. introduction. findings. detailed analysis. recommendations. appendix",
    explanation: "Standard report structure: Executive Summary (key takeaways), Introduction (context), Findings (main results), Detailed Analysis (deep dive), Recommendations (action items), Appendix (supporting data).",
  },
}

// ─── Multiple choice ────────────────────────────────────────────────────────

const multipleChoiceKey: Record<string, number> = {
  "q-task-1-2-1b": 1, // leading vs lagging: sales calls → leading (index 1)
  "q-task-1-3-3a": 0, // ice cream: third factor (index 0)
}

// ─── Validation ──────────────────────────────────────────────────────────────

export function validateAnswer(
  questId: string,
  answer: string,
  questType: "text" | "multiple_choice" | "code" = "text"
): ValidatedAnswer {
  const expected = answerKey[questId]

  if (questType === "multiple_choice") {
    const correctIdx = multipleChoiceKey[questId]
    if (correctIdx === undefined) {
      return { isCorrect: true, feedback: "Quest completed!", expectedExplanation: undefined }
    }
    const isCorrect = parseInt(answer) === correctIdx
    return {
      isCorrect,
      feedback: isCorrect
        ? "Correct!"
        : "Not quite right. Think about it and try again.",
      expectedExplanation: isCorrect ? undefined : expected?.explanation,
    }
  }

  if (!expected) {
    // No answer key entry — mark as correct (auto-complete)
    return { isCorrect: true, feedback: "Quest completed!", expectedExplanation: undefined }
  }

  const normalizedAnswer = answer.toLowerCase().trim()
  const normalizedExpected = expected.answer.toLowerCase()

  // Check for keyword overlap
  const answerWords = normalizedAnswer.split(/\s+/)
  const expectedWords = normalizedExpected.split(/\s+/)
  const significantWords = expectedWords.filter((w) => w.length > 3)
  const matches = significantWords.filter((w) => normalizedAnswer.includes(w))

  const matchRatio = significantWords.length > 0 ? matches.length / significantWords.length : 0
  const isCorrect = matchRatio >= 0.4 || normalizedAnswer.length >= 20

  return {
    isCorrect,
    feedback: isCorrect
      ? "Correct! Great analysis."
      : "Not quite right. Review the lesson material and try again.",
    expectedExplanation: isCorrect ? undefined : expected.explanation,
  }
}
