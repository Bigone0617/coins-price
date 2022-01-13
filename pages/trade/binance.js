import { useEffect, useState } from "react";
import Table from "../../Components/Table";

import * as api from "../../Function/api";

export default function Binance(){
    const [binanceDatas, setBinanceDatas] = useState();
    const [originDatas, setOriginDatas] = useState();
    
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

    return (
      <>
        <Table trade='binance' coinDatas={binanceDatas} setCoinDatas={setBinanceDatas} originDatas={originDatas}/>
      </>
    )
}