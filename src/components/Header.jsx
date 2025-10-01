import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      setUser(JSON.parse(userCookie));
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md fixed w-full z-20 top-0">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <div
          className="text-xl font-bold text-sky-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          MainPage
        </div>
        <div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span>환영합니다, {user.name}님!😁</span>
              <button
                onClick={() => navigate("/mypage")}
                className="font-bold text-sky-600 cursor-pointer"
              >
                마이페이지
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
            >
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
