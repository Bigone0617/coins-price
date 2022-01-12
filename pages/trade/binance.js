import { useEffect, useState } from "react"

export default function Binance(){
    const [binanceDatas, setBinanceDatas] = useState();
    // https://api.binance.com/api/v1/ticker/24hr
    useEffect(() => {
        (async() => {
            const binanceCoins = await (
                await fetch('https://api.binance.com/api/v1/ticker/24hr')
            ).json();
            
            binanceCoins = binanceCoins.filter((coin) => {
                if(coin.symbol.slice(-3) == "BTC"){
                    return coin;
                }
            })
            setBinanceDatas(binanceCoins);
        })();
    },[])
    return (
        <div>
        {!binanceDatas && <h4>Loading...</h4>}
        {
            binanceDatas &&  <div>
                    <h4>bithumb</h4>
                    {/* <div>
                        <button onClick={() => onClickToggleSort('price', bithumbData, setBithumbData, toggle, setToggle)}>가격 정렬</button>
                        <button onClick={() => onClickToggleSort('range', bithumbData, setBithumbData, toggle, setToggle)}>변동률 정렬</button>
                        <button onClick={() => onClickToggleSort('volume', bithumbData, setBithumbData, toggle, setToggle)}>거래대금 정렬</button>
                    </div>   */}
                </div> 
        }
        {binanceDatas?.map((coin, idx) => (
          <div key={idx} className="container">
            <div>{coin.symbol} : </div>
            <div>{coin.askPrice} BTC </div>
            <div className={(Number(coin.priceChangePercent) < 0) ? "blue" : "red"}>{(coin.priceChangePercent)}%</div>
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
    )
}