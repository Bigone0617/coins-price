import Link from 'next/link';
import { useRouter } from 'next/router';

export default function NavBar(){
    const router = useRouter();
  return (
        <nav>
        <Link href="/">
            <img src="/bitcoin.svg" />
        </Link>
        <div>
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
            nav div {
            display: flex;
            gap: 10px;
            }
        `}</style>
        </nav>
    );
}