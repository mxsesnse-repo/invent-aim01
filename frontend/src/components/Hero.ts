export function Hero(imageUrl: string) {
  return `
    <section class="hero section">
      <div class="hero-copy reveal">
        <span class="eyebrow">mxs-technologies.com • IITM Research Park, Chennai</span>
        <h1>From Concept to <span>Material</span> to Manufacturing</h1>
        <p>
          K2 — KSquare Consultancy provides futuristic engineering consultancy in product design,
          additive manufacturing, material selection, digital twins, robotic inspection, mobility,
          UAV, USV, rail, metro and smart manufacturing systems.
        </p>
        <div class="actions">
          <a class="btn primary" href="#/contact">Discuss Your Project</a>
          <a class="btn" href="#/projects">View Visual Gallery</a>
          <a class="btn orange" href="#/payments">Request Payment Link</a>
        </div>
      </div>
      <div class="hero-visual reveal">
        <img src="${imageUrl}" alt="K2 Consultancy hero visual" />
        <div class="stats">
          <span><b>17+</b> Services</span>
          <span><b>12+</b> Industries</span>
          <span><b>360°</b> Portal</span>
        </div>
      </div>
    </section>
  `;
}
