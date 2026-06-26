import { routes, currentPath } from '../routes';

export function Header() {
  const active = currentPath();
  return `
    <header class="site-header">
      <nav class="nav">
        <a href="#/" class="brand">
          <span class="logo">K<span>2</span></span>
          <span>
            <strong>K2 — KSquare Consultancy</strong>
            <small>Under MxSense Telingent Solutions Pvt. Ltd.</small>
          </span>
        </a>
        <div class="navlinks">
          ${routes.filter(r => !['/privacy-policy','/terms','/refund-policy'].includes(r.path)).map(r => `
            <a class="${active === r.path ? 'active' : ''}" href="#${r.path}">${r.label}</a>
          `).join('')}
        </div>
      </nav>
    </header>
  `;
}
