import { useState, useEffect, useMemo } from "react";
import KakaoMap from "../components/map/KakaoMap";
import SearchBar from "../components/search/SearchBar";
import ParkingList from "../components/parking/ParkingList";

export default function MainPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [parkingLots, setParkingLots] = useState([]);
  const [mapCenter, setMapCenter] = useState(null);
  const [filterType, setFilterType] = useState("all"); // 'all', 'public', 'private'
  const [filterOperatingHours, setFilterOperatingHours] = useState("all"); // 'all', '24h', 'now'
  const [filterFees, setFilterFees] = useState("all"); // 'all', 'free', 'paid'
  const [filterEV, setFilterEV] = useState(false); // boolean

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert("검색어를 입력해주세요.");
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(searchTerm, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const { y: lat, x: lng } = result[0];
        setMapCenter({ lat, lng });
      } else {
        alert("검색 결과가 없습니다. 다시 시도해주세요.");
      }
    });
  };

  const getFilteredParkingLots = useMemo(() => {
    let filtered = parkingLots;

    // 공영/민영 필터
    if (filterType === "public") {
      filtered = filtered.filter(
        (lot) => lot.PRK_TYPE && lot.PRK_TYPE.includes("공영")
      );
    } else if (filterType === "private") {
      filtered = filtered.filter(
        (lot) => lot.PRK_TYPE && !lot.PRK_TYPE.includes("공영")
      );
    }

    // 운영시간 필터 (현재 시간 기준은 구현이 복잡하므로 24시간 운영만 우선 구현)
    if (filterOperatingHours === "24h") {
      filtered = filtered.filter(
        (lot) => lot.OPR_BGN_TM === "0000" && lot.OPR_END_TM === "2400"
      );
    }

    // 요금 필터
    if (filterFees === "free") {
      filtered = filtered.filter((lot) => lot.RATES === "0");
    } else if (filterFees === "paid") {
      filtered = filtered.filter((lot) => lot.RATES !== "0");
    }

    const regularParkingLots = filtered.filter(
      (lot) => !lot.hasEVCharger || lot.hasEVCharger
    );
    const evChargingStations = filtered.filter((lot) => lot.hasEVCharger);

    return { regularParkingLots, evChargingStations };
  }, [parkingLots, filterType, filterOperatingHours, filterFees]);

  const { regularParkingLots, evChargingStations } = getFilteredParkingLots;

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

            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearch={handleSearch}
            />

            <KakaoMap center={mapCenter} onParkingLotsChange={setParkingLots} />

            {/* 필터링 UI */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow-inner">
              <h2 className="text-xl font-bold text-gray-800 mb-3">필터</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 공영/민영 필터 */}
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

                {/* 운영시간 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    운영시간
                  </label>
                  <div className="mt-1 flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="operatingHours"
                        value="all"
                        checked={filterOperatingHours === "all"}
                        onChange={(e) =>
                          setFilterOperatingHours(e.target.value)
                        }
                      />
                      <span className="ml-2">전체</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        className="form-radio"
                        name="operatingHours"
                        value="24h"
                        checked={filterOperatingHours === "24h"}
                        onChange={(e) =>
                          setFilterOperatingHours(e.target.value)
                        }
                      />
                      <span className="ml-2">24시간</span>
                    </label>
                  </div>
                </div>

                {/* 요금 필터 */}
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

                {/* 전기차 충전소 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    기타
                  </label>
                  <div className="mt-1">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={filterEV}
                        onChange={(e) => setFilterEV(e.target.checked)}
                      />
                      <span className="ml-2">전기차 충전기</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {filterEV ? (
              <ParkingList
                title="전기차 충전소"
                parkingLots={evChargingStations}
              />
            ) : (
              <ParkingList
                title="일반 주차장"
                parkingLots={regularParkingLots}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
