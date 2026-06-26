export function AdminDashboard() {
  return `
    <section class="section">
      <div class="section-head">
        <span class="eyebrow">Admin Dashboard</span>
        <h1>Work Domains, Contacts, Files, Bills, Payments & Invoices</h1>
        <p class="muted">MVP dashboard for internal consultancy management. Add authentication before production deployment.</p>
      </div>
      <div class="actions"><button class="btn primary" id="refreshAdmin">Refresh Dashboard</button>
        <a class="btn" href="http://localhost:8000/api/export/customers.csv">Export Customers</a>
        <a class="btn" href="http://localhost:8000/api/export/enquiries.csv">Export Enquiries</a>
        <a class="btn" href="http://localhost:8000/api/export/invoices.csv">Export Invoices</a>
        <a class="btn" href="http://localhost:8000/api/export/payments.csv">Export Payments</a>
      </div>
      <div id="dashboardCards" class="cards dashboard"></div>
      <div class="admin-grid">
        <div class="panel"><h2>Customers</h2><div class="table-wrap"><table id="customersTable"></table></div></div>
        <div class="panel"><h2>Enquiries</h2><div class="table-wrap"><table id="enquiriesTable"></table></div></div>
        <div class="panel"><h2>Invoices</h2><div class="table-wrap"><table id="invoicesTable"></table></div></div>
        <div class="panel"><h2>Payments</h2><div class="table-wrap"><table id="paymentsTable"></table></div></div>
        <div class="panel full"><h2>Uploaded Files</h2><div class="table-wrap"><table id="filesTable"></table></div></div>
      </div>
    </section>
  `;
}
