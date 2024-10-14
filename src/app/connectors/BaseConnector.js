class BaseConnector {
  constructor(
    cadenceCallback = (value) => {
      console.log("cadence", value);
    },
    resistanceCallback = (value) => {
      console.log("resistance", value);
    }
  ) {
    this.cadenceCallback = cadenceCallback;
    this.resistanceCallback = resistanceCallback;
  }

  active = () => {
    throw new Error("Method 'active()' must be implemented.");
  };

  startListening = async () => {
    throw new Error("Method 'startListening()' must be implemented.");
  };

  stopListening = async () => {
    throw new Error("Method 'stopListening()' must be implemented.");
  };
}

export default BaseConnector;
