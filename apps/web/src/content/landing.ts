export const brand = {
  name: "hlth OS",
  tagline: "Clinic management for independent practices.",
};

export const nav = {
  links: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "For doctors", href: "#trust" },
  ],
  cta: { label: "Join the waitlist", href: "/waitlist" },
};

export const hero = {
  badge: "Built for independent practices",
  headline: "Run your practice.\nNot paperwork.",
  subheadline:
    "hlth gives independent doctors and small clinics a clean, organized workspace for appointments, patients, staff, and daily operations — without the complexity of enterprise software.",
  ctas: [
    { label: "Join the waitlist", href: "/waitlist", primary: true },
    { label: "See how it works", href: "#features", primary: false },
  ],
};

export const problem = {
  label: "The problem",
  headline: "Clinics run on chaos they can't afford",
  body: "Most practice management tools are either too simple to be useful or so complex they require a full-time IT team. Independent doctors and small clinics are stuck in the middle — managing everything across spreadsheets, sticky notes, and disconnected apps.",
  points: [
    {
      icon: "CalendarX2",
      title: "Scheduling conflicts",
      body: "Double bookings, gaps in the schedule, and appointment follow-ups handled manually — every single day.",
    },
    {
      icon: "FileQuestion",
      title: "Scattered patient data",
      body: "Patient history, notes, and contact details split across systems with no single reliable source of truth.",
    },
    {
      icon: "Users",
      title: "No team visibility",
      body: "Staff don't have a shared view of the day, so small coordination failures become recurring problems.",
    },
    {
      icon: "Timer",
      title: "Admin overhead",
      body: "Hours per week spent on admin work that software should handle — leaving less time for actual patient care.",
    },
  ],
};

export const features = {
  label: "Features",
  headline: "Everything your clinic needs in one place",
  body: "Built around how independent practices actually work — not scaled-down versions of tools designed for hospital networks.",
  items: [
    {
      icon: "CalendarDays",
      title: "Appointment scheduling",
      body: "A clear, conflict-free calendar built for clinic workflows. Book, reschedule, and track appointments without back-and-forth.",
    },
    {
      icon: "UserRound",
      title: "Patient management",
      body: "Every patient in one place — history, consultation notes, upcoming visits, and contact details in a single view.",
    },
    {
      icon: "UsersRound",
      title: "Staff coordination",
      body: "Assign roles and responsibilities, manage availability, and give your team a shared view of the workday.",
    },
    {
      icon: "ClipboardList",
      title: "Clinical notes",
      body: "Structured note-taking for consultations — fast, organized, and always attached to the right patient record.",
    },
    {
      icon: "BellRing",
      title: "Reminders & follow-ups",
      body: "Automatic reminders for upcoming appointments and post-visit follow-ups so nothing falls through the cracks.",
    },
    {
      icon: "BarChart3",
      title: "Practice insights",
      body: "Track appointment volume, patient flow, and staff utilization without building custom reports from scratch.",
    },
  ],
};

export const productPreview = {
  label: "How it works",
  headline: "One workspace. Your whole practice.",
  body: "hlth gives everyone on your team — doctors, front desk, and clinic managers — a shared workspace with a view tailored to what they actually need.",
  points: [
    {
      title: "Start every day with clarity",
      body: "A daily view shows today's appointments, assigned staff, and any pending tasks before you open the door.",
    },
    {
      title: "Patient visits from check-in to follow-up",
      body: "Check in a patient, run the consultation, log notes, and queue a follow-up reminder — all from one connected flow.",
    },
    {
      title: "Coordinate without the noise",
      body: "Doctors see their patients. Staff see their tasks. Managers see the full picture. Role-based views cut the clutter.",
    },
  ],
};

export const trust = {
  label: "Why hlth",
  headline: "Built for independent doctors. Not hospital IT departments.",
  body: "Enterprise practice management platforms are built for large teams with dedicated admins. hlth is designed for a 3-doctor clinic that needs things to simply work.",
  points: [
    {
      icon: "Stethoscope",
      title: "Designed for small practices",
      body: "No unnecessary modules or features built for 500-seat organizations. Just the tools a working clinic actually uses.",
    },
    {
      icon: "Zap",
      title: "Ready the same day",
      body: "Set up your clinic, add your staff, and start booking appointments without a weeks-long onboarding project.",
    },
    {
      icon: "ShieldCheck",
      title: "Secure by default",
      body: "Patient data is handled carefully. Security and privacy are baseline requirements, not optional add-ons.",
    },
    {
      icon: "TrendingUp",
      title: "Scales with your practice",
      body: "Whether you're a solo doctor or managing a multi-location clinic, hlth adapts without disruption.",
    },
  ],
};

export const cta = {
  headline: "Ready to simplify your practice?",
  body: "Join the waitlist. Be among the first clinics to get access when we launch.",
  primary: { label: "Join the waitlist", href: "/waitlist" },
  secondary: { label: "Get in touch", href: "mailto:hello@hlth.app" },
};

export const footer = {
  tagline: "Clinic management for independent practices.",
  columns: [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "How it works", href: "#how-it-works" },
        { label: "Pricing", href: "#pricing" },
        { label: "Join waitlist", href: "/waitlist" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Careers", href: "/careers" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy policy", href: "/privacy" },
        { label: "Terms of service", href: "/terms" },
        { label: "Cookie policy", href: "/cookies" },
      ],
    },
  ],
};
