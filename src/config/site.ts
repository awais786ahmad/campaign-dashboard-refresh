export const site = {
  name: "Quality Dial",
  tagline: "AI-Powered Call Center Platform Built for Modern Teams",
  description:
    "Manage calls, AI agents, CRM, campaigns, messaging, and automation from one workspace.",
};

export const marketingNav = [
  { label: "Features", to: "/features" },
  { label: "Pricing", to: "/pricing" },
  { label: "Resources", to: "/resources" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export const footerColumns = [
  {
    title: "Product",
    links: [
      { label: "Features", to: "/features" },
      { label: "Pricing", to: "/pricing" },
      { label: "Dashboard preview", to: "/dashboard" },
      { label: "Onboarding", to: "/onboarding/workspace" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Sales teams", to: "/features" },
      { label: "Support desks", to: "/features" },
      { label: "Agencies", to: "/features" },
      { label: "Enterprise", to: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", to: "/resources" },
      { label: "Guides", to: "/resources" },
      { label: "Changelog", to: "/resources" },
      { label: "Help center", to: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Careers", to: "/about" },
      { label: "Security", to: "/about" },
    ],
  },
] as const;

export const plans = [
  {
    name: "Starter",
    price: "$39",
    cadence: "per user / month",
    blurb: "For small teams making their first structured calls.",
    features: ["3 users", "1 AI agent", "500 minutes", "CRM & leads", "Basic reports"],
    cta: "Start free trial",
    featured: false,
  },
  {
    name: "Professional",
    price: "$89",
    cadence: "per user / month",
    blurb: "For growing call centers running daily campaigns.",
    features: [
      "25 users",
      "10 AI agents",
      "5,000 minutes",
      "Campaigns & automation",
      "Unified inbox",
      "Advanced analytics",
    ],
    cta: "Start free trial",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "annual agreement",
    blurb: "For organizations with compliance and scale needs.",
    features: [
      "Unlimited users",
      "Unlimited AI agents",
      "Custom minutes",
      "SSO & audit logs",
      "Dedicated success manager",
    ],
    cta: "Book a demo",
    featured: false,
  },
] as const;
