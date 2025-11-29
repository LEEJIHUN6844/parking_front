import React, { useState, useEffect } from "react";
import { Roadview } from "react-kakao-maps-sdk";

export default function RoadviewModal({ position, onClose }) {
  const [isAvailable, setIsAvailable] = useState(null);

  useEffect(() => {
    if (!position) return;

    // 카카오 맵 스크립트가 로드되지 않았으면 중단
    if (!window.kakao || !window.kakao.maps) {
      setIsAvailable(false);
      return;
    }

    // 로드뷰 클라이언트 객체 생성
    const rvClient = new window.kakao.maps.RoadviewClient();
    const rvPosition = new window.kakao.maps.LatLng(position.lat, position.lng);

    // 좌표 주변 50m 반경 내에서 가장 가까운 로드뷰 찾기
    rvClient.getNearestPanoId(rvPosition, 50, (panoId) => {
      // panoId가 있으면 로드뷰가 존재하는 것
      if (panoId) {
        setIsAvailable(true);
      } else {
        // panoId가 없으면 해당 위치에는 로드뷰가 없음
        setIsAvailable(false);
      }
    });
  }, [position]);

  if (!position) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden relative animate-fade-in-up">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-bold text-gray-800">로드뷰</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors text-2xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        {/* 로드뷰 영역 */}
        <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center">
          {isAvailable === null && (
            <p className="text-gray-500">로드뷰 정보를 불러오는 중...</p>
          )}

          {isAvailable === false && (
            <div className="text-center text-gray-500">
              <p className="text-lg font-bold mb-2">⚠️ 로드뷰 정보 없음</p>
              <p>이 장소(주차장)는 로드뷰를 제공하지 않는 지역이거나,</p>
              <p>도로와 거리가 너무 멉니다.</p>
            </div>
          )}

          {isAvailable === true && (
            <Roadview
              position={{ lat: position.lat, lng: position.lng, radius: 50 }}
              style={{ width: "100%", height: "100%" }}
            ></Roadview>
          )}
        </div>
      </div>
    </div>
  );
}
