import './styles.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { ServiceCard } from './components/ServiceCard';
import { GalleryCard } from './components/GalleryCard';
import { ContactForm } from './components/ContactForm';
import { CustomerPortal } from './components/CustomerPortal';
import { PaymentForm } from './components/PaymentForm';
import { AdminDashboard } from './components/AdminDashboard';
import { services } from './data/services';
import { industries } from './data/industries';
import { gallery } from './data/gallery';
import { apiGet, apiPost } from './api';
import { currentPath } from './routes';

const app = document.querySelector<HTMLDivElement>('#app')!;

function imageUrl(name: string) {
  return new URL(`./assets/images/${name}`, import.meta.url).href;
}

function pageShell(content: string) {
  app.innerHTML = `${Header()}<main>${content}</main>${Footer()}`;
  bindForms();
  if (currentPath() === '/admin') loadAdmin();
}

function HomePage() {
  const hero = imageUrl('k2_consultancy_hero.png');
  return `
    ${Hero(hero)}
    <section class="section">
      <div class="section-head">
        <span class="eyebrow">About K2</span>
        <h1>KSquare Consultancy for Future-Ready Engineering</h1>
        <p class="muted">K2 operates under MxSense Telingent Solutions Pvt. Ltd. and supports product design, materials, prototyping, digital twins, robotic inspection, mobility and smart manufacturing projects from concept to delivery.</p>
      </div>
      <div class="cards three">
        <article class="mini-card"><b>Design</b><span>Product concepts, CAD structures, mechanical layouts and documentation.</span></article>
        <article class="mini-card"><b>Simulate</b><span>Digital twin thinking, inspection workflows, material and design validation support.</span></article>
        <article class="mini-card"><b>Prototype</b><span>Prototype planning, additive manufacturing guidance and build-ready outputs.</span></article>
      </div>
    </section>
    <section class="section">
      <div class="section-head"><span class="eyebrow">Featured Services</span><h1>Premium Engineering Consultancy Services</h1></div>
      <div class="service-grid">
        ${services.slice(0, 6).map(s => ServiceCard(s, imageUrl(s.image))).join('')}
      </div>
    </section>
    <section class="section">
      <div class="section-head"><span class="eyebrow">Industries</span><h1>Domains We Serve</h1></div>
      <div class="cards four">${industries.slice(0, 12).map(i => `<article class="mini-card"><b>${i}</b><span>Concept design, modelling, inspection, prototype and engineering documentation.</span></article>`).join('')}</div>
    </section>
  `;
}

function AboutKartikPage() {
  return `
    <section class="section">
      <div class="section-head">
        <span class="eyebrow">About Kartik Kushwaha</span>
        <h1>Product Design & Engineering Consultant</h1>
        <p class="muted">Kartik Kushwaha is a product design and engineering consultant focused on additive manufacturing, material selection, CAD design, prototype development, digital twins, robotic inspection systems and mobility engineering.</p>
      </div>
      <div class="two-col">
        <div class="panel">
          <h2>Professional Focus</h2>
          <p class="muted">He supports clients across railways, locomotives, automated vehicles, EV, NDE, UAV, drones, visual inspection, mobility, manufacturing, automotive and aerospace applications.</p>
          <p class="muted">His consultancy approach focuses on converting early ideas into structured engineering concepts, selecting suitable materials, building CAD-ready designs, preparing prototypes and supporting manufacturing-oriented development.</p>
          <div class="actions"><a class="btn primary" href="#/contact">Discuss with Kartik</a></div>
        </div>
        <div class="panel">
          <h2>Expertise</h2>
          <div class="cards two">${services.slice(0, 16).map(s => `<article class="mini-card"><b>${s.title}</b><span>${s.category}</span></article>`).join('')}</div>
        </div>
      </div>
    </section>
  `;
}

function ServicesPage() {
  return `
    <section class="section">
      <div class="section-head"><span class="eyebrow">Services</span><h1>All Consultancy Services</h1><p class="muted">Each service includes key capabilities, deliverables, relevant industries and a visual service image.</p></div>
      <div class="service-grid">${services.map(s => ServiceCard(s, imageUrl(s.image))).join('')}</div>
    </section>
  `;
}

function IndustriesPage() {
  return `
    <section class="section">
      <div class="section-head"><span class="eyebrow">Industries</span><h1>Engineering Domains and Applications</h1></div>
      <div class="cards four">${industries.map(i => `<article class="mini-card"><b>${i}</b><span>Product design, digital twin, inspection, CAD, prototype and manufacturing support.</span></article>`).join('')}</div>
    </section>
  `;
}

function ProjectsPage() {
  return `
    <section class="section">
      <div class="section-head"><span class="eyebrow">Projects / Visual Gallery</span><h1>Visual Service Portfolio</h1><p class="muted">Generated visual assets from this chat are included as website assets for the K2 Consultancy business presentation.</p></div>
      <div class="gallery-grid">${gallery.map(g => GalleryCard(g, imageUrl(g.image))).join('')}</div>
    </section>
  `;
}

function ProcessPage() {
  const steps = ['Project Discussion', 'Requirement Mapping', 'Concept Design', 'Material Selection Review', 'CAD / Design Development', 'Prototype Planning', 'Review & Revision', 'Final Delivery'];
  return `
    <section class="section process">
      <div class="section-head"><span class="eyebrow">Process</span><h1>Consulting Delivery Process</h1></div>
      <div class="cards four">${steps.map(s => `<article class="mini-card"><b>${s}</b><span>Structured engineering workflow for transparent delivery.</span></article>`).join('')}</div>
    </section>
  `;
}

function ContactPage() {
  return `<section class="section">${ContactForm()}</section>`;
}

function LegalPage(title: string) {
  return `
    <section class="section legal">
      <span class="eyebrow">Legal</span>
      <h1>${title}</h1>
      <p>This page is a starter legal template for K2 — KSquare Consultancy under MxSense Telingent Solutions Pvt. Ltd. Review and finalize with a qualified legal advisor before publishing.</p>
      <h2>Scope</h2>
      <p>Information submitted through this website may be used to evaluate consultancy enquiries, prepare quotations, manage project communication, invoices, payments and file deliveries.</p>
      <h2>Confidentiality</h2>
      <p>Project files, requirements, CAD files, Gerber files, schematics, site plans and work outputs should be treated as confidential project materials.</p>
      <h2>Payments</h2>
      <p>Payments, refunds and cancellations depend on the agreed project scope, milestone status and invoice terms.</p>
    </section>
  `;
}

function PaymentsPage() { return PaymentForm(); }
function CustomerPortalPage() { return CustomerPortal(); }

function render() {
  const path = currentPath();
  const page = {
    '/': HomePage,
    '/about-kartik': AboutKartikPage,
    '/services': ServicesPage,
    '/industries': IndustriesPage,
    '/projects': ProjectsPage,
    '/process': ProcessPage,
    '/customer-portal': CustomerPortalPage,
    '/payments': PaymentsPage,
    '/contact': ContactPage,
    '/admin': AdminDashboard,
    '/privacy-policy': () => LegalPage('Privacy Policy'),
    '/terms': () => LegalPage('Terms of Service'),
    '/refund-policy': () => LegalPage('Refund / Cancellation Policy'),
  }[path] || HomePage;
  pageShell(page());
}

function formDataObject(form: HTMLFormElement) {
  const fd = new FormData(form);
  const obj: any = {};
  fd.forEach((value, key) => {
    if (typeof value === 'string' && value.trim() !== '') obj[key] = value.trim();
  });
  ['customer_id','invoice_id'].forEach(k => { if (obj[k]) obj[k] = Number(obj[k]); });
  ['total_amount','amount_paid','amount'].forEach(k => { if (obj[k]) obj[k] = Number(obj[k]); });
  return obj;
}

function notice(id: string, ok: boolean, msg: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.className = `notice ${ok ? 'ok' : 'err'}`;
  el.textContent = msg;
}

function bindForms() {
  const contact = document.getElementById('contactForm') as HTMLFormElement | null;
  contact?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await apiPost('/enquiries', formDataObject(contact));
      notice('contactNotice', true, 'Enquiry submitted successfully.');
      contact.reset();
    } catch (err: any) { notice('contactNotice', false, err.message); }
  });

  const customer = document.getElementById('customerForm') as HTMLFormElement | null;
  customer?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await apiPost('/customers', formDataObject(customer));
      notice('customerNotice', true, `Customer saved successfully. Customer ID: ${res.id}`);
      customer.reset();
    } catch (err: any) { notice('customerNotice', false, err.message); }
  });

  const fileForm = document.getElementById('fileForm') as HTMLFormElement | null;
  fileForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData(fileForm);
      const res = await fetch('http://localhost:8000/api/files', { method: 'POST', body: fd });
      if (!res.ok) throw new Error(await res.text());
      notice('fileNotice', true, 'File uploaded successfully.');
      fileForm.reset();
    } catch (err: any) { notice('fileNotice', false, err.message); }
  });

  const invoice = document.getElementById('invoiceForm') as HTMLFormElement | null;
  invoice?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const res = await apiPost('/invoices', formDataObject(invoice));
      notice('invoiceNotice', true, `Invoice saved. Status: ${res.status}`);
      invoice.reset();
    } catch (err: any) { notice('invoiceNotice', false, err.message); }
  });

  const payment = document.getElementById('paymentForm') as HTMLFormElement | null;
  payment?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await apiPost('/payments', formDataObject(payment));
      notice('paymentNotice', true, 'Payment recorded successfully.');
      payment.reset();
    } catch (err: any) { notice('paymentNotice', false, err.message); }
  });

  const rn = document.getElementById('requirementNoteForm') as HTMLFormElement | null;
  rn?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await apiPost('/requirement-notes', formDataObject(rn));
      notice('requirementNoteNotice', true, 'Requirement note saved.');
      rn.reset();
    } catch (err: any) { notice('requirementNoteNotice', false, err.message); }
  });

  const wn = document.getElementById('workNoteForm') as HTMLFormElement | null;
  wn?.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await apiPost('/work-notes', formDataObject(wn));
      notice('workNoteNotice', true, 'Work note saved.');
      wn.reset();
    } catch (err: any) { notice('workNoteNotice', false, err.message); }
  });

  document.getElementById('refreshAdmin')?.addEventListener('click', loadAdmin);
}

function money(v: any) {
  return `₹${Number(v || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function table(headers: string[], rows: any[][]) {
  return `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>`;
}

async function loadAdmin() {
  try {
    const [d, customers, enquiries, invoices, payments, files] = await Promise.all([
      apiGet('/dashboard'),
      apiGet('/customers'),
      apiGet('/enquiries'),
      apiGet('/invoices'),
      apiGet('/payments'),
      apiGet('/files'),
    ]);

    const dashboardCards = document.getElementById('dashboardCards');
    if (dashboardCards) {
      dashboardCards.innerHTML = [
        ['Customers', d.customers], ['Enquiries', d.enquiries], ['Files', d.files], ['Invoices', d.invoices],
        ['Payments', d.payments], ['Total Billed', money(d.total_billed)], ['Total Paid', money(d.total_paid)], ['Pending', money(d.pending_payment)]
      ].map(([k,v]) => `<article class="mini-card"><b>${v}</b><span>${k}</span></article>`).join('');
    }

    (document.getElementById('customersTable') as HTMLElement).innerHTML =
      table(['Customer ID','Name','Email','Phone','Organization','City','Work Domain','Created Date'],
        customers.map((x:any) => [x.id,x.full_name,x.email,x.phone,x.organization,x.city,x.work_domain,new Date(x.created_at).toLocaleString()]));

    (document.getElementById('enquiriesTable') as HTMLElement).innerHTML =
      table(['Enquiry ID','Name','Email','Industry','Service Required','Project Stage','Status','Created Date'],
        enquiries.map((x:any) => [x.id,x.full_name,x.email,x.industry,x.service_required,x.project_stage,x.status,new Date(x.created_at).toLocaleString()]));

    (document.getElementById('invoicesTable') as HTMLElement).innerHTML =
      table(['Invoice ID','Invoice Number','Customer','Title','Total Amount','Amount Paid','Pending Amount','Status','Created Date'],
        invoices.map((x:any) => [x.id,x.invoice_number,x.customer_id,x.title,money(x.total_amount),money(x.amount_paid),money(x.pending_amount),x.status,new Date(x.created_at).toLocaleString()]));

    (document.getElementById('paymentsTable') as HTMLElement).innerHTML =
      table(['Payment ID','Invoice ID','Customer Email','Amount','Payment Mode','Reference','Status','Created Date'],
        payments.map((x:any) => [x.id,x.invoice_id,x.customer_email,money(x.amount),x.payment_mode,x.reference,x.status,new Date(x.created_at).toLocaleString()]));

    (document.getElementById('filesTable') as HTMLElement).innerHTML =
      table(['File ID','Customer','Category','Original Filename','File Size','Notes','Download Link','Uploaded Date'],
        files.map((x:any) => [x.id,x.customer_id,x.category,x.original_filename,`${Math.round(x.file_size/1024)} KB`,x.notes,`<a href="http://localhost:8000${x.download_url}" target="_blank">Download</a>`,new Date(x.created_at).toLocaleString()]));

  } catch (err: any) {
    const dashboardCards = document.getElementById('dashboardCards');
    if (dashboardCards) {
      dashboardCards.innerHTML = `<article class="mini-card"><b>Backend Offline</b><span>Start FastAPI at http://localhost:8000</span></article>`;
    }
  }
}

window.addEventListener('hashchange', render);
render();
