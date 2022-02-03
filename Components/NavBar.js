import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function NavBar(){
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const toggleNav = () => {
        setIsOpen((prev) => !prev);
    }
  return (
        <nav>
            <Link href="/">
                <img src="/bitcoin.svg" />
            </Link>
            <div className='nav_wrap'>
                <Link href="/">
                    <a className={router.pathname === "/" ? "active" : ""}>Home</a>
                </Link>
                <Link href="/trade/upbit">
                    <a className={router.pathname === "/trade/upbit" ? "active" : ""}>Upbit</a>
                </Link>
                <Link href="/trade/bithumb">
                    <a className={router.pathname === "/trade/bithumb" ? "active" : ""}>bithumb</a>
                </Link>
                <Link href="/trade/binance">
                    <a className={router.pathname === "/trade/binance" ? "active" : ""}>binance</a>
                </Link>
                <Link href="/trade/korbit">
                    <a className={router.pathname === "/trade/korbit" ? "active" : ""}>korbit</a>
                </Link>
                <Link href="/myMoney">
                    <a className={router.pathname === "/myMoney" ? "active" : ""}>자산현황</a>
                </Link>
            </div>
            <div className='nav-icon'>
                <img onClick={toggleNav} src="/menu-icon-svg-9.jpg"/>
                {
                    isOpen ? (
                        <ul>
                            <li>
                                <Link href="/">
                                    <a className={router.pathname === "/" ? "active" : ""}>Home</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/trade/upbit">
                                    <a className={router.pathname === "/trade/upbit" ? "active" : ""}>Upbit</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/trade/bithumb">
                                    <a className={router.pathname === "/trade/bithumb" ? "active" : ""}>bithumb</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/trade/binance">
                                    <a className={router.pathname === "/trade/binance" ? "active" : ""}>binance</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/trade/korbit">
                                    <a className={router.pathname === "/trade/korbit" ? "active" : ""}>korbit</a>
                                </Link>
                            </li>
                            <li>
                                <Link href="/myMoney">
                                    <a className={router.pathname === "/myMoney" ? "active" : ""}>자산현황</a>
                                </Link>
                            </li>
                        </ul>
                    ) : (
                        <></>
                    )
                }
                
            </div>
            <style jsx>{`
                nav {
                    display: flex;
                    gap: 10px;
                    flex-direction: column;
                    align-items: center;
                    padding-top: 20px;
                    padding-bottom: 10px;
                    box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
                    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
                }
                img {
                    max-width: 100px;
                    margin-bottom: 5px;
                }
                nav a {
                    font-weight: 600;
                    font-size: 18px;
                }
                .active {
                    color: tomato;
                }
                nav .nav_wrap {
                    display: flex;
                    gap: 10px;
                }
                .nav-icon img{
                    display: none;
                }
                .nav-icon ul{
                    display: none;
                }

                @media screen and (max-width: 768px) {
                    nav {
                        justify-content: space-between;
                        max-width: 100%;
                        width: 100vw;
                    }
                    nav .nav_wrap{
                        display: none;
                    }
                    .nav-icon {
                        width: 100vw;
                        display: inline-block;
                    }
                    .nav-icon img{
                        max-width: 100%;
                        display: block;
                        width: 30px;
                        float: right;
                        margin-right: 30px;
                    }
                    .nav-icon ul {
                        display: block;
                        list-style: none;
                    }
                    .nav-icon ul li{
                        margin-bottom: 5px;
                    }
                }
            `}</style>
        </nav>
    );
}