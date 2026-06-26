export const routes = [
  { path: '/', label: 'Home' },
  { path: '/about-kartik', label: 'About Kartik' },
  { path: '/services', label: 'Services' },
  { path: '/industries', label: 'Industries' },
  { path: '/projects', label: 'Projects' },
  { path: '/process', label: 'Process' },
  { path: '/customer-portal', label: 'Customer Portal' },
  { path: '/payments', label: 'Payments' },
  { path: '/contact', label: 'Contact' },
  { path: '/admin', label: 'Admin' },
  { path: '/privacy-policy', label: 'Privacy' },
  { path: '/terms', label: 'Terms' },
  { path: '/refund-policy', label: 'Refund Policy' }
];

export function currentPath() {
  return window.location.hash.replace('#', '') || '/';
}

export function navigate(path: string) {
  window.location.hash = path;
}
