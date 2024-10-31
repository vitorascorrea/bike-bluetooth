class StatValue extends HTMLElement {
  static observedAttributes = ["label", "value"];

  constructor() {
    super();
    this.container = document.createElement("div");
    this.container.classList.add("stat-value");
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
    const label = this.getAttribute("label") || "???";
    const value = this.getAttribute("value") || "";

    this.container.innerHTML = `${label}: <span>${value}</span>`;
  }
}

customElements.define("stat-value", StatValue);
