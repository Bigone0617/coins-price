// 업비트 데이터
export async function getUpbitDatas(){
    // upbit가 제공하는 모든코인 가져오기
    const upbitCoins = await (
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

// 빗썸 데이터
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

// 바이낸스 데이터
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

// 코빗 데이터
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