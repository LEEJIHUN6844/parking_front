
import { Link } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-white/30 backdrop-blur-md shadow-lg fixed top-0 left-0 right-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-sky-600 font-bold text-2xl">
              Parking
            </Link>
          </div>
          <div className="flex items-center">
            <span className="text-gray-700 mr-4">환영합니다, {user?.name || "방문자"}님!</span>
            <Link
              to="/mypage"
              className="text-gray-600 hover:text-sky-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              마이페이지
            </Link>
            <button
              onClick={onLogout}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
