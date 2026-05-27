import { makeTopic, q } from "./seed-curriculum"
import type { Module } from "@/types/curriculum"

// ─── PHASE 2: INDUSTRY DOMAINS & ANALYTICS APPLICATIONS ──────────────────────
// Module 1: Marketing Analytics
// Module 2: Financial Analytics
// Module 3: Healthcare & Operations
// ───────────────────────────────────────────────────────────────────────────────

const P2 = "phase-2"
const M2_1 = "mod-2-1", M2_2 = "mod-2-2", M2_3 = "mod-2-3"

// ── Marketing: Customer Segmentation ───────────────────────────────────────────

const T2_1_1 = makeTopic(M2_1, "topic-2-1-1", "Customer Segmentation", `## Customer Segmentation

Customer segmentation divides a customer base into groups with shared characteristics for targeted marketing.

### Simple Explanation
Rather than treating all customers identically, segmentation tailors strategies to different groups — like a clothing store organizing by size rather than piling everything together.

### Common Segmentation Methods
1. **Demographic** — Age, gender, income, education
2. **Geographic** — Location, urban/rural, climate
3. **Behavioral** — Purchase history, browsing patterns, loyalty
4. **Psychographic** — Lifestyle, values, personality

### The RFM Model
- **Recency**: How recently a customer purchased
- **Frequency**: How often they purchase
- **Monetary Value**: How much they spend

### Real-World Example
Amazon uses behavioral segmentation pervasively: "Customers who bought this also bought..." is behavioral. They also segment by Prime status, device preferences, and browsing history.

### Key Insights
- Good segmentation lifts revenue 10-20%
- More segments aren't better — make them actionable
- Segments must be measurable, accessible, and substantial
- Dynamic segments beat static ones — customers change`, 1, 75, 5, [
  q("topic-2-1-1", "q-task-2-1-1a", "Build Customer Segments", "Create 3 segments for a local coffee shop", "task", "A local coffee shop has 500 daily customers. Create 3 distinct segments using different methods (demographic, behavioral, psychographic). For each: (1) Name it, (2) List 3 defining traits, (3) Suggest one targeted marketing tactic.", 20, "easy"),
  q("topic-2-1-1", "q-task-2-1-1b", "RFM Scoring Practice", "Apply RFM scores to sample customers", "task", "Customer A: bought yesterday, shops weekly, spends $200/mo. B: bought 6mo ago, shopped twice, $50 total. C: bought 1mo ago, shops monthly, $150/mo. Score each R(1-5), F(1-5), M(1-5). Recommend an action per customer based on RFM score.", 20, "medium"),
  q("topic-2-1-1", "q-proj-2-1-1", "Segmentation Strategy Report", "Design a full customer segmentation", "project", "Choose a business you know. Design a complete segmentation: (1) 4 segments with detailed profiles, (2) RFM scoring criteria, (3) Marketing approach per segment, (4) Success metrics. 500+ words.", 50, "medium"),
  q("topic-2-1-1", "q-boss-2-1-1", "Segmentation Analytics Challenge", "Analyze data and recommend strategy", "boss_fight", "10K e-commerce customers: 40% buy once then never, 30% buy 2-5 times, 20% buy 6-20 times, 10% buy 20+ times. AOV: $45 / $55 / $72 / $120. Create 4 segments with boundaries, calculate LTV per segment, recommend retention strategies for each, propose 3 KPIs to track. 600+ words.", 100, "hard"),
])

// ── Marketing: Campaign Performance Analysis ─────────────────────────────────

const T2_1_2 = makeTopic(M2_1, "topic-2-1-2", "Campaign Performance Analysis", `## Campaign Performance Analysis

Measuring and optimizing marketing campaigns through data-driven analysis.

### Simple Explanation
Campaign analysis answers: What worked? What didn't? Where should we spend next? It's the difference between throwing darts blindfolded and aiming precisely.

### Key Metrics
- **Impressions** — How many times the ad was shown
- **Click-Through Rate (CTR)** — Clicks / Impressions
- **Conversion Rate** — Conversions / Clicks
- **Cost Per Acquisition (CPA)** — Total spend / Conversions
- **Return on Ad Spend (ROAS)** — Revenue / Ad spend

### The Marketing Funnel
Awareness → Interest → Consideration → Intent → Purchase → Retention

### Real-World Example
A SaaS company ran LinkedIn ads: $5K spend, 200K impressions, 2K clicks (1% CTR), 50 conversions (2.5% conversion), CPA = $100. Narrowing audience targeting raised CTR to 3% and dropped CPA to $60.

### Key Insights
- Benchmark against industry averages always
- High CTR doesn't guarantee quality conversions
- Attribute conversions correctly (first-touch vs last-touch)
- Test one variable at a time in A/B tests`, 2, 75, 5, [
  q("topic-2-1-2", "q-task-2-1-2a", "Campaign Metric Calculator", "Calculate performance metrics from campaign data", "task", "Campaign spent $10K, got 500K impressions, 15K clicks, 300 conversions, $45K revenue. Calculate: CTR, conversion rate, CPA, ROAS, revenue per click. Show formulas.", 15, "easy"),
  q("topic-2-1-2", "q-task-2-1-2b", "Funnel Analysis", "Identify underperforming funnel stages", "task", "Campaign A: 100K impressions → 2% CTR → 25% landing page → 10% signup → 5% purchase. Campaign B: 50K impressions → 1% CTR → 40% landing page → 15% signup → 8% purchase. Which performs better? Where does each need optimization?", 25, "medium"),
  q("topic-2-1-2", "q-proj-2-1-2", "Campaign Optimization Plan", "Design a data-driven campaign strategy", "project", "A mobile game spends $50K/month on ads. Current: $2.50 CPA, 2% conversion, 60% D1 retention, 25% D7, 10% D30. Design: (1) 3 channels to test, (2) Metrics to track, (3) Budget allocation, (4) Success criteria, (5) Timeline. 400+ words.", 50, "medium"),
  q("topic-2-1-2", "q-boss-2-1-2", "Multi-Channel Attribution", "Solve a complex attribution problem", "boss_fight", "Customer journey: Google ad (D1) → Blog (D3) → Facebook (D7) → Email (D10) → Purchase $200. Compare first-touch, last-touch, linear, and time-decay attribution. Assign credit per model, discuss pros/cons of each, recommend for different goals. 500+ words.", 100, "hard"),
])

// ── Marketing: Marketing Attribution ──────────────────────────────────────────

const T2_1_3 = makeTopic(M2_1, "topic-2-1-3", "Marketing Attribution", `## Marketing Attribution

Determining which marketing channels truly drive conversions.

### Simple Explanation
Attribution answers: When a customer buys, which ads/emails/content were most influential? It's a detective figuring out who actually solved the case.

### Attribution Models
1. **First-Touch** — Full credit to first interaction
2. **Last-Touch** — Full credit to last click before conversion
3. **Linear** — Equal credit to all touchpoints
4. **Time-Decay** — More credit to recent touchpoints
5. **Position-Based** — 40% first, 40% last, 20% middle
6. **Data-Driven** — ML-based algorithmic attribution

### Challenges
- Cross-device tracking is imperfect
- Offline-to-online attribution
- View-through conversions (saw but didn't click)
- Long B2B sales cycles with many touchpoints

### Real-World Example
A B2B company discovered webinars (seen as "middle-funnel") were actually the most influential touchpoint for enterprise deals, leading to 3x more webinar investment.

### Key Insights
- Last-touch is most common but often misleading
- No single model is perfect — use multiple
- Data-driven models need sufficient volume
- Align attribution model with business goals`, 3, 100, 6, [
  q("topic-2-1-3", "q-task-2-1-3a", "Attribute Touchpoints", "Apply different attribution models", "task", "Customer journey: Email (D1) → Search ad (D5) → Social (D10) → Direct (D14) → Purchase $500. Calculate credit for each channel under first-touch, last-touch, and linear models. Show percentages.", 20, "easy"),
  q("topic-2-1-3", "q-task-2-1-3b", "Choose the Right Model", "Match models to business scenarios", "task", "For each, recommend the best model: (1) New brand awareness campaign, (2) Retargeting cart abandoners, (3) B2B with 6-month cycle, (4) 24-hour flash sale, (5) Content brand-building. Explain why.", 25, "medium"),
  q("topic-2-1-3", "q-proj-2-1-3", "Attribution Framework Design", "Design a multi-channel attribution system", "project", "A retailer uses Facebook, Google Ads, email, affiliates, and organic. Design: (1) Primary attribution model, (2) Secondary comparison model, (3) Cross-device handling, (4) Minimum data rules, (5) Reporting template. 400+ words.", 50, "medium", "excel"),
  q("topic-2-1-3", "q-boss-2-1-3", "Attribution Strategy Case", "Solve a real attribution challenge", "boss_fight", "$100K/month across 5 channels. Last-touch says Google Ads drives 60% of revenue. Data-driven says only 30%; email is 25% vs 10%. Write: (1) Why last-touch overvalues Google Ads? (2) Testing to confirm correct model, (3) Recommend budget reallocation in $10K increments, (4) Validation KPIs. 600+ words.", 150, "hard"),
])

// ───────────────────────────────────────────────────────────────────────────────
// Module 2: Financial Analytics
// ───────────────────────────────────────────────────────────────────────────────

const T2_2_1 = makeTopic(M2_2, "topic-2-2-1", "Financial Ratios & Metrics", `## Financial Ratios & Metrics

Evaluating company performance through ratio analysis.

### Simple Explanation
Financial statements tell you what happened. Ratios tell you whether it's good or bad. Like knowing a runner's time vs knowing they're in the top 10%.

### Key Categories
**Profitability**: Gross Margin, Net Profit Margin, ROE
**Liquidity**: Current Ratio, Quick Ratio
**Efficiency**: Inventory Turnover, Asset Turnover
**Leverage**: Debt-to-Equity, Interest Coverage

### Real-World Example
A retailer's inventory turnover dropped from 4x to 2.5x and debt-to-equity rose from 0.5 to 1.2. Ratios revealed over-ordering and credit-funded expansion, enabling corrective action.

### Key Insights
- Ratios vary dramatically by industry
- A single ratio tells little — look at patterns
- Track trends over time, not just single values
- Non-financial metrics complement ratios`, 1, 75, 6, [
  q("topic-2-2-1", "q-task-2-2-1a", "Calculate Financial Ratios", "Compute key ratios from financials", "task", "Revenue $2M, COGS $1.2M, Net Income $300K, Current Assets $800K, Current Liabilities $400K, Inventory $200K, Total Assets $3M, Equity $1.5M, Debt $800K. Calculate: Gross Margin, Net Margin, Current Ratio, Quick Ratio, D/E, ROE.", 20, "easy"),
  q("topic-2-2-1", "q-task-2-2-1b", "Diagnose Business Health", "Interpret ratios to diagnose issues", "task", "Company A: GM 45%, NM 8%, Current 2.1, D/E 0.3, Inv Turn 6x. Company B: GM 42%, NM 3%, Current 0.8, D/E 2.1, Inv Turn 4x. Which is healthier? Flag specific concerns for each.", 25, "medium"),
  q("topic-2-2-1", "q-proj-2-2-1", "Competitive Financial Analysis", "Analyze a company vs competitors", "project", "Find a public company's financials. Calculate 8 key ratios and compare to industry averages. Write a 400-word report: ratios, comparison, 3 strengths, 3 risks, overall assessment.", 50, "medium"),
  q("topic-2-2-1", "q-boss-2-2-1", "Financial Health Assessment", "Write a full financial diagnostic", "boss_fight", "Manufacturer: profits down 20% despite revenue +15%. COGS +25%, Inv Turn 8x→5x, D/E 0.4→0.9, Current Ratio 2.0→1.2. Full diagnostic: root causes, 3 recommendations with financial estimates, risks, monitoring KPIs. 600+ words.", 150, "hard"),
])

const T2_2_2 = makeTopic(M2_2, "topic-2-2-2", "Budgeting & Forecasting", `## Budgeting & Forecasting

Creating financial projections to guide business decisions.

### Simple Explanation
A budget is a financial plan. A forecast is your best guess at actual outcomes. Budget = map, Forecast = GPS prediction.

### Key Methods
**Top-Down**: Market size → market share → revenue
**Bottom-Up**: Units × price → revenue
**Time Series**: Moving averages, exponential smoothing, regression

### Variance Analysis
Actual vs Budget = variance
Variance % = (Actual - Budget) / Budget × 100

### Real-World Example
A startup forecast $5M revenue but actual was $3.5M. Variance analysis showed price was on target (+2%) but units sold were 30% below forecast, prompting a sales strategy pivot.

### Key Insights
- Forecasts are always wrong — aim to be usefully wrong
- Combine multiple methods for better accuracy
- Track forecast accuracy over time
- Scenario planning beats single-point forecasts`, 2, 100, 6, [
  q("topic-2-2-2", "q-task-2-2-2a", "Build a Revenue Forecast", "Create bottom-up forecast", "task", "Bakery: Croissant $4 (50/day), Loaf $6 (30/day), Cake $25 (5/day). Expect 10% volume growth, 5% price increase. Calculate current and forecast monthly revenue. List 3 risk factors.", 20, "easy"),
  q("topic-2-2-2", "q-task-2-2-2b", "Variance Analysis", "Analyze budget vs actual", "task", "Budget: Revenue $500K, COGS $200K, Salaries $150K, Marketing $50K, Other $30K. Actual: $480K, $210K, $145K, $45K, $35K. Calculate variance $ and %. Identify favorable/unfavorable. Which need investigation?", 25, "medium"),
  q("topic-2-2-2", "q-proj-2-2-2", "Department Budget Plan", "Create a quarterly budget", "project", "15-person analytics team budget: salaries, software ($500/person/mo), training ($5K/quarter), cloud ($2K/mo + usage), contingency 10%. Justify each line, explain variance tracking. 400+ words.", 50, "medium", "excel"),
  q("topic-2-2-2", "q-boss-2-2-2", "Multi-Scenario Forecast", "Build best/base/worst case projections", "boss_fight", "SaaS: 500 customers at $100/mo, 5% churn, 30 new/mo. Scenarios: Base (trend continues), Growth (3% churn, 50 new/mo from feature launch), Risk (7% churn, 15 new/mo from competitor). Project 12 months for each. Recommend scenario likelihood and prep actions. 500+ words.", 150, "hard"),
])

const T2_2_3 = makeTopic(M2_2, "topic-2-2-3", "Investment Analysis", `## Investment Analysis

Evaluating investment opportunities quantitatively.

### Simple Explanation
Investment analysis answers: Should we spend money on this project? Like deciding between building a new store or renovating an existing one.

### Key Metrics
- **NPV**: Sum of discounted future cash flows minus investment
- **IRR**: Discount rate where NPV = 0
- **Payback Period**: Time to recover investment
- **ROI**: (Gain - Cost) / Cost × 100
- **Break-Even**: When revenue equals costs

### Time Value of Money
$100 today > $100 next year because of investment potential, inflation, and uncertainty.

### Real-World Example
A $1M automation project with $200K annual savings for 5 years at 10% discount rate: NPV = $200K × 3.79 - $1M = -$242K. Value-destroying. A $500K process improvement yielding $150K/year was NPV-positive.

### Key Insights
- Always discount future cash flows
- NPV is the most reliable go/no-go metric
- IRR can mislead for non-standard cash flows
- Consider strategic and non-financial factors`, 3, 100, 7, [
  q("topic-2-2-3", "q-task-2-2-3a", "NPV Calculation", "Calculate net present value", "task", "Project costs $100K, returns $30K/year for 5 years, discount rate 8%. Calculate NPV. Is it a good investment? What if returns were $25K/year?", 20, "easy"),
  q("topic-2-2-3", "q-task-2-2-3b", "Compare Investments", "Choose between competing opportunities", "task", "Option A: $200K investment, $60K/year for 4 years. Option B: $150K investment, $50K/year for 4 years. Discount rate 10%. Calculate NPV and payback for both. Which wins?", 25, "medium"),
  q("topic-2-2-3", "q-proj-2-2-3", "Investment Recommendation", "Write an investment analysis memo", "project", "Three projects: (1) Website $80K → $25K/yr benefit, (2) CRM $120K → $35K/yr, (3) Training $40K → $15K/yr. 3-year life, 10% discount. Calculate NPV, rank, write recommendation memo. 300+ words.", 50, "medium"),
  q("topic-2-2-3", "q-boss-2-2-3", "Capital Budgeting Challenge", "Allocate $500K across competing projects", "boss_fight", "Five projects with different costs, returns, and risk profiles. One R&D project has probabilistic returns. Calculate NPVs at 12% discount, consider risk, recommend optimal $500K portfolio. 600+ words.", 200, "hard"),
])

// ───────────────────────────────────────────────────────────────────────────────
// Module 3: Healthcare & Operations Analytics
// ───────────────────────────────────────────────────────────────────────────────

const T2_3_1 = makeTopic(M2_3, "topic-2-3-1", "Healthcare Data Analysis", `## Healthcare Data Analysis

Using analytics to improve patient outcomes and operational efficiency.

### Simple Explanation
Healthcare analytics turns patient records and operational data into better care decisions and lower costs.

### Key Areas
**Clinical**: Treatment effectiveness, readmission rates
**Operational**: Patient flow, bed utilization, staffing
**Financial**: Revenue cycle, cost per procedure
**Population Health**: Disease trends, preventive care

### Key Metrics
- 30-day Readmission Rate
- Average Length of Stay
- Patient Satisfaction Score
- Bed Occupancy Rate
- Cost Per Discharge

### Real-World Example
A hospital network found that follow-up calls within 48 hours of discharge reduced 30-day readmissions by 22%, saving $3.2M/year.

### Key Insights
- Privacy (HIPAA) is paramount
- Correlation in health data needs careful validation
- Clinical + data expertise = best results
- Small efficiency improvements have massive impact`, 1, 75, 7, [
  q("topic-2-3-1", "q-task-2-3-1a", "Healthcare KPI Calculation", "Compute key healthcare metrics", "task", "Hospital: 5,000 admissions, 4,200 discharges, 350 readmissions within 30 days, avg stay 4.5 days, 400 beds. Calculate readmission rate, bed occupancy rate, discharges per bed. Compare to benchmarks (15%, 85%, 10.5).", 20, "easy"),
  q("topic-2-3-1", "q-task-2-3-1b", "ER Process Improvement", "Identify improvement opportunities", "task", "ER data: 45min avg wait, 90min treatment, 8% leave without treatment, satisfaction 68/100, bed turnaround 3hrs. Which two metrics should be priority? Recommend one intervention per priority with expected impact.", 25, "medium"),
  q("topic-2-3-1", "q-proj-2-3-1", "Population Health Analysis", "Analyze population health patterns", "project", "100K patients, diabetes 12% prevalence. Neighborhoods A (18%) and B (15%) vs C (8%). Write: (1) Risk segments, (2) 3 interventions for high-prevalence areas, (3) Success metrics, (4) Timeline. 400+ words.", 50, "medium"),
  q("topic-2-3-1", "q-boss-2-3-1", "Healthcare Operations Transformation", "Design comprehensive improvement plan", "boss_fight", "300-bed hospital: 90% occupancy, 6hr ER wait, 18% readmission, $15M loss. Root cause analysis, 3-phase improvement plan with analytics interventions, savings estimates, KPIs per phase. 700+ words.", 200, "hard"),
])

const T2_3_2 = makeTopic(M2_3, "topic-2-3-2", "Supply Chain Analytics", `## Supply Chain Analytics

Optimizing material flow, inventory, and logistics with data.

### Simple Explanation
Supply chain analytics ensures the right product is in the right place at the right time with minimum cost.

### Key Metrics
- Inventory Turnover: COGS / Avg Inventory
- Days Inventory Outstanding: 365 / Turnover
- Order Fulfillment Cycle Time
- Perfect Order Rate: on-time + complete + undamaged
- Stockout Rate

### Key Techniques
- **ABC Analysis**: Classify by value (A=80% value, 20% items)
- **Economic Order Quantity**: Optimal order size
- **Safety Stock**: Buffer for demand uncertainty
- **Demand Forecasting**: Predict using historical data

### Real-World Example
Walmart reduced stockouts 16% and inventory $1B through better forecasting and vendor collaboration.

### Key Insights
- Integration across supply chain systems is key
- Too little inventory increases stockout risk
- Lead time variability often hurts more than demand variability`, 2, 75, 7, [
  q("topic-2-3-2", "q-task-2-3-2a", "Supply Chain KPI Calculation", "Calculate key metrics", "task", "Warehouse: $2M avg inventory, COGS $8M/yr, 95% fulfillment, 1.5% stockout, 14 day lead time. Calculate turnover, days inventory outstanding, perfect order rate (98% on-time, 97% complete, 99% undamaged).", 20, "easy"),
  q("topic-2-3-2", "q-task-2-3-2b", "ABC Inventory Analysis", "Classify inventory by value", "task", "10 SKUs with varying annual usage and unit costs. Classify each as A (70-80% value), B (15-20%), C (5-10%). Recommend control strategy per category.", 25, "medium"),
  q("topic-2-3-2", "q-proj-2-3-2", "Inventory Optimization Plan", "Design an inventory strategy", "project", "5K SKUs, $10M sales, 25% margin, 10% carrying cost, frequent stockouts on top 100 items. Design: ABC approach, safety stock formula, reorder system, tech recommendations, KPIs. 400+ words.", 50, "medium"),
  q("topic-2-3-2", "q-boss-2-3-2", "Supply Chain Transformation", "Solve a multi-faceted supply chain problem", "boss_fight", "50 stores, 2 warehouses, 3K SKUs. Stockouts 8%, inventory +30% YoY, turnover 6→4x, fulfillment 2→4 days. Root causes, data needed, recommendations (inventory policy, warehouse layout, forecasting), timeline, impact. 600+ words.", 200, "hard"),
])

const T2_3_3 = makeTopic(M2_3, "topic-2-3-3", "Operations Optimization", `## Operations Optimization

Improving processes and efficiency using data and analytical methods.

### Simple Explanation
Operations optimization is doing more with less — reducing waste, improving speed, increasing quality.

### Key Methods
- **Process Mapping**: Visualize workflows to find bottlenecks
- **Six Sigma**: DMAIC methodology
- **Queueing Theory**: Analyze wait times and capacity
- **Simulation**: Model changes without real-world risk

### Key Metrics
- Cycle Time, Throughput, First Pass Yield
- Capacity Utilization
- Overall Equipment Effectiveness (OEE)

### Real-World Example
A call center used queueing theory on 500K calls. Adding 3 agents during peak (11am-2pm) reduced wait from 12min to 3min, raising CSAT from 72 to 88.

### Key Insights
- 80% of improvements come from 20% of bottlenecks
- Measure first — data reveals what intuition misses
- Optimizing one step can hurt others (systems thinking)
- Involve frontline workers — they know the process`, 3, 100, 8, [
  q("topic-2-3-3", "q-task-2-3-3a", "Process Mapping Exercise", "Map and analyze a process", "task", "Pizza: Order 2min → Dough 5min → Toppings 3min → Bake 12min → Box 2min → Deliver 15-30min. Identify cycle time, bottleneck, one improvement, expected throughput impact.", 20, "easy"),
  q("topic-2-3-3", "q-task-2-3-3b", "Queueing Analysis", "Analyze wait times and capacity", "task", "Bank: 3 tellers, 15 customers/hr, 8min service time. Calculate utilization, expected wait. What happens with a 4th teller? Is adding tellers the best solution?", 25, "medium"),
  q("topic-2-3-3", "q-proj-2-3-3", "Process Improvement Proposal", "Design data-driven improvement", "project", "Choose a process (grocery checkout, airport security, fast food). Document steps, measure/estimate times, find bottleneck, calculate throughput, design improvement with expected impact. Include process map. 400+ words.", 50, "medium"),
  q("topic-2-3-3", "q-boss-2-3-3", "Operations Optimization Sprint", "Design full operations transformation", "boss_fight", "Fulfillment center: 200 workers, 10K orders/day, 5% errors, 85% shipped in 24hr (target 98%), overtime +40%, turnover 35%. Design comprehensive plan: data framework, process analysis, 5 interventions with impact, tech recommendations, change management, KPI dashboard. 700+ words.", 200, "hard"),
])

// ─── ASSEMBLE MODULES ──────────────────────────────────────────────────────────

export const phase2Modules: Module[] = [
  { id: M2_1, phase_id: P2, title: "Marketing Analytics", description: "Learn how analytics transforms marketing from guesswork to precision — customer segmentation, campaign analysis, and attribution modeling.", order_index: 1, unlock_level: 5, topics: [T2_1_1, T2_1_2, T2_1_3] },
  { id: M2_2, phase_id: P2, title: "Financial Analytics", description: "Master financial ratio analysis, budgeting and forecasting, and investment analysis to drive fiscal decisions.", order_index: 2, unlock_level: 6, topics: [T2_2_1, T2_2_2, T2_2_3] },
  { id: M2_3, phase_id: P2, title: "Healthcare & Operations Analytics", description: "Apply analytics to healthcare, supply chain, and operations — improving outcomes, efficiency, and cost management.", order_index: 3, unlock_level: 7, topics: [T2_3_1, T2_3_2, T2_3_3] },
]
