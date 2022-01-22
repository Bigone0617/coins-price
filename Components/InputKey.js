import { useRouter } from "next/router";


export default function InputKey ({haveKey}) {
    const router = useRouter();
    const onClickSave = () => {
        let access_key = document.getElementsByClassName('access')[0].value;
        let secret_key = document.getElementsByClassName('secret')[0].value;

        alert('API키가 저장되었습니다.')

        window.localStorage.setItem("bitmall",JSON.stringify({
            access : access_key,
            secret : secret_key
        }));
    }

    const onClickRemove = () => {
        let isDelete = confirm('API키를 정말 지우시겠습니끼?');

        if(isDelete){
            window.localStorage.removeItem('bitmall');
            router.reload()
        }
    }
    return (
        <>
            {
                haveKey ? (
                    <div>
                        <button onClick={onClickRemove}>KEY 삭제</button>
                    </div>
                ) : (
                    <div>
                        Access KEY  <input type="text" className="access"></input>
                        <br></br>
                        Secret KEY <input type="text" className="secret"></input>
                        <button onClick={onClickSave}>save</button>
                    </div>
                )
            }
        </>
    )
} 