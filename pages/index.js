import { useEffect, useState } from "react"

export default function Home() {
  const [upbitData, setUpbitData] = useState();
  const [bithumbData, setBithumbData] = useState();
  
  const getUpbitData = async() => {
    const upbitCoins = await(
      await fetch('https://api.upbit.com/v1/market/all')
    ).json();

    upbitCoins = upbitCoins.filter((data) => {
      if(data.market.slice(0,3) === "KRW"){
          return data
      }
    });

    // 마켓 이름
    let marketNames = [];
    // 한글,영어 이름
    let langName = [];
    upbitCoins.forEach((coin) => {
      marketNames.push(
        coin.market 
      );
      langName.push({
        english_name : coin.english_name, 
        korean_name : coin.korean_name
      })
    });

    // API 보내기 위해서 문자열 형식으로 합치기.
    let markets = marketNames.join(',');
    
    let priceArr = await (
                  await fetch(`https://api.upbit.com/v1/ticker?markets=${markets}`)
                ).json();
    
    // 가격 정보에 한글, 영어 이름 넣어주기
    priceArr.forEach((price,idx) => {
      price.english_name = langName[idx].english_name;
      price.korean_name = langName[idx].korean_name;
    });

    // 거래대금 top10
    priceArr = priceArr.sort((a,b) => {
      return b.acc_trade_price_24h - a.acc_trade_price_24h
    }).slice(0,10);
    setUpbitData(priceArr)
  }

  const getBithumbData = async() => {
    const bithumbCoins = await (
      await fetch('https://api.bithumb.com/public/ticker/ALL_KRW')
    ).json();

    let coins = [];

    // 객체를 배열로 바꿈
    bithumbCoins = Object.entries(bithumbCoins.data);
    bithumbCoins.forEach((coin) => {
      if(typeof(coin[1]) == 'object'){
        coin[1].name = coin[0]
        coins.push(coin[1]);
      }
    });

    coins = coins.sort((a,b) => {
      return b.acc_trade_value_24H - a.acc_trade_value_24H;
    }).slice(0,10);

    setBithumbData(coins);
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
