import { useEffect, useState } from "react"
import * as api from '../../Function/api';

export default function Upbit(){
    const [upbitData, setUpbitData] = useState();
    const [originDatas, setOriginDatas] = useState();
    const [toggle, setToggle] = useState(false);

    // 데이터 가져오는 동작
    const getCoinDats = async() => {
      api.getUpbitDatas()
         .then((result) => {
            setOriginDatas(result);
            setUpbitData(result);
          });
    }

    // 처음 로딩시 데이터 입력
    useEffect(() => {
      getCoinDats();
    },[]);

    // 실시간 변동
    useEffect(() => {
      const count = setInterval(() => {
        getCoinDats();
      }, 3000);

      return () => clearInterval(count);
    })

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
                return toggle ? ((b.korean_name<a.korean_name)?-1:(a.korean_name==b.korean_name)?0:1) : ((a.korean_name<b.korean_name)?-1:(a.korean_name==b.korean_name)?0:1);
              });
              buttonStyle(0, toggle);
            }else if(type == 'price'){
                upbitData = upbitData.sort((a,b) => {
                    return toggle ? b.trade_price - a.trade_price : a.trade_price - b.trade_price;
                });
                buttonStyle(1, toggle);
            }else if(type == 'range'){
                upbitData = upbitData.sort((a,b) => {
                    return toggle ? b.signed_change_rate - a.signed_change_rate : a.signed_change_rate - b.signed_change_rate;
                });
                buttonStyle(2, toggle);
            }else{
                upbitData = upbitData.sort((a,b) => {
                    return toggle ? b.acc_trade_price_24h - a.acc_trade_price_24h : a.acc_trade_price_24h - b.acc_trade_price_24h;
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
        setUpbitData(originDatas.filter((data) => data.korean_name.includes(text)))
      }else{
        setUpbitData(originDatas)
      }
    }


    return (
      <div className="wrap">
        {!upbitData && <h4>Loading...</h4>}
        {
          upbitData && <div className="container">
            <div className="innerContainer">
            <div>
              <input type="text" onChange={()=>onChange(originDatas, setUpbitData)}/>
            </div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>이름 <button onClick={() => onClickToggleSort('name', upbitData, setUpbitData, toggle, setToggle)}>⇵</button></th>
                      <th>가격 <button onClick={() => onClickToggleSort('price', upbitData, setUpbitData, toggle, setToggle)}>⇵</button></th>
                      <th>변동률 <button onClick={() => onClickToggleSort('range', upbitData, setUpbitData, toggle, setToggle)}>⇵</button></th>
                      <th>거래대금 <button onClick={() => onClickToggleSort('volume', upbitData, setUpbitData, toggle, setToggle)}>⇵</button></th>
                    </tr>
                  </thead>
                  <tbody>
                    {upbitData?.map((coin, idx) => (
                      <tr key={idx}>
                        <td>{coin.korean_name}</td>
                        <td>{coin.trade_price}원</td>
                        <td className={(coin.signed_change_rate < 0) ? "blue" : "red"}>{(coin.signed_change_rate * 100).toFixed(2)}%</td>
                        <td>{coin.view_trade_price}억</td>
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