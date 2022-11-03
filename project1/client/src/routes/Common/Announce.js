import { useEffect } from "react";
import styles from "routes/Common/Announce.module.css";

const Announce = ({ userObj, setUserObj }) => {
    useEffect(() => {
        const title = "공지사항";
        document.querySelector("#maintitle").innerHTML = title;
    }, []);
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.title}>
                    <h1>한양대학교 수강신청</h1>
                    <h3>2022-2학기 서울캠퍼스 수강신청 안내</h3>
                </div>
                <div className={styles.content}>
                    <p>
                        [졸업사정조회] 메뉴를 조회하여 본인의 미필과목 이수여부,
                        이수학점 등 졸업요건과 관련된 사항을 한번 더 신중하게
                        확인 후 수강신청 하시기 바랍니다.
                    </p>
                    <p>
                        수강신청 안내문을 확인하지 않음으로 인해 발생되는 결과는
                        학생 본인의 책임이므로 필히 수강신청 안내문을 확인하시기
                        바랍니다.
                    </p>
                    <p>
                        수강신청 안내문과 수강편함 교과목정보는 현재 계속
                        업데이트 중이로, 잠시 일부 깨져보일 수 있으며 일부
                        교과목의 경우 변경이 될 수 있습니다.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Announce;
