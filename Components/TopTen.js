import Link from "next/link";

export default function TopTen({topTenDatas, trade}){
    let path = "/trade/"+trade;
    
    let tname;
    let tprice;
    let trange;
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
    }else if (trade == 'korbit'){
        tname = 'name';
        tprice = 'ask';
        trange = 'changePercent';
        tvolume = 'volume';
    }



    return (
        <div className="container">
            <h2 className={`${trade}`}>{trade}</h2>
            <Link href={path}>
                <a className="more">view more</a>
            </Link>
            <table>
                <thead>
                    <tr>
                      <th>이름</th>
                      <th>가격</th>
                      <th>변동률</th>
                      <th>거래대금</th>
                    </tr>
                </thead>
                <tbody>
                    {topTenDatas?.map((coin, idx) => (
                        <tr key={idx}>
                            <td>{coin[tname]}</td>
                            <td>{coin[tprice]}{trade=='binance' ? 'BTC' : '원'}</td>
                            <td className={(coin[trange] < 0) ? "blue" : "red"}>{trade=='upbit' ? (coin[trange]*100).toFixed(2) : coin[trange]}%</td>
                            <td>{trade=='binance' ? Number(coin[tvolume]).toFixed(2)+"BTC" : coin[tvolume]+"억"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <style jsx>{`
                td {
                    padding-left : 10px;
        
                }
                th {
                    padding-left : 20px;
                }
                .blue {
                    color: blue;
                }
                .red {
                    color : red;
                }
                .more:hover {
                    color : orange;
                }
                .upbit {
                    color : #0C3F97;
                }
                .bithumb {
                    color : #E6790F;
                }
                .binance {
                    color : #F0B90B;
                }
                .korbit {
                    color : #1E293B;
                }
            `}</style>
        </div>

    )
}