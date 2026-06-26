export function GalleryCard(item: any, imageUrl: string) {
  return `
    <article class="gallery-card reveal">
      <img src="${imageUrl}" alt="${item.title}" />
      <div>
        <span class="pill">${item.category}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <a class="link-btn" href="#/contact">Discuss This Service →</a>
      </div>
    </article>
  `;
}
