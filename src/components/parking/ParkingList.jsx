import ParkingListItem from "./ParkingListItem";

export default function ParkingList({ parkingLots }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-sky-700 mt-4 mb-4">
        주변 주차장 목록
      </h2>
      {parkingLots.length > 0 ? (
        <ul className="space-y-4">
          {parkingLots.map((lot) => (
            <ParkingListItem key={lot.id} lot={lot} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">검색 결과가 없습니다.</p>
      )}
    </div>
  );
}
