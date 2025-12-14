# SQLite CSV Playground Pro - FAQ & Documentation

## What is this tool?

A browser-based SQLite query playground that lets you drag-and-drop CSV files and query them with SQL instantly. Everything runs in your browser - no server, no uploads, completely private. Built with pure HTML/CSS/JavaScript and sql.js (SQLite compiled to WebAssembly).

---

## Getting Started

### How do I load data?

**Three ways:**
1. **Drag & drop** CSV files onto the drop zone in the left sidebar
2. **Click** the drop zone to browse for files
3. **Paste a URL** to a CSV file in the URL input box and click "Load from URL"

Each CSV becomes a table named after the filename (special characters replaced with underscores).

### What URLs are supported?

The tool automatically detects and converts URLs from common data sources:

- **GitHub**: Paste any GitHub blob URL (e.g., `github.com/user/repo/blob/branch/path/file.csv`) and it automatically converts to the raw format
- **Google Sheets**: Paste a shareable link (e.g., `docs.google.com/spreadsheets/d/ID/edit`) and it converts to CSV export format. Also supports direct export URLs.
- **Direct CSV URLs**: Any direct link to a CSV file works as-is

The tool handles URL normalization automatically - just paste the URL and click "Load from URL".

### Do I need to know SQL?

Not necessarily! Toggle to "Visual Builder" mode to build queries with dropdowns and inputs. It generates the SQL for you. But knowing SQL gives you way more power.

---

## Working with Tables

### How do I see what tables I have?

The "Tables" section in the sidebar lists all loaded tables with row counts and column counts. Click on a table item to see more details.

### How do I explore a table's structure?

Click **"Inspect"** on any table to open the Schema Inspector modal. It shows:
- Each column's name and data type
- Unique value counts per column
- Null counts per column
- Sample values from each column

This is super helpful for understanding what data you're working with.

### How do I preview a table quickly?

Click **"Preview"** on any table and it auto-fills a `SELECT * FROM table_name LIMIT 100` query in your current query tab.

### How do I delete a table?

Click **"Drop"** on the table. This permanently removes it from the current session (but not from your original CSV file).

### How do I see query dependencies?

Click **"View Graph"** next to the Tables section to see a visual dependency graph showing how your queries chain together.

---

## Writing Queries

### What's the difference between SQL Editor and Visual Builder?

**SQL Editor:**
- Write raw SQL queries
- Full SQLite feature support
- Autocomplete for tables/columns/keywords
- Best for complex queries

**Visual Builder:**
- Point-and-click query building
- Select table from dropdown
- Pick columns by clicking
- Add WHERE clause with autocomplete
- Set LIMIT
- Generates SQL automatically
- Great for beginners or quick queries

Toggle between modes using the buttons at the top of each query panel.

### How does autocomplete work?

In SQL Editor mode, start typing:
- After 2+ characters, suggestions appear
- Shows SQL keywords, table names, and column names
- **Arrow keys (↑/↓)** to navigate
- **Tab or Enter** to insert
- **Escape** to close
- **Auto-quotes** column/table names with spaces or special characters
- **Case insensitive** - type "fr" or "FR" to get "FROM"
- **Smart prioritization** - columns from tables you're querying appear first

Autocomplete also works in Visual Builder's WHERE clause input.

### Can I have multiple queries?

Yes! Click **"+ New Query"** to create additional query tabs. Each query is independent. Close tabs with the × button (you can't close the last one).

### Can I save queries for later?

Yes! Click **"Save Query"**, give it a name, and it appears in the "⭐ Saved Queries" sidebar. Click any saved query name to load it into the current tab. Click × to delete saved queries.

### Where does query history go?

Every query you run is automatically saved to your browser's localStorage (last 50 queries). View them in the "Recent Queries" sidebar. Click any to reload it. Click "Clear" to remove all history.

### Can I undo a query?

Click the **"↶ Undo"** button to load your previous query from history. Only appears if you have query history.

---

## Query Chaining (The Cool Part)

### What is query chaining?

You can make one query's results become a temporary table that later queries can use. This lets you build complex data transformations step-by-step.

### How do I chain queries?

1. Create multiple queries (click "+ New Query")
2. In Query 1, write your SQL and run it
3. Check the box: **"Save results as temporary table"**
4. Give it a table name (e.g., `filtered_users`)
5. In Query 2 and beyond, you can query it: `SELECT * FROM filtered_users`

The temp table only exists for queries BELOW the one that created it (in the tab order).

**Example workflow:**
```
Query 1: SELECT name, age FROM users WHERE age > 18
         ☑ Chain as: adults

Query 2: SELECT name FROM adults WHERE age > 65
```

Chained queries show a ⛓ icon in their tab.

### How do I see my query chains?

Click **"View Graph"** next to the Tables section. It shows:
- All your queries in order
- Which ones are chained
- What temp table names they create
- A preview of each query's SQL

The graph shows the data flow through your queries.

### Do chained queries persist?

Temp tables only exist while the session is active. Save your workspace to preserve them.

---

## Working with Results

### How do I sort results without re-running the query?

Click any **column header** in the results table. Click again to toggle between ascending/descending. The ▲▼ arrows show current sort direction.

### How do I filter results?

Type in the **"Filter results..."** box above the table. It searches across ALL columns for matches. Updates instantly. Shows filtered count vs total count.

### How do I clear filters and sorting?

Click **"Clear Filters"** button to reset both filtering and sorting.

### Can I export results?

Yes! Click **"Export CSV"** to download the current query results as a CSV file.

---

## Workspaces

### What's a workspace?

Everything in your current session: all loaded tables, all queries, chain settings. Basically a snapshot of your work.

### How do I save my work?

Click **"💾 Save Workspace"** in the header. Downloads a JSON file with:
- All tables and their data
- All queries and their settings
- Chain configurations

### How do I load a saved workspace?

**Two ways:**
1. **From file**: Click **"📂 Load Workspace"** and select your JSON file. It replaces your current session entirely (clears existing tables and queries first).
2. **From URL**: If someone shares a workspace URL with you (contains `?workspace=...`), the workspace will automatically load when you open the link.

### How do I share a workspace?

Click **"🔗 Share Workspace"** in the header. This:
- Generates a shareable URL with your workspace embedded
- Copies the URL to your clipboard
- For large workspaces (>2000 characters), shows a modal with the JSON to copy manually

Share the URL with others - when they open it, your workspace (tables + queries) loads automatically!

### Why would I use workspaces?

- **Resume work later** - close browser, come back tomorrow, load workspace
- **Share analysis** - send workspace URL or file to colleague, they get exact same setup
- **Template queries** - save common analysis patterns to reuse
- **Collaboration** - share workspace URLs in chat/email for instant access

---

## Tips & Tricks

### How do I work with multiple CSVs?

Drop them all at once! Each becomes a separate table. Then you can JOIN them:
```sql
SELECT orders.*, customers.name
FROM orders
JOIN customers ON orders.customer_id = customers.id
```

### Can I create new tables from scratch?

Yes! Use standard SQLite DDL:
```sql
CREATE TABLE my_table (
    id INTEGER,
    name TEXT
);

INSERT INTO my_table VALUES (1, 'Alice'), (2, 'Bob');
```

### What SQL features are supported?

Full SQLite 3 support:
- JOINs (INNER, LEFT, RIGHT, FULL)
- Subqueries and CTEs (WITH clauses)
- Aggregations (GROUP BY, COUNT, SUM, AVG, etc.)
- Window functions
- JSON functions
- Date/time functions

### Can I use this offline?

Yes! After loading the page once, it works offline (the sql.js library gets cached). Your data never leaves your browser.

### How much data can it handle?

Depends on your browser's memory. Generally comfortable with:
- Hundreds of thousands of rows
- Dozens of columns
- Multiple CSVs totaling <100MB

Larger datasets might slow down.

### Can I load CSVs from any URL?

Only if the URL allows CORS (Cross-Origin Resource Sharing). Many public data sources work fine. The tool automatically handles:
- **GitHub URLs** - Converts blob URLs to raw format automatically
- **Google Sheets** - Converts shareable links to export format automatically
- **Direct CSV URLs** - Works as-is if CORS is enabled

If you get a CORS error, the file host doesn't allow cross-origin access. Try downloading the file and using drag-and-drop instead.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Tab** | Accept autocomplete suggestion |
| **Enter** | Accept autocomplete (when highlighted) |
| **↑ / ↓** | Navigate autocomplete suggestions |
| **Escape** | Close autocomplete dropdown |

---

## Common Questions

### Why isn't my CSV loading?

- Check it's actually a CSV (comma-separated)
- Make sure headers are in the first row
- Special characters in column names get replaced with underscores
- Very large files might take a moment

### Why is autocomplete not showing?

- Type at least 2 characters
- Make sure you're in SQL Editor mode (not Visual Builder)
- Check that you have tables loaded

### My query says "no such table"

- Table names with special chars need quotes: `SELECT * FROM "my-table"`
- Check the Tables sidebar to see exact table names
- If using chained queries, make sure the previous query ran successfully
- Chained tables only exist for queries below the one that created them

### Can I share this with others?

Absolutely! It's a single HTML file. You can:
- Send the file to anyone
- Host it on any web server
- Embed it in another page
- They need a modern browser (Chrome, Firefox, Safari, Edge)

### Is my data private?

100%. Everything runs locally in your browser. No data is sent to any server. No tracking. No analytics. Data is stored in browser memory (cleared on reload) or localStorage (for history/saved queries).

### Can I modify or extend this?

Yes! It's open source. View the HTML source to see how it works. All the code is in one file for easy modification.

---

## Example Use Cases

### Data Exploration

Load a CSV, use Inspect to understand the schema, Preview to see data, then write exploratory queries.

### Data Cleaning Pipeline

```
Query 1: SELECT * FROM raw_data WHERE value IS NOT NULL
         ☑ Chain as: cleaned

Query 2: SELECT DISTINCT * FROM cleaned
         ☑ Chain as: deduped

Query 3: SELECT * FROM deduped ORDER BY date
```

### Joining Multiple Sources

```sql
-- After loading customers.csv and orders.csv
SELECT
    customers.name,
    COUNT(orders.id) as order_count,
    SUM(orders.total) as total_spent
FROM customers
LEFT JOIN orders ON customers.id = orders.customer_id
GROUP BY customers.id, customers.name
ORDER BY total_spent DESC
```

### Quick Data Analysis

Load CSV, use Visual Builder to explore different columns, save interesting queries, export results for presentation.

---

## Troubleshooting

### The page is slow/frozen

- You might have too much data loaded
- Try limiting results with `LIMIT 1000`
- Drop unused tables
- Reload the page and load less data

### Autocomplete stopped working

- Click outside the textarea and click back in
- Reload the page if it persists

### My workspace won't load

- Check the JSON file is valid
- Make sure it's from this tool (not manually edited)
- File might be corrupted - try re-saving

### Results look wrong

- Check your SQL syntax
- Use Inspect to verify column names
- Remember: all data is loaded as TEXT type
- Use CAST to convert: `CAST(column AS INTEGER)`

### Visual Builder WHERE clause shows error

- Check your syntax matches SQLite WHERE clause format
- Column names with spaces need quotes: `"column name" = 'value'`
- The error message will show what's wrong

---

## Advanced Features

### Using CTEs (Common Table Expressions)

```sql
WITH high_value AS (
    SELECT * FROM customers WHERE lifetime_value > 1000
)
SELECT name, email FROM high_value ORDER BY lifetime_value DESC;
```

### Window Functions

```sql
SELECT
    name,
    sales,
    AVG(sales) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as moving_avg
FROM monthly_sales;
```

### JSON Columns

If your CSV has JSON strings:
```sql
SELECT
    id,
    json_extract(metadata, '$.user_id') as user_id
FROM events;
```

---

## Technical Details

### Frameworks & Libraries

- **sql.js** (v1.10.2) - SQLite compiled to WebAssembly, runs entirely in the browser
- **Pure HTML/CSS/JavaScript** - No React, no build tools, no frameworks
- **localStorage** - For persisting query history and saved queries
- **FileReader API** - For reading CSV files
- **Fetch API** - For loading CSVs from URLs

### Browser Compatibility

Works in all modern browsers that support:
- WebAssembly (sql.js requirement)
- ES6 JavaScript
- localStorage API
- FileReader API

Tested on: Chrome, Firefox, Safari, Edge (latest versions)

---

## Best Practices

1. **Start small** - Test queries on limited data (`LIMIT 100`) before running on full dataset
2. **Save often** - Use Save Workspace before complex operations
3. **Name queries** - Give descriptive names to saved queries
4. **Use chain mode** - Break complex transformations into steps
5. **Inspect first** - Always inspect table schema before writing queries
6. **Comment your SQL** - Use `-- comments` to document complex queries
7. **Export results** - Save interesting results as CSV for further use

---

**That's it! Drop in some CSVs and start exploring. Have fun!**
