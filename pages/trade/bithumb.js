import { useEffect, useState } from "react";
export default function Bithumb(){
    const [bithumbData, setBithumbData] = useState();
    const [toggle, setToggle] = useState(false);

    useEffect(() => {
        (async() => {
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
          });
    
          setBithumbData(coins);
        })()
    },[]);

    const onClickToggleSort = (type, bithumbData, setBithumbData, toggle, setToggle) => {
        if(type == 'price'){
            bithumbData = bithumbData.sort((a,b) => {
                return toggle ? b.closing_price - a.closing_price : a.closing_price - b.closing_price;
            });
            
        }else if(type == 'range'){
            bithumbData = bithumbData.sort((a,b) => {
                return toggle ? b.fluctate_rate_24H - a.fluctate_rate_24H : a.fluctate_rate_24H - b.fluctate_rate_24H;
            });
        }else{
            bithumbData = bithumbData.sort((a,b) => {
                return toggle ? b.acc_trade_value_24H - a.acc_trade_value_24H : a.acc_trade_value_24H - b.acc_trade_value_24H;
            });
        }

        setBithumbData(bithumbData);
        setToggle((prev) => !prev);
    }


    return (
        <div>
        {!bithumbData && <h4>Loading...</h4>}
        {
            bithumbData &&  <div>
                    <h4>bithumb</h4>
                    <div>
                        <button onClick={() => onClickToggleSort('price', bithumbData, setBithumbData, toggle, setToggle)}>가격 정렬</button>
                        <button onClick={() => onClickToggleSort('range', bithumbData, setBithumbData, toggle, setToggle)}>변동률 정렬</button>
                        <button onClick={() => onClickToggleSort('volume', bithumbData, setBithumbData, toggle, setToggle)}>거래대금 정렬</button>
                    </div>  
                </div> 
        }
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
    )
}