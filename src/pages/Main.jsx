import { useState, useMemo, useEffect } from "react"; // 1. useEffect 추가
import KakaoMap from "../components/map/KakaoMap";
import SearchBar from "../components/search/SearchBar";
import ParkingList from "../components/parking/ParkingList";

// 2. hotspots 목록 (이전 단계에서 KakaoMap.jsx에서 이곳으로 이동)
const hotspots = [
  { name: "강남 MICE 관광특구", code: "POI001" },
  { name: "동대문 관광특구", code: "POI002" },
  { name: "명동 관광특구", code: "POI003" },
  { name: "이태원 관광특구", code: "POI004" },
  { name: "잠실 관광특구", code: "POI005" },
  { name: "종로·청계 관광특구", code: "POI006" },
  { name: "홍대 관광특구", code: "POI007" },
  { name: "경복궁", code: "POI008" },
  { name: "광화문·덕수궁", code: "POI009" },
  { name: "보신각", code: "POI010" },
  { name: "서울 암사동 유적", code: "POI011" },
  { name: "창덕궁·종묘", code: "POI012" },
  { name: "가산디지털단지역", code: "POI013" },
  { name: "강남역", code: "POI014" },
  { name: "건대입구역", code: "POI015" },
  { name: "고덕역", code: "POI016" },
  { name: "고속터미널역", code: "POI017" },
  { name: "교대역", code: "POI018" },
  { name: "구로디지털단지역", code: "POI019" },
  { name: "구로역", code: "POI020" },
  { name: "군자역", code: "POI021" },
  { name: "대림역", code: "POI023" },
  { name: "동대문역", code: "POI024" },
  { name: "뚝섬역", code: "POI025" },
  { name: "미아사거리역", code: "POI026" },
  { name: "발산역", code: "POI027" },
  { name: "사당역", code: "POI029" },
  { name: "삼각지역", code: "POI030" },
  { name: "서울대입구역", code: "POI031" },
  { name: "서울식물원·마곡나루역", code: "POI032" },
  { name: "서울역", code: "POI033" },
  { name: "선릉역", code: "POI034" },
  { name: "성신여대입구역", code: "POI035" },
  { name: "수유역", code: "POI036" },
  { name: "신논현역·논현역", code: "POI037" },
  { name: "신도림역", code: "POI038" },
  { name: "신림역", code: "POI039" },
  { name: "신촌·이대역", code: "POI040" },
  { name: "양재역", code: "POI041" },
  { name: "역삼역", code: "POI042" },
  { name: "연신내역", code: "POI043" },
  { name: "오목교역·목동운동장", code: "POI044" },
  { name: "왕십리역", code: "POI045" },
  { name: "용산역", code: "POI046" },
  { name: "이태원역", code: "POI047" },
  { name: "장지역", code: "POI048" },
  { name: "장한평역", code: "POI049" },
  { name: "천호역", code: "POI050" },
  { name: "총신대입구(이수)역", code: "POI051" },
  { name: "충정로역", code: "POI052" },
  { name: "합정역", code: "POI053" },
  { name: "혜화역", code: "POI054" },
  { name: "홍대입구역(2호선)", code: "POI055" },
  { name: "회기역", code: "POI056" },
  { name: "가락시장", code: "POI058" },
  { name: "가로수길", code: "POI059" },
  { name: "광장(전통)시장", code: "POI060" },
  { name: "김포공항", code: "POI061" },
  { name: "노량진", code: "POI063" },
  { name: "덕수궁길·정동길", code: "POI064" },
  { name: "북촌한옥마을", code: "POI066" },
  { name: "서촌", code: "POI067" },
  { name: "성수카페거리", code: "POI068" },
  { name: "쌍문역", code: "POI070" },
  { name: "압구정로데오거리", code: "POI071" },
  { name: "여의도", code: "POI072" },
  { name: "연남동", code: "POI073" },
  { name: "영등포 타임스퀘어", code: "POI074" },
  { name: "용리단길", code: "POI076" },
  { name: "이태원 앤틱가구거리", code: "POI077" },
  { name: "인사동", code: "POI078" },
  { name: "창동 신경제 중심지", code: "POI079" },
  { name: "청담동 명품거리", code: "POI080" },
  { name: "청량리 제기동 일대 전통시장", code: "POI081" },
  { name: "해방촌·경리단길", code: "POI082" },
  { name: "DDP(동대문디자인플라자)", code: "POI083" },
  { name: "DMC(디지털미디어시티)", code: "POI084" },
  { name: "강서한강공원", code: "POI085" },
  { name: "고척돔", code: "POI086" },
  { name: "광나루한강공원", code: "POI087" },
  { name: "광화문광장", code: "POI088" },
  { name: "국립중앙박물관·용산가족공원", code: "POI089" },
  { name: "난지한강공원", code: "POI090" },
  { name: "남산공원", code: "POI091" },
  { name: "노들섬", code: "POI092" },
  { name: "뚝섬한강공원", code: "POI093" },
  { name: "망원한강공원", code: "POI094" },
  { name: "반포한강공원", code: "POI095" },
  { name: "북서울꿈의숲", code: "POI096" },
  { name: "서리풀공원·몽마르뜨공원", code: "POI098" },
  { name: "서울광장", code: "POI099" },
  { name: "서울대공원", code: "POI100" },
  { name: "서울숲공원", code: "POI101" },
  { name: "아차산", code: "POI102" },
  { name: "양화한강공원", code: "POI103" },
  { name: "어린이대공원", code: "POI104" },
  { name: "여의도한강공원", code: "POI105" },
  { name: "월드컵공원", code: "POI106" },
  { name: "응봉산", code: "POI107" },
  { name: "이촌한강공원", code: "POI108" },
  { name: "잠실종합운동장", code: "POI109" },
  { name: "잠실한강공원", code: "POI110" },
  { name: "잠원한강공원", code: "POI111" },
  { name: "청계산", code: "POI112" },
  { name: "청와대", code: "POI113" },
  { name: "북창동 먹자골목", code: "POI114" },
  { name: "남대문시장", code: "POI115" },
  { name: "익선동", code: "POI116" },
  { name: "신정네거리역", code: "POI117" },
  { name: "잠실새내역", code: "POI118" },
  { name: "잠실역", code: "POI119" },
  { name: "잠실롯데타워 일대", code: "POI120" },
  { name: "송리단길·호수단길", code: "POI121" },
  { name: "신촌 스타광장", code: "POI122" },
  { name: "보라매공원", code: "POI123" },
  { name: "서대문독립공원", code: "POI124" },
  { name: "안양천", code: "POI125" },
  { name: "여의서로", code: "POI126" },
  { name: "올림픽공원", code: "POI127" },
  { name: "홍제폭포", code: "POI128" },
];

export default function MainPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [parkingLots, setParkingLots] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  // 3. (내 위치 연동) userLocation 상태 추가
  const [userLocation, setUserLocation] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [filterFees, setFilterFees] = useState("all");

  // 🔻🔻🔻 [수정] 4. filterEV (boolean) -> filterEVState (string) 🔻🔻🔻
  const [filterEVState, setFilterEVState] = useState("all"); // 'all' 또는 'ev_only'
  // 🔺🔺🔺 ---------------------------------------------------- 🔺🔺🔺

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      alert("지도 라이브러리를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    const places = new window.kakao.maps.services.Places();

    // 1. 주소 검색 먼저 시도
    geocoder.addressSearch(searchTerm, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const { y: lat, x: lng } = result[0];
        setMapCenter({ lat, lng });
      } else {
        // 2. 주소 검색 실패 시, 키워드 검색 시도
        console.warn("주소 검색 실패, 키워드 검색을 시도합니다:", searchTerm);

        places.keywordSearch(searchTerm, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            const { y: lat, x: lng } = result[0];
            setMapCenter({ lat, lng });
          } else {
            // 3. 두 검색 모두 실패
            alert("검색 결과가 없습니다. 다시 시도해주세요.");
          }
        });
      }
    });
  };

  // 🔻🔻🔻 [수정] 5. useMemo 로직을 단일 리스트 반환으로 변경 🔻🔻🔻
  const filteredParkingLots = useMemo(() => {
    let filtered = parkingLots;

    // --- 1. 유형 필터 (공영/민영) ---
    if (filterType === "public") {
      filtered = filtered.filter(
        (lot) =>
          lot.PRK_TYPE &&
          (lot.PRK_TYPE.includes("NW") || lot.PRK_TYPE.includes("NS"))
      );
    } else if (filterType === "private") {
      filtered = filtered.filter(
        (lot) =>
          lot.PRK_TYPE &&
          !lot.PRK_TYPE.includes("NW") &&
          !lot.PRK_TYPE.includes("NS")
      );
    }

    // --- 2. 요금 필터 (무료/유료) ---
    if (filterFees === "free") {
      filtered = filtered.filter((lot) => String(lot.RATES) === "0");
    } else if (filterFees === "paid") {
      filtered = filtered.filter((lot) => String(lot.RATES) !== "0");
    }

    // --- 3. 전기차 필터 (새로운 로직) ---
    if (filterEVState === "ev_only") {
      filtered = filtered.filter((lot) => lot.hasEVCharger);
    }
    // 'all'일 경우 (기본값) 아무것도 하지 않음

    return filtered;
  }, [parkingLots, filterType, filterFees, filterEVState]); // 6. 의존성 배열 수정
  // 🔺🔺🔺 ------------------------------------ 🔺🔺🔺

  // [제거] 7. 기존의 두 개 리스트를 반환하던 변수들 제거
  // const { regularParkingLots, evChargingStations } = getFilteredParkingLots;

  return (
    <div className="relative w-full h-full min-h-screen">
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/parking.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <main className="relative z-10 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h1 className="text-4xl font-bold text-sky-700 mb-4">
              주차장 검색
            </h1>
            <p className="text-gray-800 mb-6">
              아래에서 주차장을 검색하거나 지도를 통해 위치를 확인해보세요!
            </p>

            {/* 8. (자동완성) SearchBar에 hotspots prop 전달 */}
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearch={handleSearch}
              hotspots={hotspots}
            />

            {/* 9. (내 위치, 자동완성) KakaoMap에 props 전달 */}
            <KakaoMap
              center={mapCenter}
              onParkingLotsChange={setParkingLots}
              userLocation={userLocation}
              onUserLocationChange={setUserLocation}
              hotspots={hotspots}
            />

            {/* 필터링 UI */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow-inner">
              <h2 className="text-xl font-bold text-gray-800 mb-3">필터</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
                {/* 공영/민영 필터 (기존과 동일) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    유형
                  </label>
                  <div className="mt-1 flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="parkingType"
                        value="all"
                        checked={filterType === "all"}
                        onChange={(e) => setFilterType(e.target.value)}
                      />
                      <span className="ml-2">전체</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="parkingType"
                        value="public"
                        checked={filterType === "public"}
                        onChange={(e) => setFilterType(e.target.value)}
                      />
                      <span className="ml-2">공영</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="parkingType"
                        value="private"
                        checked={filterType === "private"}
                        onChange={(e) => setFilterType(e.target.value)}
                      />
                      <span className="ml-2">민영</span>
                    </label>
                  </div>
                </div>

                {/* 요금 필터 (기존과 동일) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    요금
                  </label>
                  <div className="mt-1 flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="fees"
                        value="all"
                        checked={filterFees === "all"}
                        onChange={(e) => setFilterFees(e.target.value)}
                      />
                      <span className="ml-2">전체</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="fees"
                        value="free"
                        checked={filterFees === "free"}
                        onChange={(e) => setFilterFees(e.target.value)}
                      />
                      <span className="ml-2">무료</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="fees"
                        value="paid"
                        checked={filterFees === "paid"}
                        onChange={(e) => setFilterFees(e.target.value)}
                      />
                      <span className="ml-2">유료</span>
                    </label>
                  </div>
                </div>

                {/* 🔻🔻🔻 [수정] 10. 전기차 충전소 필터를 Checkbox에서 Radio로 변경 🔻🔻🔻 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    전기차 충전기
                  </label>
                  <div className="mt-1 flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="evFilter"
                        value="all"
                        checked={filterEVState === "all"}
                        onChange={(e) => setFilterEVState(e.target.value)}
                      />
                      <span className="ml-2">전체</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="evFilter"
                        value="ev_only"
                        checked={filterEVState === "ev_only"}
                        onChange={(e) => setFilterEVState(e.target.value)}
                      />
                      <span className="ml-2">충전기만</span>
                    </label>
                  </div>
                </div>
                {/* 🔺🔺🔺 --------------------------------------------------- 🔺🔺🔺 */}
              </div>
            </div>

            {/* 🔻🔻🔻 [수정] 11. ParkingList 렌더링 로직을 하나로 통합 🔻🔻🔻 */}
            <ParkingList
              title={
                filterEVState === "ev_only"
                  ? "전기차 충전 가능 목록"
                  : "주변 주차장 목록"
              }
              parkingLots={filteredParkingLots}
              userLocation={userLocation}
            />
            {/* 🔺🔺🔺 ---------------------------------------------- 🔺🔺🔺 */}
          </div>
        </div>
      </main>
    </div>
  );
}
