"use client";

import Image from "next/image";

import musinsaImg from "@/images/static/musinsa.png";
import cm29Img from "@/images/static/29cm.png";
import ablyImg from "@/images/static/ably.png";
import zigzagImg from "@/images/static/zigzag.png";
import wconceptImg from "@/images/static/wconcept.png";
import gearImg from "@/images/static/gear.png";

import styles from "./Showcase.module.scss";

export default function Showcase() {
  return (
    <section className={styles.featuresSection}>
      <div className={styles.features}>
        <div className={styles.featureItem1}>
          <h2 className={styles.featureItem1Title}>지원 플랫폼</h2>
          <ol className={styles.featureItem1Content}>
            <li className={`${styles.featureItem1ContentItem} ${styles.border}`}>
              <a
                href="https://www.musinsa.com/main/musinsa/ranking?gf=M&storeCode=musinsa&sectionId=200&contentsId=&categoryCode=000&ageBand=AGE_BAND_ALL"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.platformLink}
              >
                <Image
                  src={musinsaImg}
                  alt="무신사"
                  className={styles.shopIcon}
                />
                <div>
                  <p className={styles.platformName}>MUSINSA</p>
                  <p className={styles.shopDescription}>
                    패션의 모든 것, 다 무신사랑 해!
                    <br />
                    무신사에서 다양한 혜택과 스타일 팁을 확인해보세요.
                  </p>
                </div>
              </a>
            </li>

            <li className={`${styles.featureItem1ContentItem} ${styles.border} ${styles.notSupported}`}>
              <span aria-hidden="true" className={styles.platformLink}>
                <Image src={cm29Img} alt="29cm" className={styles.shopIcon} />
                <div>
                  <p className={styles.platformName}>29CM</p>
                  <p className={styles.shopDescription}>
                    패션, 라이프스타일, 컬처까지 <br />
                    29CM만의 감도 깊은 셀렉션을 만나보세요.
                  </p>
                </div>
              </span>
            </li>

            <li className={`${styles.featureItem1ContentItem} ${styles.border} ${styles.notSupported}`}>
              <span aria-hidden="true" className={styles.platformLink}>
                <Image src={ablyImg} alt="에이블리" className={styles.shopIcon} />
                <div>
                  <p className={styles.platformName}>ABLY</p>
                  <p className={styles.shopDescription}>
                    에이블리는 365일 딱 하나만 사도 무료배송! <br />
                    패션, 뷰티, 라이프 스타일의 모든 것을 쇼핑하세요.
                  </p>
                </div>
              </span>
            </li>

            <li className={`${styles.featureItem1ContentItem} ${styles.border} ${styles.notSupported}`}>
              <span aria-hidden="true" className={styles.platformLink}>
                <Image src={zigzagImg} alt="지그재그" className={styles.shopIcon} />
                <div>
                  <p className={styles.platformName}>ZIGZAG</p>
                  <p className={styles.shopDescription}>
                    4000만 여성이 선택한 올인원 쇼핑 앱 <br />
                    지그재그에서 제가 알아서 살게요.
                  </p>
                </div>
              </span>
            </li>

            <li className={`${styles.featureItem1ContentItem} ${styles.notSupported}`}>
              <span aria-hidden="true" className={styles.platformLink}>
                <Image src={wconceptImg} alt="W컨셉" className={styles.shopIcon} />
                <div>
                  <p className={styles.platformName}>Wconcept</p>
                  <p className={styles.shopDescription}>
                    나만의 컨셉, 감각적 스타일링 <br />
                    감도 높은 콘텐츠와 큐레이션으로 나만의 스타일을 발견해보세요.
                  </p>
                </div>
              </span>
            </li>
          </ol>
        </div>

        <div className={styles.toolSection}>
          <h2 className={styles.featureItem1Title}>응답 API</h2>
          <Image
            src={gearImg}
            alt="Gemini API"
            className={styles.toolImage}
          />
          <h3>Gemini API</h3>
          <p className={styles.apiSubtitle}>Google Gemini 2.0 Flash</p>

          <div className={styles.apiLinks}>
            <a
              href="https://ai.google.dev/gemini-api/docs?hl=ko"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.apiLink}
            >
              Documentation
            </a>
            <a
              href="https://aistudio.google.com/app/apikey?hl=ko"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.apiLink}
            >
              Get an API Key
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
