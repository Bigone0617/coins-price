import { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {Doughnut} from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import Seo from '../Components/Seo';
import InputKey from '../Components/InputKey';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MyMoney(){
    const [myMoney, setMyMoney] = useState();
    const [myRealMoney, setMyRealMoney] = useState();
    const [names, setNames] = useState();
    const [moneys, setMoneys] = useState();
    const [haveKey, setHaveKey] = useState(false);

    const getPrice = (coinData, btc_price) => {
        // 금액과 이름만 리턴하기 
        // 원화일 경우
        if(coinData.market.includes('KRW')){
            return {
                name : coinData.market,
                price : coinData.trade_price
            };
        }else if (coinData.market.includes('BTC')){
            return {
                name : coinData.market,
                price : coinData.trade_price * btc_price
            };
        }else{
            return {
                name : coinData.market,
                price : coinData.trade_price * 1000
            }
        }
    }

    const getMyCoinsPrice = async(coins) => {
        let searchCoins = "KRW-BTC,";

        // 업비트 코안 리스트
        const upbit_coin_list = await (
            await fetch('https://api.upbit.com/v1/market/all')
        ).json();

        for(let i = 0; i < coins.length; i++){
            upbit_coin_list.forEach((data) => {
                if(data.market.includes(coins[i])){
                    searchCoins += data.market+",";
                }
            })
        }

        searchCoins = searchCoins.slice(0,-1);

        // 보유코인 실시간 시세 받아오기
        let coinsData = await(
            await fetch(`https://api.upbit.com/v1/ticker?markets=${searchCoins}`)
        ).json();

        let pirces_arr = [];


        // 원화 기준 가격 가져오기 , 만약 원화마켓에 없는거면 BTC, 그다음 USD마켓
        for(let i = 0; i < coins.length; i++){
            let test = [];
            coinsData.forEach((data) => {
                if(data.market.includes(coins[i])){
                    test.push(data);
                }
            });
            pirces_arr.push(test);
        }

        let returnPrices = [];

        for(let i = 0; i < pirces_arr.length; i++){
            // 여러 마켓에 상장된 경우
            if(pirces_arr[i].length > 1){
                let return_data = pirces_arr[i].filter((data) => data.market.includes('KRW'));

                // 원화 마켓이 없는 경우
                if(return_data.length == 0){
                    return_data = pirces_arr[i].filter((data) => data.market.includes('BTC'));
                    returnPrices.push(getPrice(return_data[0], coinsData[0].trade_price))
                }else{
                    returnPrices.push(getPrice(return_data[0], coinsData[0].trade_price))
                }
            }else{
                returnPrices.push(getPrice(pirces_arr[i][0], coinsData[0].trade_price))
            }
        }

        return returnPrices;
    }

    const getMyMoney = async() => {
        let api_key = JSON.parse(window.localStorage.getItem('bitmall'));
        if(api_key){
            const access_key = api_key.access;
            const secret_key = api_key.secret;

            const payload = {
                access_key: access_key,
                nonce: uuidv4(),
            }

            const token = jwt.sign(payload, secret_key)

            const options = {method: 'GET', headers: {Accept: 'application/json'}};
            options.headers.Authorization = `Bearer ${token}`;

            const myCoins = await (
                await fetch('/api/upbit/mymoney', options)
            ).json();

            let total_my_money = 0;
            let names = [];
            let moneys = [];
            let price_coins = [];

            myCoins?.forEach((coin) => {
                if(coin.currency !== "KRW"){
                    coin.total_money = Number(coin.avg_buy_price) * Number(coin.balance);
                }else{
                    coin.total_money = Number(coin.balance);
                }

                if(Number(coin.avg_buy_price) > 0){
                    price_coins.push(coin.currency);
                }

                total_my_money += coin.total_money;
                names.push(coin.currency);
                moneys.push(Math.round(coin.total_money));
            });

            let prices = await getMyCoinsPrice(price_coins);


            let realMoney = 0;

            for(let i =0; i < prices.length; i++){
                let name = prices[i].name.split('-')[1]
                let coin_quantity = myCoins.filter((coin) => coin.currency == name)[0].balance;

                realMoney = realMoney + (Number(coin_quantity) * prices[i].price);
            }

            setNames(names);
            setMoneys(moneys);
            setMyMoney(Math.round(total_my_money));
            setMyRealMoney(Math.round(realMoney));
            setHaveKey(true);
        }
    }

    const data = {
      labels: names,
      datasets: [
        {
          labels: names,
          data: moneys,
          borderWidth: 2,
          hoverBorderWidth: 3,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1
        }
      ]
    };
    
    useEffect(() => {
        getMyMoney();
    },[]);

    // 실시간 변동
    useEffect(() => {
        const count = setInterval(() => {
            getMyMoney();
        }, 3000);
  
        return () => clearInterval(count);
    })
  

    return (
        <>
            <Seo title="MyMoney"/>
            {
                haveKey ? (
                    <>
                        <div className='chart'>
                        {!myRealMoney &&
                        <div>Loding...</div>}
                        {
                            myRealMoney && 
                            <>
                                <InputKey haveKey={true}/>
                                <Doughnut
                                data={data}
                                />
                                <div className='text'>
                                    {`매수금액 : ${myMoney}원`}
                                    <br></br>
                                    {`지금 내돈 : ${myRealMoney}원`}
                                    <br></br>
                                    {myRealMoney-myMoney > 0 ? `수익중 : ` : `손실중 : `}{`${myRealMoney-myMoney}원`}
                                    <br></br>
                                    {myRealMoney-myMoney > 0 ? `수익률 : ` : `손실률 : `}{`${(((myRealMoney-myMoney)/myMoney)*100).toFixed(2)}%`}
                                </div>
                            </>
                        }
                        
                    </div>
                    
                    <style jsx>{`
                        .chart{
                            width: 500px;
                            height: 500px;
                            margin-bottom: 50px;
                        }
                        .text{
                            margin-left: 50px;
                        }
                    `}</style>
                </>
                ) : (
                    <>
                        <div>
                            <InputKey haveKey={false}/>
                            입력된 api키가 없습니다.
                            <br></br>
                            * API키는 사용자의 브라우저 저장소에 저장이 됩니다. DB에 별도로 저장이 되지 않으니 걱정 안 하셔도 됩니다.
                        </div>
                    </>
                )
            }
            
        </>
    )
}