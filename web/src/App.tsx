import { Faq } from './components/Faq';
import {
  ChecklistSection,
  Footer,
  Header,
  Hero,
  HowItWorks,
  IndependentPerspective,
  PilotCTA,
  ProblemSection,
  SafetySection,
} from './components/Sections';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div id="top" />
      <Header />
      <main id="main">
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <ChecklistSection />
        <IndependentPerspective />
        <SafetySection />
        <PilotCTA />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
