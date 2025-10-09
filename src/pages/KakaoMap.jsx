import React, { useEffect, useState } from "react";

// User-provided list of hotspots
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

const KakaoMap = () => {
  const [map, setMap] = useState(null);
  const [infowindow, setInfowindow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false`;
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

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const lat = position.coords.latitude;
              const lng = position.coords.longitude;
              mapInstance.setCenter(new window.kakao.maps.LatLng(lat, lng));
            },
            () => {
              console.warn("위치 정보를 가져올 수 없습니다.");
            }
          );
        }
      });
    };

    return () => document.head.removeChild(script);
  }, []);

  const fetchNearbyParking = async () => {
    if (!map || isLoading) return;

    setIsLoading(true);
    try {
      const center = map.getCenter();
      const lat = center.getLat();
      const lng = center.getLng();

      // 기존 마커 제거
      if (map.markers) map.markers.forEach((marker) => marker.setMap(null));
      map.markers = [];

      for (const spot of hotspots) {
        try {
          const res = await fetch(`/api/seoul/parking/${spot.code}`);
          const data = await res.json();
          const cityData = data.CITYDATA;

          if (!cityData?.PRK_STTS) continue;

          const lots = Array.isArray(cityData.PRK_STTS)
            ? cityData.PRK_STTS
            : [cityData.PRK_STTS];

          lots.forEach((lot) => {
            const lotLat = parseFloat(lot.LAT);
            const lotLng = parseFloat(lot.LNG);
            if (!lotLat || !lotLng) return;

            const distance = Math.sqrt(
              Math.pow(lat - lotLat, 2) + Math.pow(lng - lotLng, 2)
            );
            if (distance > 0.01) return; // 1km 이상 제외

            const marker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(lotLat, lotLng),
              map,
            });
            map.markers.push(marker);

            const availableSpaces = lot.CPCTY - (lot.CUR_PRK_CNT || 0);
            const iwContent = `
              <div style="padding:10px; font-size:12px; width:280px; line-height:1.6;">
                <div style="font-size:16px; font-weight:bold; color:#333; margin-bottom:5px;">${
                  lot.PRK_NM
                }</div>
                <div style="font-size:13px; color:#666; margin-bottom:10px;">${
                  lot.PRK_TYPE || ""
                }</div>
                <hr style="border:0; border-top:1px solid #eee; margin-bottom:10px;">
                <div><strong>주소:</strong> ${lot.ADDRESS}</div>
                <div><strong>운영시간:</strong> ${
                  lot.OPR_BGN_TM && lot.OPR_END_TM
                    ? `${lot.OPR_BGN_TM} - ${lot.OPR_END_TM}`
                    : "24시간"
                }</div>
                <div><strong>요금:</strong> ${
                  lot.RATES
                    ? `${lot.RATES}원 / ${lot.TIME_RATES || "?"}분`
                    : "정보 없음"
                }</div>
                <div style="margin-top:10px; text-align:center; font-size:14px; font-weight:bold;">
                  ${
                    lot.CUR_PRK_YN === "Y" && lot.CUR_PRK_CNT
                      ? `<span style="color: #007bff;">주차 가능: ${availableSpaces} 대</span>`
                      : '<span style="color: #868e96;">실시간 정보 없음</span>'
                  }
                </div>
              </div>`;

            // 클릭 시 InfoWindow
            window.kakao.maps.event.addListener(marker, "click", () => {
              infowindow.setContent(iwContent);
              infowindow.open(map, marker);
            });

            // 마커에서 벗어나면 InfoWindow 닫기
            window.kakao.maps.event.addListener(marker, "mouseout", () => {
              infowindow.close();
            });
          });
        } catch (err) {
          console.error(`Error fetching data for ${spot.name}:`, err);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const buttonStyle = {
    position: "absolute",
    zIndex: 10,
    top: 10,
    left: 515,
    padding: "8px 12px",
    backgroundColor: isHovering ? "#f0f0f0" : "white",
    color: "#007bff",
    border: "0.5px solid #ddd",
    borderRadius: "30px",
    cursor: isLoading ? "not-allowed" : "pointer",
    opacity: isLoading ? 0.7 : 1,
    transition: "background-color 0.2s",
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "600px" }}>
      <button
        style={buttonStyle}
        onClick={fetchNearbyParking}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        disabled={isLoading}
      >
        {isLoading ? "검색 중..." : "⎋ 현 지도 주변 검색"}
      </button>
      <div id="map" style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

export default KakaoMap;
