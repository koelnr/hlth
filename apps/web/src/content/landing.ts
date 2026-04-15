export const brand = {
  name: "hlth OS",
  tagline: "Clinic management for independent practices.",
};

export const nav = {
  links: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "For clinics", href: "#trust" },
  ],
  cta: { label: "Get early access", href: "/waitlist" },
};

export const hero = {
  badge: "Purpose-built for independent practices",
  headline: "Run your practice.\nNot the admin.",
  subheadline:
    "Most practice software was built for hospital systems with IT departments. hlth is built for independent clinics — one workspace for scheduling, patients, and staff that your whole team can use from day one.",
  ctas: [
    { label: "Get early access", href: "/waitlist", primary: true },
    { label: "See how it works", href: "#features", primary: false },
  ],
};

export const problem = {
  label: "Sound familiar?",
  headline: "Your clinic is running on workarounds",
  body: "You're not a hospital. But enterprise software doesn't know that. Most practice tools are either too simple to trust or so complex they need a dedicated admin. Independent clinics end up stringing together spreadsheets, texts, and three different apps — and calling it a system.",
  points: [
    {
      icon: "CalendarX2",
      title: "Double bookings and gaps",
      body: "Scheduling conflicts that shouldn't happen — and follow-ups that fall through because no one owns them.",
    },
    {
      icon: "FileQuestion",
      title: "No single source of truth",
      body: "Patient history split across sticky notes, emails, and a system nobody fully trusts.",
    },
    {
      icon: "Users",
      title: "Staff flying blind",
      body: "No shared view of the day means small coordination failures become recurring, avoidable problems.",
    },
    {
      icon: "Timer",
      title: "Hours lost to admin",
      body: "Time spent chasing paperwork and re-entering data is time that isn't spent on patient care.",
    },
  ],
};

export const features = {
  label: "What's included",
  headline: "One platform. Every workflow your clinic runs.",
  body: "Built for independent practices — not a scaled-down version of software designed for 200-bed hospitals.",
  items: [
    {
      icon: "CalendarDays",
      title: "Appointment scheduling",
      body: "A conflict-free calendar built for clinic workflows. Book, reschedule, and manage the full day without back-and-forth.",
    },
    {
      icon: "UserRound",
      title: "Patient records",
      body: "Full history, consultation notes, and contact details in one view. Never dig through two systems to answer a simple question.",
    },
    {
      icon: "UsersRound",
      title: "Staff coordination",
      body: "Give your team a shared view of the day. Assign roles, manage availability, and cut the end-of-day confusion.",
    },
    {
      icon: "ClipboardList",
      title: "Clinical notes",
      body: "Structured notes that attach directly to the patient record. Write during the visit, not after.",
    },
    {
      icon: "BellRing",
      title: "Reminders & follow-ups",
      body: "Automated reminders before appointments and follow-ups after — fewer no-shows, better continuity of care.",
    },
    {
      icon: "BarChart3",
      title: "Practice insights",
      body: "See appointment volume, patient flow, and staff utilization — without building a report from scratch.",
    },
  ],
};

export const productPreview = {
  label: "How it works",
  headline: "One workspace for your whole team.",
  body: "Every role — doctors, front desk, clinic managers — gets a view built around what they actually need to do their job.",
  points: [
    {
      title: "Start every day with clarity",
      body: "Open hlth and see today's schedule, your staff, and any pending items — before your first patient walks in.",
    },
    {
      title: "From check-in to follow-up",
      body: "Log the visit, write the note, and queue a reminder — all in one connected flow from the same screen.",
    },
    {
      title: "Role-based views that cut the noise",
      body: "Doctors see their patients. Front desk sees appointments. Managers see the full picture. No one sees more than they need to.",
    },
  ],
};

export const trust = {
  label: "Why hlth",
  headline: "Built for independent clinics. Not hospital IT.",
  body: "Enterprise platforms are built for 50-person ops teams with dedicated admins. hlth is built for the practice that needs things to simply work.",
  points: [
    {
      icon: "Stethoscope",
      title: "Built for small practices",
      body: "No modules designed for 500-seat organizations. Just the tools a working clinic actually uses, every day.",
    },
    {
      icon: "Zap",
      title: "Up and running the same day",
      body: "Add your clinic, your staff, and your schedule — and you're live. No implementation project. No IT consultant.",
    },
    {
      icon: "ShieldCheck",
      title: "Secure by default",
      body: "Patient data is handled with care. Security and privacy are built in from the start — not sold as add-ons.",
    },
    {
      icon: "TrendingUp",
      title: "Grows with you",
      body: "Solo practice today, multi-location clinic tomorrow. hlth adapts without a migration or a new contract.",
    },
  ],
};

export const cta = {
  headline: "Take your clinic off spreadsheets.",
  body: "Join the waitlist. We're onboarding independent practices in early batches.",
  primary: { label: "Get early access", href: "/waitlist" },
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
