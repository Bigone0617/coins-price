import { useState } from "react";

export default function Table({trade, coinDatas, setCoinDatas, originDatas}){
    const [toggle, setToggle] = useState(false);

    let tname;
    let tprice;
    let trange;
    let tvolume;

    if(trade == 'upbit'){
        tname = 'korean_name';
        tprice = 'trade_price';
        trange = 'signed_change_rate';
        tvolume = 'view_trade_price';
    }else if (trade == 'bithumb'){
        tname = 'name';
        tprice = 'closing_price';
        trange = 'fluctate_rate_24H';
        tvolume = 'view_trade_price';
    }else if (trade == 'binance'){
        tname = 'symbol';
        tprice = 'askPrice';
        trange = 'priceChangePercent';
        tvolume = 'volume';
    }else if (trade == "korbit"){
        tname = 'name';
        tprice = 'ask';
        trange = 'changePercent';
        tvolume = 'view_trade_volume';
    }

    // 정렬
    const onClickToggleSort = (type, upbitData, setUpbitData, toggle, setToggle) => {
        const buttonStyle = (idx, toggle) => {
            let nodes = event.target.parentNode.parentNode.childNodes;
            for(let i = 0; i < nodes.length; i++){
            if(i == idx){
                if(toggle){
                event.target.textContent = '▲';
                event.target.style.color = 'red';
                }else{
                event.target.textContent = '▼';
                event.target.style.color = 'blue';
                }
            }else{
                nodes[i].childNodes[1].textContent = "⇵";
                nodes[i].childNodes[1].style.color = "";
                }
            }
        } 

        if(type == 'name'){
            upbitData = upbitData.sort((a,b) => {
            return toggle ? ((b[tname]<a[tname])?-1:(a[tname]==b[tname])?0:1) : ((a[tname]<b[tname])?-1:(a[tname]==b[tname])?0:1);
            });
            buttonStyle(0, toggle);
        }else if(type == 'price'){
            upbitData = upbitData.sort((a,b) => {
                return toggle ? b[tprice] - a[tprice] : a[tprice] - b[tprice];
            });
            buttonStyle(1, toggle);
        }else if(type == 'range'){
            upbitData = upbitData.sort((a,b) => {
                return toggle ? b[trange] - a[trange] : a[trange] - b[trange];
            });
            buttonStyle(2, toggle);
        }else{
            upbitData = upbitData.sort((a,b) => {
                return toggle ? b[tvolume] - a[tvolume] : a[tvolume] - b[tvolume];
            });
            buttonStyle(3, toggle);
        }
        
        setUpbitData(upbitData);
        setToggle((prev) => !prev);
    }
    
    // 검색
    const onChange = (originDatas, setUpbitData) => {
        const text = event.target.value;
        if(text){
        setUpbitData(originDatas.filter((data) => data[tname].includes(text)))
        }else{
        setUpbitData(originDatas)
        }
    }

    return (
        <div className="wrap">
        {!coinDatas && <h4>Loading...</h4>}
        {
          coinDatas && <div className="container">
            <div className="innerContainer">
            <div>
              <input type="text" onChange={()=>onChange(originDatas, setCoinDatas)}/>
            </div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>이름 <button onClick={() => onClickToggleSort('name', coinDatas, setCoinDatas, toggle, setToggle)}>⇵</button></th>
                      <th>가격 <button onClick={() => onClickToggleSort('price', coinDatas, setCoinDatas, toggle, setToggle)}>⇵</button></th>
                      <th>변동률 <button onClick={() => onClickToggleSort('range', coinDatas, setCoinDatas, toggle, setToggle)}>⇵</button></th>
                      <th>거래대금 <button onClick={() => onClickToggleSort('volume', coinDatas, setCoinDatas, toggle, setToggle)}>⇵</button></th>
                    </tr>
                  </thead>
                  <tbody>
                    {coinDatas?.map((coin, idx) => (
                      <tr key={idx}>
                        <td>{coin[tname]}</td>
                        <td>{coin[tprice]}{trade=='binance' ? 'BTC' : '원'}</td>
                        <td className={(coin[trange] < 0) ? "blue" : "red"}>{trade=='upbit' ? (coin[trange]*100).toFixed(2) : coin[trange]}%</td>
                        <td>{trade=='binance' ? Number(coin[tvolume]).toFixed(2)+"BTC" : coin[tvolume]+(trade =='korbit' ? "백만" : "억")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
        <style jsx>{`
          .wrap{
            display: flex;
            gap: 10px;
            flex-direction: column;
            align-items: center;
          }
          .container{
            display: flex;
          }
          .innerContainer{
            display: block;
          }
          .innerContainer input{
            width: 500px;
            max-width: 100%;
            border-radius: 10px;
          }
          .blue {
            color: blue;
          }
          .red {
            color : red;
          }
          td {
            padding-left : 10px;

          }
          th {
            padding-left : 20px;
          }
        `}</style>
      </div>
    )
}