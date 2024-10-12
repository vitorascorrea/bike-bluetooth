class Bike {
  // Power approximation formula => Power = a * (b1 ^ cadence) * (b2 ^ resistance)
  static POWER_CADENCE_COEFFICIENT = 1.015343;
  static POWER_RESISTANCE_COEFFICIENT = 1.090112;
  static POWER_CONSTANT = 7.228958;

  constructor() {
    this.wheelRadius = 0.35; // average, in meters
    this.wheelCircumference = 2 * Math.PI * this.wheelRadius;
    this.cadence = 0;
    this.resistance = 1;
  }

  updateCadence = (cadence) => {
    this.cadence = cadence;
  };

  updateResistance = (resistance) => {
    this.resistance = resistance;
  };

  currentSpeedInKmPerH = () => {
    // Cadence is in RPM
    return (this.cadence * this.wheelCircumference * 60.0) / 1000.0;
  };

  currentPowerInWatts = () => {
    if (this.cadence > 0 && this.resistance > 0) {
      return (
        Math.pow(Bike.POWER_CADENCE_COEFFICIENT, this.cadence) *
        Math.pow(Bike.POWER_RESISTANCE_COEFFICIENT, this.resistance) *
        Bike.POWER_CONSTANT
      );
    } else {
      return 0;
    }
  };
}

export default Bike;
