import BikeSession from "../../app/session/BikeSession.js";
import Bike from "../../app/session/Bike.js";

describe("BikeSession Class Tests", () => {
  let bike, bikeSession;

  beforeEach(() => {
    bike = new Bike();
    bikeSession = new BikeSession(bike);

    jest.useFakeTimers();
  });

  afterEach(() => {
    if (bikeSession.durationInterval) {
      clearInterval(bikeSession.durationInterval);
    }

    jest.clearAllTimers();
  });

  test("BikeSession constructor initializes default values correctly", () => {
    expect(bikeSession.bike).toBe(bike);
    expect(bikeSession.durationInSeconds).toBe(0);
    expect(bikeSession.totalDistanceInKm).toBe(0);
    expect(bikeSession.totalKCal).toBe(0);
    expect(bikeSession.getStatisticForValue("cadence", "max")).toBe(0);
    expect(bikeSession.getStatisticForValue("resistance", "max")).toBe(0);
    expect(bikeSession.getStatisticForValue("speed", "max")).toBe(0);
    expect(bikeSession.getStatisticForValue("power", "max")).toBe(0);
    expect(bikeSession.durationInterval).toBeNull();
    expect(bikeSession.lastTimeChecked).toBeNull();
  });

  test("start method starts the session", () => {
    bikeSession.start(() => {});

    jest.advanceTimersByTime(1000);

    expect(bikeSession.started()).toBe(true);
    expect(bikeSession.durationInSeconds).toBe(1);
  });

  test("stop method stops the session", () => {
    bikeSession.start(() => {});
    bikeSession.stop();
    expect(bikeSession.started()).toBe(false);
  });

  test("cadenceCallback updates cadence and session stats", () => {
    const newCadence = 80;

    bikeSession.cadenceCallback(newCadence);

    expect(bike.cadence).toBe(newCadence);
  });

  test("resistanceCallback updates resistance and session stats", () => {
    const newResistance = 4;

    bikeSession.resistanceCallback(newResistance);

    expect(bike.resistance).toBe(newResistance);
  });

  test("updateSessionStats updates stats based on cadence, resistance, and power if lastTimeChecked is before UPDATE_THRESHOLD_IN_SECONDS", () => {
    bike.wheelCircumference = 3; // To make the test easier
    bikeSession.cadenceCallback(60);
    bikeSession.resistanceCallback(1);
    bikeSession.lastTimeChecked = Date.now() / 1000 - 3600; // One hour

    bikeSession.updateSessionStats();

    const expectedSpeedInKmPerH = (60 * 3 * 60.0) / 1000.0;

    expect(bikeSession.getStatisticForValue("cadence", "max")).toBe(60);
    expect(bikeSession.getStatisticForValue("resistance", "max")).toBe(1);
    expect(bikeSession.getStatisticForValue("power", "max")).toBeGreaterThan(0);

    expect(bikeSession.getStatisticForValue("speed", "max")).toBeCloseTo(
      expectedSpeedInKmPerH,
      2
    );
    expect(bikeSession.totalDistanceInKm).toBeCloseTo(expectedSpeedInKmPerH, 2);

    expect(bikeSession.totalKCal).toBeGreaterThan(0);
  });

  test("updateSessionStats doesn't update stats if lastTimeChecked is null or not before UPDATE_THRESHOLD_IN_SECONDS", () => {
    bikeSession.cadenceCallback(90);
    bikeSession.resistanceCallback(5);

    bikeSession.updateSessionStats();

    expect(bikeSession.getStatisticForValue("cadence", "max")).toBe(0);
    expect(bikeSession.getStatisticForValue("resistance", "max")).toBe(0);
    expect(bikeSession.getStatisticForValue("speed", "max")).toBe(0);
    expect(bikeSession.getStatisticForValue("power", "max")).toBe(0);

    expect(bikeSession.totalDistanceInKm).toBe(0);
    expect(bikeSession.totalKCal).toBe(0);
  });

  test("serialize correctly serializes the session", () => {
    const expectedStatistics = {
      cadence: { max: 100 },
      resistance: { max: 4 },
      speed: { max: 35 },
      power: { max: 300 },
    };

    bikeSession.durationInSeconds = 60;
    bikeSession.totalDistanceInKm = 2.5;
    bikeSession.totalKCal = 100;
    bikeSession.statistics = expectedStatistics;

    const serialized = BikeSession.serialize(bikeSession);
    const expected = JSON.stringify({
      bike: Bike.serialize(bikeSession.bike),
      durationInSeconds: bikeSession.durationInSeconds,
      totalDistanceInKm: bikeSession.totalDistanceInKm,
      totalKCal: bikeSession.totalKCal,
      statistics: expectedStatistics,
    });

    expect(serialized).toBe(expected);
  });

  test("deserialize correctly deserializes the session", () => {
    const bikeData = JSON.stringify({
      wheelRadius: 0.35,
      cadence: 90,
      resistance: 3,
    });
    const bikeSessionData = JSON.stringify({
      bike: bikeData,
      durationInSeconds: 120,
      totalDistanceInKm: 10,
      totalKCal: 200,
      statistics: {
        cadence: { max: 100 },
        resistance: { max: 4 },
        speed: { max: 35 },
        power: { max: 300 },
      },
    });

    const deserializedSession = BikeSession.deserialize(bikeSessionData);

    expect(deserializedSession.durationInSeconds).toBe(120);
    expect(deserializedSession.totalDistanceInKm).toBe(10);
    expect(deserializedSession.totalKCal).toBe(200);
    expect(deserializedSession.getStatisticForValue("cadence", "max")).toBe(
      100
    );
    expect(deserializedSession.getStatisticForValue("resistance", "max")).toBe(
      4
    );
    expect(deserializedSession.getStatisticForValue("speed", "max")).toBe(35);
    expect(deserializedSession.getStatisticForValue("power", "max")).toBe(300);
    expect(deserializedSession.bike.cadence).toBe(90);
    expect(deserializedSession.bike.resistance).toBe(3);
  });

  test("serialize and deserialize work together correctly", () => {
    const originalSession = new BikeSession(bike);
    originalSession.start(() => {
      originalSession.cadenceCallback(85);
      originalSession.resistanceCallback(2);
      originalSession.updateSessionStats();
    });

    const serialized = BikeSession.serialize(originalSession);
    const deserializedSession = BikeSession.deserialize(serialized);

    expect(deserializedSession.bike.cadence).toBe(originalSession.bike.cadence);
    expect(deserializedSession.bike.resistance).toBe(
      originalSession.bike.resistance
    );
    expect(deserializedSession.totalDistanceInKm).toBe(
      originalSession.totalDistanceInKm
    );
    expect(deserializedSession.totalKCal).toBe(originalSession.totalKCal);
    expect(deserializedSession.getStatisticForValue("cadence", "max")).toBe(
      originalSession.getStatisticForValue("cadence", "max")
    );
    expect(deserializedSession.getStatisticForValue("resistance", "max")).toBe(
      originalSession.getStatisticForValue("resistance", "max")
    );
    expect(deserializedSession.getStatisticForValue("speed", "max")).toBe(
      originalSession.getStatisticForValue("speed", "max")
    );
    expect(deserializedSession.getStatisticForValue("power", "max")).toBe(
      originalSession.getStatisticForValue("power", "max")
    );
  });
});
