
export default function UpbitApiInfo () {

    return (
        <>
            <div className="info_wrap">
                <img src='images/upbit_api1.png' alt='업비트 api 설명 1'/>
                <div className="api_text">
                    1. 로그인 후 웹사이트 상단 MY 버튼 클릭
                </div>
            </div>
            <div className="info_wrap">
                <img src='images/upbit_api2.png' alt='업비트 api 설명 2'/>
                <div className="api_text">
                    2. OPEN API 관리 버튼 클릭
                </div>
            </div>
            <div className="info_wrap">
                <img src='images/upbit_api3.png' alt='업비트 api 설명 3'/>
                <div className="api_text">
                    3. 자산조회 체크 후 Open API 발급받기 버튼 클릭
                    <br></br>
                    4. 카카오톡 인증
                </div>

            </div>
            <div className="info_wrap">
                <img src='images/upbit_api4.png' alt='업비트 api 설명 4'/>
                <div className="api_text">
                    5. API Key 발급 완료 후 Access Key, Secret Key 복사 후 입력
                </div>
            </div>
            <style jsx>{`
                img{
                    width: 50%;
                    height: auto;
                    box-shadow:rgba(50, 50, 93, 0.3) 10px 10px 10px 10px;
                }
                .api_text{
                    font-weight: bold;
                    margin: 20px;
                }
                .info_wrap{
                    text-align: center;
                    margin-top: 10px
                }
                @media screen and (max-width: 768px) {
                    img{
                        width: 80%;
                        height: auto;
                        box-shadow:rgba(50, 50, 93, 0.3) 5px 5px 5px 5px;
                    }
                    .api_text{
                        font-weight: 200;
                        margin: 10px;
                    }
                }
            `}</style>
        </>
    )
}