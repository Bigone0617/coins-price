import { useEffect, useState } from "react";
import * as api from '../Function/api';

export default function Home() {
  const [upbitData, setUpbitData] = useState();
  const [bithumbData, setBithumbData] = useState();
  
  const getUpbitData = async() => {
    api.getUpbitDatas()
       .then((result) => setUpbitData(result.slice(0,10)));
  }

  const getBithumbData = async() => {
    api.getBithumbDatas()
       .then((result) => setBithumbData(result.slice(0,10)));
  }

  useEffect(() => {
    getUpbitData();
    getBithumbData();
  },[]);

  useEffect(() => {
    let id = setInterval(() => {
      getUpbitData();
      getBithumbData();
    }, 3000);
    return () => clearInterval(id);
  },[]);

  return(
    <>
      <div>
        {!upbitData && <h4>Loading...</h4>}
        {upbitData && <h4>upbit</h4>}
        {upbitData?.map((coin, idx) => (
          <div key={idx} className="container">
            <div>{coin.korean_name} : </div>
            <div>{coin.trade_price}원 </div>
            <div className={(coin.signed_change_rate < 0) ? "blue" : "red"}>{(coin.signed_change_rate * 100).toFixed(2)}%</div>
          </div>
        ))}
        <style jsx>{`
          .container{
            display: grid;
            grid-template-columns: 1fr 1fr 1f;
            padding: 20px;
            gap: 20px;
          }
          .container div{
            max-width: 30%;
            display: contents;
            margin-right: 20px
          }
          .blue {
            color: blue;
          }
          .red {
            color : red;
          }
        `}</style>
      </div>
      <div>
        {!bithumbData && <h4>Loading...</h4>}
        {bithumbData && <h4>bithumb</h4>}
        {bithumbData?.map((coin, idx) => (
          <div key={idx} className="container">
            <div>{coin.name} : </div>
            <div>{coin.closing_price}원 </div>
            <div className={(coin.fluctate_rate_24H < 0) ? "blue" : "red"}>{(coin.fluctate_rate_24H)}%</div>
          </div>
        ))}
        <style jsx>{`
          .container{
            display: grid;
            grid-template-columns: 1fr 1fr 1f;
            padding: 20px;
            gap: 20px;
          }
          .container div{
            max-width: 30%;
            display: contents;
            margin-right: 20px
          }
          .blue {
            color: blue;
          }
          .red {
            color : red;
          }
        `}</style>
      </div>
    </>
  )
}
