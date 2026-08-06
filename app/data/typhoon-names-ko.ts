import type { Storm } from "./storms";

const names: Record<string, string> = {
  DAMREY: "담레이", KOKI: "코키", NAKRI: "나크리", KROVANH: "크로반", TRASES: "트라세",
  TIANMA: "톈마", YINXING: "인싱", FENGSHEN: "펑선", DUJUAN: "두쥐안", MULAN: "무란",
  KIROGI: "기러기", GAEGURI: "개구리", KALMAEGI: "갈매기", SURIGAE: "수리개", MEARI: "메아리",
  "YUN-YEUNG": "윈욍", "DIM-SUM": "딤섬", "FUNG-WONG": "풍웡", "CHOI-WAN": "초이완", "TSING-MA": "칭마",
  KOINU: "고이누", HEBI: "헤비", KOTO: "고토", KOGUMA: "고구마", TOKAGE: "도카게",
  BOLAVEN: "볼라벤", PABUK: "파북", NOKAEN: "노카엔", CHAMPI: "참피", "ONG-MANG": "옹망",
  SANBA: "산바", WUTIP: "우딥", PENHA: "페냐", "IN-FA": "인파", MUIFA: "무이파",
  JELAWAT: "즐라왓", SEPAT: "스팟", NURI: "누리", CEMPAKA: "츰파카", MERBOK: "므르복",
  TIROU: "티로우", MUN: "문", SINLAKU: "실라코", NEPARTAK: "네파탁", NANMADOL: "난마돌",
  MALIKSI: "말릭시", DANAS: "다나스", HAGUPIT: "하구핏", LUPIT: "루핏", TALAS: "탈라스",
  GAEMI: "개미", NARI: "나리", JANGMI: "장미", MIRINAE: "미리내", HODU: "호두",
  PRAPIROON: "프라피룬", WIPHA: "위파", MEKKHALA: "메칼라", NIDA: "니다", KULAP: "꿀랍",
  MARIA: "마리아", FRANCISCO: "프란시스코", HIGOS: "히고스", OMAIS: "오마이스", ROKE: "로키",
  "SON-TINH": "손띤", "CO-MAY": "꼬마이", BAVI: "바비", "LUC-BINH": "룩빈", SONCA: "선까",
  AMPIL: "암필", KROSA: "크로사", MAYSAK: "마이삭", CHANTHU: "찬투", NESAT: "네삿",
  WUKONG: "우쿵", BAILU: "바이루", HAISHEN: "하이선", DIANMU: "뎬무", HAITANG: "하이탕",
  JONGDARI: "종다리", PODUL: "버들", NOUL: "노을", MINDULLE: "민들레", JAMJARI: "잠자리",
  SHANSHAN: "산산", LINGLING: "링링", DOLPHIN: "돌핀", LIONROCK: "라이언록", BANYAN: "바냔",
  TOMO: "도모", KAJIKI: "가지키", KUJIRA: "구지라", TOKEI: "도케이", YAMANEKO: "야마네코",
  LEEPI: "리피", NONGFA: "농파", "CHAN-HOM": "찬홈", NAMTHEUN: "남테운", PAKHAR: "파카르",
  BEBINCA: "버빙카", PEIPAH: "페이파", PEILOU: "페이러우", MALOU: "말로", SANVU: "상우",
  PULASAN: "풀라산", TAPAH: "타파", NANGKA: "낭카", NYATOH: "냐토", MAWAR: "마와르",
  SOULIK: "솔릭", MITAG: "미탁", SAUDEL: "사우델", SARBUL: "사르불", GUCHOL: "구촐",
  CIMARON: "시마론", RAGASA: "라가사", NARRA: "나라", AMUYAO: "아무야오", TALIM: "탈림",
  NARAE: "나래", NEOGURI: "너구리", GAENARI: "개나리", GOSARI: "고사리", BORI: "보리",
  BURAPHA: "부라파", BUALOI: "부알로이", ATSANI: "앗사니", CHABA: "차바", KHANUN: "카눈",
  BARIJAT: "바리자트", MATMO: "마트모", ETAU: "아타우", AERE: "에어리", LAN: "란",
  HOABAN: "호아반", HALONG: "할롱", "BANG-LANG": "방랑", SONGDA: "송다", SAOBIEN: "사오비엔",
};

export function displayStormName(storm: Storm) {
  return storm.basin === "WP" ? names[storm.name.toUpperCase()] ?? storm.name : storm.name;
}
