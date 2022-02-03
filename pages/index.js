import { useEffect, useState } from "react";
import Seo from "../Components/Seo";
import TopTen from "../Components/TopTen";
import * as api from '../Function/api';

export default function Home() {
  const [upbitData, setUpbitData] = useState();
  const [bithumbData, setBithumbData] = useState();
  const [binanceData, setBinanceData] = useState();
  const [korbitData, setKorbitData] = useState();
  
  const getUpbitData = async() => {
    api.getUpbitDatas()
       .then((result) => setUpbitData(result.slice(0,10)));
  }

  const getBithumbData = async() => {
    api.getBithumbDatas()
       .then((result) => setBithumbData(result.slice(0,10)));
  }

  const getBinanceData = async() => {
    api.getBinanceDatas()
       .then((result) => setBinanceData(result.slice(0,10)));
  }

  const getKorbitData = async() => {
    api.getKorbitDatas()
       .then((result) => setKorbitData(result.slice(0,10)));
  }

  useEffect(() => {
    getUpbitData();
    getBithumbData();
    getBinanceData();
    getKorbitData();
  },[]);

  useEffect(() => {
    let id = setInterval(() => {
      getUpbitData();
      getBithumbData();
      getBinanceData();
      getKorbitData();
    }, 3000);
    return () => clearInterval(id);
  },[]);

  return(
    <>
      <Seo title="Home"/>
      <div className="container">
        <div>
          {!upbitData && <h4>Loading...</h4>}
          {upbitData &&<TopTen topTenDatas={upbitData} trade="upbit"/>}
        </div>
        <div>
          {!bithumbData && <h4>Loading...</h4>}
          {bithumbData &&<TopTen topTenDatas={bithumbData} trade="bithumb"/>}
        </div>
        <div>
          {!binanceData && <h4>Loading...</h4>}
          {binanceData &&<TopTen topTenDatas={binanceData} trade="binance"/>}
        </div>
        <div>
          {!korbitData && <h4>Loading...</h4>}
          {korbitData &&<TopTen topTenDatas={korbitData} trade="korbit"/>}
        </div>
        <style jsx>{`
          .container{
            display: grid;
            grid-template-columns: 1fr 1fr;
            padding: 20px;
            gap: 20px;
          }

          @media screen and (max-width: 768px) {
            .container{
              display: grid;
              grid-template-columns: 1fr;
              padding: 20px;
              gap: 20px;
            }
        }
        `}</style>
      </div>
    </>
   
  )
}
