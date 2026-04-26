"use client";

import Image, { type StaticImageData } from "next/image";

import musinsaImg from "@/images/static/musinsa.png";
import cm29Img from "@/images/static/29cm.png";
import ablyImg from "@/images/static/ably.png";
import zigzagImg from "@/images/static/zigzag.png";
import wconceptImg from "@/images/static/wconcept.png";
import gearImg from "@/images/static/gear.png";

import styles from "./Showcase.module.scss";

interface Platform {
  name: string;
  image: StaticImageData;
  alt: string;
  description: string;
  url?: string;
  supported: boolean;
}

const PLATFORMS: Platform[] = [
  {
    name: "MUSINSA",
    image: musinsaImg,
    alt: "무신사",
    description: "패션의 모든 것, 다 무신사랑 해!\n무신사에서 다양한 혜택과 스타일 팁을 확인해보세요.",
    url: "https://www.musinsa.com/main/musinsa/ranking?gf=M&storeCode=musinsa&sectionId=200&contentsId=&categoryCode=000&ageBand=AGE_BAND_ALL",
    supported: true,
  },
  {
    name: "29CM",
    image: cm29Img,
    alt: "29cm",
    description: "패션, 라이프스타일, 컬처까지\n29CM만의 감도 깊은 셀렉션을 만나보세요.",
    supported: false,
  },
  {
    name: "ABLY",
    image: ablyImg,
    alt: "에이블리",
    description: "에이블리는 365일 딱 하나만 사도 무료배송!\n패션, 뷰티, 라이프 스타일의 모든 것을 쇼핑하세요.",
    supported: false,
  },
  {
    name: "ZIGZAG",
    image: zigzagImg,
    alt: "지그재그",
    description: "4000만 여성이 선택한 올인원 쇼핑 앱\n지그재그에서 제가 알아서 살게요.",
    supported: false,
  },
  {
    name: "Wconcept",
    image: wconceptImg,
    alt: "W컨셉",
    description: "나만의 컨셉, 감각적 스타일링\n감도 높은 콘텐츠와 큐레이션으로 나만의 스타일을 발견해보세요.",
    supported: false,
  },
];

export default function Showcase() {
  return (
    <section className={styles.section}>
      <div className={styles.panels}>
        <div className={styles.platformPanel}>
          <h2 className={styles.panelTitle}>지원 플랫폼</h2>
          <ol className={styles.platformList}>
            {PLATFORMS.map((platform, index) => (
              <li
                key={platform.name}
                className={`${styles.platformItem} ${platform.supported ? "" : styles.notSupported}`}
              >
                {platform.supported && platform.url ? (
                  <a
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.platformLink}
                  >
                    <Image src={platform.image} alt={platform.alt} className={styles.icon} />
                    <div className={styles.info}>
                      <p className={styles.name}>{platform.name}</p>
                      <p className={styles.desc}>{platform.description}</p>
                    </div>
                  </a>
                ) : (
                  <span aria-hidden="true" className={styles.platformLink}>
                    <Image src={platform.image} alt={platform.alt} className={styles.icon} />
                    <div className={styles.info}>
                      <p className={styles.name}>{platform.name}</p>
                      <p className={styles.desc}>{platform.description}</p>
                    </div>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.apiPanel}>
          <h2 className={styles.panelTitle}>응답 API</h2>
          <div className={styles.apiContent}>
            <Image src={gearImg} alt="Gemini API" className={styles.gearIcon} />
            <p className={styles.title}>Gemini API</p>
            <p className={styles.subtitle}>Google Gemini 2.5 Flash</p>
            <div className={styles.links}>
              <a
                href="https://ai.google.dev/gemini-api/docs?hl=ko"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Documentation
              </a>
              <a
                href="https://aistudio.google.com/app/apikey?hl=ko"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                Get an API Key
              </a>
            </div></div>
        </div>
      </div>
    </section>
  );
}
