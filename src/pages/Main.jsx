import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import KakaoMap from "./KakaoMap";

export default function MainPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/"); 
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
        } else {
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        navigate("/");
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/parking.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Navbar */}
      {user && <Navbar user={user} onLogout={handleLogout} />}

      {/* Main Content */}
      <main className="relative z-10 pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/50 backdrop-blur-md shadow-xl rounded-lg p-8">
            <h1 className="text-3xl font-bold text-sky-700 mb-4">
              주차장 검색
            </h1>
            <p className="text-gray-800 mb-6">
              아래에서 주차장을 검색하거나 지도를 통해 위치를 확인하세요.
            </p>

            {/* Search Bar */}
            <div className="mb-8">
              <input
                type="text"
                placeholder="주소, 장소 또는 키워드 입력..."
                className="w-full px-4 py-3 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Kakao Map */}
            <KakaoMap />

            {/* Placeholder for Parking List */}
            <div>
              <h2 className="text-2xl font-bold text-sky-700 mt-4 mb-4">
                주변 주차장 목록
              </h2>
              <ul className="space-y-4">
                <li className="bg-white/70 p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">주차장 A</h3>
                    <p className="text-sm text-gray-600">서울시 강남구</p>
                  </div>
                  <span className="text-green-600 font-bold">이용 가능</span>
                </li>
                <li className="bg-white/70 p-4 rounded-lg shadow-md flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">주차장 B</h3>
                    <p className="text-sm text-gray-600">서울시 서초구</p>
                  </div>
                  <span className="text-red-600 font-bold">만차</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}