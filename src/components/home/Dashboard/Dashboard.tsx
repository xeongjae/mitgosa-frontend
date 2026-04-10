import styles from "./Dashboard.module.scss";

export default function Dashboard() {
  return (
    <section className={styles.section} aria-labelledby="dashboard-heading">
      <h2 id="dashboard-heading" className={styles.title}>
        분석 대시보드
      </h2>
      <p className={styles.desc}>
        URL 입력·분석 결과가 들어갈 영역입니다. (구현 예정)
      </p>
    </section>
  );
}
