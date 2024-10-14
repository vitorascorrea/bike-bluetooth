import Bike from "../../app/session-models/Bike.js";

describe("Bike Class Tests", () => {
  let bike;

  beforeEach(() => {
    bike = new Bike();
  });

  test("Bike constructor initializes default values correctly", () => {
    expect(bike.wheelRadius).toBe(0.35);
    expect(bike.wheelCircumference).toBeCloseTo(2 * Math.PI * 0.35, 5);
    expect(bike.cadence).toBe(0);
    expect(bike.resistance).toBe(1);
  });

  test("updateCadence updates the cadence", () => {
    bike.updateCadence(90);
    expect(bike.cadence).toBe(90);
  });

  test("updateResistance updates the resistance", () => {
    bike.updateResistance(3);
    expect(bike.resistance).toBe(3);
  });

  test("currentSpeedInKmPerH calculates speed correctly", () => {
    bike.updateCadence(60);
    bike.wheelCircumference = 3; // To make the test easier

    const speed = bike.currentSpeedInKmPerH();
    expect(speed).toBeCloseTo(
      (60 * 3 * 60.0) / 1000.0,
      2
    ); // Speed in km/h formula
  });

  test("currentPowerInWatts calculates power correctly when cadence and resistance are non-zero", () => {
    bike.updateCadence(90);
    bike.updateResistance(3);
    const power = bike.currentPowerInWatts();
    expect(power).toBeGreaterThan(0);
  });

  test("currentPowerInWatts returns 0 when cadence or resistance is zero", () => {
    bike.updateCadence(0);
    bike.updateResistance(3);
    expect(bike.currentPowerInWatts()).toBe(0);

    bike.updateCadence(90);
    bike.updateResistance(0);
    expect(bike.currentPowerInWatts()).toBe(0);
  });

  test("serialize converts the bike object to JSON string correctly", () => {
    bike.updateCadence(100);
    bike.updateResistance(5);
    const serialized = Bike.serialize(bike);
    const expected = JSON.stringify({
      wheelRadius: bike.wheelRadius,
      cadence: bike.cadence,
      resistance: bike.resistance,
    });
    expect(serialized).toBe(expected);
  });

  test("deserialize creates a Bike object from a JSON string", () => {
    const bikeData = JSON.stringify({
      wheelRadius: 0.35,
      cadence: 75,
      resistance: 3,
    });
    const deserializedBike = Bike.deserialize(bikeData);
    expect(deserializedBike.wheelRadius).toBe(0.35);
    expect(deserializedBike.cadence).toBe(75);
    expect(deserializedBike.resistance).toBe(3);
  });
});

