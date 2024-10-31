class SecondaryStat extends HTMLElement {
  static observedAttributes = ["title", "icon", "unit", "current", "avg", "max"];

  constructor() {
    super();
    this.container = document.createElement("div");
    this.container.classList.add("stat");
    this.appendChild(this.container);

    this.render();
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const title = this.getAttribute("title") || "Stat";
    const icon = this.getAttribute("icon") || "";
    const unit = this.getAttribute("unit") || "";
    const current = this.getAttribute("current") || "0.00";
    const avg = this.getAttribute("avg") || "0.00";
    const max = this.getAttribute("max") || "0.00";

    this.container.innerHTML = `
      <div class="stat-header">
        <i class="fas ${icon}"></i>
        <span>${title} ${unit ? "in " + unit : ""}</span>
      </div>
      <div class="stat-values">
        <stat-value label="Current" value="${current}"></stat-value>
        <stat-value label="Avg" value="${avg}"></stat-value>
        <stat-value label="Max" value="${max}"></stat-value>
      </div>
    `;
  }
}

customElements.define("secondary-stat", SecondaryStat);
