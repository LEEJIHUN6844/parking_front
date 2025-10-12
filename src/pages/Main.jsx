import { useState, useEffect } from "react";
import KakaoMap from "../components/map/KakaoMap";
import SearchBar from "../components/search/SearchBar";
import ParkingList from "../components/parking/ParkingList";

export default function MainPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [parkingLots, setParkingLots] = useState([]);

  useEffect(() => {
    // 이 부분은 주변 주차장 목록을 위한 로직으로, 지도와는 별개로 작동합니다.
    console.log(`Searching for: ${searchTerm}`);

    const fakeData = [
      {
        id: 1,
        name: "주차장 A",
        address: "서울시 강남구",
        status: "이용 가능",
      },
      {
        id: 2,
        name: "주차장 B",
        address: "서울시 서초구",
        status: "만차",
      },
    ];
    setParkingLots(fakeData);
  }, [searchTerm]);

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

            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

            {/* KakaoMap은 이제 props 없이 독립적으로 작동합니다. */}
            <KakaoMap />

            <ParkingList parkingLots={parkingLots} />
          </div>
        </div>
      </main>
    </div>
  );
}