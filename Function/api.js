import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

//! 거래소별 시세 start

//? 업비트 모든 코인 이름 가져오기
export async function getUpbitAllCoins(){
  const allCoins = await(
    await fetch('https://api.upbit.com/v1/market/all')
  ).json();
  return allCoins
}

//? 업비트 데이터
export async function getUpbitDatas(){
    // upbit가 제공하는 모든코인 가져오기
    const upbitCoins = await getUpbitAllCoins()

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

        // 거래대금 보기 편하게 변경
        const view_trade_price = String(Math.round(price.acc_trade_price_24h)).slice(0,-6).split("");
        view_trade_price.splice(view_trade_price.length-2,0, ".");
        view_trade_price = view_trade_price.join("");
        //1억 넘지 않는 애들 앞에 0 붙여주기
        if(view_trade_price.length < 4){
            view_trade_price = "0"+view_trade_price;
        }
        price.view_trade_price = view_trade_price;
      });

      // 거래대금순으로 정렬
      priceArr = priceArr.sort((a,b) => {
        return b.acc_trade_price_24h - a.acc_trade_price_24h
      });

      return await priceArr;
}

//? 빗썸 데이터
export async function getBithumbDatas(){
    const bithumbCoins = await (
        await fetch('/api/bithumb')
      ).json();

      let coins = [];

      // 객체를 배열로 바꿈
      bithumbCoins = Object.entries(bithumbCoins.data);
      bithumbCoins.forEach((coin) => {
        if(typeof(coin[1]) == 'object'){
          coin[1].name = coin[0]

          // 거래대금 보기 편하게 변경
          const view_trade_price = String(Math.round(coin[1].acc_trade_value_24H)).slice(0,-6).split("");
          view_trade_price.splice(view_trade_price.length-2,0, ".");
          view_trade_price = view_trade_price.join("");
          
          // 1억이 넘지 않는 애들 앞에 0 붙여주기;
          if(view_trade_price.length < 4){
            view_trade_price = "0"+view_trade_price;
          }
          coin[1].view_trade_price = view_trade_price;
          coins.push(coin[1]);
        }
      });

      coins = coins.sort((a,b) => {
        return b.acc_trade_value_24H - a.acc_trade_value_24H;
      });
      
      return coins;
}

//? 바이낸스 데이터
export async function getBinanceDatas(){
    const binanceCoins = await (
        await fetch('https://api.binance.com/api/v1/ticker/24hr')
    ).json();

    binanceCoins = binanceCoins.filter((coin) => {
        if(coin.symbol.slice(-3) == "BTC"){
            return coin;
        }
    });

    binanceCoins = binanceCoins.sort((a,b) => {
        return b.volume - a.volume;
    })

    return binanceCoins;
}

//? 코빗 데이터
export async function getKorbitDatas(){
  const korbitDatas = await (await fetch('/api/korbit')).json();

  korbitDatas = Object.entries(korbitDatas);

  let coins = [];


  korbitDatas.forEach((coin) => {
    coin[1].name = coin[0].slice(0,-4);
    coin[1].ask = Number(coin[1].last);
    coin[1].volume = Number(coin[1].volume);
    coin[1].view_trade_volume = Math.round(coin[1].volume);
    coins.push(coin[1]);
  });

  coins = coins.sort((a,b) => {
    return b.volume - a.volume
  })

  return coins;
}

//! 거래소별 시세 end


//! 자산 관련 api start
//? upbit start
// 내 보유 자산 가져오기
export async function getMyUpbitMoney(api_key){
  /** 업비트 자산 가져오기 api Start */
  const access_key = api_key.access;
  const secret_key = api_key.secret;

  const payload = {
      access_key: access_key,
      nonce: uuidv4(),
  }

  const token = jwt.sign(payload, secret_key);

  const options = {method: 'GET', headers: {Accept: 'application/json'}};
  options.headers.Authorization = `Bearer ${token}`;

  const myCoins = await (
      // cors 오류 해결을 위해서 next.config.js를 통해 api를 호출
      await fetch('/api/upbit/mymoney', options)
  ).json();

  /** 업비트 자산 가져오기 api End */
  // 내 현금 자산 + 매수 금액 
  let total_my_money = 0;
  // 보유 코인 이름들
  let names = [];
  // 보유코인 매수금액(평단가 * 수량)
  let moneys = [];
  // 보유코인 중 상장되어 있는 코인들 실시간 시세 가져 올 리스트
  let price_coins = [];

  myCoins?.forEach((coin) => {
      // 현금이 아닌 경우 개수 * 평단가 (얼마치 샀는지 계산)
      if(coin.currency !== "KRW"){
          coin.total_money = Number(coin.avg_buy_price) * Number(coin.balance);
      }else{
          coin.total_money = Number(coin.balance);
      }

      // 상장되어 있는 코인만 추리기
      // (평단가가 있냐 없냐로 따지는 거라 만약 에어드랍으로 받은 후 상장한거는 확인 못함)
      if(Number(coin.avg_buy_price) > 0){
          price_coins.push(coin.currency);
      }

      total_my_money += coin.total_money;
      names.push(coin.currency);
      moneys.push(Math.round(coin.total_money));
  });

  // 보유 코인중 상장되어 있는 코인 실시간 시세 가져오기
  let prices = await getMyUpbitCoinPrice(price_coins);

  // 내 원래 자산 + (수익중 혹은 손실중) -> 실시간 내 자산
  let realMoney = 0;

  for(let i = 0; i < prices.length; i++){
      let name = prices[i].name.split('-')[1]
      let coin_quantity = myCoins.filter((coin) => coin.currency == name)[0].balance;

      realMoney = realMoney + (Number(coin_quantity) * prices[i].price);
  }

  return {names, moneys, total_my_money, realMoney}
}

// 내 보유 코인 실시간 시세 가져오기
export async function getMyUpbitCoinPrice(coins){
  let searchCoins = "KRW-BTC,";
  // upbit 모든 코인 종류
  const upbit_coin_list = await getUpbitAllCoins();

  // btc 마켓 코인, usdt 마켓 코인 원화로 변경
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
 
  // 업비트 코인 리스트 중에 내 보유 코인 정보만 가져오기
  for(let i = 0; i < coins.length; i++){
    upbit_coin_list.forEach((data) => {
        if(data.market.includes(coins[i])){
            searchCoins += data.market+",";
        }
    })
  }

  searchCoins = searchCoins.slice(0,-1);

  // 보유코인 실시간 시세 가져오기
  let coinsData = await(
      await fetch(`https://api.upbit.com/v1/ticker?markets=${searchCoins}`)
  ).json();

  //? 데이터 형태 : [[{krw-xrp,...},{btc-xrp,...},{usdt-xrp,...}],[{btc-pci,...}],[{krw-blm},{btc-blm}]]
  let pirces_arr = [];

  // 원화 기준 가격 가져오기 , 만약 원화마켓에 없는거면 BTC, 그다음 USD마켓
  for(let i = 0; i < coins.length; i++){
      let markets = [];
      coinsData.forEach((data) => {
          if(data.market.includes(coins[i])){
            markets.push(data);
          }
      });
      pirces_arr.push(markets);
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
//? upbit end
//! 자산 관련 api end