import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

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

const FavoriteItem = ({ item, onRemove }) => (
  <li className="p-4 border rounded-md relative">
    <p className="font-semibold text-sky-800">{item.prk_name}</p>
    <p className="text-sm text-gray-700 mt-1">
      <strong>주소:</strong> {item.address || item.road_address || "정보 없음"}
    </p>
    <p className="text-sm text-gray-700 mt-1">
      <strong>요금:</strong>{" "}
      {item.rates && String(item.rates) !== "0"
        ? `${item.rates}원 / ${item.time_rates || "?"}분`
        : "무료 또는 정보 없음"}
    </p>
    <button
      onClick={() => onRemove(item.favorite_id)}
      className="absolute top-3 right-3 text-red-500 hover:text-red-700 text-2xl font-bold"
      title="찜 삭제"
    >
      &times;
    </button>
  </li>
);

const FavoriteList = ({ favorites, setFavorites }) => {
  const handleFavoriteRemove = async (favoriteId) => {
    if (!window.confirm("이 항목을 찜 목록에서 삭제하시겠습니까?")) {
      return;
    }
    try {
      // 찜 삭제 API 호출
      const response = await fetch(`/api/favorites/${favoriteId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        alert("삭제되었습니다.");
        setFavorites((prevFavorites) =>
          prevFavorites.filter((item) => item.favorite_id !== favoriteId)
        );
      } else {
        alert(data.message || "삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("찜 삭제 오류:", error);
      alert("요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">찜 목록</h2>
      {favorites.length > 0 ? (
        <ul className="space-y-4">
          {favorites.map((item) => (
            <FavoriteItem
              key={item.favorite_id}
              item={item}
              onRemove={handleFavoriteRemove}
            />
          ))}
        </ul>
      ) : (
        <p>찜한 주차장이 없습니다.</p>
      )}
    </div>
  );
};

export default function Mypage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("쿠키 파싱 오류", e);
      }
    }
  }, []);

  // 찜 목록 불러오기
  useEffect(() => {
    if (user && user.email && activeTab === "favorites") {
      const fetchFavorites = async () => {
        setIsLoadingFavorites(true);
        try {
          const response = await fetch(`/api/favorites/user/${user.email}`);
          const data = await response.json();

          if (data.success) {
            setFavorites(data.favorites);
          } else {
            console.error("찜 목록 로드 실패:", data.message);
          }
        } catch (error) {
          console.error("찜 목록 로드 오류:", error);
        } finally {
          setIsLoadingFavorites(false);
        }
      };

      fetchFavorites();
    }
  }, [user, activeTab]);

  return (
    <div className="container mx-auto p-4 pt-16">
      <div className="flex">
        {/* 사이드바 */}
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
              onClick={() => setActiveTab("favorites")}
              className={`w-full text-left px-4 py-2 rounded-md ${
                activeTab === "favorites"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              찜 목록
            </button>
          </nav>
        </aside>

        <main className="w-3/4">
          {activeTab === "profile" && <UserProfile user={user} />}
          {activeTab === "favorites" &&
            (isLoadingFavorites ? (
              <p>찜 목록을 불러오는 중입니다...</p>
            ) : (
              <FavoriteList favorites={favorites} setFavorites={setFavorites} />
            ))}
        </main>
      </div>
    </div>
  );
}
