import BaseConnector from "./BaseConnector.js";

class DebugConnector extends BaseConnector {
  constructor(cadenceCallback, resistanceCallback) {
    super(cadenceCallback, resistanceCallback);

    this.isActive = false;
    this.arrowKeysListener = null;

    this.currentCadence = 0;
    this.currentResistance = 1;
  }

  active = () => {
    return this.isActive;
  };

  startListening = async () => {
    this.arrowKeysListener = document.addEventListener(
      "keydown",
      this.#handleKeyPress
    );
    this.isActive = true;

    return Promise.resolve();
  };

  stopListening = async () => {
    removeEventListener("keydown", this.arrowKeysListener);
    this.isActive = false;

    return Promise.resolve();
  };

  #handleKeyPress = (event) => {
    switch (event.key) {
      case "ArrowUp":
        this.currentCadence += 1;
        this.cadenceCallback(this.currentCadence);
        break;
      case "ArrowDown":
        this.currentCadence -= 1;
        this.cadenceCallback(this.currentCadence);
        break;
      case "ArrowLeft":
        this.currentResistance -= 1;
        this.resistanceCallback(this.currentResistance);
        break;
      case "ArrowRight":
        this.currentResistance += 1;
        this.resistanceCallback(this.currentResistance);
        break;
      default:
        break;
    }

    console.log(`Current cadence: ${this.currentCadence}, current resistance: ${this.currentResistance}`)
  }
}

export default DebugConnector;
