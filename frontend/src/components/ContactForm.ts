import { industries } from '../data/industries';
import { services } from '../data/services';

export function ContactForm() {
  return `
    <form id="contactForm" class="panel form-grid-full">
      <h2>Consultancy Enquiry Form</h2>
      <p class="muted">Share your product design, CAD, digital twin, inspection, mobility, UAV, USV, rail, metro, conveyor or manufacturing requirement.</p>
      <div class="form-grid">
        <label>Full Name *<input name="full_name" required /></label>
        <label>Email Address *<input name="email" type="email" required /></label>
        <label>Phone / WhatsApp<input name="phone" /></label>
        <label>Company / College / Organization<input name="organization" /></label>
        <label>City / Location<input name="city" /></label>
        <label>Industry *<select name="industry">${industries.map(i => `<option>${i}</option>`).join('')}</select></label>
        <label>Service Required *<select name="service_required">${services.map(s => `<option>${s.title}</option>`).join('')}<option>Custom Engineering Consultancy</option><option>Other</option></select></label>
        <label>Project Stage *<select name="project_stage"><option>Idea Stage</option><option>Concept Stage</option><option>CAD Design Required</option><option>Prototype Required</option><option>Material Selection Required</option><option>Design Improvement Required</option><option>Manufacturing Support Required</option><option>Existing Product Needs Redesign</option><option>Academic / Student Project</option><option>Other</option></select></label>
        <label>Expected Timeline<select name="timeline"><option>Need Discussion</option><option>Urgent: 1–3 Days</option><option>1 Week</option><option>2–4 Weeks</option><option>1–2 Months</option><option>Long-Term Project</option></select></label>
        <label>Budget Range<select name="budget_range"><option>Need Discussion</option><option>Below ₹5,000</option><option>₹5,000 – ₹15,000</option><option>₹15,000 – ₹50,000</option><option>₹50,000 – ₹1,00,000</option><option>Above ₹1,00,000</option></select></label>
        <label>Preferred Contact Mode<select name="preferred_contact_mode"><option>Phone Call</option><option>WhatsApp</option><option>Email</option><option>Google Meet</option><option>In-Person Meeting</option></select></label>
        <label>Need Payment Link?<select name="need_payment_link"><option>After Discussion</option><option>Yes</option><option>No</option></select></label>
      </div>
      <label>Project Description *<textarea name="project_description" required></textarea></label>
      <button class="btn primary" type="submit">Submit Enquiry</button>
      <div id="contactNotice" class="notice"></div>
    </form>
  `;
}
