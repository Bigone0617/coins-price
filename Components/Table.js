import { useState } from "react";

export default function Table({trade, coinDatas, setCoinDatas, originDatas}){
    // 오름차순, 내림차순 인지 toggle
    const [toggle, setToggle] = useState(false);
    // 정렬을 눌렀는지 안눌렀는지
    const [sort, setSort] = useState();

    // 코인 이름
    let tname;
    // 코인 가격
    let tprice;
    // 어제 대비 상승률, 하락률
    let trange;
    // 오늘 거래대금
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

    // 정렬을 눌렀을 경우 새로운 데이터가 들어와 렌더해도 정렬이 그대로 유지되게 하기 위해
    if(sort){
      if(sort == 'name'){
        coinDatas = coinDatas.sort((a,b) => {
        return toggle ? ((b[tname]<a[tname])?-1:(a[tname]==b[tname])?0:1) : ((a[tname]<b[tname])?-1:(a[tname]==b[tname])?0:1);
        });
      }else if(sort == 'price'){
        coinDatas = coinDatas.sort((a,b) => {
              return toggle ? b[tprice] - a[tprice] : a[tprice] - b[tprice];
          });
      }else if(sort == 'range'){
        coinDatas = coinDatas.sort((a,b) => {
              return toggle ? b[trange] - a[trange] : a[trange] - b[trange];
          });
      }else{
        coinDatas = coinDatas.sort((a,b) => {
              return toggle ? b[tvolume] - a[tvolume] : a[tvolume] - b[tvolume];
          });
      }
      
      setCoinDatas(coinDatas);
    }

    // 정렬
    const onClickToggleSort = (type, coinDatas, setCoinDatas, toggle, setToggle) => {
        // 버튼 스타일 바꾸기 위해서
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

        // 항목별 정렬
        if(type == 'name'){
            coinDatas = coinDatas.sort((a,b) => {
            return toggle ? ((b[tname]<a[tname])?-1:(a[tname]==b[tname])?0:1) : ((a[tname]<b[tname])?-1:(a[tname]==b[tname])?0:1);
            });
            setSort('name');
            buttonStyle(0, toggle);
        }else if(type == 'price'){
            coinDatas = coinDatas.sort((a,b) => {
                return toggle ? b[tprice] - a[tprice] : a[tprice] - b[tprice];
            });
            setSort('price');
            buttonStyle(1, toggle);
        }else if(type == 'range'){
            coinDatas = coinDatas.sort((a,b) => {
                return toggle ? b[trange] - a[trange] : a[trange] - b[trange];
            });
            setSort('range');
            buttonStyle(2, toggle);
        }else{
            coinDatas = coinDatas.sort((a,b) => {
                return toggle ? b[tvolume] - a[tvolume] : a[tvolume] - b[tvolume];
            });
            setSort('volume');
            buttonStyle(3, toggle);
        }
        
        setCoinDatas(coinDatas);
        setToggle((prev) => !prev);
    }
    
    // 검색
    const onChange = (originDatas, setCoinDatas) => {
        const text = event.target.value;
        if(text){
        setCoinDatas(originDatas.filter((data) => data[tname].includes(text)))
        }else{
        setCoinDatas(originDatas)
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