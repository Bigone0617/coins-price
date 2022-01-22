import { useEffect, useState } from 'react';


import * as api from '../../Function/api';
import Table from '../../Components/Table';
import Seo from '../../Components/Seo';

export default function Korbit(){
    const [korbitData, setKorbitData] = useState();
    const [originDatas, setOriginDatas] = useState();

    const getKorbitDatas = async() => {
        api.getKorbitDatas()
           .then((result) => {
               setKorbitData(result);
               setOriginDatas(result);
            });
    }

    useEffect(() => {
        getKorbitDatas();
    },[]);
    

    return (
        <>
            <Seo title="korbit"/>
            <Table trade='korbit' coinDatas={korbitData} setCoinDatas={setKorbitData} originDatas={originDatas}/>
        </>
    )
}