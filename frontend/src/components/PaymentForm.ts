export function PaymentForm() {
  return `
    <section class="section">
      <div class="section-head">
        <span class="eyebrow">Payments & Invoices</span>
        <h1>Bills, Payments, Invoices and Pending Status</h1>
        <p class="muted">Create invoices, record payments and automatically update status as Pending, Partially Paid or Paid.</p>
      </div>
      <div class="two-col">
        <form id="invoiceForm" class="panel">
          <h2>Create Invoice / Bill</h2>
          <div class="form-grid">
            <label>Customer ID<input name="customer_id" /></label>
            <label>Invoice Number *<input name="invoice_number" required placeholder="K2-INV-001" /></label>
            <label>Title *<input name="title" required /></label>
            <label>Total Amount *<input name="total_amount" type="number" required /></label>
            <label>Amount Paid<input name="amount_paid" type="number" value="0" /></label>
          </div>
          <label>Notes<textarea name="notes"></textarea></label>
          <button class="btn primary" type="submit">Save Invoice</button>
          <div id="invoiceNotice" class="notice"></div>
        </form>

        <form id="paymentForm" class="panel">
          <h2>Record Payment</h2>
          <div class="form-grid">
            <label>Invoice ID<input name="invoice_id" /></label>
            <label>Customer Email<input name="customer_email" type="email" /></label>
            <label>Amount *<input name="amount" type="number" required /></label>
            <label>Payment Mode<select name="payment_mode"><option>UPI</option><option>QR Code</option><option>Payment Link</option><option>Bank Transfer</option><option>Invoice Payment</option><option>Other</option></select></label>
            <label>Reference Number<input name="reference" /></label>
          </div>
          <label>Notes<textarea name="notes"></textarea></label>
          <button class="btn primary" type="submit">Record Payment</button>
          <div id="paymentNotice" class="notice"></div>
        </form>
      </div>
      <div class="cards four">
        <article class="mini-card"><b>UPI / QR</b><span>Fast digital payments</span></article>
        <article class="mini-card"><b>Payment Link</b><span>Share after quote</span></article>
        <article class="mini-card"><b>Invoice Payment</b><span>Company billing</span></article>
        <article class="mini-card"><b>Status Tracking</b><span>Paid / Pending / Partial</span></article>
      </div>
    </section>
  `;
}
