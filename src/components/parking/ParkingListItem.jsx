export default function ParkingListItem({ lot }) {
  const statusColor = lot.status === "이용 가능" ? "text-green-600" : "text-red-600";

  return (
    <li className="bg-white/70 p-4 rounded-lg shadow-md flex justify-between items-center">
      <div>
        <h3 className="font-bold">{lot.name}</h3>
        <p className="text-sm text-gray-600">{lot.address}</p>
      </div>
      <span className={`font-bold ${statusColor}`}>{lot.status}</span>
    </li>
  );
}
