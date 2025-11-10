import Cookies from "js-cookie";

export default function ParkingListItem({ lot }) {
  const isRealtime =
    lot.CUR_PRK_YN === "Y" &&
    lot.CUR_PRK_CNT !== null &&
    lot.CUR_PRK_CNT !== undefined;
  const availableSpaces = lot.CPCTY - (lot.CUR_PRK_CNT || 0);

  const statusText = isRealtime
    ? `주차 가능: ${availableSpaces} 대`
    : "실시간 정보 없음";

  const statusColor = isRealtime ? "text-green-600" : "text-gray-500";

  const handleFavoriteAdd = async () => {
    const userData = Cookies.get("user");
    if (!userData) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const user = JSON.parse(userData);

      const userEmail = user.email;
      const parkingLotCode = lot.PRK_CD;

      if (!userEmail || !parkingLotCode) {
        alert("유저 정보(이메일) 또는 주차장 코드가 없습니다.");
        return;
      }

      const response = await fetch("/api/favorites/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ userEmail, parkingLotCode }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("찜 목록에 추가되었습니다.");
      } else {
        alert(data.message || "찜 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("찜 추가 요청 오류:", error);
      alert("요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <li className="bg-white/70 p-4 rounded-lg shadow-md relative">
      <button
        onClick={handleFavoriteAdd}
        className="absolute top-6 right-8 text-sm font-medium transition-colors bg-sky-500 text-white hover:bg-sky-600 rounded-md px-3 py-1"
        title="찜하기"
      >
        찜하기!
      </button>

      <h3 className="font-bold text-lg text-sky-800 mb-1 pr-10">
        {lot.PRK_NM}
      </h3>
      <p className="text-sm text-gray-700 mb-1">
        <strong>주소:</strong> {lot.ADDRESS || ""}
      </p>

      <p className="text-sm text-gray-700 mb-2">
        <strong>요금:</strong>{" "}
        {lot.RATES && String(lot.RATES) !== "0"
          ? `${lot.RATES}원 / ${lot.TIME_RATES || "?"}분`
          : "무료 또는 정보 없음"}
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
