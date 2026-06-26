import { industries } from '../data/industries';
import { services } from '../data/services';

export function CustomerPortal() {
  return `
    <section class="section">
      <div class="section-head">
        <span class="eyebrow">Customer Portal</span>
        <h1>Save Requirements, Notes, Files, Bills & Work Outputs</h1>
        <p class="muted">Create customer accounts, upload CAD, Gerber, schematics, site plans, documents and save work done notes.</p>
      </div>
      <div class="two-col">
        <form id="customerForm" class="panel">
          <h2>Create Customer Account</h2>
          <div class="form-grid">
            <label>Customer Name *<input name="full_name" required /></label>
            <label>Email *<input name="email" type="email" required /></label>
            <label>Phone<input name="phone" /></label>
            <label>Organization<input name="organization" /></label>
            <label>City<input name="city" /></label>
            <label>Work Domain<select name="work_domain">${industries.map(i => `<option>${i}</option>`).join('')}</select></label>
            <label>Service Required<select name="service_required">${services.map(s => `<option>${s.title}</option>`).join('')}</select></label>
            <label>Project Status<select name="project_status"><option>New</option><option>Discussion</option><option>Quoted</option><option>In Progress</option><option>On Hold</option><option>Completed</option></select></label>
          </div>
          <label>Requirement Notes<textarea name="requirement_notes"></textarea></label>
          <label>Updated Notes<textarea name="updated_notes"></textarea></label>
          <button class="btn primary" type="submit">Save Customer</button>
          <div id="customerNotice" class="notice"></div>
        </form>

        <form id="fileForm" class="panel">
          <h2>Upload Requirement / Work File</h2>
          <div class="form-grid">
            <label>Customer ID<input name="customer_id" placeholder="Optional" /></label>
            <label>Category<select name="category"><option>Requirement</option><option>Work Done</option><option>CAD File</option><option>Gerber File</option><option>Schematic</option><option>PCB Design</option><option>Site Plan</option><option>Drawing</option><option>BOM</option><option>Report</option><option>Image Reference</option><option>Invoice</option><option>Payment Proof</option><option>Archive</option><option>Other</option></select></label>
          </div>
          <label>Notes<textarea name="notes"></textarea></label>
          <label>Upload File<input name="file" type="file" required /></label>
          <button class="btn primary" type="submit">Upload File</button>
          <div id="fileNotice" class="notice"></div>
        </form>
      </div>
      <div class="two-col">
        <form id="requirementNoteForm" class="panel">
          <h2>Requirement Note</h2>
          <label>Customer ID<input name="customer_id" /></label>
          <label>Title<input name="title" required /></label>
          <label>Note<textarea name="note" required></textarea></label>
          <button class="btn" type="submit">Save Requirement Note</button>
          <div id="requirementNoteNotice" class="notice"></div>
        </form>
        <form id="workNoteForm" class="panel">
          <h2>Work Done Note</h2>
          <label>Customer ID<input name="customer_id" /></label>
          <label>Title<input name="title" required /></label>
          <label>Status<select name="status"><option>In Progress</option><option>Review</option><option>Delivered</option><option>Closed</option></select></label>
          <label>Work Note<textarea name="note" required></textarea></label>
          <button class="btn" type="submit">Save Work Note</button>
          <div id="workNoteNotice" class="notice"></div>
        </form>
      </div>
    </section>
  `;
}
