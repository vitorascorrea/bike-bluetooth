export const formatTime = (totalSecondsPassed) => {
  const hours = Math.floor(totalSecondsPassed / 3600);
  const minutes = Math.floor((totalSecondsPassed % 3600) / 60);
  const seconds = Math.floor((totalSecondsPassed % 3600) % 60)

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}