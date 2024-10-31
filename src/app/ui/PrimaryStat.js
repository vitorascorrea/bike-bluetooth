class PrimaryStat extends HTMLElement {
  static observedAttributes = ["title", "icon", "value", "unit"];

  constructor() {
    super();
    this.container = document.createElement("div");
    this.container.classList.add("primary-stat");
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
    const title = this.getAttribute("title") || "???";
    const value = this.getAttribute("value") || "";
    const icon = this.getAttribute("icon") || "";
    const unit = this.getAttribute("unit") || "";

    this.container.innerHTML = `
    <i class="fas ${icon}"></i>
    ${title}
    <span>${value} ${unit}</span>
    `;
  }
}

customElements.define("primary-stat", PrimaryStat);
