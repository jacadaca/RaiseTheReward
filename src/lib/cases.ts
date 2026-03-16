/** Placeholder case data — will be replaced by Sanity queries later */
export interface Case {
  id: string;
  name: string;
  type: "Missing Person" | "Unsolved Crime" | "Wanted Individual" | "Lost Pet";
  reward: string;
  rewardNum: number;
  goal: number;
  donors: number;
  days: number;
  loc: string;
  pct: number;
  emoji: string;
  summary: string;
  color: string;
  initials: string;
}

export const CASES: Case[] = [
  {
    id: "nancy",
    name: "Nancy Guthrie",
    type: "Missing Person",
    reward: "$47,250",
    rewardNum: 47250,
    goal: 75000,
    donors: 312,
    days: 84,
    loc: "Riverside County, CA",
    pct: 62,
    emoji: "\u{1F50D}",
    summary:
      "Nancy Guthrie, 34, was last seen leaving her workplace on March 2, 2024. Her vehicle was found abandoned 3 miles away. Law enforcement is actively investigating.",
    color: "#4A90D9",
    initials: "NG",
  },
  {
    id: "ramirez",
    name: "Maria Ramirez (Homicide)",
    type: "Unsolved Crime",
    reward: "$128,900",
    rewardNum: 128900,
    goal: 150000,
    donors: 891,
    days: 412,
    loc: "Houston, TX",
    pct: 85,
    emoji: "\u2696\uFE0F",
    summary:
      "Maria Ramirez was murdered on September 14, 2022. No arrests have been made. Tips can be submitted directly to Houston PD or Crime Stoppers.",
    color: "#D94A4A",
    initials: "MR",
  },
  {
    id: "doe",
    name: "John Doe \u2014 River Junction",
    type: "Unsolved Crime",
    reward: "$18,400",
    rewardNum: 18400,
    goal: 65000,
    donors: 154,
    days: 1240,
    loc: "Louisville, KY",
    pct: 28,
    emoji: "\u{1F50E}",
    summary:
      "Unidentified male found in River Junction area, 2021. Believed to be age 30\u201345. FBI and local law enforcement are seeking identification.",
    color: "#7B68A7",
    initials: "JD",
  },
  {
    id: "biscuit",
    name: "Biscuit \u2014 Lost Dog",
    type: "Lost Pet",
    reward: "$2,200",
    rewardNum: 2200,
    goal: 10000,
    donors: 47,
    days: 12,
    loc: "Austin, TX",
    pct: 22,
    emoji: "\u{1F43E}",
    summary:
      "Biscuit, a 3-year-old golden retriever, went missing from Barton Hills neighborhood. Last seen wearing a blue collar.",
    color: "#D4A24E",
    initials: "B",
  },
  {
    id: "miller",
    name: "Thomas Miller \u2014 Wanted",
    type: "Wanted Individual",
    reward: "$55,000",
    rewardNum: 55000,
    goal: 120000,
    donors: 503,
    days: 201,
    loc: "National",
    pct: 45,
    emoji: "\u{1F6A8}",
    summary:
      "Thomas Miller is wanted in connection with financial crimes across multiple states. A federal warrant has been issued. Do not approach.",
    color: "#333333",
    initials: "TM",
  },
];
