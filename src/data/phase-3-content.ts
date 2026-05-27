import { makeTopic, q } from "./seed-curriculum"
import type { Module } from "@/types/curriculum"

// ─── PHASE 3: CORE DATA ANALYTICS TOOLS ──────────────────────────────────────
// Module 1: Excel for Analytics
// Module 2: SQL for Data Analysis
// Module 3: Python for Data Analysis
// ───────────────────────────────────────────────────────────────────────────────

const P3 = "phase-3"
const M3_1 = "mod-3-1", M3_2 = "mod-3-2", M3_3 = "mod-3-3"

// ───────────────────────────────────────────────────────────────────────────────
// Module 1: Excel for Analytics
// ───────────────────────────────────────────────────────────────────────────────

const T3_1_1 = makeTopic(M3_1, "topic-3-1-1", "Advanced Excel Functions", `## Advanced Excel Functions

Moving beyond SUM and AVERAGE into the functions that power real analytics work.

### Simple Explanation
Basic Excel is a calculator. Advanced Excel is a data analysis toolkit. These functions let you clean, transform, and analyze data without writing code.

### Essential Functions

**Lookup & Reference**
- \`VLOOKUP\` / \`HLOOKUP\`: Find values by matching
- \`INDEX-MATCH\`: More flexible than VLOOKUP
- \`XLOOKUP\`: Modern replacement for all lookups

**Logical**
- \`IF\`, \`IFS\`: Conditional logic
- \`AND\`, \`OR\`, \`NOT\`: Compound conditions
- \`IFERROR\`: Graceful error handling

**Text**
- \`LEFT\`, \`RIGHT\`, \`MID\`: Extract from strings
- \`LEN\`: String length
- \`TRIM\`: Remove extra spaces
- \`CONCAT\` / \`TEXTJOIN\`: Combine strings

**Date & Time**
- \`DATEDIF\`: Calculate date differences
- \`NETWORKDAYS\`: Business days between dates
- \`EOMONTH\`: End of month calculations

**Statistical**
- \`COUNTIF\` / \`COUNTIFS\`: Conditional counting
- \`SUMIF\` / \`SUMIFS\`: Conditional summing
- \`AVERAGEIF\`: Conditional averaging

### Real-World Example
An analyst used XLOOKUP to match 5K customer IDs across two spreadsheets in seconds, replacing a manual 4-hour task. Then used SUMIFS to calculate regional sales totals from the merged data.

### Key Insights
- Learn INDEX-MATCH before XLOOKUP (you'll encounter old workbooks)
- Nested IFs get messy fast — use IFS instead
- Always use absolute references ($A$1) when copying formulas
- Test your formulas on small data before scaling up`, 1, 75, 10, [
  q("topic-3-1-1", "q-task-3-1-1a", "VLOOKUP Practice", "Match customer IDs to names using VLOOKUP", "task", "You have two tables: Orders (order_id, customer_id, amount) and Customers (customer_id, name, city). Using VLOOKUP, write the formula to pull customer name into the orders table. Then explain the limitation of VLOOKUP and how INDEX-MATCH solves it. Provide example formulas.", 20, "easy"),
  q("topic-3-1-1", "q-task-3-1-1b", "SUMIFS Challenge", "Calculate conditional sums across categories", "task", "A table has: Product, Region, Sales, Month. Write SUMIFS formulas to find: (1) Total sales for Product A, (2) Sales for Product A in North region, (3) Sales for Product A in North region in Q1 (months Jan-Mar). Explain each formula component.", 25, "medium"),
  q("topic-3-1-1", "q-proj-3-1-1", "Excel Data Cleaning Project", "Clean and prepare a messy dataset", "project", "You receive a CSV with: mixed date formats, trailing spaces, blank cells, inconsistent capitalization, and merged cells. Document a step-by-step cleaning process using Excel functions: TRIM, UPPER/PROPER, IFERROR, TEXT formulas, and Find & Replace. Show before/after examples. 400+ words.", 50, "medium", "excel"),
  q("topic-3-1-1", "q-boss-3-1-1", "Excel Automation Challenge", "Build a reusable report template", "boss_fight", "You need to build a monthly sales report template that: (1) Pulls data from a raw data sheet, (2) Cleans and validates entries, (3) Calculates KPIs (total sales, growth %, top products, regional breakdown), (4) Has a dashboard sheet with charts that auto-update. Describe: formulas used, sheet structure, data validation rules, chart types, and how you'd make it user-proof. 500+ words.", 100, "hard"),
])

const T3_1_2 = makeTopic(M3_1, "topic-3-1-2", "Pivot Tables & Charts", `## Pivot Tables & Charts

Excel's most powerful feature for summarizing and analyzing data interactively.

### Simple Explanation
A pivot table is like a Swiss Army knife for data. With a few clicks, you can slice, dice, summarize, and explore thousands of rows of data.

### Pivot Table Essentials
**Rows & Columns**: How to organize your data
**Values**: What to calculate (SUM, COUNT, AVERAGE, etc.)
**Filters**: Which data to include
**Slicers**: Visual filters for interactive dashboards

### Advanced Pivot Features
- **Calculated Fields**: Custom formulas within pivot tables
- **Grouping**: Group dates (by month, quarter, year), numbers (by range), or text
- **Show Values As**: % of total, running total, difference from
- **GETPIVOTDATA**: Reference pivot values in formulas
- **Power Pivot**: Work with millions of rows from multiple sources

### Chart Types for Analytics
- **Line Chart**: Trends over time
- **Column/Bar Chart**: Comparisons across categories
- **Pie/Doughnut**: Parts of a whole (use sparingly)
- **Scatter Plot**: Relationships between variables
- **Histogram**: Distribution of values
- **Waterfall**: Sequential changes (financials)
- **Combo Chart**: Mixed chart types on same axis

### Real-World Example
A retail analyst used a pivot table to analyze 50K transactions in 2 minutes: rows = product category, columns = region, values = SUM of sales. Added slicers for month and found that Electronics in the West region was the best-performing combination.

### Key Insights
- PivotTables work best with clean tabular data (no blank rows, no merged cells)
- Format source data as a Table (Ctrl+T) before pivoting
- Refreshing data source when new data arrives
- Pivot charts update automatically with slicer changes`, 2, 100, 10, [
  q("topic-3-1-2", "q-task-3-1-2a", "Build a Pivot Table", "Create a pivot table to summarize sales data", "task", "Given a dataset with Date, Region, Product, Salesperson, Units, Revenue. Create a pivot table showing Revenue by Region (rows) and Product (columns). Add a slicer for salesperson. Describe each step and what insights each view reveals.", 20, "easy"),
  q("topic-3-1-2", "q-task-3-1-2b", "Calculated Fields", "Add custom calculations to pivot tables", "task", "Using the same dataset, add a calculated field for 'Profit' (Revenue * 0.4). Then create a calculated field showing 'Revenue per Unit' (Revenue/Units). Show the formulas and explain when calculated fields are better vs adding columns to source data.", 25, "medium"),
  q("topic-3-1-2", "q-proj-3-1-2", "Interactive Dashboard", "Build a sales dashboard with pivot charts", "project", "Design a one-page interactive Excel dashboard with: (1) 4 pivot tables (sales by region, product performance, monthly trend, salesperson ranking), (2) Slicers for region and month, (3) At least 3 chart types, (4) Conditional formatting for KPIs. Describe layout, chart choices, interactivity, and data refresh process. 400+ words.", 50, "medium", "excel"),
  q("topic-3-1-2", "q-boss-3-1-2", "Executive Dashboard Project", "Design a complete analytics dashboard", "boss_fight", "You're building a monthly executive dashboard for a 50-store retail chain. Requirements: (1) 6 key KPIs with status indicators, (2) Sales trend with forecast line, (3) Store performance comparison, (4) Product category breakdown, (5) Regional map, (6) Ability to drill into specific stores. Design the complete dashboard: sheet structure, data model, pivot tables, chart types, interactivity (slicers/timelines), conditional formatting rules, and how you'd handle 200K+ rows. 600+ words.", 150, "hard"),
])

const T3_1_3 = makeTopic(M3_1, "topic-3-1-3", "Statistical Analysis in Excel", `## Statistical Analysis in Excel

Using Excel's built-in statistical tools for data analysis.

### Simple Explanation
Excel isn't just for business reports — it has powerful statistical analysis capabilities that can reveal patterns, test hypotheses, and make predictions.

### Descriptive Statistics
- **Mean, Median, Mode**: Central tendency
- **Standard Deviation, Variance**: Spread of data
- **Min, Max, Range, Quartiles**: Data distribution
- **SKEW, KURT**: Shape of distribution
- **Data Analysis Toolpak**: One-click descriptive stats

### Correlation & Regression
- **CORREL**: Correlation coefficient between variables
- **RSQ**: R-squared value for regression fit
- **LINEST**: Linear regression coefficients
- **FORECAST.LINEAR**: Predict future values
- **Regression Tool**: Full regression analysis

### Hypothesis Testing
- **T.TEST**: Compare two group means
- **Z.TEST**: Test against population mean
- **CHISQ.TEST**: Test categorical relationships
- **F.TEST**: Compare variances

### Real-World Example
An HR analyst used regression in Excel to model employee satisfaction: factors included salary, commute time, manager rating, and years at company. The model showed commute time had the strongest negative impact, leading to a remote work policy change.

### Key Insights
- The Analysis Toolpak must be enabled (File → Options → Add-ins)
- Correlation does not equal causation
- Check for outliers before running statistics
- Sample size matters — small samples give unreliable results`, 3, 100, 10, [
  q("topic-3-1-3", "q-task-3-1-3a", "Descriptive Statistics", "Calculate and interpret descriptive stats", "task", "A dataset has these values: 23, 45, 67, 12, 89, 34, 56, 78, 90, 11, 45, 67. Calculate mean, median, mode, standard deviation, min, max, range. What does the standard deviation tell you? Is the data skewed?", 20, "easy", "excel"),
  q("topic-3-1-3", "q-task-3-1-3b", "Correlation Analysis", "Find and interpret correlations", "task", "Data: Advertising spend ($K): 10, 15, 20, 25, 30, 35. Sales ($K): 45, 55, 60, 75, 80, 100. Calculate: (1) Correlation coefficient, (2) R-squared, (3) Interpret the strength and direction, (4) What could confound this relationship?", 25, "medium"),
  q("topic-3-1-3", "q-proj-3-1-3", "Regression Modeling", "Build a predictive regression model", "project", "A real estate agent has data on 50 house sales: price, sq ft, bedrooms, bathrooms, age, distance to city center. Build a multiple regression model in Excel. Interpret: (1) R-squared, (2) Each coefficient, (3) P-values for significance, (4) Which factors matter most? (5) Predict price for a 2,000sqft, 3BR, 2BA, 10yr old, 5mi from center. 500+ words.", 75, "medium", "excel"),
  q("topic-3-1-3", "q-boss-3-1-3", "A/B Test Analysis", "Conduct a full A/B test analysis in Excel", "boss_fight", "An e-commerce site ran an A/B test on checkout page design. Control (n=500): 45 conversions. Variant (n=500): 62 conversions. Revenue per visitor: Control $3.20, Variant $4.15. Run a full analysis: (1) Calculate conversion rates and lift, (2) Run a two-proportion z-test or chi-square test, (3) Calculate statistical significance, (4) Revenue impact if rolled out to 100K visitors/mo, (5) Write a recommendation. 600+ words.", 150, "hard"),
])

// ───────────────────────────────────────────────────────────────────────────────
// Module 2: SQL for Data Analysis
// ───────────────────────────────────────────────────────────────────────────────

const T3_2_1 = makeTopic(M3_2, "topic-3-2-1", "Querying & Filtering Data", `## Querying & Filtering Data

SQL (Structured Query Language) is the universal language for accessing and manipulating databases.

### Simple Explanation
SQL is how you talk to databases. If data is stored in a warehouse, SQL is the forklift — it gets you exactly what you need, when you need it.

### Core SELECT Statement
\`\`\`sql
SELECT column1, column2
FROM table_name
WHERE condition
GROUP BY column
HAVING group_condition
ORDER BY column ASC/DESC
LIMIT n;
\`\`\`

### Key Filtering Techniques
- **WHERE**: Filter rows (=, <, >, <>, BETWEEN, LIKE, IN, IS NULL)
- **LIKE**: Pattern matching (% wildcard, _ single char)
- **IN**: Match against list of values
- **BETWEEN**: Range filter (inclusive)
- **Logical Operators**: AND, OR, NOT

### Sorting & Limiting
- **ORDER BY**: Sort results (ASC ascending, DESC descending)
- **LIMIT**: Return only N rows
- **OFFSET**: Skip N rows before returning

### Real-World Example
\`\`\`sql
SELECT product_name, SUM(quantity) as total_sold
FROM sales
WHERE sale_date >= '2024-01-01'
  AND region IN ('North', 'East')
GROUP BY product_name
HAVING SUM(quantity) > 100
ORDER BY total_sold DESC
LIMIT 10;
\`\`\`
This query finds the top 10 products by quantity sold in 2024 for North and East regions.

### Key Insights
- SELECT * is fine for exploring but never use in production
- WHERE filters rows before grouping; HAVING filters after
- SQL order of execution: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT
- Use table aliases (AS) for readability`, 1, 75, 10, [
  q("topic-3-2-1", "q-task-3-2-1a", "Basic SQL Queries", "Write SELECT statements with filters", "task", "Given an 'employees' table with columns: id, name, department, salary, hire_date, city. Write SQL queries to: (1) Show all employees in 'Engineering', (2) Show names and salaries of employees earning > $80K, (3) Show employees hired in 2023, (4) Show employees in 'NYC' or 'SF' earning < $70K, (5) Show the 5 highest-paid employees.", 20, "easy", "sql"),
  q("topic-3-2-1", "q-task-3-2-1b", "Pattern Matching & Sorting", "Use LIKE, IN, BETWEEN, and ORDER BY", "task", "Same employees table. Write queries to: (1) Find employees whose name starts with 'J', (2) Find employees with 'manager' in their title, (3) Find employees hired between 2020 and 2022, (4) Find employees in departments 'Sales', 'Marketing', or 'Support', (5) Show employees sorted by department then salary descending.", 25, "medium", "sql"),
  q("topic-3-2-1", "q-proj-3-2-1", "Sales Analysis Queries", "Write analytical SQL queries on a sales database", "project", "Given tables: products(id, name, category, price), customers(id, name, city, signup_date), sales(id, product_id, customer_id, quantity, sale_date). Write 8 queries to analyze: (1) Top 10 products by revenue, (2) Monthly sales trend, (3) Customers who haven't purchased in 6 months, (4) Most popular category by revenue, (5) Customer segmentation by total spend, (6) Average order value by month, (7) Products never sold, (8) Repeat purchase rate. Provide queries and explain results.", 75, "medium", "sql"),
  q("topic-3-2-1", "q-boss-3-2-1", "Exploratory Data Analysis with SQL", "Perform a complete EDA using SQL", "boss_fight", "You have a database of 100K transactions. Tables: customers (50K rows), orders (200K rows), products (5K rows), reviews (30K rows). Write a comprehensive analytical query set: (1) Data quality checks (nulls, duplicates, outliers), (2) Customer cohort analysis (signup month vs retention), (3) Product affinity analysis (products frequently bought together), (4) RFM segmentation query, (5) Rolling revenue calculations, (6) Customer lifetime value estimation. Explain each query's business value. 700+ words.", 150, "hard", "sql"),
])

const T3_2_2 = makeTopic(M3_2, "topic-3-2-2", "Joins & Aggregations", `## Joins & Aggregations

Combining data from multiple tables and computing summaries.

### Simple Explanation
JOINs are how you connect related tables. Aggregations are how you summarize data. Together, they form the backbone of analytical SQL.

### Types of JOINs
- **INNER JOIN**: Returns matching rows from both tables
- **LEFT JOIN**: Returns all rows from left table, matching from right
- **RIGHT JOIN**: Returns all rows from right table, matching from left
- **FULL OUTER JOIN**: Returns all rows from both tables
- **CROSS JOIN**: Cartesian product of both tables
- **SELF JOIN**: Join a table to itself

### Aggregation Functions
- **COUNT()**: Number of rows
- **SUM()**: Total of numeric column
- **AVG()**: Average of numeric column
- **MIN() / MAX()**: Minimum/maximum value
- **COUNT(DISTINCT)**: Count unique values

### Advanced Aggregation
- **GROUP BY**: Group rows for aggregation
- **HAVING**: Filter groups (like WHERE for groups)
- **GROUPING SETS**: Multiple groupings in one query
- **ROLLUP**: Hierarchical summaries (weekly → monthly → yearly)
- **CUBE**: All combinations of groupings

### Real-World Example
\`\`\`sql
SELECT c.segment,
       COUNT(DISTINCT c.id) as customer_count,
       SUM(o.amount) as total_revenue,
       AVG(o.amount) as avg_order_value
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.order_date >= '2024-01-01'
GROUP BY c.segment
HAVING COUNT(DISTINCT c.id) > 100
ORDER BY total_revenue DESC;
\`\`\`

### Key Insights
- INNER JOIN excludes non-matching rows — use LEFT JOIN to keep all
- JOIN order affects performance but not results (optimizer chooses)
- COUNT(*) counts all rows; COUNT(column) excludes nulls
- GROUP BY columns must appear in SELECT or be aggregated`, 2, 100, 11, [
  q("topic-3-2-2", "q-task-3-2-2a", "JOIN Practice", "Write queries combining multiple tables", "task", "Tables: students(id, name, class_id), classes(id, name, teacher), grades(student_id, subject, score). Write queries to: (1) Show each student with their class name, (2) Show all classes and count of students per class (including empty classes), (3) Show each student's average grade per subject, (4) Find students with no grades recorded.", 20, "easy", "sql"),
  q("topic-3-2-2", "q-task-3-2-2b", "Aggregation Techniques", "Write queries with GROUP BY and HAVING", "task", "Orders table: order_id, customer_id, product_id, quantity, price, order_date. Write queries to: (1) Total revenue per customer, (2) Average order value per month, (3) Customers with total spend > $500, (4) Products with less than 10 units sold total, (5) Daily revenue for the last 30 days.", 25, "medium", "sql"),
  q("topic-3-2-2", "q-proj-3-2-2", "Business Intelligence Queries", "Build a set of BI SQL queries", "project", "Design and write 10 SQL queries for an e-commerce BI dashboard. Tables: customers, orders, order_items, products, categories, reviews. Queries should cover: (1) Revenue KPIs (total, growth, AOV), (2) Customer metrics (new vs returning, churn, LTV), (3) Product performance (top sellers, inventory turnover), (4) Operational metrics (fulfillment time, return rate). Provide full SQL and explain each query's business purpose. 500+ words.", 75, "medium", "sql"),
  q("topic-3-2-2", "q-boss-3-2-2", "Advanced SQL Analytics", "Solve complex analytical problems with SQL", "boss_fight", "A subscription business has tables: users(id, signup_date, plan), subscriptions(user_id, start_date, end_date, amount), events(user_id, event_type, event_date). Write queries to: (1) Monthly cohort retention analysis (users who signed up in month X, % still active in month Y), (2) Customer lifetime value by acquisition channel (use self-join or window functions), (3) Churn prediction feature extraction (last login, support tickets, usage decline), (4) Revenue recognition schedule (monthly recurring revenue), (5) Funnel analysis (trial → paid → renewal). Use window functions, CTEs, and date manipulations. 800+ words.", 200, "hard", "sql"),
])

const T3_2_3 = makeTopic(M3_2, "topic-3-2-3", "Subqueries & CTEs", `## Subqueries & CTEs

Advanced SQL patterns for complex analytical queries.

### Simple Explanation
Subqueries are queries within queries — like asking a question, then using the answer to ask another question. CTEs (Common Table Expressions) are named subqueries that make complex SQL readable.

### Subqueries
**Scalar Subquery**: Returns single value
\`\`\`sql
SELECT name, salary
FROM employees
WHERE salary > (SELECT AVG(salary) FROM employees);
\`\`\`

**Row Subquery**: Returns single row
**Table Subquery**: Returns result set (used with IN, EXISTS)
**Correlated Subquery**: References outer query

### CTEs (WITH clause)
\`\`\`sql
WITH revenue_by_region AS (
  SELECT region, SUM(revenue) as total_revenue
  FROM sales GROUP BY region
),
top_regions AS (
  SELECT region FROM revenue_by_region
  WHERE total_revenue > 100000
)
SELECT * FROM top_regions;
\`\`\`

### Window Functions
- **ROW_NUMBER()**: Sequential row number within partition
- **RANK() / DENSE_RANK()**: Ranking with gaps / without gaps
- **LAG() / LEAD()**: Access previous/next row values
- **SUM() OVER**: Running totals and moving averages
- **FIRST_VALUE() / LAST_VALUE()**: First/last in partition

### Real-World Example
\`\`\`sql
WITH monthly_revenue AS (
  SELECT DATE_TRUNC('month', order_date) as month,
         SUM(amount) as revenue
  FROM orders GROUP BY month
),
growth AS (
  SELECT month, revenue,
         LAG(revenue) OVER (ORDER BY month) as prev_revenue,
         (revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month) * 100 as growth_pct
  FROM monthly_revenue
)
SELECT * FROM growth;
\`\`\`

### Key Insights
- CTEs make complex queries readable and maintainable
- Correlated subqueries can be slow — rewrite as JOINs when possible
- EXISTS is often faster than IN for large datasets
- Window functions are the most powerful SQL feature for analytics`, 3, 100, 11, [
  q("topic-3-2-3", "q-task-3-2-3a", "Subquery Practice", "Write queries using subqueries", "task", "Employees table: id, name, department, salary. Departments table: id, name, budget. Write queries using subqueries to: (1) Find employees earning more than their department average, (2) Find departments where avg salary > company avg, (3) Find the top-paid employee in each department (correlated subquery), (4) Find departments with salary budget underspend.", 25, "easy", "sql"),
  q("topic-3-2-3", "q-task-3-2-3b", "CTE & Window Functions", "Write CTEs and window function queries", "task", "Orders: id, customer_id, amount, order_date. Write queries using CTEs and window functions to: (1) Rank customers by total spend, (2) Show each order with running total per customer, (3) Calculate month-over-month revenue growth %, (4) Find each customer's second purchase date, (5) Moving 3-month average of daily orders.", 30, "medium", "sql"),
  q("topic-3-2-3", "q-proj-3-2-3", "Analytical SQL Project", "Write a comprehensive analytical SQL pipeline", "project", "A marketing team needs a weekly performance report. Tables: campaigns(id, name, start_date, budget), ad_spend(campaign_id, date, spend), leads(id, campaign_id, created_date, status), conversions(lead_id, deal_value, close_date). Write a CTE-based analytical query that produces: (1) Campaign performance (spend, leads, conversions, revenue, ROAS), (2) Lead conversion funnel (lead → qualified → opportunity → closed), (3) Weekly trend with running totals, (4) Budget utilization %, (5) Compare to previous period. 600+ words.", 100, "medium", "sql"),
  q("topic-3-2-3", "q-boss-3-2-3", "Data Pipeline Design", "Design and implement a complete data analysis pipeline in SQL", "boss_fight", "You're building a customer analytics pipeline. Tables: events (50M rows, columns: user_id, event_type, event_date, page_url, session_id), users (500K rows: id, signup_date, plan, referral_source), subscriptions (payment history), support_tickets. Design and write SQL queries for: (1) Data quality checks (null rates, duplicate events, outlier dates), (2) User sessionization (assign session IDs, calculate session duration, pages per session), (3) Funnel analysis (visit → signup → first purchase → repeat purchase), (4) Cohort analysis (monthly retention tables), (5) Feature engineering for churn prediction (30+ features: login frequency, pages viewed, support contacts, payment history, time since last activity), (6) A/B test analysis (significance testing using SQL). Optimization notes: partition strategies, indexing recommendations, materialized view suggestions. 1000+ words.", 250, "hard", "sql"),
])

// ───────────────────────────────────────────────────────────────────────────────
// Module 3: Python for Data Analysis
// ───────────────────────────────────────────────────────────────────────────────

const T3_3_1 = makeTopic(M3_3, "topic-3-3-1", "Python Basics for Analytics", `## Python Basics for Analytics

Python is the most popular language for data analysis — versatile, readable, with an ecosystem of powerful libraries.

### Simple Explanation
If Excel is a bicycle and SQL is a car, Python is a spaceship. It can handle massive datasets, automate complex workflows, and build predictive models.

### Getting Started
Python data analysis stack:
- **Pandas**: Data manipulation
- **NumPy**: Numerical computing
- **Matplotlib**: Basic plotting
- **Seaborn**: Statistical visualizations
- **Scikit-learn**: Machine learning

### Core Python Concepts for Analytics
**Variables & Data Types**: int, float, string, boolean, list, dict
**Control Flow**: if/elif/else, for loops, while loops
**Functions**: def, parameters, return values
**List Comprehensions**: Concise list creation
**Lambda Functions**: Anonymous one-line functions

### Working with Jupyter Notebooks
Jupyter provides an interactive environment where you can combine code, visualizations, and explanatory text — perfect for exploratory data analysis.

### Real-World Example
\`\`\`python
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('sales_data.csv')
monthly_sales = df.groupby('month')['revenue'].sum()
monthly_sales.plot(kind='line', title='Monthly Revenue Trend')
plt.show()
\`\`\`

### Key Insights
- Start with Pandas — it's the foundation of data analysis in Python
- Use Jupyter notebooks for exploration, .py files for production
- Python is case-sensitive and indentation matters
- The community is huge — almost any problem has a solution on Stack Overflow`, 1, 75, 12, [
  q("topic-3-3-1", "q-task-3-3-1a", "Python Data Types", "Work with Python data structures", "task", "Create Python variables representing: (1) A list of 5 product prices, (2) A dictionary mapping product names to prices, (3) A tuple of coordinates (lat, lon), (4) A set of unique customer IDs. Then write a function that takes a price list and returns the average, min, and max. Show the code and output.", 20, "easy", "python"),
  q("topic-3-3-1", "q-task-3-3-1b", "List Comprehensions & Lambdas", "Use advanced Python patterns", "task", "Given a list of sales amounts: [1200, 3400, 560, 2300, 890, 4500, 120]. Use list comprehensions to: (1) Create a list of amounts > $1000, (2) Apply 10% discount to all amounts, (3) Create a list of (original, discounted) pairs. Then use a lambda with sorted() to sort products by price descending. Show all code.", 25, "medium", "python"),
  q("topic-3-3-1", "q-proj-3-3-1", "Automated Report Script", "Build a Python data analysis script", "project", "Write a Python script that: (1) Reads a CSV file with columns (date, product, region, units, revenue), (2) Cleans the data (handle missing values, fix data types), (3) Computes key metrics (total revenue, top products, regional breakdown), (4) Creates three visualizations (trend line, bar chart, pie chart), (5) Exports results to a summary CSV. The script should be reusable — accept the CSV filename as a parameter. 500+ words.", 75, "medium", "python"),
  q("topic-3-3-1", "q-boss-3-3-1", "Data Analysis Automation", "Build a complete data pipeline in Python", "boss_fight", "You receive daily CSV files from 5 sources with different formats. Build a Python pipeline that: (1) Automatically discovers and reads all files, (2) Validates schema and data quality, (3) Standardizes column names and formats, (4) Merges into a single dataset, (5) Computes 10 business KPIs, (6) Generates a PDF report with 5 charts, (7) Archives raw files and logs processing status. Design the class structure, error handling, and scheduling approach. 800+ words.", 200, "hard", "python"),
])

const T3_3_2 = makeTopic(M3_3, "topic-3-3-2", "Pandas & Data Manipulation", `## Pandas & Data Manipulation

Pandas is the Swiss Army knife of data analysis in Python.

### Simple Explanation
Pandas is like Excel on steroids — it gives you spreadsheet-like power with programming flexibility. A DataFrame is like an Excel sheet that you can manipulate programmatically.

### Core DataFrame Operations
**Reading Data**: read_csv, read_excel, read_sql, read_json
**Exploring Data**: head(), info(), describe(), shape, columns
**Filtering**: df[df['column'] > value], query(), loc[], iloc[]
**Selecting Columns**: Single column (series), multiple columns (list)
**Adding Columns**: df['new'] = calculation, assign()

### Data Cleaning
- **Handling Missing Values**: dropna(), fillna(), interpolate()
- **Removing Duplicates**: drop_duplicates()
- **Renaming Columns**: rename()
- **Changing Data Types**: astype(), to_datetime()
- **String Operations**: str.contains(), str.extract(), str.replace()

### Grouping & Aggregation
\`\`\`python
df.groupby('region').agg({
    'revenue': 'sum',
    'orders': 'count',
    'profit': 'mean'
}).reset_index()
\`\`\`

### Merging & Joining
- **merge()**: SQL-style joins (inner, left, right, outer)
- **concat()**: Stack DataFrames vertically or horizontally
- **join()**: Join on index

### Real-World Example
\`\`\`python
import pandas as pd
# Clean and analyze messy survey data
df = pd.read_csv('survey.csv')
df = df.dropna(subset=['age', 'income']).drop_duplicates()
df['age_group'] = pd.cut(df['age'], bins=[0, 25, 35, 50, 100], labels=['18-25', '26-35', '36-50', '50+'])
summary = df.groupby('age_group')['income'].agg(['mean', 'median', 'count'])
\`\`\`

### Key Insights
- Avoid chained indexing (df[df['x'] > 0]['y']) — use .loc instead
- Vectorized operations are faster than loops
- Use inplace=False (default) for safer operations
- reset_index() after groupby() for cleaner DataFrames`, 2, 100, 12, [
  q("topic-3-3-2", "q-task-3-3-2a", "DataFrame Basics", "Explore and manipulate DataFrames", "task", "Create a DataFrame from a dictionary of 10 customers (name, age, city, spend). Then: (1) Show the first 5 rows, (2) Filter customers with spend > $500, (3) Add a 'segment' column (Premium if spend > $1000 else Standard), (4) Sort by spend descending, (5) Find the average age per city. Show all code and output.", 20, "easy", "python"),
  q("topic-3-3-2", "q-task-3-3-2b", "Data Cleaning Pipeline", "Clean a messy DataFrame", "task", "Given a DataFrame with: missing values, duplicate rows, mixed date formats, inconsistent text (e.g., 'NYC', 'New York', 'new york'), and wrong data types. Write a cleaning pipeline that: (1) Identifies all data quality issues, (2) Handles each appropriately, (3) Validates the cleaned data. Show before/after summaries. 300+ words.", 30, "medium", "python"),
  q("topic-3-3-2", "q-proj-3-3-2", "Exploratory Data Analysis", "Perform a complete EDA with Pandas", "project", "Using a dataset of your choice (Kaggle, public data, or generated): (1) Load and clean the data, (2) Generate summary statistics for all columns, (3) Create at least 6 visualizations exploring patterns and relationships, (4) Segment the data into meaningful groups and compare, (5) Write a 500-word report of findings. Include all code in a Jupyter notebook format.", 100, "medium", "python"),
  q("topic-3-3-2", "q-boss-3-3-2", "Advanced Data Wrangling Challenge", "Solve complex data transformation problems", "boss_fight", "You receive data from 4 sources: (A) Customer data CSV (10K rows, inconsistent columns), (B) Transaction JSON (50K records, nested), (C) Web analytics export (100K rows, wide format), (D) Legacy system dump (fixed-width file, messy encoding). Build a Python/Pandas pipeline that: (1) Extracts and standardizes all sources, (2) Handles data quality (nulls 40% in some columns, outliers, duplicates across sources), (3) Merges into a unified customer 360 dataset, (4) Creates feature store (30+ features: recency, frequency, monetary, tenure, engagement score), (5) Exports as Parquet with schema validation. Handle memory efficiently (chunking, dtypes). 1000+ words.", 300, "hard", "python"),
])

const T3_3_3 = makeTopic(M3_3, "topic-3-3-3", "Data Visualization with Python", `## Data Visualization with Python

Creating compelling visualizations to communicate insights.

### Simple Explanation
A great visualization can reveal patterns that are invisible in raw data. Python's visualization libraries give you the power to create anything from quick exploratory plots to publication-ready graphics.

### Matplotlib: The Foundation
\`\`\`python
import matplotlib.pyplot as plt
import numpy as np

x = np.linspace(0, 10, 100)
plt.figure(figsize=(10, 6))
plt.plot(x, np.sin(x), label='sin(x)', linewidth=2)
plt.plot(x, np.cos(x), label='cos(x)', linewidth=2)
plt.title('Trigonometric Functions')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()
\`\`\`

### Seaborn: Statistical Visualizations
- **barplot**: Categorical comparisons
- **boxplot**: Distribution and outliers
- **violinplot**: Distribution shape
- **heatmap**: Correlation matrices
- **pairplot**: Multi-dimensional relationships
- **lineplot**: Trends with confidence intervals

### Choosing the Right Chart
| Goal | Chart Type |
|------|-----------|
| Trend over time | Line chart |
| Compare categories | Bar chart |
| Distribution | Histogram, boxplot |
| Relationship | Scatter plot |
| Composition | Stacked bar, pie |
| Correlation | Heatmap |
| Part-to-whole | Treemap |

### Best Practices
- Colorblind-friendly palettes (use Seaborn's colorblind or viridis)
- Remove chartjunk (unnecessary gridlines, borders, effects)
- Always label axes and include units
- Titles should state the insight, not describe the chart
- Use annotations to highlight key findings

### Real-World Example
\`\`\`python
import seaborn as sns
import matplotlib.pyplot as plt

df = sns.load_dataset('tips')
sns.set_style('whitegrid')
fig, axes = plt.subplots(1, 2, figsize=(12, 5))
sns.barplot(data=df, x='day', y='total_bill', hue='sex', ax=axes[0])
axes[0].set_title('Average Bill by Day and Gender')
sns.boxplot(data=df, x='day', y='total_bill', ax=axes[1])
axes[1].set_title('Bill Distribution by Day')
plt.tight_layout()
plt.show()
\`\`\`

### Key Insights
- matplotlib controls everything but requires more code
- Seaborn is built on matplotlib — learn both
- 80% of your visualizations should be simple (bar, line, scatter)
- Interactive libraries (Plotly, Bokeh) for web dashboards`, 3, 100, 13, [
  q("topic-3-3-3", "q-task-3-3-3a", "Basic Plotting", "Create basic charts with Matplotlib", "task", "Using monthly revenue data [Jan=45, Feb=52, Mar=48, Apr=63, May=58, Jun=72, Jul=68, Aug=75, Sep=71, Oct=80, Nov=85, Dec=92], create: (1) A line chart with labels and title, (2) A bar chart comparing first 6 months vs last 6 months, (3) A histogram of the data. Add appropriate labels, titles, and gridlines. Show code and output.", 20, "easy", "python"),
  q("topic-3-3-3", "q-task-3-3-3b", "Seaborn Statistical Plots", "Create multi-variable visualizations", "task", "Using a dataset with columns: age, income, education_level, region, spending_score. Create Seaborn plots to: (1) Compare income distribution across regions, (2) Show relationship between age and spending colored by education, (3) Create a heatmap of correlations, (4) Show pairplot of 4 key variables. Interpret each visualization's insight. 300+ words.", 30, "medium", "python"),
  q("topic-3-3-3", "q-proj-3-3-3", "Sales Data Dashboard", "Build a multi-plot dashboard", "project", "Using 12 months of sales data with products, regions, and channels: (1) Create a 2×3 grid dashboard with: monthly revenue trend, top 10 products, regional breakdown map (bar chart), channel performance, growth rate by month, and a summary KPI card with annotations. (2) Use both Matplotlib and Seaborn. (3) Apply consistent styling and a color palette. (4) Add annotations highlighting key insights. 500+ words.", 100, "medium", "python"),
  q("topic-3-3-3", "q-boss-3-3-3", "Executive Dashboard Visualization", "Design a professional-grade analytics dashboard", "boss_fight", "You're creating an executive dashboard for a subscription SaaS company with 50K users. Data: daily active users, MRR, churn rate, CAC, LTV, NPS scores, feature usage, support tickets, and cohort data. Design and create: (1) 6-8 visualizations that tell the company's story, (2) A KPI summary section, (3) A cohort retention heatmap, (4) A churn predictor visualization, (5) A waterfall chart showing MRR movements (new, expansion, churn, contraction), (6) A forecast visualization with confidence intervals. For each, explain the chart choice, color rationale, and the insight it conveys. 800+ words.", 300, "hard", "python"),
])

// ─── ASSEMBLE MODULES ──────────────────────────────────────────────────────────

export const phase3Modules: Module[] = [
  { id: M3_1, phase_id: P3, title: "Excel for Analytics", description: "Master Excel's analytical capabilities — from advanced functions and pivot tables to statistical analysis and regression.", order_index: 1, unlock_level: 10, topics: [T3_1_1, T3_1_2, T3_1_3] },
  { id: M3_2, phase_id: P3, title: "SQL for Data Analysis", description: "Learn SQL from basic queries to advanced analytics — joins, aggregations, window functions, and CTEs.", order_index: 2, unlock_level: 11, topics: [T3_2_1, T3_2_2, T3_2_3] },
  { id: M3_3, phase_id: P3, title: "Python for Data Analysis", description: "Build Python data analysis skills with Pandas, visualization libraries, and automated data pipelines.", order_index: 3, unlock_level: 12, topics: [T3_3_1, T3_3_2, T3_3_3] },
]
