export interface UserProfile {
  username: string;
  initials: string;
  role: string;
  bio: string;
  joinDate: string;
  posts: number;
  likesReceived: number;
  badge?: "mod" | "verified" | "top";
  location?: string;
  isOnline?: boolean;
}

export const users: Record<string, UserProfile> = {
  EmmaK: { username: "EmmaK", initials: "EK", role: "UX Designer @ Spotify", bio: "Fd lärare som hittade hem i UX-design. Älskar att hjälpa andra karriärväxlare.", joinDate: "2023-03-15", posts: 142, likesReceived: 1893, badge: "verified", location: "Stockholm", isOnline: true },
  TechAnton: { username: "TechAnton", initials: "TA", role: "Student — KTH", bio: "Sista året på civilingenjör datateknik. Nyfiken på allt tech.", joinDate: "2024-09-01", posts: 23, likesReceived: 312, location: "Stockholm", isOnline: true },
  LinaM: { username: "LinaM", initials: "LM", role: "Projektledare @ Volvo", bio: "Driven projektledare med passion för bilindustrin.", joinDate: "2022-11-20", posts: 89, likesReceived: 1456, badge: "top", location: "Göteborg", isOnline: false },
  OskarP: { username: "OskarP", initials: "OP", role: "Student", bio: "Pluggar ekonomi och söker sommarjobb.", joinDate: "2025-01-10", posts: 8, likesReceived: 98, isOnline: false },
  AnonymAnvändare: { username: "AnonymAnvändare", initials: "AA", role: "Anonym", bio: "Föredrar att vara anonym.", joinDate: "2024-06-01", posts: 34, likesReceived: 567 },
  FreelanceFreda: { username: "FreelanceFreda", initials: "FF", role: "Frilansare", bio: "Frilansande utvecklare som jobbar remote från hela Sverige.", joinDate: "2023-07-01", posts: 67, likesReceived: 890, badge: "top", location: "Malmö", isOnline: true },
  NegotiatorNiklas: { username: "NegotiatorNiklas", initials: "NN", role: "Systemutvecklare @ H&M", bio: "Brinner för lönetransparens och rättvisa villkor.", joinDate: "2023-01-15", posts: 112, likesReceived: 2341, badge: "verified", location: "Stockholm", isOnline: false },
  KodKarin: { username: "KodKarin", initials: "KK", role: "Karriärväxlare", bio: "På väg in i techvärlden!", joinDate: "2025-02-01", posts: 12, likesReceived: 145 },
  JohanL: { username: "JohanL", initials: "JL", role: "Utvecklare", bio: "Fullstack-utvecklare med 5 års erfarenhet.", joinDate: "2023-05-20", posts: 56, likesReceived: 478, badge: "verified", isOnline: true },
  SaraB: { username: "SaraB", initials: "SB", role: "UX Researcher", bio: "Nyfiken på människor och design.", joinDate: "2024-02-14", posts: 31, likesReceived: 234, isOnline: false },
  MarcusW: { username: "MarcusW", initials: "MW", role: "Ekonom", bio: "Funderar på karriärväxling till UX.", joinDate: "2024-08-10", posts: 14, likesReceived: 156 },
  UXDesignerLisa: { username: "UXDesignerLisa", initials: "UL", role: "Senior UX Designer", bio: "10+ år inom design. Mentor på ADPList.", joinDate: "2022-06-01", posts: 198, likesReceived: 3210, badge: "verified", location: "Stockholm", isOnline: true },
  KristofferN: { username: "KristofferN", initials: "KN", role: "Tech Recruiter", bio: "Hjälper talanger hitta rätt jobb.", joinDate: "2023-02-01", posts: 87, likesReceived: 1567, badge: "top", location: "Stockholm" },
  PsykologPer: { username: "PsykologPer", initials: "PP", role: "Leg. Psykolog", bio: "Specialiserad på arbetsrelaterad stress.", joinDate: "2023-04-01", posts: 76, likesReceived: 2890, badge: "verified", location: "Göteborg", isOnline: true },
  VarDärSjälv: { username: "VarDärSjälv", initials: "VS", role: "Utvecklare", bio: "Överlevde en toxisk arbetsplats. Delar erfarenheter.", joinDate: "2024-01-15", posts: 29, likesReceived: 445 },
  KarriärCoachMia: { username: "KarriärCoachMia", initials: "KC", role: "Karriärcoach", bio: "Certifierad coach som hjälper med karriärutveckling.", joinDate: "2023-08-01", posts: 94, likesReceived: 1678, badge: "verified", location: "Malmö" },
  HRSara: { username: "HRSara", initials: "HS", role: "HR-chef", bio: "15 år inom HR. Fråga mig om arbetsrätt!", joinDate: "2022-12-01", posts: 145, likesReceived: 3456, badge: "verified", location: "Uppsala", isOnline: false },
  DevJohan: { username: "DevJohan", initials: "DJ", role: "Frontend-utvecklare", bio: "React-entusiast och OSS-bidragare.", joinDate: "2023-09-15", posts: 63, likesReceived: 712, location: "Linköping", isOnline: true },
  AnnaS: { username: "AnnaS", initials: "AS", role: "Lärare", bio: "Funderar på karriärväxling.", joinDate: "2024-11-01", posts: 7, likesReceived: 89 },
  DevPontus: { username: "DevPontus", initials: "DP", role: "Techlead", bio: "Bygger team och produkter.", joinDate: "2023-01-01", posts: 78, likesReceived: 934, location: "Stockholm", isOnline: false },
  NathalieR: { username: "NathalieR", initials: "NR", role: "Lärare", bio: "Drömmer om tjänstedesign.", joinDate: "2024-10-01", posts: 11, likesReceived: 123 },
  CarolineH: { username: "CarolineH", initials: "CH", role: "Produktdesigner", bio: "Fd jurist → produktdesigner. Ångrar inget.", joinDate: "2023-03-01", posts: 64, likesReceived: 1234, badge: "verified", location: "Stockholm", isOnline: true },
  TobiasK: { username: "TobiasK", initials: "TK", role: "Design Manager", bio: "Leder designteam och mentorerar juniorer.", joinDate: "2022-09-01", posts: 134, likesReceived: 2567, badge: "top", location: "Göteborg" },
  SandraP: { username: "SandraP", initials: "SP", role: "UX Lead", bio: "ADPList-mentor och design-evangelist.", joinDate: "2022-08-01", posts: 156, likesReceived: 3890, badge: "verified", location: "Stockholm", isOnline: true },
  PatrikS: { username: "PatrikS", initials: "PS", role: "Frontend-utvecklare", bio: "Fd polis → kodare. Allt är möjligt.", joinDate: "2023-11-01", posts: 42, likesReceived: 678, location: "Malmö" },
  MagnusF: { username: "MagnusF", initials: "MF", role: "Service Designer", bio: "Bred erfarenhet inom alla designdiscipliner.", joinDate: "2022-07-01", posts: 167, likesReceived: 2890, badge: "top", location: "Stockholm" },
  JennyT: { username: "JennyT", initials: "JT", role: "UX Lead", bio: "Anställer och mentorerar designers.", joinDate: "2022-10-01", posts: 98, likesReceived: 2345, badge: "verified", location: "Stockholm", isOnline: false },
  FredrikÖ: { username: "FredrikÖ", initials: "FÖ", role: "Konsult", bio: "IT-konsult med bred erfarenhet.", joinDate: "2024-03-01", posts: 19, likesReceived: 178 },
  DanielG: { username: "DanielG", initials: "DG", role: "Junior UX Designer", bio: "Nyss bytt karriär, älskar det!", joinDate: "2024-07-01", posts: 25, likesReceived: 345 },
};

export const getUser = (username: string): UserProfile => {
  return users[username] || {
    username,
    initials: username.slice(0, 2).toUpperCase(),
    role: "Medlem",
    bio: "",
    joinDate: "2024-01-01",
    posts: 0,
    likesReceived: 0,
  };
};
