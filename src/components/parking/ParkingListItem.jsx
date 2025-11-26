// parking_front/src/components/parking/ParkingListItem.jsx
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

  // 1. 찜하기 핸들러 (기존 코드)
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

  // 🔻🔻🔻 [추가] 2. 길안내 버튼 클릭 핸들러 🔻🔻🔻
  const handleNavigate = () => {
    const { PRK_NM, LAT, LNG } = lot;

    // 주차장 이름에 특수문자(+, &, / 등)가 있을 수 있으므로 인코딩합니다.
    const destinationName = encodeURIComponent(PRK_NM);

    // 카카오내비 웹 길안내 URL
    const url = `https://map.kakao.com/link/to/${destinationName},${LAT},${LNG}`;

    // 새 탭에서 열기
    window.open(url, "_blank");
  };
  // 🔺🔺🔺 ---------------------------------- 🔺🔺🔺

  return (
    <li className="bg-white/70 p-4 rounded-lg shadow-md relative">
      {/* 🔻🔻🔻 [수정] 3. 버튼 2개를 위한 레이아웃 수정 🔻🔻🔻 */}
      <div className="absolute top-4 right-4 flex gap-2">
        {/* 길안내 버튼 */}
        <button
          onClick={handleNavigate}
          className="text-sm font-medium transition-colors bg-green-500 text-white hover:bg-green-600 rounded-md px-3 py-1"
          title="길안내"
        >
          길안내
        </button>

        {/* 찜하기 버튼 */}
        <button
          onClick={handleFavoriteAdd}
          className="text-sm font-medium transition-colors bg-sky-500 text-white hover:bg-sky-600 rounded-md px-3 py-1"
          title="찜하기"
        >
          찜하기
        </button>
      </div>

      {/* [수정] 4. 주차장 이름이 버튼과 겹치지 않도록
        버튼이 차지하는 영역(약 160px)만큼 오른쪽에 여백(pr)을 줍니다.
        pr-[170px]는 "padding-right: 170px"와 같습니다.
      */}
      <h3 className="font-bold text-lg text-sky-800 mb-1 pr-[170px]">
        {lot.PRK_NM}
      </h3>
      {/* 🔺🔺🔺 ----------------------------------------- 🔺🔺🔺 */}

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
