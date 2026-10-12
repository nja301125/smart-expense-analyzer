# Smart Expense Analyzer

A client-side web application that helps university students record, visualize, and analyze their daily expenses — built as a final project using only HTML, CSS, and JavaScript.

---

## Problem Statement

University students often struggle to manage limited budgets without a simple, accessible tool to track spending. Most budgeting apps require account registration, internet connectivity, or paid subscriptions — creating unnecessary barriers for students who just need something lightweight and immediate.

**Smart Expense Analyzer** solves this by running entirely in the browser with zero setup. No login, no server, no cost.

---

## Project Objectives

- Provide a simple interface for students to record daily expenses
- Visualize spending patterns by category using a chart
- Offer rule-based saving suggestions based on recorded data
- Store data locally in the browser so it persists across sessions
- Deliver a responsive layout that works on both laptop and mobile

---

## Features

| Feature | Description |
|---|---|
| **Summary Dashboard** | Displays total expenses, top spending category, daily average, and transaction count |
| **Add Expense Form** | Input fields for name, category (6 options), amount in IDR (Rp), and date — with full validation |
| **Transaction Table** | Lists all recorded expenses newest-first, with color-coded category badges and a delete button per row |
| **Doughnut Chart** | Visualizes spending distribution by category using Chart.js; updates automatically on every change |
| **Saving Suggestions** | Rule-based tips triggered by spending patterns (e.g. high food ratio, high daily average, entertainment overspend) |
| **Data Persistence** | All transactions are saved to `localStorage` and restored on every page load |
| **Sample Data** | 10 pre-loaded sample transactions populate the dashboard on first launch |
| **Responsive Layout** | Adapts from a 4-column desktop grid down to a single-column mobile layout |

---

## Technologies Used

| Technology | Role |
|---|---|
| **HTML5** | Page structure and semantic markup |
| **CSS3** | Styling, layout (CSS Grid), responsive design, CSS custom properties |
| **Vanilla JavaScript (ES6)** | Application logic — data management, DOM manipulation, validation, suggestions |
| **[Chart.js](https://www.chartjs.org/) v4 (CDN)** | Doughnut chart for category-based spending visualization |
| **Web Storage API (`localStorage`)** | Client-side data persistence across browser sessions |

No build tools, frameworks, or package managers are required.

---

## Project Structure

```
smart-expense-analyzer/
├── index.html    # Page structure, layout, and Chart.js CDN link
├── style.css     # All styling including responsive breakpoints
├── app.js        # All application logic (data, rendering, validation)
└── README.md     # This file
```

---

## How to Run Locally

**Requirements:** Any modern browser (Chrome, Edge, or Firefox). No installation needed.

1. Download or clone this repository to your computer
2. Open the `smart-expense-analyzer/` folder
3. Double-click `index.html`
4. The application opens directly in your browser

> **Note:** Chart.js is loaded from a CDN, so an internet connection is required on first load. After the browser caches it, the app works offline.

---

## Testing Results

All features below were manually tested in **Google Chrome**.

### 1. Adding Transactions
- Filling in all fields and clicking **+ Tambah Pengeluaran** successfully adds a new row to the transaction table
- The summary cards (total, top category, daily average, count) update immediately
- The doughnut chart redraws to reflect the new category totals

### 2. Input Validation
The form rejects invalid submissions and displays Indonesian error messages inline:

| Invalid Input | Error Message Shown |
|---|---|
| Empty name field | *"Nama pengeluaran tidak boleh kosong."* |
| No category selected | *"Pilih kategori pengeluaran."* |
| Non-numeric amount | *"Masukkan jumlah yang valid."* |
| Amount ≤ 0 | *"Jumlah harus lebih dari Rp 0."* |
| No date selected | *"Pilih tanggal pengeluaran."* |

After a valid submission, the form resets and the date defaults to today.

### 3. Deleting Transactions
- Clicking **Hapus** on any row triggers a browser confirmation dialog
- Confirming removes the row and updates all cards, the chart, and suggestions instantly
- Cancelling the dialog leaves the data unchanged

### 4. Data Persistence After Refresh
- Transactions added during a session remain visible after a full page refresh (`F5`)
- Data is stored in the browser's `localStorage` under the key `smartExpenses` as a JSON string
- The 10 sample transactions are only inserted once — on the very first launch when `localStorage` is empty

### 5. Category Chart
- The doughnut chart correctly groups spending by the 6 available categories
- Each category slice uses a consistent color matching the table badges
- Hovering over a slice displays the exact amount in Rupiah format (e.g. `Rp 56.000`)
- When all transactions are deleted, the chart canvas is hidden and replaced with a placeholder message

### 6. Saving Suggestions
Rule-based suggestions appear dynamically based on the current data:

| Condition | Suggestion Triggered |
|---|---|
| Daily average > Rp 80,000 | Advice to set a daily spending limit |
| Food spending > 50% of total | Suggestion to cook at home or find cheaper canteens |
| Entertainment > 25% of total | Recommendation to use free campus activities |
| Education spending < 5% of total | Reminder to invest in study materials |
| Transport > 30% of total | Tip to use public transport or carpooling |
| Transaction count > 20 | Encouragement to set monthly category targets |
| No rules triggered | Positive feedback that spending looks balanced |

### 7. Responsive Layout
- **Desktop (≥ 900px):** 4-column summary grid, side-by-side form and chart
- **Tablet (≤ 900px):** 2-column summary grid, form and chart stacked vertically
- **Mobile (≤ 560px):** 2-column summary grid, compact padding, smaller typography, subtitle hidden

### 8. Browser Console
- No JavaScript errors appear in the browser DevTools console during normal use
- `localStorage` key `smartExpenses` is visible and readable under **Application → Local Storage** in Chrome DevTools

---

## Limitations

- **Local storage only:** Data is stored in a single browser on a single device. Clearing browser data or using a different browser will result in data loss. There is no cloud sync or export feature.
- **Rule-based suggestions:** Saving suggestions are generated using fixed percentage thresholds, not machine learning or personalized financial modeling. They provide general guidance only and may not reflect every user's actual financial situation.
- **No authentication:** All data is accessible to anyone who opens the app on the same browser. The app is not suitable for shared or public computers.
- **Manual data entry only:** There is no import feature (e.g. from bank statements or CSV files).

---

## Future Improvements

- **CSV export** — allow users to download their transaction history as a spreadsheet
- **Monthly filter** — view and analyze expenses for a specific month or date range
- **Budget targets** — let users set a spending limit per category and receive warnings when approaching it
- **Cloud sync** — connect to a simple backend (e.g. Firebase) so data is available across devices
- **Recurring expenses** — automatically log fixed monthly costs (e.g. rent, subscriptions)
- **Dark mode** — toggle between light and dark themes using CSS custom properties

---

## Author

Built as a university final project.  
Stack: HTML · CSS · JavaScript · Chart.js · LocalStorage
