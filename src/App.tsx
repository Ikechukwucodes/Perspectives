import { useState, type ReactNode } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronDown,
  HeartHandshake,
  Menu,
  Quote,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  X,
} from "lucide-react";

type Story = {
  name: string;
  role: string;
  quote: string;
  initials: string;
  color: string;
};

const steps = [
  {
    number: "01",
    title: "Tell us what you need",
    text: "Share a little about what support could look like. You stay in control of what you share.",
  },
  {
    number: "02",
    title: "Explore verified care",
    text: "Browse thoughtful profiles by specialty, language, availability and faith compatibility.",
  },
  {
    number: "03",
    title: "Choose your next step",
    text: "Request an appointment and begin a private, professional relationship at your pace.",
  },
];

const psychologists = [
  {
    name: "Dr. Leah Okafor",
    specialty: "Anxiety, identity & life transitions",
    detail: "English · Telehealth",
    initials: "LO",
    color: "#38BDF8",
  },
  {
    name: "Dr. Benjamin Reed",
    specialty: "Relationships, grief & resilience",
    detail: "English · In person + online",
    initials: "SR",
    color: "#8B5CF6",
  },
  {
    name: "Dr. Elena Torres",
    specialty: "Family, trauma-informed care",
    detail: "English · Español · Telehealth",
    initials: "ET",
    color: "#14B8A6",
  },
];

const stories: Story[] = [
  {
    name: "Dr. Maya Okafor",
    role: "Clinical psychologist",
    quote:
      "The most meaningful work starts with listening without rushing to fix. PERSPECTIVES makes room for that kind of care.",
    initials: "MO",
    color: "#38BDF8",
  },
  {
    name: "Dr. Samuel Reed",
    role: "Counseling psychologist",
    quote:
      "People deserve support that respects both their professional needs and the values that shape their lives.",
    initials: "SR",
    color: "#8B5CF6",
  },
  {
    name: "Jordan, patient",
    role: "PERSPECTIVES community",
    quote:
      "I appreciated being able to choose how faith showed up in the conversation. The process felt clear and human.",
    initials: "J",
    color: "#14B8A6",
  },
];

const faqs = [
  [
    "What does Christian psychology mean here?",
    "It means you can connect with a verified professional who is open to discussing Christian faith when you welcome it. Your preferences guide the experience.",
  ],
  [
    "How are psychologists verified?",
    "Profiles are reviewed by the PERSPECTIVES team. Verification includes professional identity and credential checks before a psychologist can appear in discovery.",
  ],
  [
    "Is this emergency support?",
    "PERSPECTIVES is not an emergency service. If there is immediate danger or a risk of harm, contact local emergency services, a crisis service or a trusted person now.",
  ],
  [
    "Does Scripture replace professional treatment?",
    "No. Prayer, Scripture and faith resources may be meaningful supports, but they never replace psychological, medical or emergency care.",
  ],
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={compact ? "logo logo-compact" : "logo"}
      aria-label="PERSPECTIVES"
    >
      <svg className="logo-symbol" viewBox="0 0 48 48" aria-hidden="true">
        <circle
          cx="24"
          cy="24"
          r="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity=".42"
        />
        <ellipse
          cx="24"
          cy="24"
          rx="8"
          ry="19"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          transform="rotate(42 24 24)"
        />
        <ellipse
          cx="24"
          cy="24"
          rx="8"
          ry="19"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          transform="rotate(-42 24 24)"
        />
        <circle cx="24" cy="24" r="4" fill="#22D3EE" />
      </svg>
      {!compact && <span className="logo-word">PERSPECTIVES</span>}
    </span>
  );
}

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState<"patient" | "psychologist">("patient");
  const [storyIndex, setStoryIndex] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const story = stories[storyIndex];
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell" id="top">
      <header className="site-header">
        <a href="#top" className="brand" onClick={closeMenu}>
          <Logo />
        </a>
        <button
          className="menu-toggle"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
        <nav
          className={menuOpen ? "main-nav is-open" : "main-nav"}
          aria-label="Main navigation"
        >
          <Link to="/how-it-works" onClick={closeMenu}>
            How it works
          </Link>
          <Link to="/psychologists" onClick={closeMenu}>
            Psychologists
          </Link>
          <Link to="/safety" onClick={closeMenu}>
            Safety
          </Link>
          <Link to="/resources" onClick={closeMenu}>
            Resources
          </Link>
          <Link to="/about" onClick={closeMenu}>
            About
          </Link>
          <Link to="/faq" onClick={closeMenu}>
            FAQ
          </Link>
          <Link className="nav-login" to="/login" onClick={closeMenu}>
            Sign in
          </Link>
          <Link
            className="button button-small"
            to="/psychologists"
            onClick={closeMenu}
          >
            Find a Psychologist <ArrowRight size={15} />
          </Link>
        </nav>
      </header>

      <main>
        <section className="hero section-grid">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="eyebrow-dot" /> Professional care · room for
              faith
            </p>
            <h1>
              Care that honors the whole of you.{" "}
              <span className="hero-title-gradient">
                A new perspective on mental health.
              </span>
            </h1>
            <p className="hero-lede">
              Find thoughtful, private support from a verified Christian
              psychologist—professionally grounded, compassionate and shaped
              around your values.
            </p>
            <div className="hero-actions" id="start">
              <Link
                className="button"
                to="/psychologists"
                aria-label="Find your support"
              >
                Find a Psychologist <ArrowRight size={17} />
              </Link>
              <Link
                className="button button-outline"
                to="/join-as-psychologist"
              >
                Join as a Psychologist
              </Link>
            </div>
            <p className="microcopy">
              <ShieldCheck size={15} /> Verified professionals · Private by
              design · Your pace
            </p>
          </div>
          <div
            className="hero-art"
            aria-label="Abstract perspectives logo illustration"
            role="img"
          >
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-sun" />
            <div className="art-card art-card-top">
              <span className="mini-avatar" style={{ background: story.color }}>
                {story.initials}
              </span>
              <span>
                <b>Verified care</b>
                <small>Human connection first</small>
              </span>
              <Check size={16} />
            </div>
            <div className="art-card art-card-bottom">
              <Quote size={18} />
              <span>
                There is room for
                <br />
                <b>where you are today.</b>
              </span>
            </div>
            <span className="art-caption">your story, held with care</span>
          </div>
        </section>

        <section className="trust-strip">
          <p>
            <ShieldCheck size={17} /> Reviewed professionals
          </p>
          <p>
            <HeartHandshake size={17} /> Care without judgment
          </p>
          <p>
            <LockIcon /> Privacy at the center
          </p>
        </section>

        <section className="section intro-section" id="how-it-works">
          <div className="section-intro">
            <p className="eyebrow">How PERSPECTIVES works</p>
            <h2>
              Support can begin <em>simply.</em>
            </h2>
            <p>
              You do not need perfect words or a polished story. Start with what
              feels possible, then take the next step with a professional who
              understands the importance of being heard.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((step) => (
              <article className="step" key={step.number}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="journeys section">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Two ways to begin</p>
              <h2>
                Designed around <em>your journey.</em>
              </h2>
            </div>
            <span className="section-aside">Clear steps. Human support.</span>
          </div>
          <div className="journey-grid">
            <article className="journey-card journey-patient">
              <div className="journey-icon">
                <Users />
              </div>
              <p className="eyebrow">For patients</p>
              <h3>Find support that feels like a fit.</h3>
              <p>
                Explore verified psychologists, share your preferences and
                request a session when you are ready.
              </p>
              <a className="text-link" href="#psychologists">
                Explore the experience <ArrowRight size={16} />
              </a>
            </article>
            <article className="journey-card journey-pro">
              <div className="journey-icon">
                <Stethoscope />
              </div>
              <p className="eyebrow">For psychologists</p>
              <h3>Grow a practice grounded in care.</h3>
              <p>
                Create a professional profile, manage availability and connect
                with people seeking thoughtful support.
              </p>
              <a className="text-link" href="#for-psychologists">
                Learn about joining <ArrowRight size={16} />
              </a>
            </article>
          </div>
        </section>

        <section className="faith-section" id="faith">
          <div className="faith-visual">
            <img
              src="/peace-of-mind.svg"
              alt="A peaceful moonlit lake with still water, distant hills and a quiet plant silhouette"
            />
            <span className="visual-caption">A quiet place to breathe</span>
          </div>
          <div className="faith-copy">
            <p className="eyebrow eyebrow-light">Faith, on your terms</p>
            <h2>
              Your faith can be part of care—<em>when you want it.</em>
            </h2>
            <p>
              Christian faith is welcomed as an optional, respectful part of the
              experience. You decide whether prayer, Scripture or faith-based
              reflection belongs in your support journey.
            </p>
            <a className="button button-light" href="#resources">
              Explore faith resources <ArrowRight size={17} />
            </a>
          </div>
          <div className="faith-panel">
            <Sparkles size={22} />
            <h3>Professional care comes first.</h3>
            <p>
              Faith resources can complement support, but never replace
              psychological, medical or emergency care.
            </p>
          </div>
        </section>

        <section
          className="section psychologists-section"
          id="psychologists"
          data-testid="match"
        >
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">Meet the community</p>
              <h2>
                Verified people. <em>Real presence.</em>
              </h2>
            </div>
            <a className="text-link" href="#start">
              View all psychologists <ArrowRight size={16} />
            </a>
          </div>
          <div className="notice">
            <ShieldCheck size={20} />
            <span>
              <strong>Development preview:</strong> These cards use mock profile
              data for interface testing. They are not real professionals and
              cannot be booked.
            </span>
          </div>
          <div className="psychologist-grid">
            {psychologists.map((person) => (
              <article className="psychologist-card" key={person.name}>
                <div
                  className="profile-avatar"
                  style={{ background: person.color }}
                >
                  {person.initials}
                </div>
                <div>
                  <span className="verified">
                    <ShieldCheck size={14} /> Mock profile · development only
                  </span>
                  <h3>{person.name}</h3>
                  <p>{person.specialty}</p>
                  <small>{person.detail}</small>
                </div>
                <button
                  className="icon-button"
                  aria-label={`View ${person.name} profile`}
                >
                  <ArrowRight size={17} />
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="trust-section">
          <div>
            <p className="eyebrow eyebrow-light">
              Trust is built into the foundation
            </p>
            <h2>A calmer way to look for care.</h2>
            <p>
              Privacy, verification and clear expectations are part of every
              step—from your first visit to your ongoing conversations.
            </p>
          </div>
          <div className="trust-points">
            <span>
              <Check /> Identity and credential review
            </span>
            <span>
              <Check /> Sensitive information protected
            </span>
            <span>
              <Check /> Clear safety boundaries
            </span>
            <span>
              <Check /> Patient choice respected
            </span>
          </div>
        </section>

        <section className="section stories-section">
          <div className="section-heading-row">
            <div>
              <p className="eyebrow">A wider perspective</p>
              <h2>
                Stories from the <em>community.</em>
              </h2>
            </div>
            <div className="carousel-controls">
              <button
                className="icon-button"
                aria-label="Previous story"
                onClick={() =>
                  setStoryIndex(
                    (storyIndex - 1 + stories.length) % stories.length,
                  )
                }
              >
                <ArrowRight className="arrow-left" size={18} />
              </button>
              <button
                className="icon-button"
                aria-label="Next story"
                onClick={() => setStoryIndex((storyIndex + 1) % stories.length)}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="notice">
            <Sparkles size={18} />
            <span>
              <strong>Development mock stories:</strong> Names and quotes are
              placeholders for interface testing.
            </span>
          </div>
          <article className="story-card">
            <div className="story-person">
              <div
                className="profile-avatar"
                style={{ background: story.color }}
              >
                {story.initials}
              </div>
              <div>
                <h3>{story.name}</h3>
                <p>{story.role}</p>
              </div>
            </div>
            <blockquote>“{story.quote}”</blockquote>
            <div className="story-dots" aria-label="Story navigation">
              {stories.map((item, index) => (
                <button
                  key={item.name}
                  aria-label={`Go to story ${index + 1}`}
                  className={index === storyIndex ? "active" : ""}
                  onClick={() => setStoryIndex(index)}
                />
              ))}
            </div>
          </article>
        </section>

        <section className="cta-section" id="for-psychologists">
          <div>
            <p className="eyebrow eyebrow-light">Your next perspective</p>
            <h2>Care has room to grow.</h2>
            <p>
              Whether you are seeking support or offering it, PERSPECTIVES is
              built around meaningful human connection.
            </p>
          </div>
          <div className="cta-actions">
            <div
              className="role-tabs"
              role="tablist"
              aria-label="Choose your path"
            >
              <button
                role="tab"
                aria-selected={role === "patient"}
                className={role === "patient" ? "active" : ""}
                onClick={() => setRole("patient")}
              >
                I’m seeking support
              </button>
              <button
                role="tab"
                aria-selected={role === "psychologist"}
                className={role === "psychologist" ? "active" : ""}
                onClick={() => setRole("psychologist")}
              >
                I’m a psychologist
              </button>
            </div>
            <a
              className="button button-light"
              href={
                role === "patient" ? "#psychologists" : "#for-psychologists"
              }
            >
              {role === "patient"
                ? "Find a Psychologist"
                : "Join as a Psychologist"}{" "}
              <ArrowRight size={17} />
            </a>
          </div>
        </section>

        <section className="safety-section section" id="safety">
          <div className="safety-icon">
            <HeartHandshake size={25} />
          </div>
          <div>
            <p className="eyebrow">Please know</p>
            <h2>
              PERSPECTIVES is <em>not</em> an emergency service.
            </h2>
            <p>
              If you or someone else is in immediate danger, experiencing a
              medical emergency or at risk of harm, contact local emergency
              services, a crisis service or a trusted person immediately.
            </p>
          </div>
          <a className="text-link" href="#crisis-resources">
            Crisis resources <ArrowRight size={16} />
          </a>
        </section>

        <section className="section faq-section" id="faq">
          <div className="section-intro">
            <p className="eyebrow">Questions, answered</p>
            <h2>
              Clarity before <em>you begin.</em>
            </h2>
          </div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => {
              const open = activeFaq === index;
              return (
                <div className="faq-item" key={question}>
                  <button
                    className="faq-question"
                    aria-expanded={open}
                    onClick={() => setActiveFaq(open ? null : index)}
                  >
                    {question}
                    <ChevronDown className={open ? "is-open" : ""} size={19} />
                  </button>
                  <p
                    data-testid={
                      index === 2 ? "faq-emergency-answer" : undefined
                    }
                    hidden={!open}
                  >
                    {answer}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <a className="brand" href="#top">
            <Logo />
          </a>
          <p>Professional care, with room for faith.</p>
        </div>
        <div className="footer-links">
          <a href="#privacy">Privacy</a>
          <a href="#safety">Safety</a>
          <a href="#resources">Resources</a>
          <a href="#contact">Contact</a>
        </div>
        <p className="footer-note">
          © 2026 PERSPECTIVES. Not an emergency service.
        </p>
      </footer>
    </div>
  );
}

function LockIcon() {
  return <ShieldCheck size={17} />;
}

function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <header className="site-header public-header">
      <Link to="/" className="brand" onClick={closeMenu}>
        <Logo />
      </Link>
      <button
        className="menu-toggle"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X /> : <Menu />}
      </button>
      <nav
        className={menuOpen ? "main-nav is-open" : "main-nav"}
        aria-label="Main navigation"
      >
        <Link to="/about" onClick={closeMenu}>
          About
        </Link>
        <Link to="/how-it-works" onClick={closeMenu}>
          How it works
        </Link>
        <Link to="/psychologists" onClick={closeMenu}>
          Psychologists
        </Link>
        <Link to="/resources" onClick={closeMenu}>
          Resources
        </Link>
        <Link to="/safety" onClick={closeMenu}>
          Safety
        </Link>
        <Link className="nav-login" to="/login" onClick={closeMenu}>
          Sign in
        </Link>
        <Link
          className="button button-small"
          to="/register"
          onClick={closeMenu}
        >
          Get started <ArrowRight size={15} />
        </Link>
      </nav>
    </header>
  );
}

function PublicFooter() {
  return (
    <footer className="site-footer public-footer">
      <div>
        <Link className="brand" to="/">
          <Logo />
        </Link>
        <p>Professional care, with room for faith.</p>
      </div>
      <div className="footer-links">
        <Link to="/about">About</Link>
        <Link to="/privacy">Privacy</Link>
        <Link to="/safety">Safety</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <p className="footer-note">
        © 2026 PERSPECTIVES. Not an emergency service.
      </p>
    </footer>
  );
}

type PageContent = {
  eyebrow: string;
  title: string;
  description: string;
  action?: string;
};

const pageContent: Record<string, PageContent> = {
  about: {
    eyebrow: "About PERSPECTIVES",
    title: "Care with context.",
    description:
      "PERSPECTIVES helps people find professional mental-health support from people who understand that faith, identity and lived experience can be part of the conversation.",
  },
  "how-it-works": {
    eyebrow: "How it works",
    title: "A clear first step.",
    description:
      "From sharing what you need to finding a professional fit, PERSPECTIVES keeps the path understandable, private and centered on your choices.",
  },
  resources: {
    eyebrow: "Resources",
    title: "Resources for your next step.",
    description:
      "Explore practical mental-health education, faith-sensitive reflections and safety information designed to support—not replace—professional care.",
  },
  psychologists: {
    eyebrow: "Psychologists",
    title: "Find a thoughtful professional fit.",
    description:
      "Explore how verified Christian psychologists will share their specialties, approach and availability. Profiles shown here are for development only.",
  },
  safety: {
    eyebrow: "Safety & boundaries",
    title: "Care with clear boundaries.",
    description:
      "Your safety matters. PERSPECTIVES is designed for professional support and is not an emergency service.",
  },
  contact: {
    eyebrow: "Contact",
    title: "We’re here to listen.",
    description:
      "Questions about the platform, accessibility or professional verification? Send a note to the PERSPECTIVES team.",
  },
  login: {
    eyebrow: "Welcome back",
    title: "Continue your perspective.",
    description:
      "Sign in to your PERSPECTIVES account. Authentication is being connected in the next product phase.",
  },
  register: {
    eyebrow: "Start gently",
    title: "Create your perspective.",
    description:
      "This development form previews the patient registration experience. It does not submit or create a real account yet.",
  },
  "join-as-psychologist": {
    eyebrow: "For psychologists",
    title: "Join your practice with care.",
    description:
      "Share your professional story in steps. Every application is reviewed before a profile can appear publicly.",
  },
  faq: {
    eyebrow: "Questions, answered",
    title: "Clarity before you begin.",
    description:
      "Learn how professional care, optional faith integration and safety boundaries come together on PERSPECTIVES.",
  },
};

function StaticPage({ page }: { page: string }) {
  const content = pageContent[page];
  const isForm =
    page === "login" || page === "register" || page === "join-as-psychologist";
  return (
    <div className="site-shell page-shell">
      <PublicHeader />
      <main className="page-main">
        <section className="page-hero">
          <p className="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          {page === "safety" && (
            <div className="notice notice-coral">
              <HeartHandshake size={20} />
              <span>
                <strong>Immediate danger?</strong> Contact your local emergency
                service, crisis service or a trusted person now.
              </span>
            </div>
          )}
        </section>
        {page === "psychologists" ? (
          <PsychologistsPage />
        ) : page === "join-as-psychologist" ? (
          <PsychologistOnboardingPage />
        ) : isForm ? (
          <PreviewForm page={page} />
        ) : (
          <ContentBlocks page={page} />
        )}
      </main>
      <PublicFooter />
    </div>
  );
}

const psychologistWizardSteps = [
  "Account creation",
  "Personal information",
  "Professional information",
  "Qualifications",
  "Specializations",
  "Registration/license",
  "Experience",
  "Languages",
  "Faith compatibility",
  "Verification documents",
  "Review application",
  "Submit application",
];

type PsychologistWizardData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  professionalTitle: string;
  qualifications: string;
  institution: string;
  degree: string;
  specializations: string;
  yearsOfExperience: string;
  languages: string;
  biography: string;
  licenseNumber: string;
  licensingOrganization: string;
  sessionTypes: string;
  pricing: string;
  availabilityPreferences: string;
  faithCompatibility: string;
  faithIntegrationApproach: string;
  verificationDocuments: string;
  termsConsent: boolean;
  privacyConsent: boolean;
  verificationAgreement: boolean;
};

const initialPsychologistWizardData: PsychologistWizardData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  country: "",
  professionalTitle: "",
  qualifications: "",
  institution: "",
  degree: "",
  specializations: "",
  yearsOfExperience: "",
  languages: "",
  biography: "",
  licenseNumber: "",
  licensingOrganization: "",
  sessionTypes: "",
  pricing: "",
  availabilityPreferences: "",
  faithCompatibility: "",
  faithIntegrationApproach: "",
  verificationDocuments: "",
  termsConsent: false,
  privacyConsent: false,
  verificationAgreement: false,
};

function PsychologistOnboardingPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialPsychologistWizardData);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const update = (
    field: keyof PsychologistWizardData,
    value: string | boolean,
  ) => setData((current) => ({ ...current, [field]: value }));

  const input = (
    field: keyof PsychologistWizardData,
    label: string,
    type = "text",
  ) => (
    <label>
      {label}
      <input
        required
        type={type}
        value={String(data[field])}
        onChange={(event) => update(field, event.target.value)}
      />
    </label>
  );

  const textArea = (
    field: keyof PsychologistWizardData,
    label: string,
    hint?: string,
  ) => (
    <label className="wizard-full">
      {label}
      {hint && <small>{hint}</small>}
      <textarea
        required
        value={String(data[field])}
        onChange={(event) => update(field, event.target.value)}
      />
    </label>
  );

  const submitApplication = async () => {
    setSaving(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
      const authResponse = await fetch(
        `${apiUrl}/api/auth/register/psychologist`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword,
            professionalTitle: data.professionalTitle,
            country: data.country,
            licenseInformation: data.licenseNumber,
            specializations: data.specializations
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            yearsOfExperience: Number(data.yearsOfExperience),
            faithCompatibility: data.faithCompatibility,
            termsConsent: data.termsConsent,
            privacyConsent: data.privacyConsent,
            verificationAgreement: data.verificationAgreement,
          }),
        },
      );
      if (!authResponse.ok) {
        const body = (await authResponse.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(
          body?.message ?? "Please check your account details and try again.",
        );
      }

      const applicationResponse = await fetch(
        `${apiUrl}/api/psychologist/application`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            professionalTitle: data.professionalTitle,
            qualifications: [
              {
                qualification: data.qualifications,
                institution: data.institution,
                degree: data.degree,
              },
            ],
            specializations: data.specializations
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            yearsOfExperience: Number(data.yearsOfExperience),
            languages: data.languages
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            biography: data.biography,
            licenseNumber: data.licenseNumber,
            licensingOrganization: data.licensingOrganization,
            country: data.country,
            sessionTypes: data.sessionTypes
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            pricing: {
              currency: "USD",
              amount: Number(data.pricing) || 0,
              interval: "session",
            },
            availabilityPreferences: data.availabilityPreferences
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            faithCompatibility: data.faithCompatibility,
            faithIntegrationApproach: data.faithIntegrationApproach,
            verificationDocumentIds: [data.verificationDocuments],
          }),
        },
      );
      if (!applicationResponse.ok) {
        const body = (await applicationResponse.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(
          body?.message ??
            "Your account was created, but the application could not be submitted.",
        );
      }
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit application.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (submitted)
    return (
      <section className="form-card status-card" aria-live="polite">
        <span className="status-pill">PENDING</span>
        <h2>Your application is under review.</h2>
        <p>
          Thank you for sharing your professional information. An administrator
          will review your credentials and documents before any public profile
          is published.
        </p>
        <div className="notice notice-coral">
          <ShieldCheck size={18} />
          <span>
            Your account is not publicly verified yet. Verification is never
            automatic.
          </span>
        </div>
      </section>
    );

  return (
    <section className="onboarding-layout">
      <aside className="wizard-progress" aria-label="Application progress">
        <p className="eyebrow">Professional application</p>
        <h2>One thoughtful step at a time.</h2>
        <ol>
          {psychologistWizardSteps.map((label, index) => (
            <li
              className={
                index === step ? "active" : index < step ? "complete" : ""
              }
              key={label}
            >
              <span>{index < step ? "✓" : index + 1}</span>
              {label}
            </li>
          ))}
        </ol>
      </aside>
      <form
        noValidate
        className="form-card wizard-card"
        onSubmit={(event) => {
          event.preventDefault();
          if (step < 11) setStep((current) => current + 1);
          else void submitApplication();
        }}
      >
        <div className="wizard-heading">
          <p className="eyebrow">Step {step + 1} of 12</p>
          <h2>{psychologistWizardSteps[step]}</h2>
          <p>
            Required information is used for professional review and kept
            private.
          </p>
        </div>
        {step === 0 && (
          <div className="form-grid">
            {input("name", "Full name")}
            {input("email", "Professional email", "email")}
            {input("password", "Password", "password")}
            {input("confirmPassword", "Confirm password", "password")}
          </div>
        )}
        {step === 1 && (
          <div className="form-grid">
            <label>
              Country or region
              <select
                required
                value={data.country}
                onChange={(event) => update("country", event.target.value)}
              >
                <option value="">Select a country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="NG">Nigeria</option>
                <option value="GH">Ghana</option>
                <option value="KE">Kenya</option>
                <option value="ZA">South Africa</option>
                <option value="AU">Australia</option>
              </select>
            </label>
            {input("professionalTitle", "Professional title")}
          </div>
        )}
        {step === 2 && (
          <div className="form-grid">
            {input("professionalTitle", "Professional title")}
            {input("sessionTypes", "Session types", "text")}
            {textArea(
              "biography",
              "Professional biography",
              "A concise, patient-friendly introduction.",
            )}
          </div>
        )}
        {step === 3 && (
          <div className="form-grid">
            {input("qualifications", "Qualification")}
            {input("institution", "Institution")}
            {input("degree", "Degree")}
          </div>
        )}
        {step === 4 && (
          <div className="form-grid">
            {textArea(
              "specializations",
              "Specializations",
              "Separate multiple areas with commas.",
            )}
          </div>
        )}
        {step === 5 && (
          <div className="form-grid">
            {input("licenseNumber", "License or registration number")}
            {input("licensingOrganization", "Licensing organization")}
          </div>
        )}
        {step === 6 && (
          <div className="form-grid">
            {input("yearsOfExperience", "Years of experience", "number")}
            {input("pricing", "Session price in USD", "number")}
            {textArea(
              "availabilityPreferences",
              "Availability preferences",
              "Separate times or days with commas.",
            )}
          </div>
        )}
        {step === 7 && (
          <div className="form-grid">
            {textArea(
              "languages",
              "Languages",
              "Separate languages with commas.",
            )}
          </div>
        )}
        {step === 8 && (
          <div className="form-grid">
            <label>
              Christian faith compatibility
              <select
                required
                value={data.faithCompatibility}
                onChange={(event) =>
                  update("faithCompatibility", event.target.value)
                }
              >
                <option value="">Select an approach</option>
                <option value="open-to-discussion">Open to discussion</option>
                <option value="faith-integrated">Faith-integrated</option>
                <option value="prefer-not">Prefer not to include faith</option>
              </select>
            </label>
            {textArea(
              "faithIntegrationApproach",
              "Faith integration approach",
              "Explain how faith is optional and patient-led in your care.",
            )}
          </div>
        )}
        {step === 9 && (
          <div className="form-grid">
            {input("verificationDocuments", "Verification document reference")}
          </div>
        )}
        {step === 10 && (
          <div className="review-list">
            <p>
              <strong>{data.name || "Your name"}</strong> ·{" "}
              {data.professionalTitle || "Professional title"}
            </p>
            <p>{data.specializations || "Specializations not yet added"}</p>
            <p>{data.licenseNumber || "License details not yet added"}</p>
            <p>
              {data.verificationDocuments ||
                "Verification document not yet added"}
            </p>
            <div className="notice">
              <ShieldCheck size={18} />
              <span>
                Review your details carefully. Submission starts a manual
                review; it does not create a verified public profile.
              </span>
            </div>
          </div>
        )}
        {step === 11 && (
          <div className="form-grid">
            <label className="check-row">
              <input
                type="checkbox"
                required
                checked={data.termsConsent}
                onChange={(event) =>
                  update("termsConsent", event.target.checked)
                }
              />{" "}
              I agree to the terms of professional participation.
            </label>
            <label className="check-row">
              <input
                type="checkbox"
                required
                checked={data.privacyConsent}
                onChange={(event) =>
                  update("privacyConsent", event.target.checked)
                }
              />{" "}
              I consent to the privacy notice.
            </label>
            <label className="check-row">
              <input
                type="checkbox"
                required
                checked={data.verificationAgreement}
                onChange={(event) =>
                  update("verificationAgreement", event.target.checked)
                }
              />{" "}
              I confirm the information and documents are accurate.
            </label>
          </div>
        )}
        {error && (
          <p className="form-status" role="alert">
            {error}
          </p>
        )}
        <div className="wizard-actions">
          {step > 0 && (
            <button
              className="button button-ghost"
              type="button"
              onClick={() => setStep((current) => current - 1)}
            >
              Back
            </button>
          )}
          <button className="button" type="submit" disabled={saving}>
            {saving
              ? "Submitting…"
              : step === 11
                ? "Submit application"
                : "Next step"}
            <ArrowRight size={17} />
          </button>
        </div>
      </form>
    </section>
  );
}

function ContentBlocks({ page }: { page: string }) {
  if (page === "safety")
    return (
      <section className="page-grid">
        <article className="content-card">
          <ShieldCheck size={22} />
          <h2>Professional boundaries protect people.</h2>
          <p>
            PERSPECTIVES does not diagnose, prescribe, guarantee outcomes or
            present faith resources as a replacement for psychological, medical
            or emergency care.
          </p>
        </article>
        <article className="content-card">
          <HeartHandshake size={22} />
          <h2>Privacy is part of care.</h2>
          <p>
            We are building least-privilege access, clear consent choices and
            safeguards for sensitive mental-health information.
          </p>
        </article>
      </section>
    );
  if (page === "resources")
    return (
      <section className="page-grid">
        <article className="content-card">
          <Sparkles size={22} />
          <h2>Practical mental-health education</h2>
          <p>
            Development content will cover support preferences, preparing for a
            first appointment and questions to ask a professional.
          </p>
        </article>
        <article className="content-card">
          <HeartHandshake size={22} />
          <h2>Faith resources, thoughtfully offered</h2>
          <p>
            Scripture and Christian reflection may complement care when
            welcomed. They never replace professional treatment.
          </p>
        </article>
      </section>
    );
  if (page === "how-it-works")
    return (
      <section className="page-grid">
        <article className="content-card">
          <span className="step-number">01</span>
          <h2>Share what you need</h2>
          <p>
            Tell us what kind of support you are looking for, at your own pace.
          </p>
        </article>
        <article className="content-card">
          <span className="step-number">02</span>
          <h2>Review verified profiles</h2>
          <p>
            Compare specialties, availability and compatibility preferences.
          </p>
        </article>
        <article className="content-card">
          <span className="step-number">03</span>
          <h2>Choose your next step</h2>
          <p>Request an appointment when the fit feels right.</p>
        </article>
      </section>
    );
  if (page === "faq")
    return (
      <section className="page-grid">
        {faqs.map(([question, answer]) => (
          <article className="content-card" key={question}>
            <h2>{question}</h2>
            <p>{answer}</p>
          </article>
        ))}
      </section>
    );
  return (
    <section className="page-grid">
      <article className="content-card">
        <Users size={22} />
        <h2>A whole-person lens</h2>
        <p>
          Good care makes room for the person behind the concern, including
          culture, values and faith when relevant.
        </p>
      </article>
      <article className="content-card">
        <ShieldCheck size={22} />
        <h2>Built around trust</h2>
        <p>
          We are creating a professional, private platform with verification and
          clear expectations at every step.
        </p>
      </article>
    </section>
  );
}

function PsychologistsPage() {
  return (
    <section className="page-content">
      <div className="notice">
        <ShieldCheck size={20} />
        <span>
          <strong>Development preview:</strong> The profiles below are mock
          profile data for interface testing only. They are not real
          professionals and cannot be booked.
        </span>
      </div>
      <div className="page-grid">
        {["Sample profile A", "Sample profile B", "Sample profile C"].map(
          (name, index) => (
            <article className="content-card" key={name}>
              <div
                className="profile-avatar"
                style={{ background: ["#38BDF8", "#8B5CF6", "#14B8A6"][index] }}
              >
                P{index + 1}
              </div>
              <p className="eyebrow">Mock profile data</p>
              <h2>{name}</h2>
              <p>
                Specialization and availability will appear here after
                professional verification.
              </p>
              <span className="verified">
                <ShieldCheck size={14} /> Development only
              </span>
            </article>
          ),
        )}
      </div>
    </section>
  );
}

function PreviewForm({ page }: { page: string }) {
  const psychologist = page === "join-as-psychologist";
  return (
    <section className="form-card">
      <div className="notice">
        <Sparkles size={18} />
        <span>Development preview only. Nothing is submitted.</span>
      </div>
      <form onSubmit={(event) => event.preventDefault()}>
        <div className="form-grid">
          {psychologist ? (
            <label>
              Name
              <input required name="name" />
            </label>
          ) : page === "register" ? (
            <>
              <label>
                First name
                <input required name="firstName" />
              </label>
              <label>
                Last name
                <input required name="lastName" />
              </label>
            </>
          ) : null}
          <label>
            Email
            <input required type="email" name="email" />
          </label>
          <label>
            Password
            <input required type="password" name="password" />
          </label>
          {psychologist && (
            <>
              <label>
                Professional title
                <input name="title" />
              </label>
              <label>
                Country
                <input name="country" placeholder="US" />
              </label>
            </>
          )}
        </div>
        {page === "register" && (
          <label className="check-row">
            <input type="checkbox" required /> I agree to the development terms
            and privacy notice.
          </label>
        )}
        <button className="button" type="submit">
          {psychologist
            ? "Preview professional profile"
            : page === "login"
              ? "Continue to sign in"
              : "Preview registration"}
          <ArrowRight size={17} />
        </button>
      </form>
    </section>
  );
}

const intakeFields = [
  ["mainReason", "What brings you here?"],
  ["currentConcerns", "Current concerns"],
  ["emotionalChallenges", "Emotional challenges"],
  ["relationshipChallenges", "Relationship challenges"],
  ["workSchoolChallenges", "Work or school challenges"],
  ["griefLoss", "Grief or loss"],
  ["faithRelatedConcerns", "Faith-related concerns"],
  ["previousProfessionalSupport", "Previous professional support"],
  ["preferredSupportApproach", "Preferred support approach"],
  ["additionalInformation", "Anything else you would like to share"],
] as const;

function PatientNav() {
  return (
    <nav className="patient-nav" aria-label="Patient navigation">
      <Link to="/patient/dashboard">Dashboard</Link>
      <Link to="/patient/profile">Profile</Link>
      <Link to="/patient/onboarding">Onboarding</Link>
      <Link to="/patient/intake">Intake</Link>
      <Link to="/patient/settings">Settings</Link>
    </nav>
  );
}

function PatientShell({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell page-shell patient-shell">
      <PublicHeader />
      <main className="page-main">
        <PatientNav />
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}

function PatientPage({ page }: { page: string }) {
  if (page === "dashboard")
    return (
      <PatientShell>
        <section className="page-hero">
          <p className="eyebrow">Patient dashboard</p>
          <h1>Your care space.</h1>
          <p>
            A private place to prepare for support and choose your next step.
          </p>
        </section>
        <section className="dashboard-grid">
          <article className="content-card">
            <p className="eyebrow">Next step</p>
            <h2>Complete your intake</h2>
            <p>
              This is a non-diagnostic way to share what you want a professional
              to know.
            </p>
            <Link className="button" to="/patient/intake">
              Complete intake <ArrowRight size={17} />
            </Link>
          </article>
          <article className="content-card">
            <p className="eyebrow">Your choices</p>
            <h2>Set your preferences</h2>
            <p>
              Choose language, communication, session and faith preferences at
              your own pace.
            </p>
            <Link className="text-link" to="/patient/profile">
              Review profile <ArrowRight size={16} />
            </Link>
          </article>
        </section>
      </PatientShell>
    );

  if (page === "intake") return <PatientIntakePage />;

  const pageDetails: Record<
    string,
    { eyebrow: string; title: string; description: string }
  > = {
    profile: {
      eyebrow: "Your profile",
      title: "A profile shaped by you.",
      description:
        "Keep the details that help a future professional understand how to support you.",
    },
    onboarding: {
      eyebrow: "Welcome",
      title: "Start at your own pace.",
      description:
        "A few thoughtful choices can help make your first step feel clearer.",
    },
    settings: {
      eyebrow: "Privacy and preferences",
      title: "You stay in control.",
      description:
        "Manage communication, privacy and faith preferences as your needs change.",
    },
  };
  const details = pageDetails[page];
  return (
    <PatientShell>
      <section className="page-hero">
        <p className="eyebrow">{details.eyebrow}</p>
        <h1>{details.title}</h1>
        <p>{details.description}</p>
      </section>
      <section className="form-card">
        <form onSubmit={(event) => event.preventDefault()}>
          <div className="form-grid">
            <label>
              Preferred name
              <input name="preferredName" />
            </label>
            <label>
              Country
              <input name="country" placeholder="US" />
            </label>
            <label>
              Language
              <input name="language" placeholder="English" />
            </label>
            <label>
              Timezone
              <input name="timezone" placeholder="America/New_York" />
            </label>
            <label>
              Communication preferences
              <input
                name="communicationPreferences"
                placeholder="Email, messaging"
              />
            </label>
            <label>
              Session preferences
              <input name="sessionPreferences" placeholder="Online sessions" />
            </label>
            <label>
              Christian faith preferences
              <input
                name="faithPreferences"
                placeholder="Optional to discuss"
              />
            </label>
          </div>
          <button className="button" type="submit">
            Save development profile <Check size={17} />
          </button>
        </form>
      </section>
    </PatientShell>
  );
}

function PatientIntakePage() {
  const [status, setStatus] = useState<string | null>(null);
  return (
    <PatientShell>
      <section className="page-hero">
        <p className="eyebrow">Mental-health intake</p>
        <h1>Share what support could look like.</h1>
        <p>
          This is not a diagnostic questionnaire. You choose what you want to
          share, and a professional can use it as context for your first
          conversation.
        </p>
        <div className="notice notice-coral">
          <HeartHandshake size={20} />
          <span>
            <strong>Immediate danger?</strong> Contact your local emergency
            service, crisis service or a trusted person immediately.
            PERSPECTIVES is not an emergency service.
          </span>
        </div>
      </section>
      <section className="form-card">
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            setStatus("Saving securely…");
            const values = Object.fromEntries(
              new FormData(event.currentTarget),
            );
            try {
              const response = await fetch(
                `${import.meta.env.VITE_API_URL ?? "http://localhost:4000"}/api/patient/intake`,
                {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...values,
                    consentVersion: "2026-01",
                  }),
                },
              );
              if (!response.ok) throw new Error("Unable to save intake");
              setStatus(
                "Your intake was saved securely to your patient account.",
              );
            } catch {
              setStatus(
                "We could not save your intake. Please sign in and try again.",
              );
            }
          }}
        >
          <div className="form-grid intake-form">
            {intakeFields.map(([name, label]) => (
              <label key={name}>
                {label}
                <textarea name={name} rows={3} maxLength={5000} />
              </label>
            ))}
          </div>
          <label className="check-row">
            <input type="checkbox" required /> I understand this information is
            voluntary and is not used to generate a diagnosis.
          </label>
          <button className="button" type="submit">
            Save intake securely <ShieldCheck size={17} />
          </button>
          {status && (
            <p className="form-status" role="status">
              {status}
            </p>
          )}
        </form>
      </section>
    </PatientShell>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<StaticPage page="about" />} />
        <Route
          path="/how-it-works"
          element={<StaticPage page="how-it-works" />}
        />
        <Route
          path="/psychologists"
          element={<StaticPage page="psychologists" />}
        />
        <Route path="/resources" element={<StaticPage page="resources" />} />
        <Route path="/safety" element={<StaticPage page="safety" />} />
        <Route path="/contact" element={<StaticPage page="contact" />} />
        <Route path="/faq" element={<StaticPage page="faq" />} />
        <Route path="/login" element={<StaticPage page="login" />} />
        <Route path="/register" element={<StaticPage page="register" />} />
        <Route
          path="/join-as-psychologist"
          element={<StaticPage page="join-as-psychologist" />}
        />
        <Route
          path="/patient/dashboard"
          element={<PatientPage page="dashboard" />}
        />
        <Route
          path="/patient/profile"
          element={<PatientPage page="profile" />}
        />
        <Route
          path="/patient/onboarding"
          element={<PatientPage page="onboarding" />}
        />
        <Route path="/patient/intake" element={<PatientPage page="intake" />} />
        <Route
          path="/patient/settings"
          element={<PatientPage page="settings" />}
        />
        <Route path="*" element={<StaticPage page="about" />} />
      </Routes>
    </BrowserRouter>
  );
}
