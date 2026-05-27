import { makeTopic, q } from "./seed-curriculum"
import type { Module } from "@/types/curriculum"

// ─── PHASE 4: BUSINESS INTELLIGENCE & REPORTING ──────────────────────────────
// Module 1: BI Tools & Dashboards
// Module 2: Executive Communication
// Module 3: Capstone Project
// ───────────────────────────────────────────────────────────────────────────────

const P4 = "phase-4"
const M4_1 = "mod-4-1", M4_2 = "mod-4-2", M4_3 = "mod-4-3"

// ───────────────────────────────────────────────────────────────────────────────
// Module 1: BI Tools & Dashboards
// ───────────────────────────────────────────────────────────────────────────────

const T4_1_1 = makeTopic(M4_1, "topic-4-1-1", "Introduction to BI Tools", `## Introduction to BI Tools

Business Intelligence platforms transform raw data into interactive dashboards and actionable insights.

### Simple Explanation
If Excel is a tool shed and Python is a workshop, BI tools are a factory floor — purpose-built for turning data into decisions at scale.

### Popular BI Platforms
- **Power BI**: Microsoft's enterprise BI, strong with Excel integration
- **Tableau**: Industry leader in visualization, steep learning curve
- **Looker**: Cloud-native, uses LookML modeling layer
- **Metabase**: Open-source, easy for self-service analytics
- **Superset**: Apache open-source, scales well

### BI Architecture
**Data Sources** → **Data Warehouse** → **Semantic Layer** → **BI Tool** → **Dashboards**

- **ETL/ELT**: Extract, Transform, Load data into warehouse
- **Semantic Layer**: Business definitions of metrics (e.g., "Revenue = SUM of line totals where status = completed")
- **Data Modeling**: Star schema (fact + dimension tables)

### Key BI Concepts
- **Live Connection**: Query database directly (real-time but slower)
- **Import Mode**: Cache data in BI tool (faster but stale)
- **Incremental Refresh**: Update only changed data
- **Row-Level Security**: Restrict data access by user
- **Scheduled Refresh**: Keep dashboards current automatically

### Real-World Example
A retail company moved from Excel reports (40 hours/week) to Power BI dashboards (5 hours/week) with automated refreshes. The BI solution connected directly to their warehouse, enforced row-level security for regional managers, and provided real-time inventory visibility.

### Key Insights
- BI tools are not replacements for SQL/Python — they complement them
- Data modeling determines dashboard performance and flexibility
- Self-service BI empowers business users but needs governance
- Choose tools based on your organization's ecosystem`, 1, 100, 15, [
  q("topic-4-1-1", "q-task-4-1-1a", "BI Tool Comparison", "Evaluate BI platforms against requirements", "task", "A mid-size company (200 employees) needs to: (1) Connect to PostgreSQL and Google Sheets, (2) Allow 5 analysts to create dashboards, (3) Allow 50 executives to view on mobile, (4) Cost < $2K/month. Compare Power BI, Tableau, Looker, and Metabase on: connectivity, ease of use, mobile support, cost, and governance. Recommend one with justification.", 25, "easy"),
  q("topic-4-1-1", "q-task-4-1-1b", "Star Schema Design", "Design a data model for a BI dashboard", "task", "A sales team needs a dashboard with: sales by customer, product, region, and date; inventory levels; salesperson performance. Design a star schema with: (1) Fact table(s) with measures, (2) Dimension tables with attributes, (3) Relationships between tables, (4) Example queries the schema enables. Draw the schema and explain design choices.", 30, "medium"),
  q("topic-4-1-1", "q-proj-4-1-1", "BI Implementation Plan", "Design a full BI roadmap", "project", "A company currently uses Excel for all reporting. 20 analysts spend 60% of time preparing reports. Design a 6-month BI implementation plan: (1) Tool selection criteria and recommendation, (2) Data architecture (sources, warehouse, modeling), (3) Team structure and skills needed, (4) 6-phase rollout timeline, (5) Expected efficiency gains and ROI calculation, (6) Governance framework. 600+ words.", 100, "medium"),
  q("topic-4-1-1", "q-boss-4-1-1", "BI Strategy & Governance", "Design enterprise BI strategy", "boss_fight", "A 2,000-person company has: 15 data sources (SQL, Salesforce, Google Analytics, ERP), 50 report creators, 500 report consumers, current state = Excel chaos. Design a comprehensive BI strategy covering: (1) Platform architecture (warehouse, semantic layer, BI tool selection with comparison), (2) Data governance (ownership, quality standards, certification process), (3) Self-service vs governed analytics balance, (4) Team structure (center of excellence vs federated), (5) Implementation timeline (12 months, phased), (6) Budget estimate and ROI projection, (7) Change management and training approach. 1000+ words.", 300, "hard"),
])

const T4_1_2 = makeTopic(M4_1, "topic-4-1-2", "Dashboard Design in Power BI", `## Dashboard Design in Power BI

Building professional, interactive dashboards in Power BI.

### Simple Explanation
Power BI is Microsoft's BI platform that connects to hundreds of data sources, creates interactive visualizations, and publishes to web and mobile.

### Power BI Components
- **Power BI Desktop**: Development environment (free)
- **Power BI Service**: Cloud publishing and sharing
- **Power BI Mobile**: Apps for iOS, Android
- **Power BI Report Builder**: Paginated reports

### Building Blocks
**Data Sources**: Import from files, databases, web services
**Power Query**: ETL tool for data transformation
**DAX**: Data Analysis Expressions — formulas for calculated columns and measures
**Visualizations**: Built-in charts, tables, maps, custom visuals
**Filters**: Report, page, visual-level; slicers for interactivity

### Essential DAX Functions
\`\`\`
CALCULATE, FILTER, ALL, SUMX, AVERAGEX
TOTALYTD, SAMEPERIODLASTYEAR, DATEADD
RANKX, TOPN, HASONEVALUE
\`\`\`

### Design Principles
- **Mobile-first**: Design for small screens first
- **Consistent Color**: Use theme colors, conditional formatting
- **Hierarchy**: Most important KPI at top-left
- **Interactivity**: Cross-filtering, drill-through, bookmarks
- **Performance**: Minimize visuals per page, optimize DAX

### Real-World Example
A logistics company built a Power BI dashboard with: KPI cards (on-time delivery %, avg transit time, cost per mile), map visual for real-time tracking, line chart for trend analysis, and drill-through to individual shipment details. The dashboard saved 15 hours/week in manual reporting.

### Key Insights
- Star schema design dramatically improves Power BI performance
- DAX measures are calculated at query time, calculated columns at refresh
- Use bookmarks and buttons for navigation between pages
- Power BI Service scheduled refresh keeps data current`, 2, 100, 15, [
  q("topic-4-1-2", "q-task-4-1-2a", "Power Query Transformations", "Clean and shape data with Power Query", "task", "You receive a messy CSV: inconsistent date formats, merge columns, blank rows, calculated columns needed. Describe step-by-step how you'd use Power Query to: (1) Promote headers, (2) Split a 'FullName' column into First and Last, (3) Convert dates to a consistent format, (4) Remove blank rows, (5) Add a calculated column for 'Revenue = Price * Quantity', (6) Group by category and sum revenue. Explain each step's M code.", 25, "easy"),
  q("topic-4-1-2", "q-task-4-1-2b", "DAX Measures", "Write DAX formulas for common analytics", "task", "Given a sales table (date, product, region, units, revenue) and calendar table, write DAX measures for: (1) Total Revenue, (2) Total Cost (revenue * 0.6), (3) Revenue LY (same period last year), (4) YoY Growth %, (5) Running Total Revenue, (6) Revenue Rank by Product, (7) Top 5 Products by Revenue. Explain each measure's logic.", 30, "medium"),
  q("topic-4-1-2", "q-proj-4-1-2", "Sales Dashboard Design", "Build a complete Power BI dashboard", "project", "Design a 3-page Power BI sales dashboard for a retail chain with 20 stores: (1) Executive Summary page — 4 KPI cards, revenue trend line, top/bottom stores bar chart, monthly target gauge, (2) Product Analysis page — category breakdown, product performance matrix, price elasticity scatter, inventory heatmap, (3) Store Operations page — map visualization, store ranking, staff efficiency, foot traffic vs sales. For each page specify: chart types chosen, DAX measures needed, interactions (cross-filter, drill-through), slicers, and design rationale. 700+ words.", 150, "medium"),
  q("topic-4-1-2", "q-boss-4-1-2", "Enterprise BI Dashboard", "Design a full enterprise BI solution", "boss_fight", "A multinational company needs a BI solution covering: Finance (P&L by region, budget vs actual, cash flow), Sales (pipeline, win rates, quota attainment, forecast), Operations (supply chain, inventory, fulfillment), HR (headcount, turnover, diversity, training). Design: (1) Data model (fact/dimension tables, relationships), (2) 10+ key measures with DAX formulas, (3) Dashboard structure (pages, navigation, bookmarks), (4) Row-level security design (by region and role), (5) Performance optimization strategy (incremental refresh, aggregation tables), (6) Deployment pipeline (Dev → Test → Prod). 1000+ words.", 350, "hard"),
])

const T4_1_3 = makeTopic(M4_1, "topic-4-1-3", "Advanced Visualization Techniques", `## Advanced Visualization Techniques

Creating compelling, professional visualizations that drive decisions.

### Simple Explanation
Basic charts show data. Advanced visualizations tell stories. The difference is in thoughtful design, appropriate chart selection, and attention to detail.

### Advanced Chart Types
**Heatmap**: Showing patterns across two dimensions
**Sankey Diagram**: Flow between categories
**Waterfall Chart**: Sequential build-up of values
**Radar/Spider Chart**: Multi-dimensional comparison
**Treemap**: Hierarchical data with area encoding
**Gantt Chart**: Project timelines and dependencies
**Bullet Chart**: KPI vs target in compact space
**Sparklines**: Tiny charts in tables

### Visual Design Principles
**Gestalt Principles**: Proximity, similarity, closure, continuity
**Pre-attentive Processing**: Color, size, position for instant understanding
**Data-Ink Ratio**: Maximize data, minimize non-data ink
**Chart Integrity**: Area should be proportional to data (no 3D pie charts)

### Color Theory for Analytics
- **Sequential**: Light → dark (for ordered data)
- **Diverging**: Two extremes + neutral midpoint
- **Qualitative**: Distinct categories (max 8 colors)
- **Accessibility**: Colorblind-friendly palettes (CVD-safe)

### Interactive Features
- **Tooltips**: Show details on hover
- **Drill-Down**: Click to see more detail
- **Parameters**: User-controlled variables
- **Animations**: Show changes over time
- **Cross-Filtering**: Selecting in one chart filters others

### Real-World Example
A financial analyst replaced a cluttered pie chart with a bullet chart showing actual vs budget for 20 departments. The new design fit on one screen instead of three, allowed instant identification of underperforming departments, and was adopted company-wide.

### Key Insights
- The best visualization is the simplest one that communicates the insight
- Color should encode data, not decorate
- Test your visualizations with your actual audience
- Interactive exploration beats static reports for analytical users`, 3, 100, 15, [
  q("topic-4-1-3", "q-task-4-1-3a", "Chart Redesign", "Redesign poor visualizations", "task", "You're given three problematic charts: (1) A 3D pie chart with 12 slices in rainbow colors, (2) A line chart with 8 series on the same axis with no labels, (3) A bar chart starting at y-axis 400 instead of 0. For each: identify the problem, redesign with an appropriate chart type, and explain your design choices.", 25, "easy"),
  q("topic-4-1-3", "q-task-4-1-3b", "Color Palette Selection", "Choose appropriate color schemes", "task", "For each scenario, recommend a color palette type (sequential, diverging, qualitative) and specific colors: (1) Temperature data from -20°C to 40°C, (2) 5 product categories in a bar chart, (3) Population density by region, (4) Survey responses from Very Satisfied to Very Dissatisfied, (5) Website traffic by hour of day. Consider accessibility requirements.", 25, "medium"),
  q("topic-4-1-3", "q-proj-4-1-3", "Visualization Style Guide", "Create an analytics style guide", "project", "Create a comprehensive visualization style guide for a company: (1) Color palette (primary, secondary, semantic colors with hex codes), (2) Typography (headings, labels, annotations), (3) Chart types — which to use (and not use) for each scenario, (4) Layout guidelines (margins, spacing, grid alignment), (5) Accessibility requirements (contrast ratios, colorblind-friendly), (6) Template examples (dashboard, report, slide deck). 600+ words.", 100, "medium"),
  q("topic-4-1-3", "q-boss-4-1-3", "Visualization System Design", "Design a complete enterprise visualization system", "boss_fight", "You're leading a data visualization overhaul for a Fortune 500 company. Current state: 200+ dashboards, no standards, inconsistent metrics, users can't find the right report. Design: (1) A visualization governance framework (standards, review process, certification), (2) A common metric definition catalog with 30+ business definitions, (3) A dashboard design system (layout templates, component library, interaction patterns), (4) A self-service creation guide for business analysts, (5) A quality scoring system for dashboards, (6) A retirement process for unused dashboards. Include examples of before/after for a sample dashboard. 1000+ words.", 350, "hard"),
])

// ───────────────────────────────────────────────────────────────────────────────
// Module 2: Executive Communication
// ───────────────────────────────────────────────────────────────────────────────

const T4_2_1 = makeTopic(M4_2, "topic-4-2-1", "Data-Driven Storytelling", `## Data-Driven Storytelling

The art of weaving data, narrative, and visuals into compelling stories.

### Simple Explanation
Data without story is just numbers. Story without data is just opinion. Data storytelling combines both to drive understanding and action.

### The Three Elements
**Data**: Credible, relevant facts and figures
**Narrative**: A structured story with context, conflict, resolution
**Visuals**: Charts and graphics that make data accessible

### The Storytelling Framework
1. **Hook**: Grab attention with a compelling opening
2. **Context**: Set the scene — what are we talking about?
3. **Conflict**: The problem or insight that needs attention
4. **Resolution**: What do we do about it?
5. **Call to Action**: What should the audience do next?

### Building a Data Story
- Start with the insight, not the data
- Guide the audience from what they know to what they don't
- Create tension (contrast actual vs expected)
- Use analogies to make complex data relatable
- End with a clear, specific recommendation

### Real-World Example
Airbnb discovered professional photos boosted bookings 40%. Instead of a spreadsheet, they presented a story: "Hosts spend hours cleaning but minutes on photos" (hook) → "Better photos = more bookings" (data) → "Let's offer free pro photography" (CTA). The program launched same day.

### Key Insights
- People remember stories 22x more than facts alone
- The best data story can be told in 30 seconds
- If you can't explain it simply, you don't understand it
- Stories drive emotion; emotion drives action`, 1, 100, 16, [
  q("topic-4-2-1", "q-task-4-2-1a", "Build a Data Story", "Structure findings into a narrative", "task", "Findings: Customer satisfaction 72/100. Support department lowest at 58. Support has 40% overtime vs 15% company average. Support manager resigned 3 months ago. Structure as a data story: Hook, Context, Conflict, Resolution, CTA. Write each section in 2-3 sentences.", 20, "easy"),
  q("topic-4-2-1", "q-task-4-2-1b", "Analogies for Data", "Create relatable analogies for complex data", "task", "Create an analogy for each: (1) Database query optimization (technical to non-technical), (2) Machine learning overfitting, (3) Statistical significance (p-value), (4) Data pipeline / ETL process, (5) A/B testing. Each analogy should make the concept accessible to a 10th grader.", 25, "medium"),
  q("topic-4-2-1", "q-proj-4-2-1", "Data Story Script", "Write a full presentation script", "project", "Write a 5-minute data story presentation script for the CEO. Topic: A 20% decline in customer retention over 6 months. Include: (1) Opening hook, (2) Key data points with visual descriptions, (3) Root cause analysis story, (4) 3 recommendations with expected impact, (5) Call to action. Describe what visual accompanies each slide. 700+ words.", 100, "medium"),
  q("topic-4-2-1", "q-boss-4-2-1", "Crisis Communication", "Handle a high-stakes data communication scenario", "boss_fight", "Scenario: Your quarterly report accidentally overstated revenue by $5M due to a data processing error. The incorrect report was already presented to the board. Write: (1) An email to the CFO owning the error with clear explanation, (2) A corrected executive summary with key corrections highlighted, (3) A root cause analysis of how the error occurred, (4) A process improvement plan to prevent recurrence, (5) A communication plan for restating to the board. Balance transparency with professionalism. 800+ words.", 250, "hard"),
])

const T4_2_2 = makeTopic(M4_2, "topic-4-2-2", "Executive Reporting", `## Executive Reporting

Creating reports that executives actually read and act on.

### Simple Explanation
Executives don't have time to dig through data. They need the bottom line, the key insight, and the recommended action — all in under 60 seconds.

### The Executive Mindset
Executives ask three questions:
1. **What's happening?** (Current state vs target)
2. **Why is it happening?** (Root cause)
3. **What should I do?** (Recommendation)

### Report Structure for Executives
**The Pyramid Principle: Conclusion First**
1. Executive Summary (1 page max)
2. Key Insights (3-5 bullet points)
3. Supporting Data (visuals + short commentary)
4. Recommendations (specific, actionable, prioritized)
5. Appendix (detailed tables, methodology)

### Best Practices
- **One page = one message**: Don't cram multiple topics
- **Visual hierarchy**: Most important info at top-left
- **Traffic lighting**: Red/Yellow/Green for status
- **Consistent format**: Same structure monthly builds familiarity
- **Action items**: Every report should end with decisions needed

### KPI Design for Executives
- Leading indicators (future-focused) over lagging (past-focused)
- Benchmarks (vs plan, vs last year, vs industry)
- Trend arrows (up/down/flat) for quick scanning
- Sparklines in tables for mini-trends

### Real-World Example
McKinsey's one-page executive summary format: Problem → Analysis → Recommendation → Impact. Used globally because it respects executive time while conveying critical information.

### Key Insights
- Executives spend 2-5 minutes on a report, max
- If the executive summary doesn't convince, the rest won't matter
- Use the minimum data needed to make each point
- Always include a "so what?" for every data point`, 2, 100, 16, [
  q("topic-4-2-2", "q-task-4-2-2a", "Executive Summary Writing", "Write a one-page executive summary", "task", "Data: Revenue $12.5M (vs plan $13M, -3.8%), Gross Margin 52% (target 55%), CAC $85 (vs target $75), NPS 42 (up from 38 last quarter), headcount 245. Write a one-page executive summary with: (1) Performance overview with traffic lights, (2) Top 3 insights, (3) Top 3 recommendations with expected impact, (4) Key decisions needed this week. Maximum 500 words.", 25, "easy"),
  q("topic-4-2-2", "q-task-4-2-2b", "KPI Dashboard Design", "Design a one-screen executive KPI dashboard", "task", "Design a one-screen dashboard for a SaaS company CEO. Include: (1) 6-8 KPIs with targets and status indicators, (2) A trend chart for MRR, (3) A metric showing what needs attention today, (4) Sparklines in a KPI table. For each element, explain: why it's there, what action it drives, and update frequency. 400+ words.", 30, "medium"),
  q("topic-4-2-2", "q-proj-4-2-2", "Monthly Board Report", "Create a complete board report package", "project", "Create a mock board report package for a company of your choice. Include: (1) Cover page with company overview, (2) Executive summary (one page), (3) Financial performance (P&L, balance sheet highlights, cash flow), (4) Operational metrics (customers, product, team), (5) Strategic initiatives update, (6) Risk dashboard, (7) Forward-looking outlook. Use realistic data and visuals. 800+ words.", 150, "medium"),
  q("topic-4-2-2", "q-boss-4-2-2", "Quarterly Business Review", "Lead a data-driven QBR process", "boss_fight", "You're the analytics lead for a $50M SaaS company preparing the Q4 board deck. Key stories: (1) Revenue grew 25% YoY but missed Q4 target by 5%, (2) Enterprise segment grew 80% while SMB declined 10%, (3) Customer acquisition cost rose 30% due to new channel investments, (4) NPS hit all-time high of 65, (5) Two major competitors launched competing products. Create: (1) Narrative arc for the 30-minute presentation, (2) 6-8 slides with specific chart recommendations, (3) Talking points for each slide anticipating executive questions, (4) Worst-case scenario questions and prepared responses. 1000+ words.", 400, "hard"),
])

const T4_2_3 = makeTopic(M4_2, "topic-4-2-3", "Presentation Skills for Analysts", `## Presentation Skills for Analysts

Presenting data insights with confidence, clarity, and impact.

### Simple Explanation
The best analysis in the world is worthless if you can't present it effectively. Presentation skills turn data into decisions.

### The 10/20/30 Rule (Guy Kawasaki)
- **10 slides**: Maximum for any presentation
- **20 minutes**: Maximum time for presentation
- **30-point font**: Minimum font size (forces simplicity)

### Structuring Your Presentation
**Opening**: The hook (30 seconds)
- Start with a surprising fact, question, or story
- State your conclusion upfront

**Body**: The evidence (15 minutes)
- One insight per slide
- Each slide: insight heading → supporting visual → brief explanation → so-what

**Closing**: The call to action (2 minutes)
- Summarize 3 key takeaways
- Make a specific ask
- End with a memorable statement

### Visual Design for Presentations
- One message per slide
- Minimal text (audience reads, doesn't listen)
- High-contrast colors, large fonts
- Consistent template
- No animations unless they add meaning

### Handling Q&A
- Listen fully before responding
- Repeat/rephrase the question to confirm understanding
- If you don't know, say "I'll find out" (then actually do)
- Bridge from questions back to your message
- End each answer by asking "Does that answer your question?"

### Real-World Example
An analyst presenting churn analysis: instead of starting with methodology, she opened with "We're losing $2M/year to churn — here's how we can save $1.5M of it." Decision-makers were engaged immediately.

### Key Insights
- Confidence comes from preparation, not personality
- Your audience wants you to succeed — they're on your side
- Nervousness is normal — channel it into energy
- The best presenters make it look easy through practice`, 3, 100, 17, [
  q("topic-4-2-3", "q-task-4-2-3a", "Presentation Outline", "Structure a 10-slide presentation", "task", "You need to present a recommendation to switch from Tableau to Power BI. Create a 10-slide outline following the 10/20/30 rule. For each slide: (1) Title that states the insight, (2) Visual/layout description, (3) Key message in one sentence, (4) Speaker notes. Also include: opening hook, closing CTA, and anticipated questions.", 25, "easy"),
  q("topic-4-2-3", "q-task-4-2-3b", "Slide Makeover", "Redesign ineffective slides", "task", "You're given 3 poorly designed slides: (1) A data-dense table on a dark background, (2) A slide with 6 bullet points and no visuals, (3) A chaotic chart with 15 series and unreadable labels. Redesign each slide with: proper visual hierarchy, appropriate chart type, reduced text, clear messaging. Explain your design decisions.", 25, "medium"),
  q("topic-4-2-3", "q-proj-4-2-3", "Full Presentation Build", "Create and narrate a complete presentation", "project", "You're presenting Q4 results to the leadership team. Build a 10-slide presentation: (1) Hook slide with key metric that summarizes the quarter, (2) Revenue performance vs target, (3) Growth drivers analysis, (4) Customer metrics (acquisition, retention, satisfaction), (5) Product/feature performance, (6) Team highlights, (7) Challenges and risks, (8) Q1 priorities, (9) Resource needs, (10) Call to action. Include slide content, speaker notes for each, and 3 potential Q&A questions with prepared responses. 800+ words.", 150, "medium"),
  q("topic-4-2-3", "q-boss-4-2-3", "Executive Presentation Simulation", "Handle a high-stakes executive presentation", "boss_fight", 'Scenario: The CEO asked you to present "Why customer churn is increasing" to the board in 15 minutes. Data shows: (1) Churn increased from 3% to 5% over 6 months, (2) Most churn happens in months 3-6, (3) Customers who do not use the mobile app churn at 3x the rate, (4) Support response time went from 2hr to 8hr, (5) Competitor launched a similar product at half the price. Prepare: (1) Full 10-slide presentation with speaker notes, (2) Opening 30-second hook, (3) Anticipate 5 executive questions with responses, (4) Worst-case scenario (if the CEO challenges your methodology), (5) A one-page leave-behind executive summary. 1000+ words.', 400, "hard"),
])

// ───────────────────────────────────────────────────────────────────────────────
// Module 3: Capstone Project
// ───────────────────────────────────────────────────────────────────────────────

const T4_3_1 = makeTopic(M4_3, "topic-4-3-1", "End-to-End Analytics Project", `## End-to-End Analytics Project

Bringing everything together — a complete analytics project from start to finish.

### Simple Explanation
The capstone is your opportunity to prove you can do real analytics work. You'll go from raw data to executive presentation, using every skill you've learned.

### The Complete Project Lifecycle
1. **Define the Problem**: What business question are we answering?
2. **Acquire Data**: Find, collect, or request relevant data
3. **Clean & Prepare**: Handle missing values, outliers, inconsistencies
4. **Explore & Analyze**: Statistical analysis, pattern discovery
5. **Model & Interpret**: Build models, test hypotheses
6. **Visualize & Communicate**: Dashboards, reports, presentations

### Project Selection Criteria
Choose a project that:
- Has real business value (not just academic)
- Uses datasets you can access
- Has clear success criteria
- Can be completed in 2-4 weeks
- Demonstrates multiple skills

### Sample Project Ideas
1. Customer churn analysis and prediction
2. Sales performance and forecasting
3. Marketing campaign optimization
4. Operational efficiency analysis
5. Financial performance review
6. Product usage and engagement analysis

### Deliverables
- **Executive Summary**: One-page overview for decision makers
- **Technical Report**: Methodology, data sources, analysis details
- **Dashboard/Visualization**: Interactive or static visual presentation
- **Presentation Deck**: 10-slide max for stakeholders
- **Code/Workbook**: Reproducible analysis (Python notebook, Excel, SQL)

### Real-World Example
A data analyst intern built a churn analysis project: SQL for data extraction (50K customers), Python/Pandas for cleaning and analysis, Seaborn/Matplotlib for visualizations, and a 10-slide presentation. The analysis identified the top 3 churn drivers and saved the company $2M/year.

### Key Insights
- A good project is better than a perfect one — ship it
- Document your process thoroughly for portfolio use
- Always include limitations and next steps
- The final presentation is as important as the analysis`, 1, 200, 18, [
  q("topic-4-3-1", "q-task-4-3-1a", "Project Scoping", "Define a capstone project scope", "task", "Choose a business problem that interests you. Write a project charter including: (1) Problem statement (one sentence), (2) Business question to answer, (3) Data sources needed (at least 2), (4) Success criteria (quantifiable), (5) Timeline (4 weeks, broken into phases), (6) Stakeholders who would care about the result, (7) 3 risks and mitigations. 400+ words.", 30, "easy"),
  q("topic-4-3-1", "q-task-4-3-1b", "Data Collection Plan", "Design a data acquisition strategy", "task", "For your chosen project, create a detailed data plan: (1) List all data sources with access method (API, SQL, CSV, etc.), (2) Expected row counts and columns, (3) Data dictionary template, (4) Data quality checks (completeness, accuracy, timeliness), (5) Fallback plan if primary sources are unavailable, (6) Ethics/privacy considerations. 400+ words.", 30, "medium"),
  q("topic-4-3-1", "q-proj-4-3-1", "Mid-Project Progress Report", "Document your capstone progress", "project", "You're halfway through your capstone. Write a progress report: (1) What you've done (data acquired, cleaned, initial analysis), (2) Preliminary findings (3 key observations with supporting visuals described), (3) Challenges encountered and solutions, (4) Revised timeline if needed, (5) What you plan to present at the final review. 500+ words.", 100, "medium"),
  q("topic-4-3-1", "q-boss-4-3-1", "Full Capstone Project", "Complete a comprehensive analytics project", "boss_fight", "Complete a full end-to-end analytics project using a real dataset of your choice. Deliver: (1) Project charter with problem definition and success criteria, (2) Data documentation (sources, cleaning steps, data dictionary), (3) Analysis notebooks/workbooks with all steps, (4) At least 10 visualizations exploring patterns and insights, (5) Statistical analysis (regression, hypothesis test, or segmentation), (6) Executive summary (one page), (7) 10-slide presentation deck with speaker notes, (8) Recommendations with expected business impact. The project should demonstrate skills across the entire curriculum. 2000+ words total across deliverables.", 500, "hard"),
])

const T4_3_2 = makeTopic(M4_3, "topic-4-3-2", "Client Communication", `## Client Communication

Working with stakeholders to deliver analytics that meet real business needs.

### Simple Explanation
Analysts don't work in a vacuum — you serve clients (internal or external). Great analysis + poor communication = failed project. Good analysis + great communication = hero.

### The Client Relationship
**Discovery Phase**: Understanding the real problem
- Ask "Why?" five times to find root cause
- Define scope clearly — what's in and out
- Set expectations for deliverables and timeline
- Identify decision-makers and users

**Delivery Phase**: Managing the process
- Regular check-ins (weekly minimum)
- Early validation of assumptions
- Transparent about challenges
- Demo early, demo often

**Closing Phase**: Ensuring adoption
- Provide training and documentation
- Plan for handoff and maintenance
- Gather feedback for improvement
- Celebrate success

### Managing Difficult Situations
- **Scope creep**: "That's a great idea — let's add it to phase 2"
- **Unrealistic timeline**: "Here's what we can deliver by then — what's most important?"
- **Disagreeing with results**: "Let's review the data together — I may have missed something"
- **Non-technical stakeholders**: Avoid jargon, use analogies

### Real-World Example
An analyst delivered a perfect technical analysis but the client rejected it. The problem? The analyst answered the question they were asked, not the question they should have been asked. After a discovery conversation, they realized the real problem was different — and the "analysis" was useless.

### Key Insights
- Understand the problem before touching data
- Under-promise and over-deliver
- Documentation isn't optional — people leave, memories fade
- Your success is measured by impact, not technical complexity`, 2, 150, 18, [
  q("topic-4-3-2", "q-task-4-3-2a", "Discovery Questions", "Design a discovery questionnaire", "task", "A marketing director asks for 'a dashboard showing everything about our customers.' Write a set of 15 discovery questions to uncover: (1) The real business problem, (2) Key decisions the dashboard will inform, (3) Success criteria, (4) Technical constraints, (5) Users and their needs, (6) Data sources and access. 300+ words.", 25, "easy"),
  q("topic-4-3-2", "q-task-4-3-2b", "Scope Management", "Handle scope creep professionally", "task", "You're mid-project on a 4-week, $15K analysis. The client requests 3 additional features that would add 2 weeks. Write: (1) An email acknowledging the request, (2) An impact assessment (time, cost, quality), (3) Three options for the client with trade-offs, (4) A recommended approach. 400+ words.", 30, "medium"),
  q("topic-4-3-2", "q-proj-4-3-2", "Client Deliverable Package", "Create a professional client deliverable", "project", "You've completed a customer segmentation project for a retail client. Create the final deliverable package: (1) Cover page with title and date, (2) Executive summary (one page), (3) Methodology overview (non-technical), (4) Key findings with visualizations, (5) Actionable recommendations, (6) Technical appendix, (7) Handoff checklist, (8) Next steps timeline. 600+ words.", 150, "medium"),
  q("topic-4-3-2", "q-boss-4-3-2", "Client Project Simulation", "Manage a complete client engagement", "boss_fight", 'You\'re an analytics consultant for a retail chain. The CEO wants to know: "Why are our sales declining in the Northeast region?" The store manager says it is because of a new competitor. The marketing director says it is because of poor online experience. The CFO says it is because they raised prices. You have 3 weeks and 5 data sources (sales, web analytics, competitor data, customer surveys, operational data). Write: (1) Your discovery approach, (2) Your data analysis plan, (3) How you would handle conflicting stakeholder narratives, (4) A presentation outline for the final deliverable, (5) Your approach to managing stakeholder expectations. 800+ words.', 400, "hard"),
])

const T4_3_3 = makeTopic(M4_3, "topic-4-3-3", "Portfolio Building", `## Portfolio Building

Creating a compelling analytics portfolio that gets you hired.

### Simple Explanation
Your portfolio is the most important job-hunting tool you'll build. It proves you can do the work, not just talk about it.

### What Makes a Great Portfolio
1. **Real projects**: Use real data, solve real problems
2. **Narrative**: Each project tells a story
3. **Process**: Show your thinking, not just results
4. **Skills diversity**: Demonstrate breadth and depth
5. **Professional presentation**: Clean, polished, accessible

### Portfolio Components
**For Each Project**:
- Project title and one-line summary
- Business problem and context
- Data sources and methodology
- Key findings with visualizations
- Business impact and recommendations
- Link to code/data (GitHub, Kaggle, etc.)
- Your role and contributions

**Platform Options**:
- **GitHub**: Code-focused portfolios
- **Tableau Public**: Interactive dashboards
- **Personal Website**: Full showcase
- **LinkedIn**: Summary and links
- **Medium/Blog**: Write about your process

### Projects to Build
1. **Churn Analysis**: End-to-end customer analytics
2. **Sales Dashboard**: BI visualization showcase
3. **A/B Test Analysis**: Statistical rigor
4. **Financial Analysis**: Business domain expertise
5. **Python/SQL Portfolio**: Technical depth
6. **Capstone Project**: Comprehensive demonstration

### Real-World Example
A career-changer built 5 portfolio projects over 3 months: (1) SQL analysis of 50K transactions, (2) Python EDA of public dataset, (3) Power BI sales dashboard, (4) Marketing campaign analysis, (5) Capstone project. Each had a write-up, visualizations, and code. She got 3 interview requests in 2 weeks.

### Key Insights
- Quality over quantity — 3 great projects > 10 mediocre ones
- Document your process — employers care about how you think
- Include a project that required stakeholder communication
- Make your portfolio easy to find and navigate
- Update regularly — stale portfolios signal inactivity`, 3, 150, 18, [
  q("topic-4-3-3", "q-task-4-3-3a", "Portfolio Audit", "Assess your current portfolio", "task", "Evaluate your current project portfolio: (1) How many projects do you have? (2) How many skills do they demonstrate? (3) Are they well-documented? (4) Do they have clear business context? (5) Are they professionally presented? Write a gap analysis: which skills or project types are missing, and create a plan to fill those gaps in the next 30 days. 400+ words.", 25, "easy"),
  q("topic-4-3-3", "q-task-4-3-3b", "Project Write-Up", "Write a compelling project case study", "task", "Take a project you've worked on (or use one from this course) and write a 500-word case study. Follow this structure: (1) Title and one-line summary, (2) Problem and business context, (3) Data and tools used, (4) Approach and methodology, (5) Key findings with 2 visual descriptions, (6) Recommendations and impact, (7) What you learned. Write for a hiring manager who reads it in 2 minutes.", 30, "medium"),
  q("topic-4-3-3", "q-proj-4-3-3", "Portfolio Website", "Create your analytics portfolio site", "project", "Design and build a personal portfolio website (or detailed outline if not publishing). Include: (1) About section (who you are, what you do), (2) 3-5 project case studies with problem context, visuals, results, and links, (3) Skills section (tools, techniques, domains), (4) Resume/CV download, (5) Contact information and LinkedIn link. For each project case study: describe the narrative arc, key visual, and business impact. 600+ words.", 150, "medium"),
  q("topic-4-3-3", "q-boss-4-3-3", "Portfolio & Career Strategy", "Build a complete career readiness package", "boss_fight", "You're completing the DataQuest Analytics program. Create a comprehensive career readiness package: (1) Resume optimized for analytics roles (include metrics, tools, impact), (2) LinkedIn profile (headline, summary, experience descriptions, skills), (3) Portfolio strategy (which 3 projects to feature, how to present each), (4) Target company list (10 companies with research notes), (5) Interview preparation (common analytics interview questions with structured answers — technical, behavioral, case), (6) Networking strategy (events, online communities, reach-out templates), (7) 90-day job search plan. 1500+ words.", 500, "hard"),
])

// ─── ASSEMBLE MODULES ──────────────────────────────────────────────────────────

export const phase4Modules: Module[] = [
  { id: M4_1, phase_id: P4, title: "BI Tools & Dashboards", description: "Master business intelligence platforms like Power BI, data modeling, and professional dashboard design.", order_index: 1, unlock_level: 15, topics: [T4_1_1, T4_1_2, T4_1_3] },
  { id: M4_2, phase_id: P4, title: "Executive Communication", description: "Learn data storytelling, executive reporting, and presentation skills to drive decisions with data.", order_index: 2, unlock_level: 16, topics: [T4_2_1, T4_2_2, T4_2_3] },
  { id: M4_3, phase_id: P4, title: "Capstone Project", description: "Apply everything you've learned to a real-world analytics project and build your professional portfolio.", order_index: 3, unlock_level: 17, topics: [T4_3_1, T4_3_2, T4_3_3] },
]
