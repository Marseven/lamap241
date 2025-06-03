export default function PlayerInfo({ name, score }) {
  return (
    <div className="text-center mb-2">
      <div className="text-xl font-bold">{score}</div>
      <div>{name}</div>
    </div>
  );
}