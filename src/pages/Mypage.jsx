import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

// 회원정보 컴포넌트
const UserProfile = ({ user }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">회원정보</h2>
    {user ? (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            이름
          </label>
          <input
            type="text"
            value={user.name}
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            readOnly
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            이메일
          </label>
          <input
            type="email"
            value={user.email}
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            readOnly
          />
        </div>
      </div>
    ) : (
      <p>로그인 정보가 없습니다. 다시 로그인해주세요.</p>
    )}
  </div>
);

// 예약 내역 컴포넌트
const ReservationList = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">예약 내역</h2>
    <ul className="space-y-4">
      <li className="p-4 border rounded-md">
        <p className="font-semibold">강남 주차장</p>
        <p className="text-sm text-gray-600">2025년 10월 3일 14:00 - 16:00</p>
      </li>
      <li className="p-4 border rounded-md">
        <p className="font-semibold">역삼 주차장</p>
        <p className="text-sm text-gray-600">2025년 9월 5일 10:00 - 11:00</p>
      </li>
    </ul>
  </div>
);

export default function Mypage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex">
        {/* 사이드 메뉴 */}
        <aside className="w-1/4 pr-8">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === "profile"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              회원정보
            </button>
            <button
              onClick={() => setActiveTab("reservations")}
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === "reservations"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              예약 내역
            </button>
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="w-3/4">
          {activeTab === "profile" && <UserProfile user={user} />}
          {activeTab === "reservations" && <ReservationList />}
        </main>
      </div>
    </div>
  );
}
