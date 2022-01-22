import { useEffect, useState } from "react"
import Seo from "../../Components/Seo";
import Table from "../../Components/Table";
import * as api from '../../Function/api';


export default function Upbit(){
    const [upbitData, setUpbitData] = useState();
    const [originDatas, setOriginDatas] = useState();

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

    return (
      <>
        <Seo title="upbit"/>
        <Table trade='upbit' coinDatas={upbitData} setCoinDatas={setUpbitData} originDatas={originDatas}/>
      </>
    )
}