export function ServiceCard(service: any, imageUrl: string) {
  return `
    <article class="service-card reveal">
      <img src="${imageUrl}" alt="${service.title}" />
      <div class="service-body">
        <span class="pill">${service.category}</span>
        <h3>${service.title}</h3>
        <p>${service.short}</p>
        <ul>${service.capabilities.slice(0, 3).map((x: string) => `<li>${x}</li>`).join('')}</ul>
        <a class="link-btn" href="#/contact" data-service="${service.title}">Discuss This Service →</a>
      </div>
    </article>
  `;
}
