import { useEffect, useState } from "react";
import * as api from '../../Function/api';

export default function Bithumb(){
    const [bithumbData, setBithumbData] = useState();
    const [originDatas, setOriginDatas] = useState();
    const [toggle, setToggle] = useState(false);

    // 데이터 가져오는 동작
    const getCoinDats = async() => {
      api.getBithumbDatas()
         .then((result) => {
           setOriginDatas(result);
           setBithumbData(result);
          });
    }

    // 처음 로딩시 데이터 입력
    useEffect(() => {
      getCoinDats();
    },[]);

    // 실시간 변동
    useEffect(() => {
      const count = setInterval(() => {
        console.log(1);
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
            return toggle ? ((b.name<a.name)?-1:(a.name==b.name)?0:1) : ((a.name<b.name)?-1:(a.name==b.name)?0:1);
          });
          buttonStyle(0, toggle);
        }else if(type == 'price'){
            upbitData = upbitData.sort((a,b) => {
                return toggle ? b.closing_price - a.closing_price : a.closing_price - b.closing_price;
            });
            buttonStyle(1, toggle);
        }else if(type == 'range'){
            upbitData = upbitData.sort((a,b) => {
                return toggle ? b.fluctate_rate_24H - a.fluctate_rate_24H : a.fluctate_rate_24H - b.fluctate_rate_24H;
            });
            buttonStyle(2, toggle);
        }else{
            upbitData = upbitData.sort((a,b) => {
                return toggle ? b.acc_trade_value_24H - a.acc_trade_value_24H : a.acc_trade_value_24H - b.acc_trade_value_24H;
            });
            buttonStyle(3, toggle);
        }
        
        setUpbitData(upbitData);
        setToggle((prev) => !prev);
    }

    // 검색
    const onChange = (originDatas, setBithumbData) => {
      const text =  event.target.value;
      if(text){
        setBithumbData(originDatas.filter((data) => data.name.toLowerCase().includes(text.toLowerCase())))
      }else{
        setBithumbData(originDatas)
      }
    }

    return (
      <div className="wrap">
        {!bithumbData && <h4>Loading...</h4>}
        {
          bithumbData && <div className="container">
            <div className="innerContainer">
            <div>
              <input type="text" onChange={()=>onChange(originDatas, setBithumbData)}/>
            </div>
              <div>
                <table>
                  <thead>
                    <tr>
                      <th>이름 <button onClick={() => onClickToggleSort('name', bithumbData, setBithumbData, toggle, setToggle)}>⇵</button></th>
                      <th>가격 <button onClick={() => onClickToggleSort('price', bithumbData, setBithumbData, toggle, setToggle)}>⇵</button></th>
                      <th>변동률 <button onClick={() => onClickToggleSort('range', bithumbData, setBithumbData, toggle, setToggle)}>⇵</button></th>
                      <th>거래대금 <button onClick={() => onClickToggleSort('volume', bithumbData, setBithumbData, toggle, setToggle)}>⇵</button></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bithumbData?.map((coin, idx) => (
                      <tr key={idx}>
                        <td>{coin.name}</td>
                        <td>{coin.closing_price}원</td>
                        <td className={(coin.fluctate_rate_24H < 0) ? "blue" : "red"}>{coin.fluctate_rate_24H}%</td>
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