export default function ParkingListItem({ lot }) {
  const availableSpaces = lot.CPCTY - (lot.CUR_PRK_CNT || 0);
  const statusText =
    lot.CUR_PRK_YN === "Y" && lot.CUR_PRK_CNT !== undefined
      ? `주차 가능: ${availableSpaces} 대`
      : "실시간 정보 없음";
  const statusColor =
    lot.CUR_PRK_YN === "Y" && lot.CUR_PRK_CNT !== undefined
      ? "text-green-600"
      : "text-gray-500";

  return (
    <li className="bg-white/70 p-4 rounded-lg shadow-md">
      <h3 className="font-bold text-lg text-sky-800 mb-1">{lot.PRK_NM}</h3>
      <p className="text-sm text-gray-700 mb-1">
        <strong>주소:</strong> {lot.ADDRESS}
      </p>
      <p className="text-sm text-gray-700 mb-1">
        <strong>운영시간:</strong>{" "}
        {lot.OPR_BGN_TM && lot.OPR_END_TM
          ? `${lot.OPR_BGN_TM} - ${lot.OPR_END_TM}`
          : "24시간"}
      </p>
      <p className="text-sm text-gray-700 mb-2">
        <strong>요금:</strong>{" "}
        {lot.RATES
          ? `${lot.RATES}원 / ${lot.TIME_RATES || "?"}분`
          : "정보 없음"}
      </p>
      <p className="text-sm text-sky-700 mb-2">
        <strong>전기차 충전 가능 대수:</strong>{" "}
        {lot.evChargers && lot.evChargers.length > 0
          ? `${
              lot.evChargers.filter(
                (charger) => charger.CHARGER_STAT === "사용가능"
              ).length
            } / ${lot.evChargers.length}`
          : "정보 없음"}
      </p>
      <div className={`font-bold ${statusColor}`}>{statusText}</div>
    </li>
  );
}
