/** Placeholder case data — will be replaced by Sanity queries later */
export interface Case {
  id: string;
  name: string;
  type: "Missing Person" | "Unsolved Crime" | "Wanted Individual";
  reward: string;
  rewardNum: number;
  donors: number;
  days: number;
  loc: string;
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
    donors: 312,
    days: 84,
    loc: "Riverside County, CA",
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
    donors: 891,
    days: 412,
    loc: "Houston, TX",
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
    donors: 154,
    days: 1240,
    loc: "Louisville, KY",
    emoji: "\u{1F50E}",
    summary:
      "Unidentified male found in River Junction area, 2021. Believed to be age 30\u201345. FBI and local law enforcement are seeking identification.",
    color: "#7B68A7",
    initials: "JD",
  },
  {
    id: "miller",
    name: "Thomas Miller \u2014 Wanted",
    type: "Wanted Individual",
    reward: "$55,000",
    rewardNum: 55000,
    donors: 503,
    days: 201,
    loc: "National",
    emoji: "\u{1F6A8}",
    summary:
      "Thomas Miller is wanted in connection with financial crimes across multiple states. A federal warrant has been issued. Do not approach.",
    color: "#333333",
    initials: "TM",
  },
];
