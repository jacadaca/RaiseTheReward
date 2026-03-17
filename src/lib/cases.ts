/** Case data — sourced from public law enforcement databases.
 *  Will be replaced by Sanity queries later. */
export interface Case {
  id: string;
  name: string;
  type: "Missing Person" | "Unsolved Crime" | "Wanted Individual";
  reward: string;
  rewardNum: number;
  donors: number;
  loc: string;
  summary: string;
  color: string;
  initials: string;
  /** Where this case was sourced from */
  source: "FBI" | "NCMEC" | "NamUs" | "Crime Stoppers" | "User Submitted";
  /** URL to the original listing */
  sourceUrl: string;
  /** Law enforcement contact for tips */
  leContact: string;
  /** Photo URL from source (if available) */
  imageUrl?: string;
  /** Date the case was added to RaiseTheReward */
  dateAdded: string;
}

/**
 * Generate a consistent color from a string (name).
 * Used for avatar placeholders when no photo is available.
 */
function nameToColor(name: string): string {
  const colors = [
    "#4A90D9", "#D94A4A", "#7B68A7", "#D4A24E", "#5BA55B",
    "#C06090", "#4AAAA0", "#8B6E4E", "#6B8ED6", "#CC7A3E",
    "#5C7C3E", "#9B59B6", "#2E86AB", "#A23B72", "#E8543E",
    "#3D8EB9", "#6C5B7B", "#C0A062", "#2D6A4F", "#B5495B",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter((w) => w.length > 0 && w[0] === w[0].toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

// ─── REAL CASES ──────────────────────────────────────────────
// Sourced from public FBI Wanted, NCMEC, and other LE databases.
// All reward pools start at $0 — crowdfunding begins on RaiseTheReward.

export const CASES: Case[] = [
  // ── FBI Most Wanted ──
  {
    id: "ruja-ignatova",
    name: "Ruja Ignatova",
    type: "Wanted Individual",
    reward: "$0",
    rewardNum: 0,
    donors: 0,
    loc: "International",
    summary:
      "Ruja Ignatova is wanted for her alleged participation in a large-scale fraud scheme involving OneCoin, a cryptocurrency company she founded. She was charged with wire fraud, securities fraud, and money laundering. She has been missing since 2017.",
    color: nameToColor("Ruja Ignatova"),
    initials: getInitials("Ruja Ignatova"),
    source: "FBI",
    sourceUrl: "https://www.fbi.gov/wanted/topten/ruja-ignatova",
    leContact: "Contact your local FBI field office or submit a tip at tips.fbi.gov",
    imageUrl: "https://www.fbi.gov/wanted/topten/ruja-ignatova/@@images/image/large",
    dateAdded: "2026-03-17",
  },
  {
    id: "alexis-flores",
    name: "Alexis Flores",
    type: "Wanted Individual",
    reward: "$0",
    rewardNum: 0,
    donors: 0,
    loc: "Honduras / United States",
    summary:
      "Alexis Flores is wanted for his alleged involvement in the kidnapping and murder of a five-year-old girl in Philadelphia, Pennsylvania in 2000. DNA evidence linked Flores to the crime. He is believed to have fled to Honduras.",
    color: nameToColor("Alexis Flores"),
    initials: getInitials("Alexis Flores"),
    source: "FBI",
    sourceUrl: "https://www.fbi.gov/wanted/topten/alexis-flores",
    leContact: "Contact your local FBI field office or submit a tip at tips.fbi.gov",
    imageUrl: "https://www.fbi.gov/wanted/topten/alexis-flores/@@images/image/large",
    dateAdded: "2026-03-17",
  },
  {
    id: "bhadreshkumar-patel",
    name: "Bhadreshkumar Chetanbhai Patel",
    type: "Wanted Individual",
    reward: "$0",
    rewardNum: 0,
    donors: 0,
    loc: "National / International",
    summary:
      "Bhadreshkumar Chetanbhai Patel is wanted for the murder of his wife at a Dunkin' Donuts in Hanover, Maryland in April 2015. He was captured on surveillance video and has been a fugitive since. He was added to the FBI Ten Most Wanted Fugitives list.",
    color: nameToColor("Bhadreshkumar Patel"),
    initials: "BP",
    source: "FBI",
    sourceUrl: "https://www.fbi.gov/wanted/topten/bhadreshkumar-chetanbhai-patel",
    leContact: "Contact your local FBI field office or submit a tip at tips.fbi.gov",
    imageUrl: "https://www.fbi.gov/wanted/topten/bhadreshkumar-chetanbhai-patel/@@images/image/large",
    dateAdded: "2026-03-17",
  },
  {
    id: "eugene-palmer",
    name: "Eugene Palmer",
    type: "Wanted Individual",
    reward: "$0",
    rewardNum: 0,
    donors: 0,
    loc: "New York",
    summary:
      "Eugene Palmer is wanted for the alleged murder of his daughter-in-law, who was shot and killed in Stony Point, New York in 2012. Palmer, an experienced outdoorsman, disappeared into Harriman State Park shortly after the murder.",
    color: nameToColor("Eugene Palmer"),
    initials: getInitials("Eugene Palmer"),
    source: "FBI",
    sourceUrl: "https://www.fbi.gov/wanted/topten/eugene-palmer",
    leContact: "Contact your local FBI field office or submit a tip at tips.fbi.gov",
    imageUrl: "https://www.fbi.gov/wanted/topten/eugene-palmer/@@images/image/large",
    dateAdded: "2026-03-17",
  },

  // ── Missing Persons (NCMEC / NamUs / Public Record) ──
  {
    id: "kyron-horman",
    name: "Kyron Horman",
    type: "Missing Person",
    reward: "$0",
    rewardNum: 0,
    donors: 0,
    loc: "Portland, OR",
    summary:
      "Kyron Horman was last seen at Skyline Elementary School in Portland, Oregon on June 4, 2010. He was 7 years old at the time of his disappearance. Despite extensive searches, Kyron has never been found. His case remains one of the most well-known missing child cases in the Pacific Northwest.",
    color: nameToColor("Kyron Horman"),
    initials: getInitials("Kyron Horman"),
    source: "NCMEC",
    sourceUrl: "https://www.missingkids.org/poster/NCMC/1146067",
    leContact: "Multnomah County Sheriff's Office: (503) 261-2847",
    imageUrl: "https://www.missingkids.org/poster/NCMC/1146067/1/screen",
    dateAdded: "2026-03-17",
  },
  {
    id: "asha-degree",
    name: "Asha Degree",
    type: "Missing Person",
    reward: "$0",
    rewardNum: 0,
    donors: 0,
    loc: "Shelby, NC",
    summary:
      "Asha Degree was 9 years old when she disappeared from her home in Shelby, North Carolina in the early morning hours of February 14, 2000. She was seen walking along Highway 18 in the rain. Her bookbag was found buried in 2001, but Asha has never been located.",
    color: nameToColor("Asha Degree"),
    initials: getInitials("Asha Degree"),
    source: "NCMEC",
    sourceUrl: "https://www.missingkids.org/poster/NCMC/1205987",
    leContact: "Cleveland County Sheriff's Office: (704) 484-4822 or FBI Charlotte: (704) 672-6100",
    imageUrl: "https://www.missingkids.org/poster/NCMC/1205987/1/screen",
    dateAdded: "2026-03-17",
  },
  {
    id: "michaela-garecht",
    name: "Michaela Garecht",
    type: "Missing Person",
    reward: "$0",
    rewardNum: 0,
    donors: 0,
    loc: "Hayward, CA",
    summary:
      "Michaela Garecht was 9 years old when she was kidnapped from a grocery store parking lot in Hayward, California on November 19, 1988. A witness saw a man grab her and pull her into a vehicle. Despite decades of investigation, Michaela has never been found.",
    color: nameToColor("Michaela Garecht"),
    initials: getInitials("Michaela Garecht"),
    source: "NCMEC",
    sourceUrl: "https://www.missingkids.org/poster/NCMC/1132367",
    leContact: "Hayward Police Department: (510) 293-7000 or FBI San Francisco",
    imageUrl: "https://www.missingkids.org/poster/NCMC/1132367/1/screen",
    dateAdded: "2026-03-17",
  },
  {
    id: "relisha-rudd",
    name: "Relisha Rudd",
    type: "Missing Person",
    reward: "$0",
    rewardNum: 0,
    donors: 0,
    loc: "Washington, DC",
    summary:
      "Relisha Rudd was 8 years old when she went missing from Washington, D.C. in March 2014. She was last seen with a janitor from the homeless shelter where she lived with her family. The janitor was later found dead. Relisha has never been located.",
    color: nameToColor("Relisha Rudd"),
    initials: getInitials("Relisha Rudd"),
    source: "NCMEC",
    sourceUrl: "https://www.missingkids.org/poster/NCMC/1255450",
    leContact: "DC Metropolitan Police: (202) 727-9099 or FBI Washington: (202) 278-2000",
    imageUrl: "https://www.missingkids.org/poster/NCMC/1255450/1/screen",
    dateAdded: "2026-03-17",
  },

  // ── Unsolved Crimes (Public Record / Crime Stoppers) ──
  {
    id: "delphi-murders",
    name: "Abby Williams & Libby German",
    type: "Unsolved Crime",
    reward: "$0",
    rewardNum: 0,
    donors: 0,
    loc: "Delphi, IN",
    summary:
      "Abigail Williams, 13, and Liberty German, 14, were murdered on February 13, 2017 while hiking the Delphi Historic Trail in Delphi, Indiana. Libby captured audio and video of the suspected killer on her phone. A suspect was arrested in 2022 and the trial is ongoing.",
    color: nameToColor("Delphi Murders"),
    initials: "DM",
    source: "Crime Stoppers",
    sourceUrl: "https://www.in.gov/isp/delphi-investigation/",
    leContact: "Indiana State Police: (800) 382-7537 or Tip Line: abbyandlibbytip@cacoshrf.com",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/5f/Abby_Williams_and_Libby_German.jpg",
    dateAdded: "2026-03-17",
  },
  {
    id: "missy-bevers",
    name: "Missy Bevers",
    type: "Unsolved Crime",
    reward: "$0",
    rewardNum: 0,
    donors: 0,
    loc: "Midlothian, TX",
    summary:
      "Terri \"Missy\" Bevers, 45, was murdered inside Creekside Church of Christ in Midlothian, Texas on April 18, 2016, where she was preparing for a fitness class. Surveillance footage showed a suspect dressed in tactical SWAT gear. The case remains unsolved.",
    color: nameToColor("Missy Bevers"),
    initials: getInitials("Missy Bevers"),
    source: "Crime Stoppers",
    sourceUrl: "https://www.midlothian.tx.us/610/Missy-Bevers-Investigation",
    leContact: "Midlothian Police Department: (972) 775-3333",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/5/5c/Missy_Bevers.jpg",
    dateAdded: "2026-03-17",
  },
  {
    id: "springfield-three",
    name: "The Springfield Three",
    type: "Missing Person",
    reward: "$0",
    rewardNum: 0,
    donors: 0,
    loc: "Springfield, MO",
    summary:
      "Sherrill Levitt, her daughter Suzanne Streeter, and Suzanne's friend Stacy McCall disappeared from Levitt's home in Springfield, Missouri on June 7, 1992 after a graduation party. There were no signs of struggle. All three women have never been found.",
    color: nameToColor("Springfield Three"),
    initials: "S3",
    source: "Crime Stoppers",
    sourceUrl: "https://www.springfieldmo.gov/2236/Missing-Women",
    leContact: "Springfield Police Department: (417) 864-1810 or Crime Stoppers: (417) 869-TIPS",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/f/f3/Springfield_Three_Missing_Women.jpg",
    dateAdded: "2026-03-17",
  },
  {
    id: "natalee-holloway",
    name: "Natalee Holloway",
    type: "Missing Person",
    reward: "$0",
    rewardNum: 0,
    donors: 0,
    loc: "Aruba",
    summary:
      "Natalee Holloway, 18, disappeared on May 30, 2005 while on a high school graduation trip to Aruba. She was last seen leaving a nightclub. Joran van der Sloot was the prime suspect and later confessed to killing her in 2023, though her remains have never been recovered.",
    color: nameToColor("Natalee Holloway"),
    initials: getInitials("Natalee Holloway"),
    source: "FBI",
    sourceUrl: "https://www.fbi.gov/news/stories/natalee-holloway-case",
    leContact: "FBI: tips.fbi.gov or 1-800-CALL-FBI",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/14/Natalee_Holloway.jpg",
    dateAdded: "2026-03-17",
  },
];
