
import bintang_6 from "../assets/bronze_finansial_6.png";
import bintang_7 from "../assets/silver_finansial_analysis_7.png";
import bintang_8 from "../assets/gold_finansial_strategist_8.png";
import bintang_9 from "../assets/platinum_smartnuma_master_9.png";

export const TROPHIES = [
  {
    stars: 9,
    title: "Master Keuangan Smartnuma",
    image: bintang_9,
  },
  {
    stars: 8,
    title: "Konsultan Ahli",
    image: bintang_8,
  },
  {
    stars: 7,
    title: "Konsultan Andal",
    image: bintang_7,
  },
  {
    stars: 6,
    title: "Penasihat Pemula",
    image: bintang_6,
  },
];

export function getTrophy(totalStars) {
  return (
    TROPHIES.find((t) => totalStars >= t.stars) ??
    TROPHIES[TROPHIES.length - 1]
  );
}
