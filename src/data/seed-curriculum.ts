import type { Phase, Quest } from "@/types/curriculum"

// ─── QUEST HELPER ────────────────────────────────────────────────────────────

export function q(
  topicId: string, id: string, title: string, description: string,
  type: "task" | "project" | "boss_fight",
  instructions: string, xp_reward: number, difficulty: "easy" | "medium" | "hard",
  practiceType?: "sql" | "python" | "excel"
): Quest {
  return { id, topic_id: topicId, title, description, type, instructions, xp_reward, difficulty, practiceType }
}

// ─── TOPIC HELPER ────────────────────────────────────────────────────────────

export function makeTopic(
  moduleId: string, id: string, title: string, lesson: string,
  order: number, xp: number, level: number, quests: Quest[]
) {
  return { id, module_id: moduleId, title, lesson_content: lesson, order_index: order, xp_reward: xp, unlock_level: level, quests }
}

// ─── PHASE, MODULE, TOPIC IDS ───────────────────────────────────────────────

const P1 = "phase-1"
const M1 = "mod-1-1", M2 = "mod-1-2", M3 = "mod-1-3", M4 = "mod-1-4"

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 1 — Data & Business Foundations
// Module 1: Introduction to Data Analytics
// ─────────────────────────────────────────────────────────────────────────────

const T1_1_1 = makeTopic(M1, "topic-1-1-1", "What is Data?", `## What is Data?

Data is raw, unprocessed facts and figures collected from the world around us. It is the foundation of every analytics process.

### Simple Explanation
Think of data as digital LEGO bricks. Each brick by itself is just a single piece — a number, a word, a reading. When you connect them together in a meaningful way, you build something valuable: information, insights, and decisions.

**Examples of data you encounter daily:**
- Your morning coffee price ($4.50)
- Steps recorded by your phone (8,342)
- Customer reviews (4 out of 5 stars)
- Bus arrival times (7:15 AM)

### Real-World Example
Netflix collects data on what you watch, when you pause, what you search for, and even what thumbnail you click. They use this raw data to recommend shows, decide which new series to produce, and personalize your entire experience.

### Key Insights
- Data without context is meaningless
- Quality matters more than quantity
- Data is only valuable when it leads to action
- Every business decision starts with data`, 1, 50, 1, [
  q("topic-1-1-1", "q-task-1-1-1a", "Identify Data Sources", "Find 5 sources of data around you", "task", "List 5 data sources you interact with daily (e.g., weather app, grocery receipt). For each source, write one sentence describing what data it provides and how it could be useful to a business.", 15, "easy"),
  q("topic-1-1-1", "q-task-1-1-1b", "Data vs Information", "Distinguish raw data from meaningful information", "task", "Given these items, classify each as 'Raw Data' or 'Information': (1) Temperature reading 72°F, (2) Average temperature this week is 68°F, (3) Customer ID #4521, (4) Total sales Q1 = $50K, (5) Product weight 2.5kg. Explain your reasoning for each.", 20, "easy"),
  q("topic-1-1-1", "q-proj-1-1-1", "Data Collection Log", "Create a personal data collection journal", "project", "Spend one hour observing your environment (cafe, park, office). Record at least 15 different data points you observe. Organize them into categories (numerical, categorical, time-based). Write a short paragraph about what insights a business could gain from this data.", 40, "medium"),
  q("topic-1-1-1", "q-boss-1-1-1", "Data Detective Challenge", "Analyze a real dataset scenario", "boss_fight", "Scenario: A coffee shop wants to understand its customers better. They have recorded: (1) 150 customers per day on average, (2) Most popular drink is latte (40% of orders), (3) Peak hour is 8-9 AM, (4) Average spend is $5.75 per customer. Write a brief analysis: What business decisions could this data support? What additional data would you recommend collecting? Your answer should be at least 3 paragraphs.", 75, "hard"),
])

const T1_1_2 = makeTopic(M1, "topic-1-1-2", "Types of Data", `## Types of Data

Understanding data types is critical because each type requires different analysis techniques.

### Simple Explanation
Data comes in different flavors, just like ice cream. Knowing which flavor you're working with tells you how to handle it, what tools to use, and what conclusions you can draw.

### The Main Categories
**1. Quantitative (Numerical) Data** — Numbers you can do math with.
- *Discrete*: Countable whole numbers (e.g., number of products sold: 5, 12, 30)
- *Continuous*: Any value within a range (e.g., temperature: 72.3°F, height: 5.9 ft)

**2. Qualitative (Categorical) Data** — Categories and labels.
- *Nominal*: Named categories without order (e.g., colors: red, blue, green)
- *Ordinal*: Categories with a meaningful order (e.g., ratings: poor, good, excellent)

**3. Time-Series Data** — Data points collected over time (e.g., stock prices, website traffic hourly)

### Real-World Example
An e-commerce store collects: product category (nominal), customer rating 1-5 (ordinal), price in dollars (continuous), number of items purchased (discrete), and time of purchase (time-series). Each type tells a different story.

### Key Insights
- The type of data determines which analysis method to use
- Mixing up data types leads to incorrect conclusions
- Most real-world datasets contain multiple data types
- Always identify your data types before starting analysis`, 2, 50, 1, [
  q("topic-1-1-2", "q-task-1-1-2a", "Categorize Data Types", "Classify different data examples", "task", "For each item, identify whether it is: Discrete, Continuous, Nominal, Ordinal, or Time-Series: (1) Customer satisfaction rating (1-5), (2) Website page load time (ms), (3) Employee department, (4) Monthly revenue 2024, (5) Shoe sizes (7, 8, 9, 10). Explain each classification.", 15, "easy"),
  q("topic-1-1-2", "q-task-1-1-2b", "Data Type Sorting", "Sort data into the correct categories", "task", "You work at a hospital. Sort these data points into the correct type: patient blood type, heart rate (bpm), admission date, bed number, pain level (1-10), insurance provider. Create a table with columns: Data Point, Type, and Why.", 20, "easy"),
  q("topic-1-1-2", "q-proj-1-1-2", "Real-World Data Classification", "Analyze a real dataset schema", "project", "Find any dataset online (Kaggle, data.gov, or a spreadsheet you use). Copy 10 column headers and classify each column's data type. For each column, explain: (1) What type it is, (2) What analysis you could do with it, (3) What chart type would visualize it best.", 40, "medium"),
  q("topic-1-1-2", "q-boss-1-1-2", "Data Type Master Quiz", "Solve complex data type scenarios", "boss_fight", "Challenge: A streaming service collects: user ID, subscription plan (Basic/Standard/Premium), monthly watch hours, genre preferences, device type, rating given (1-5), time spent browsing, age of user. For each: (1) Classify the data type, (2) Explain the best way to analyze it, (3) Describe one insight it could reveal.", 75, "hard"),
])

const T1_1_3 = makeTopic(M1, "topic-1-1-3", "The Data Analytics Process", `## The Data Analytics Process

Analytics follows a structured process that turns raw data into actionable insights.

### Simple Explanation
Analytics is like cooking. You start with ingredients (raw data), prepare them (clean), follow a recipe (method), taste and adjust (analyze), then serve the dish (present insights).

### The Six-Step Framework
1. **Ask & Define** — What problem are you solving?
2. **Collect & Prepare** — Gather and clean data
3. **Explore & Transform** — Look for patterns
4. **Analyze** — Apply statistical methods
5. **Interpret** — What do the results mean?
6. **Communicate** — Present findings

### Real-World Example
A retail chain noticed declining sales. Step 1: "Why are sales dropping?" Step 2: Collected sales, foot traffic, and competitor pricing. Step 3: Found sales dropped most on weekends. Step 4: Analyzed correlation with competitor promotions. Step 5: Competitor discounts were pulling customers. Step 6: Recommended loyalty program for weekends.

### Key Insights
- Skip steps and you get bad results
- Most time is spent on data preparation (~80%)
- The process is iterative, not linear
- Always start with the question, not the data`, 3, 75, 1, [
  q("topic-1-1-3", "q-task-1-1-3a", "Map the Process", "Apply the six-step framework", "task", "Scenario: A university wants to understand why student dropout rates increased 15%. Write 1-2 sentences per step describing what action you would take in the analytics process.", 15, "easy"),
  q("topic-1-1-3", "q-project-1-1-3", "Process Analysis Report", "Document a full analytics workflow", "project", "Choose a real business problem (restaurant wanting to increase tips, gym retaining members). Write a 400-word report following the six-step framework. Include specific techniques at each step and what success looks like.", 40, "medium"),
  q("topic-1-1-3", "q-boss-1-1-3", "Process Flow Challenge", "Design a complete analytics workflow", "boss_fight", "An e-commerce company has 30% cart abandonment. The CEO wants to reduce it by 10% in 3 months. Design a workflow: (1) Questions to answer, (2) Data sources, (3) Cleaning steps, (4) Analysis methods, (5) Validation approach, (6) Presentation format. Be thorough.", 100, "hard"),
])

// ─────────────────────────────────────────────────────────────────────────────
// Module 2: Business Thinking for Analysts
// ─────────────────────────────────────────────────────────────────────────────

const T1_2_1 = makeTopic(M2, "topic-1-2-1", "KPIs in Business", `## KPIs in Business

Key Performance Indicators (KPIs) are measurable values that show how effectively a company is achieving its key business objectives.

### Simple Explanation
KPIs are like your car's dashboard. Speed (immediate action), fuel gauge (mid-term planning), odometer (long-term tracking). Businesses use KPIs the same way.

### Common Business KPIs
- **Revenue Growth** — % increase in revenue over time
- **Customer Acquisition Cost (CAC)** — Cost to gain one new customer
- **Customer Lifetime Value (CLV)** — Revenue from a customer over their relationship
- **Net Promoter Score (NPS)** — How likely customers recommend you
- **Churn Rate** — % of customers who stop using your service
- **Conversion Rate** — % of visitors who take desired action

### Real-World Example
Spotify tracks: Monthly Active Users (growth), Premium Conversion Rate (monetization), Churn Rate (retention), Daily Active Users (engagement). Each drives specific decisions like marketing spend or feature development.

### Key Insights
- Good KPIs are specific, measurable, and actionable
- Leading KPIs predict future performance (e.g., sales pipeline)
- Lagging KPIs show past results (e.g., quarterly revenue)
- Too many KPIs is as bad as too few`, 1, 50, 2, [
  q("topic-1-2-1", "q-task-1-2-1a", "Identify Key KPIs", "Match KPIs to business goals", "task", "For each business goal, suggest the best KPI: (1) Increase customer happiness, (2) Reduce operational costs, (3) Grow market share, (4) Improve product quality, (5) Boost employee productivity. Explain why.", 15, "easy", "sql"),
  q("topic-1-2-1", "q-task-1-2-1b", "Leading vs Lagging KPIs", "Categorize KPIs by type", "task", "Classify each as Leading or Lagging: (1) Monthly recurring revenue, (2) Number of sales calls made, (3) Customer satisfaction score, (4) Employee training hours, (5) Annual profit. Explain.", 20, "easy"),
  q("topic-1-2-1", "q-proj-1-2-1", "KPI Dashboard Design", "Design a KPI dashboard for a business", "project", "Choose a business you know. Design a one-page KPI dashboard with 5-7 KPIs. For each: name, definition, target, frequency, and action if off-target.", 40, "medium"),
  q("topic-1-2-1", "q-boss-1-2-1", "KPI Strategy Challenge", "Build a complete KPI framework", "boss_fight", "You're analytics lead for a food delivery startup launching in 3 months. Design KPIs for: (1) Launch phase (5 KPIs), (2) Growth phase months 4-12 (5 KPIs), (3) Maturity year 2+ (5 KPIs). Each: name, formula, target, frequency, decision driven.", 75, "hard"),
])

const T1_2_2 = makeTopic(M2, "topic-1-2-2", "Business Metrics & Measurement", `## Business Metrics & Measurement

Metrics turn abstract business goals into concrete, trackable numbers.

### Simple Explanation
If KPIs are your dashboard, metrics are the sensors feeding data into it. Metrics are raw measurements; KPIs are critical metrics tied to strategy.

### The Metric Hierarchy
**Goal → Objective → KPI → Metric → Data Point**

Example: "Increase profitability" → "Reduce operating costs by 15%" → "Operating margin %" → "Monthly utility costs" → "$4,532"

### Categories of Metrics
- **Financial**: Revenue, profit, ROI, cash flow
- **Customer**: Satisfaction, retention, acquisition
- **Process**: Cycle time, error rate, throughput
- **People**: Turnover, productivity, satisfaction

### Real-World Example
Amazon tracks: order defect rate (quality), inventory turnover (efficiency), contact rate (customer experience), revenue per employee (productivity). Each has an owner, target, and review cadence.

### Key Insights
- Not everything that counts can be counted
- Metrics should drive action, not just reporting
- Vanity metrics look good but don't drive decisions
- A metric without a target is just a number`, 2, 75, 2, [
  q("topic-1-2-2", "q-task-1-2-2a", "Metric Hierarchy Exercise", "Build from goal to data point", "task", "Take 'Improve customer satisfaction' and build: Goal → Objective → KPI → Metric → Data Point. Create two different branches.", 15, "easy"),
  q("topic-1-2-2", "q-task-1-2-2b", "Vanity vs Actionable Metrics", "Distinguish useful from misleading", "task", "Classify as Vanity or Actionable: (1) Total website visits, (2) Conversion rate, (3) Social media followers, (4) Revenue per customer, (5) App downloads, (6) Daily active users. Explain.", 20, "easy"),
  q("topic-1-2-2", "q-proj-1-2-2", "Business Metric Audit", "Audit a real company's metrics", "project", "Choose a public company. Research 3 metrics they likely track. For each: define it, find/estimate current value, explain connection to strategy, suggest improvement action.", 40, "medium"),
  q("topic-1-2-2", "q-boss-1-2-2", "Metrics System Design", "Design a complete measurement system", "boss_fight", "A fitness app with 10K users wants to double in 6 months. Design: (1) 3 financial metrics, (2) 3 customer metrics, (3) 3 process metrics. Each: name, formula, target, frequency, source, decision supported.", 75, "hard"),
])

const T1_2_3 = makeTopic(M2, "topic-1-2-3", "Stakeholder Communication", `## Stakeholder Communication

An analyst's insights are only valuable if understood and acted upon.

### Simple Explanation
You can build the best analysis, but if you can't explain it to decision-makers, it's worthless. You're a translator: you speak 'data', stakeholders speak 'business'. Bridge the gap.

### The Communication Framework
1. **Know Your Audience** — Executives want bottom line; Managers want details; Technical teams want methodology
2. **Structure Your Message** — Conclusion first, evidence second, action third
3. **Choose the Right Format** — Dashboard (monitoring), Report (analysis), Presentation (decisions)

### Real-World Example
When Airbnb analysts found professional photos increased bookings by 40%, they didn't send a spreadsheet. They said: "Professional photography will increase revenue" (conclusion), showed 40% lift (evidence), recommended a free program (action). The CEO approved immediately.

### Key Insights
- Tailor communication to the audience
- A chart is worth a thousand rows of data
- Always lead with insight, not process
- The best analysis leads to action`, 3, 75, 2, [
  q("topic-1-2-3", "q-task-1-2-3a", "Audience Analysis", "Adapt a message for different audiences", "task", "Customer churn is increasing due to slow support. Write the same insight for: (1) CEO (one paragraph), (2) Support Manager, (3) Data Team. Use appropriate language and detail.", 15, "easy"),
  q("topic-1-2-3", "q-task-1-2-3b", "Executive Summary", "Write a concise executive summary", "task", "Data: Sales dropped 12% in Q3. Decline is in 18-25 age group. Competitor launched student discount. Our social engagement down 30% in this demo. Write a 4-sentence summary with conclusion, evidence, recommendation.", 20, "easy"),
  q("topic-1-2-3", "q-proj-1-2-3", "Stakeholder Presentation", "Create a mini-presentation", "project", "Choose a topic where data informs a decision. Create a 5-slide structure: (1) Question, (2) Key Data, (3) Analysis, (4) Insights, (5) Recommendations. Write content for each slide.", 40, "medium"),
  q("topic-1-2-3", "q-boss-1-2-3", "Communication Crisis Simulation", "Handle a real stakeholder challenge", "boss_fight", "You discover a critical error in a report sent to the VP of Marketing last week — it made the campaign look 3x more effective. Write: (1) Email owning the error, (2) Revised one-page summary, (3) Process improvement plan.", 100, "hard"),
])

// ─────────────────────────────────────────────────────────────────────────────
// Module 3: Problem Solving & Analytical Thinking
// ─────────────────────────────────────────────────────────────────────────────

const T1_3_1 = makeTopic(M3, "topic-1-3-1", "Structured Problem Solving", `## Structured Problem Solving

Great analysts don't just find answers — they ask the right questions systematically.

### Simple Explanation
When your GPS gives wrong directions, you don't drive randomly. You: identify the problem, diagnose why, find a solution, verify. Structured problem solving is the same approach applied to business.

### The Framework
1. **Define the Problem** — Be specific. "Sales declining" is vague. "Q4 Midwest sales down 8% YoY" is specific.
2. **Break It Down** — Use MECE (Mutually Exclusive, Collectively Exhaustive)
3. **Generate Hypotheses** — Testable statements about possible causes
4. **Gather & Analyze Data** — Test each hypothesis
5. **Recommend & Act** — Based on evidence, recommend action

### Real-World Example
Uber noticed rising cancellations. They defined precisely, broke down (driver behavior? pricing? wait times?), hypothesized wait times, confirmed with data, and implemented driver incentives.

### Key Insights
- A well-defined problem is half-solved
- Avoid jumping to conclusions without evidence
- Use data to test, not to confirm biases
- Structure prevents missing important factors`, 1, 50, 3, [
  q("topic-1-3-1", "q-task-1-3-1a", "Problem Definition", "Practice defining problems specifically", "task", "Rewrite as specific statements with metrics: (1) 'Customer service is bad', (2) 'Our website is slow', (3) 'Employee morale is low', (4) 'Marketing isn't working', (5) 'Product needs improvement'.", 15, "easy"),
  q("topic-1-3-1", "q-task-1-3-1b", "Hypothesis Generation", "Generate testable hypotheses", "task", "'Gym membership renewals dropped 20% this quarter.' Generate 4 testable hypotheses. For each: hypothesis, data needed, what confirms it.", 20, "easy"),
  q("topic-1-3-1", "q-proj-1-3-1", "Problem Structure Analysis", "Apply framework to a real scenario", "project", "Choose a problem at a business you frequent (restaurant wait times, grocery checkout). Apply the framework: define, break down, 3 hypotheses, data needed, expected recommendation. 400 words.", 40, "medium"),
  q("topic-1-3-1", "q-boss-1-3-1", "MECE Framework Challenge", "Build a complete MECE breakdown", "boss_fight", "A ride-sharing company's revenue dropped 15%. Revenue = Rides × Fare. Break each branch down using MECE (3+ levels). For each leaf node, suggest a data source. Present as structured tree.", 75, "hard"),
])

const T1_3_2 = makeTopic(M3, "topic-1-3-2", "Data-Driven Decision Making", `## Data-Driven Decision Making

Making decisions based on evidence rather than intuition or tradition.

### Simple Explanation
Restaurant A: "Let's serve what the owner likes." Restaurant B: "Check last year's sales, reviews, and trends." Restaurant B makes better decisions because they're guided by evidence.

### The Decision Framework
1. **Identify the Decision** — What choice needs to be made?
2. **Gather Relevant Data** — Historical, market research, A/B tests
3. **Analyze & Quantify** — Estimate outcomes statistically
4. **Consider Trade-offs** — Every decision has trade-offs
5. **Decide & Measure** — Track results to validate

### Common Pitfalls
- **Confirmation Bias**: Seeking data that confirms beliefs
- **Anchoring**: Over-relying on first information
- **Survivorship Bias**: Only looking at successes

### Real-World Example
Netflix spent $100M on 'House of Cards' based on data: users who watched the UK version also watched Fincher films and Spacey movies. The intersection predicted success.

### Key Insights
- Data reduces risk but doesn't eliminate uncertainty
- Combine data with domain expertise
- Always consider what data isn't telling you
- Measure outcomes to improve future decisions`, 2, 75, 3, [
  q("topic-1-3-2", "q-task-1-3-2a", "Bias Identification", "Recognize cognitive biases", "task", "Identify the bias: (1) Manager only studies successful companies, (2) Team bases budget on last year's number, (3) Executive interprets data to support preferred plan, (4) Team ignores customer surveys 'we know better'.", 15, "easy"),
  q("topic-1-3-2", "q-task-1-3-2b", "Decision Matrix", "Build a decision matrix", "task", "Choose between 3 analytics tools: Free/basic, $50/good, $200/advanced. Create a matrix with Cost, Features, Ease of Use, Support. Score 1-5 each, recommend one.", 20, "easy"),
  q("topic-1-3-2", "q-proj-1-3-2", "A/B Test Design", "Design an A/B test", "project", "A SaaS company wants more sign-ups. Options: (1) Shorter form, (2) Free trial, (3) Testimonials. Design a test: what to test first, duration, sample size, success metric, threats to validity.", 40, "medium", "python"),
  q("topic-1-3-2", "q-boss-1-3-2", "Strategic Decision Analysis", "Make a data-driven recommendation", "boss_fight", "Retailer: $500K on e-commerce OR $300K on store renovations. Data: online = 20% of sales (growing 30% YoY), in-store = 80% (declining 5%). CAC: online $25, in-store $80. AOV: online $45, in-store $65. Write a comprehensive recommendation with reasoning.", 100, "hard"),
])

const T1_3_3 = makeTopic(M3, "topic-1-3-3", "Critical Thinking for Analysts", `## Critical Thinking for Analysts

The ability to question assumptions, evaluate evidence, and form well-reasoned conclusions.

### Simple Explanation
If regular thinking is driving, critical thinking is being a mechanic. You don't just accept the car moves — you understand how and check for problems.

### The Critical Thinking Toolkit
1. **Question Everything** — What's the source? How collected? What's missing? What assumptions?
2. **Alternative Explanations** — For every pattern, think of 2-3 other causes
3. **Correlation ≠ Causation** — Ice cream sales and drownings both increase in summer
4. **Consider Counterarguments** — What would someone who disagrees say?

### Real-World Example
A retailer found stores with red signage had lower sales. Recommendation: change to blue. Critical question: "Are red-signage stores in lower-traffic areas?" Yes — color was irrelevant.

### Key Insights
- The obvious answer is often wrong
- Always ask: "What else explains this?"
- Numbers can lie — check the methodology
- Strong conclusions require strong evidence`, 3, 75, 3, [
  q("topic-1-3-3", "q-task-1-3-3a", "Correlation vs Causation", "Identify spurious correlations", "task", "For each: does A cause B, B cause A, or third factor? (1) Ice cream ↑, sunburn ↑, (2) Education ↑, salary ↑, (3) Exercise ↑, health ↑, (4) Shoe size ↑, reading ability ↑ (children). Explain.", 15, "easy"),
  q("topic-1-3-3", "q-task-1-3-3b", "Question the Source", "Evaluate data quality", "task", "'90% of dentists recommend Brand X.' List 5 critical questions about this claim. Consider sample, funding, methodology, bias.", 20, "easy"),
  q("topic-1-3-3", "q-proj-1-3-3", "Critical Analysis Report", "Analyze a data claim", "project", "Find a data-driven claim in news. Write 400 words: (1) The claim, (2) Supporting data, (3) Questions to ask, (4) Alternative explanations, (5) Is conclusion justified?", 40, "medium"),
  q("topic-1-3-3", "q-boss-1-3-3", "Critical Thinking Case Study", "Solve a complex analytical puzzle", "boss_fight", "Bank: mobile banking users have 40% higher balances. Marketing wants ad: 'Use mobile banking to grow savings!' Task: (1) List 3 alternative explanations, (2) Design study to find real relationship, (3) Analyze ethical implications, (4) Write recommendation to marketing. 500 words.", 100, "hard"),
])

// ─────────────────────────────────────────────────────────────────────────────
// Module 4: Dashboards & Reporting
// ─────────────────────────────────────────────────────────────────────────────

const T1_4_1 = makeTopic(M4, "topic-1-4-1", "Data Storytelling", `## Data Storytelling

The art of combining data, narrative, and visuals to communicate insights compellingly.

### Simple Explanation
A spreadsheet is a pile of LEGO pieces. Data storytelling builds them into something meaningful. You're not just showing data — you're telling a story.

### The Three Elements
1. **Data** — The facts (the 'what')
2. **Narrative** — The context (the 'why')
3. **Visuals** — The charts (the 'how')

### The Story Arc
- **Setting**: Current situation
- **Conflict**: The problem or opportunity
- **Resolution**: Insight and recommendation

### Real-World Example
"Our subscription business is healthy (setting), but we're losing 30% of customers in first 90 days (conflict). These customers never used onboarding. We recommend a mandatory 15-minute call (resolution)."

### Best Practices
- One chart, one message
- Titles should state the insight, not describe the chart
- Guide the audience through the story
- If you need to explain the chart, redesign it

### Key Insights
- People remember stories, not spreadsheets
- Context makes numbers meaningful
- Good storytelling drives action`, 1, 50, 3, [
  q("topic-1-4-1", "q-task-1-4-1a", "Insight Titles", "Turn descriptions into insight titles", "task", "Rewrite: (1) 'Monthly Revenue 2024', (2) 'Customer Satisfaction by Region', (3) 'Employee Turnover Rate', (4) 'Website Traffic Sources', (5) 'Product Returns by Category'. Each should state what to conclude.", 15, "easy"),
  q("topic-1-4-1", "q-task-1-4-1b", "Story Arc Builder", "Structure findings into narrative", "task", "Findings: 'Satisfaction score 72/100. Support dept lowest at 58. Support has 40% overtime vs 15% avg. Support manager resigned 3 months ago.' Structure as Setting, Conflict, Resolution.", 20, "easy"),
  q("topic-1-4-1", "q-proj-1-4-1", "Data Story Script", "Write a 2-minute story", "project", "Write a 300-word data story for leadership. Include: context, data points, insight, recommendation. Describe what visual accompanies each part.", 40, "medium"),
  q("topic-1-4-1", "q-boss-1-4-1", "Storytelling Presentation", "Create a story-driven presentation", "boss_fight", "E-commerce CEO presentation: AOV=$45, cart abandonment=70%, email open=25%, click=5%, recovered carts=15%. Create story: hook, situation, opportunity, recommendation, call to action. 500 words.", 75, "hard"),
])

const T1_4_2 = makeTopic(M4, "topic-1-4-2", "Dashboard Design Principles", `## Dashboard Design Principles

A visual display of the most important information needed to achieve objectives, on a single screen.

### Simple Explanation
A good dashboard is a cockpit. The pilot needs critical info organized logically: speed, altitude, fuel, direction always prominent. Everything else is secondary.

### Key Principles
1. **Know Your User** — Strategic (executives), Operational (managers), Analytical (analysts)
2. **Organize for Scanning** — Most important at top-left. Group related items.
3. **Choose Right Chart** — Line (trends), Bar (comparisons), Pie (composition), Scatter (relationships)
4. **Minimize Clutter** — Remove gridlines when unnecessary. Use color purposefully.

### Real-World Example
Emergency room dashboard: wait time (big, red if >30min), patients waiting, available beds, avg treatment time — all on one screen, updated real-time.

### Key Insights
- A dashboard should answer questions within 5 seconds
- Design for lowest common denominator of data literacy
- Red/yellow/green is intuitive but use consistently
- Mobile-first design is becoming essential`, 2, 75, 4, [
  q("topic-1-4-2", "q-task-1-4-2a", "Dashboard Type ID", "Identify the right dashboard type", "task", "For each scenario, identify type (Strategic/Operational/Analytical) and list 3 metrics: (1) Hospital administrator managing daily ops, (2) CEO reviewing quarterly performance, (3) Marketing analyst exploring campaigns, (4) Warehouse manager tracking shipments.", 15, "easy"),
  q("topic-1-4-2", "q-task-1-4-2b", "Chart Selection", "Match chart to data", "task", "Recommend chart type: (1) Compare revenue across 5 products, (2) Revenue trend over 12 months, (3) Market share breakdown, (4) Ad spend vs sales relationship, (5) Customer age distribution. Explain.", 20, "easy", "excel"),
  q("topic-1-4-2", "q-proj-1-4-2", "Dashboard Wireframe", "Design a dashboard wireframe", "project", "Design a one-screen dashboard for a gym chain with 10 locations. Decide purpose and audience. Show: layout with 4-6 charts, chart types, colors, action each drives. Explain choices.", 40, "medium"),
  q("topic-1-4-2", "q-boss-1-4-2", "Dashboard Redesign", "Redesign a poor dashboard", "boss_fight", "Current: 15 charts on one page, 8 colors, same metric in 3 chart types, no hierarchy, title 'Data Overview'. Redesign for SaaS executives. Provide: layout, 5 key metrics with justification, chart types, hierarchy plan, color rationale. Include critique of original.", 100, "hard"),
])

const T1_4_3 = makeTopic(M4, "topic-1-4-3", "Creating Effective Reports", `## Creating Effective Reports

Reports transform analysis into actionable documents that drive decisions.

### Simple Explanation
If a dashboard is a quick glance at your car's dash, a report is the full diagnostic. Reports provide depth, context, and recommendations.

### Report Structure
1. **Executive Summary** (1 page) — The entire report in miniature
2. **Introduction & Context** — Question, data, methodology
3. **Key Findings** — Most important results with visuals
4. **Detailed Analysis** — Deep dive with tables and statistics
5. **Recommendations** — Specific, actionable next steps
6. **Appendix** — Raw data, methodology details, glossary

### Real-World Example
McKinsey market entry report: Executive summary (CEO reads this), Market overview, Customer segmentation, Competitive analysis, Entry strategy, Financial projections.

### Best Practices
- One key insight per page
- Use headings for scannability
- Cite data sources
- Shorter reports are read more often

### Key Insights
- The executive summary is the most important page
- If you can't explain simply, you don't understand well enough
- Reports should drive decisions, not just inform`, 3, 100, 4, [
  q("topic-1-4-3", "q-task-1-4-3a", "Executive Summary", "Write a one-paragraph executive summary", "task", "Data: (1) Non-users in first 7 days have 80% churn, (2) Monthly pricing churns 2x annual, (3) Zero support tickets in first month = 50% more churn. Write a paragraph a VP reads in 30 seconds.", 15, "easy"),
  q("topic-1-4-3", "q-task-1-4-3b", "Report Structure Plan", "Outline a report", "task", "Outline a 6-section report on 'Website Performance Optimization.' Each section: title, question answered, data/visuals, key takeaway.", 20, "easy"),
  q("topic-1-4-3", "q-proj-1-4-3", "Full Report Creation", "Write a complete analytics report", "project", "Write a 3-page report on a business problem. Include: executive summary, intro, 3+ findings with charts described, 2+ recommendations, appendix. 800+ words.", 50, "medium"),
  q("topic-1-4-3", "q-boss-1-4-3", "The Capstone Report", "Create a professional-grade report", "boss_fight", "You're an analyst at a subscription box company. Monthly churn rose from 5% to 12% over 6 months. Create a full report: executive summary, problem definition, 4+ cause analysis (hypothetical data), recommendations (short/long-term), timeline, success metrics. 1000+ words.", 200, "hard"),
])

// ─── ASSEMBLE MODULES ────────────────────────────────────────────────────────

const module1 = { id: M1, phase_id: P1, title: "Introduction to Data Analytics", description: "Learn what data is, its types, and the systematic process of turning raw data into insights.", order_index: 1, unlock_level: 1, topics: [T1_1_1, T1_1_2, T1_1_3] }
const module2 = { id: M2, phase_id: P1, title: "Business Thinking for Analysts", description: "Understand KPIs, business metrics, and how to communicate data insights to stakeholders.", order_index: 2, unlock_level: 2, topics: [T1_2_1, T1_2_2, T1_2_3] }
const module3 = { id: M3, phase_id: P1, title: "Problem Solving & Analytical Thinking", description: "Develop structured problem-solving, data-driven decisions, and critical thinking.", order_index: 3, unlock_level: 3, topics: [T1_3_1, T1_3_2, T1_3_3] }
const module4 = { id: M4, phase_id: P1, title: "Dashboards & Reporting", description: "Master data storytelling, dashboard design, and professional report creation.", order_index: 4, unlock_level: 3, topics: [T1_4_1, T1_4_2, T1_4_3] }

// ─── PHASE BUILD HELPER ──────────────────────────────────────────────────────

function buildPhase(base: { id: string; title: string; description: string; order_index: number; icon: string; unlock_level: number }, mods: typeof module1[]): Phase {
  return { ...base, modules: mods }
}

// ─── IMPORT PHASES 2-4 ────────────────────────────────────────────────────────

import { phase2Modules } from "./phase-2-content"
import { phase3Modules } from "./phase-3-content"
import { phase4Modules } from "./phase-4-content"

// ─── EXPORT ──────────────────────────────────────────────────────────────────

export const seedPhases: Phase[] = [
  buildPhase(
    { id: "phase-1", title: "Data & Business Foundations", description: "Start here! Build your analytical foundation with data concepts, business thinking, problem solving, and communication skills.", order_index: 1, icon: "Compass", unlock_level: 1 },
    [module1, module2, module3, module4]
  ),
  buildPhase(
    { id: "phase-2", title: "Industry Domains & Analytics Applications", description: "Explore how analytics drives decisions in marketing, finance, healthcare, and operations.", order_index: 2, icon: "Building2", unlock_level: 5 },
    phase2Modules
  ),
  buildPhase(
    { id: "phase-3", title: "Core Data Analytics Tools", description: "Master the essential tools: Excel, SQL, and Python for data analysis.", order_index: 3, icon: "Wrench", unlock_level: 10 },
    phase3Modules
  ),
  buildPhase(
    { id: "phase-4", title: "Business Intelligence & Reporting", description: "Learn BI tools, advanced visualization, and executive-level reporting.", order_index: 4, icon: "BarChart3", unlock_level: 15 },
    phase4Modules
  ),
]
