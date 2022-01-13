import { useEffect, useState } from "react";

import * as api from "../../Function/api";

export default function Binance(){
    const [binanceDatas, setBinanceDatas] = useState();
    const [originDatas, setOriginDatas] = useState();
    const [toggle, setToggle] = useState(false);
    
    const getCoinDats = async() => {
      api.getBinanceDatas()
         .then((result) => {
           setBinanceDatas(result);
           setOriginDatas(result);
          });
    }

    useEffect(() => {
      getCoinDats();
    },[]);

    useEffect(() => {
      const count = setInterval(() => {
        getCoinDats();
      }, 3000);

      return () => clearInterval(count);
    });

        // 정렬
    const onClickToggleSort = (type, binanceDatas, setBinanceDatas, toggle, setToggle) => {
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
        binanceDatas = binanceDatas.sort((a,b) => {
          return toggle ? ((b.symbol<a.symbol)?-1:(a.symbol==b.symbol)?0:1) : ((a.symbol<b.symbol)?-1:(a.symbol==b.symbol)?0:1);
        });
        buttonStyle(0, toggle);
      }else if(type == 'price'){
        binanceDatas = binanceDatas.sort((a,b) => {
            return toggle ? b.askPrice - a.askPrice : a.askPrice - b.askPrice;
        });
        buttonStyle(1, toggle);
      }else if(type == 'range'){
        binanceDatas = binanceDatas.sort((a,b) => {
            return toggle ? b.priceChangePercent - a.priceChangePercent : a.priceChangePercent - b.priceChangePercent;
        });
        buttonStyle(2, toggle);
      }else{
        binanceDatas = binanceDatas.sort((a,b) => {
            return toggle ? b.volume - a.volume : a.volume - b.volume;
        });
        buttonStyle(3, toggle);
      }
      
      setBinanceDatas(binanceDatas);
      setToggle((prev) => !prev);
    }

    return (
      <div className="wrap">
        {!binanceDatas && <h4>Loading...</h4>}
        {
          binanceDatas && <div className="container">
            <div className="innerContainer">
            <div>
              <input type="text" onChange={()=>onChange(originDatas, setBinanceDatas)}/>
            </div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>이름 <button onClick={() => onClickToggleSort('name', binanceDatas, setBinanceDatas, toggle, setToggle)}>⇵</button></th>
                      <th>가격 <button onClick={() => onClickToggleSort('price', binanceDatas, setBinanceDatas, toggle, setToggle)}>⇵</button></th>
                      <th>변동률 <button onClick={() => onClickToggleSort('range', binanceDatas, setBinanceDatas, toggle, setToggle)}>⇵</button></th>
                      <th>거래대금 <button onClick={() => onClickToggleSort('volume', binanceDatas, setBinanceDatas, toggle, setToggle)}>⇵</button></th>
                    </tr>
                  </thead>
                  <tbody>
                    {binanceDatas?.map((coin, idx) => (
                      <tr key={idx}>
                        <td>{coin.symbol}</td>
                        <td>{coin.askPrice}원</td>
                        <td className={(coin.priceChangePercent < 0) ? "blue" : "red"}>{coin.priceChangePercent}%</td>
                        <td>{Number(coin.volume).toFixed(2)}억</td>
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