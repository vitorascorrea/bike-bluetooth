class Bike {
  constructor() {
    this.wheelRadius = 0.35; // average, in meters
    this.wheelCircumference = 2 * Math.PI * this.wheelRadius;
    this.cadence = 0;
    this.resistance = 1;
  }

  updateCadence = (cadence) => {
    this.cadence = cadence;
  }

  updateResistance = (resistance) => {
    this.resistance = resistance;
  }
}

export default Bike