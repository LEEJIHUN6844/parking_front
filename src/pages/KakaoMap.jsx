
import React, { useEffect } from 'react';

const KakaoMap = () => {
  useEffect(() => {
    console.log("KakaoMap component mounted.");
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false`;
    document.head.appendChild(script);

    script.onload = () => {
      console.log("Kakao Maps script loaded.");
      window.kakao.maps.load(() => {
        console.log("Kakao Maps API loaded and ready.");
        const container = document.getElementById('map');
        if (container) {
          const options = {
            center: new window.kakao.maps.LatLng(37.566826, 126.9786567),
            level: 3,
          };
          new window.kakao.maps.Map(container, options);
          console.log("Kakao Map initialized.");
        } else {
          console.error("Map container div with id 'map' not found.");
        }
      });
    };

    script.onerror = (error) => {
      console.error("Error loading Kakao Maps script:", error);
    };

    return () => {
      // Clean up the script when the component unmounts
      document.head.removeChild(script);
    };
  }, []);

  return <div id="map" style={{ width: '100%', height: '600px' }}></div>;
};

export default KakaoMap;
