import type { DatasetTable } from "@/types/practice"

export const datasetSales: DatasetTable = {
  name: "sales",
  columns: [
    { name: "id", type: "INTEGER" },
    { name: "product_id", type: "INTEGER" },
    { name: "customer_id", type: "INTEGER" },
    { name: "amount", type: "DECIMAL" },
    { name: "quantity", type: "INTEGER" },
    { name: "sale_date", type: "DATE" },
    { name: "region", type: "TEXT" },
    { name: "status", type: "TEXT" },
  ],
  rows: [
    { id: 1, product_id: 101, customer_id: 201, amount: 250.0, quantity: 2, sale_date: "2024-01-15", region: "North", status: "completed" },
    { id: 2, product_id: 102, customer_id: 202, amount: 180.5, quantity: 1, sale_date: "2024-01-16", region: "South", status: "completed" },
    { id: 3, product_id: 103, customer_id: 203, amount: 320.0, quantity: 4, sale_date: "2024-01-17", region: "East", status: "completed" },
    { id: 4, product_id: 101, customer_id: 204, amount: 125.0, quantity: 1, sale_date: "2024-01-18", region: "West", status: "pending" },
    { id: 5, product_id: 104, customer_id: 201, amount: 500.0, quantity: 5, sale_date: "2024-01-19", region: "North", status: "completed" },
    { id: 6, product_id: 102, customer_id: 205, amount: 90.25, quantity: 1, sale_date: "2024-01-20", region: "South", status: "completed" },
    { id: 7, product_id: 105, customer_id: 202, amount: 750.0, quantity: 3, sale_date: "2024-02-01", region: "East", status: "completed" },
    { id: 8, product_id: 103, customer_id: 203, amount: 160.0, quantity: 2, sale_date: "2024-02-02", region: "West", status: "failed" },
    { id: 9, product_id: 101, customer_id: 206, amount: 375.0, quantity: 3, sale_date: "2024-02-03", region: "North", status: "completed" },
    { id: 10, product_id: 106, customer_id: 204, amount: 210.0, quantity: 2, sale_date: "2024-02-04", region: "South", status: "completed" },
    { id: 11, product_id: 104, customer_id: 201, amount: 100.0, quantity: 1, sale_date: "2024-02-05", region: "East", status: "pending" },
    { id: 12, product_id: 102, customer_id: 205, amount: 540.0, quantity: 3, sale_date: "2024-02-10", region: "North", status: "completed" },
    { id: 13, product_id: 107, customer_id: 202, amount: 890.0, quantity: 2, sale_date: "2024-02-15", region: "West", status: "completed" },
    { id: 14, product_id: 105, customer_id: 206, amount: 420.0, quantity: 4, sale_date: "2024-02-20", region: "South", status: "completed" },
    { id: 15, product_id: 103, customer_id: 203, amount: 640.0, quantity: 8, sale_date: "2024-03-01", region: "East", status: "completed" },
  ],
}

export const datasetCustomers: DatasetTable = {
  name: "customers",
  columns: [
    { name: "id", type: "INTEGER" },
    { name: "name", type: "TEXT" },
    { name: "email", type: "TEXT" },
    { name: "age", type: "INTEGER" },
    { name: "city", type: "TEXT" },
    { name: "signup_date", type: "DATE" },
    { name: "segment", type: "TEXT" },
    { name: "is_active", type: "BOOLEAN" },
  ],
  rows: [
    { id: 201, name: "Alice Johnson", email: "alice@email.com", age: 32, city: "New York", signup_date: "2023-06-15", segment: "Premium", is_active: true },
    { id: 202, name: "Bob Smith", email: "bob@email.com", age: 28, city: "Los Angeles", signup_date: "2023-07-20", segment: "Standard", is_active: true },
    { id: 203, name: "Charlie Brown", email: "charlie@email.com", age: 45, city: "Chicago", signup_date: "2023-05-10", segment: "Premium", is_active: true },
    { id: 204, name: "Diana Prince", email: "diana@email.com", age: 35, city: "Houston", signup_date: "2023-08-05", segment: "Standard", is_active: false },
    { id: 205, name: "Eve Davis", email: "eve@email.com", age: 24, city: "Phoenix", signup_date: "2023-09-12", segment: "Basic", is_active: true },
    { id: 206, name: "Frank Wilson", email: "frank@email.com", age: 38, city: "New York", signup_date: "2023-04-22", segment: "Premium", is_active: true },
  ],
}

export const datasetProducts: DatasetTable = {
  name: "products",
  columns: [
    { name: "id", type: "INTEGER" },
    { name: "name", type: "TEXT" },
    { name: "category", type: "TEXT" },
    { name: "price", type: "DECIMAL" },
    { name: "stock", type: "INTEGER" },
    { name: "supplier", type: "TEXT" },
  ],
  rows: [
    { id: 101, name: "Widget Alpha", category: "Electronics", price: 125.0, stock: 500, supplier: "TechSupply Co" },
    { id: 102, name: "Gadget Beta", category: "Electronics", price: 90.0, stock: 300, supplier: "GizmoWorks" },
    { id: 103, name: "Component X", category: "Hardware", price: 80.0, stock: 1000, supplier: "BuildPart Inc" },
    { id: 104, name: "Widget Pro", category: "Electronics", price: 100.0, stock: 200, supplier: "TechSupply Co" },
    { id: 105, name: "Accessory Pack", category: "Accessories", price: 250.0, stock: 150, supplier: "AddOn Ltd" },
    { id: 106, name: "Basic Connector", category: "Hardware", price: 105.0, stock: 750, supplier: "BuildPart Inc" },
    { id: 107, name: "Premium Kit", category: "Accessories", price: 445.0, stock: 80, supplier: "AddOn Ltd" },
  ],
}

export const datasetTransactions: DatasetTable = {
  name: "transactions",
  columns: [
    { name: "txn_id", type: "INTEGER" },
    { name: "sale_id", type: "INTEGER" },
    { name: "payment_method", type: "TEXT" },
    { name: "amount", type: "DECIMAL" },
    { name: "fee", type: "DECIMAL" },
    { name: "success", type: "BOOLEAN" },
    { name: "txn_date", type: "DATE" },
  ],
  rows: [
    { txn_id: 1001, sale_id: 1, payment_method: "Credit Card", amount: 250.0, fee: 7.5, success: true, txn_date: "2024-01-15" },
    { txn_id: 1002, sale_id: 2, payment_method: "Debit Card", amount: 180.5, fee: 2.7, success: true, txn_date: "2024-01-16" },
    { txn_id: 1003, sale_id: 3, payment_method: "PayPal", amount: 320.0, fee: 9.6, success: true, txn_date: "2024-01-17" },
    { txn_id: 1004, sale_id: 4, payment_method: "Credit Card", amount: 125.0, fee: 3.75, success: false, txn_date: "2024-01-18" },
    { txn_id: 1005, sale_id: 5, payment_method: "Bank Transfer", amount: 500.0, fee: 5.0, success: true, txn_date: "2024-01-19" },
    { txn_id: 1006, sale_id: 6, payment_method: "Debit Card", amount: 90.25, fee: 1.35, success: true, txn_date: "2024-01-20" },
    { txn_id: 1007, sale_id: 7, payment_method: "PayPal", amount: 750.0, fee: 22.5, success: true, txn_date: "2024-02-01" },
    { txn_id: 1008, sale_id: 8, payment_method: "Credit Card", amount: 160.0, fee: 4.8, success: false, txn_date: "2024-02-02" },
    { txn_id: 1009, sale_id: 9, payment_method: "Bank Transfer", amount: 375.0, fee: 3.75, success: true, txn_date: "2024-02-03" },
    { txn_id: 1010, sale_id: 10, payment_method: "Debit Card", amount: 210.0, fee: 3.15, success: true, txn_date: "2024-02-04" },
  ],
}

export const allDatasets: Record<string, DatasetTable> = {
  sales: datasetSales,
  customers: datasetCustomers,
  products: datasetProducts,
  transactions: datasetTransactions,
}
