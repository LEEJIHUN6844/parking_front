import React, { useEffect, useState, useRef } from "react"; // useRef 추가

const ensureArray = (data) => {
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

// 두 지점 간의 거리 계산
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const KakaoMap = ({
  center,
  onParkingLotsChange,
  userLocation,
  onUserLocationChange,
  hotspots,
}) => {
  const [map, setMap] = useState(null);
  const [infowindow, setInfowindow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const userMarkerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const mapInstance = new window.kakao.maps.Map(container, {
          center: new window.kakao.maps.LatLng(37.5665, 126.978),
          level: 5,
        });
        setMap(mapInstance);

        const iw = new window.kakao.maps.InfoWindow({
          zIndex: 1,
          removable: true,
        });
        setInfowindow(iw);
      });
    };

    return () => document.head.removeChild(script);
  }, []);

  useEffect(() => {
    if (map && center) {
      const newCenter = new window.kakao.maps.LatLng(center.lat, center.lng);
      map.setCenter(newCenter);
      fetchNearbyParking();
    }
  }, [map, center]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (onUserLocationChange) {
            onUserLocationChange({ lat, lng });
          }
        },
        (err) => {
          console.error("Error getting user location:", err);
        }
      );
    }
  }, [map]);

  // 2. 내 위치 마커 표시 로직 수정 (중복 방지)
  useEffect(() => {
    if (map && userLocation) {
      // 기존 마커가 있다면 지도에서 제거
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }

      const imageSrc = "/assets/location.png";
      const imageSize = new window.kakao.maps.Size(40, 40);
      const imageOption = { offset: new window.kakao.maps.Point(15, 30) };

      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imageOption
      );

      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(
          userLocation.lat,
          userLocation.lng
        ),
        image: markerImage,
      });

      // 새 마커를 지도에 표시하고 ref에 저장
      marker.setMap(map);
      userMarkerRef.current = marker;
    }
  }, [map, userLocation]);

  const fetchNearbyParking = async () => {
    if (!map || isLoading) return;

    setIsLoading(true);
    const allLots = [];

    try {
      const center = map.getCenter();
      const lat = center.getLat();
      const lng = center.getLng();

      if (map.markers) map.markers.forEach((marker) => marker.setMap(null));
      map.markers = [];

      const requests = hotspots.map(async (spot) => {
        try {
          const res = await fetch(`/api/seoul/parking/${spot.code}`);
          const data = await res.json();

          const cityData = data.CITYDATA;
          if (!cityData?.PRK_STTS) return;

          const allChargerDetails = [];
          if (cityData.CHARGER_STTS) {
            const chargerStations = ensureArray(cityData.CHARGER_STTS);

            chargerStations.forEach((station) => {
              const details = ensureArray(station.CHARGER_DETAILS);

              details.forEach((detail) => {
                allChargerDetails.push({
                  ...detail,
                  STAT_NM: station.STAT_NM,
                  STAT_ID: station.STAT_ID,
                  STAT_ADDR: station.STAT_ADDR,
                  STAT_USETIME: station.STAT_USETIME,
                  STAT_PARKPAY: station.STAT_PARKPAY,
                  STAT_LIMITYN: station.STAT_LIMITYN,
                  STAT_LIMITDETAIL: station.STAT_LIMITDETAIL,
                  STAT_KINDDETAIL: station.STAT_KINDDETAIL,
                  STAT_X: station.STAT_X,
                  STAT_Y: station.STAT_Y,
                });
              });
            });
          }

          const lots = ensureArray(cityData.PRK_STTS);

          lots.forEach((lot) => {
            const lotLat = parseFloat(lot.LAT);
            const lotLng = parseFloat(lot.LNG);
            if (!lotLat || !lotLng) return;

            const distance = Math.sqrt(
              Math.pow(lat - lotLat, 2) + Math.pow(lng - lotLng, 2)
            );
            if (distance > 0.02) return;

            const matchedChargers = allChargerDetails.filter((charger) => {
              const chargerLat = parseFloat(charger.STAT_Y);
              const chargerLng = parseFloat(charger.STAT_X);
              if (isNaN(chargerLat) || isNaN(chargerLng)) return false;

              const dist = calculateDistance(
                lotLat,
                lotLng,
                chargerLat,
                chargerLng
              );
              return dist < 550;
            });
            lot.evChargers = matchedChargers;
            lot.hasEVCharger = matchedChargers.length > 0;

            allLots.push(lot);
            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(lotLat, lotLng),
              map,
            });
            map.markers.push(marker);

            const isRealtime =
              lot.CUR_PRK_YN === "Y" &&
              lot.CUR_PRK_CNT !== null &&
              lot.CUR_PRK_CNT !== undefined;
            const availableSpaces = lot.CPCTY - (lot.CUR_PRK_CNT || 0);

            let evChargerInfoHtml = "";
            if (lot.hasEVCharger) {
              const total = lot.evChargers.length;
              const available = lot.evChargers.filter(
                (c) => c.CHARGER_STAT === "사용가능"
              ).length;

              evChargerInfoHtml = `
                <div style="margin-top:10px; padding:8px; background:#f0f9ff; border-radius:8px;">
                  <div style="font-weight:bold; color:#007bff; margin-bottom:5px;">
                    ⚡ 전기차 충전 정보
                  </div>
                  <div>총 충전기: ${total}대</div>
                  <div>사용 가능: <strong style="color:green;">${available}</strong>대</div>
                </div>
              `;
            }

            const iwContent = `
              <div style="padding:10px; font-size:12px; width:280px; line-height:1.6;">
              <div style="font-size:16px; font-weight:bold; color:#333; margin-bottom:5px;">${
                lot.PRK_NM
              }</div>
              <div style="font-size:13px; color:#666; margin-bottom:10px;">${
                lot.PRK_TYPE || ""
              }</div>
                <hr style="border:0; border-top:1px solid #eee; margin-bottom:10px;">
                  <div><strong>주소:</strong> ${lot.ADDRESS || ""}</div>
                  <div><strong>요금:</strong> ${
                    lot.RATES && String(lot.RATES) !== "0"
                      ? `${lot.RATES}원 / ${lot.TIME_RATES || "?"}분`
                      : "무료 또는 정보 없음"
                  }</div>
                  <div style="margin-top:10px; text-align:center; font-size:14px; font-weight:bold;">
                    ${
                      isRealtime
                        ? `<span style="color: #007bff;">주차 가능: ${availableSpaces} 대</span>`
                        : '<span style="color: #868e96;">실시간 정보 없음</span>'
                    }
                  </div>
                  ${evChargerInfoHtml}
                </div>`;

            window.kakao.maps.event.addListener(marker, "click", () => {
              infowindow.setContent(iwContent);
              infowindow.open(map, marker);
            });

            window.kakao.maps.event.addListener(marker, "mouseout", () => {
              infowindow.close();
            });
          });
        } catch (err) {
          console.error(`Error fetching data for ${spot.name}:`, err);
        }
      });

      await Promise.all(requests);
    } finally {
      setIsLoading(false);
      onParkingLotsChange(allLots);
    }
  };

  const goToUserLocation = () => {
    if (map && userLocation) {
      map.setCenter(
        new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng)
      );
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          if (onUserLocationChange) {
            onUserLocationChange({ lat, lng });
          }

          if (map) {
            map.setCenter(new window.kakao.maps.LatLng(lat, lng));
          }
        },
        (err) => {
          alert(
            "위치 정보를 가져올 수 없습니다. 브라우저 설정을 확인해주세요."
          );
        }
      );
    }
  };

  return (
    <div className="relative w-full h-full min-h-[450px] md:h-screen">
      <button
        className={`absolute z-10 top-2 left-1/2 -translate-x-1/2 md:left-[515px] md:-translate-x-0 py-1 px-2 bg-white text-blue-500 border border-gray-300 rounded-full cursor-pointer transition-colors hover:bg-gray-100 ${
          isLoading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        onClick={fetchNearbyParking}
        disabled={isLoading}
      >
        {isLoading ? "검색 중..." : "⎋ 현 지도 주변 검색"}
      </button>
      <button
        className="absolute z-10 bottom-7 left-1 md:top-1/5 md:left-[15px] w-12 h-12 bg-white border border-gray-300 rounded-full cursor-pointer flex justify-center items-center transition-colors hover:bg-gray-100"
        onClick={goToUserLocation}
        title="내 위치로 이동 및 갱신"
      >
        <img src="/assets/my.png" alt="My Location" className="w-8 h-8" />
      </button>
      <div id="map" className="w-full h-full"></div>
    </div>
  );
};

export default KakaoMap;
