// Main landing page: composes all sections, smooth anchor links, preloads chime.
import { useEffect } from "react";
import HeroSection from "../components/HeroSection";
import VERACompanion from "../components/VERACompanion";
import GroundingExercise from "../components/GroundingExercise";
import BreathingOrb from "../components/BreathingOrb";
import SwayingOrbit from "../components/SwayingOrbit";
import SomaticMismatchPattern from "../components/SomaticMismatchPattern";
import FeaturesSection from "../components/FeaturesSection";
import MethodologySection from "../components/MethodologySection";
import ExercisesSection from "../components/ExercisesSection";
import PricingSection from "../components/PricingSection";
import HeartSection from "../components/HeartSection";
import LivingUniverse from "../components/LivingUniverse";
import VERAFooter from "../components/VERAFooter";
import VERANav from "../components/VERANav";
import TestBanner from "../components/TestBanner";
import VERAAuthModal from "../components/VERAAuthModal";

export default function Home() {
  useEffect(() => {
    const audio = new Audio("/vera-chime.mp3");
    audio.preload = "auto";
  }, []);

  return (
    <>
      <TestBanner />
      <VERAAuthModal />
      <VERANav />
      <main>
        <HeroSection />
        <section id="chat">
          <VERACompanion />
        </section>
        <section id="grounding">
          <GroundingExercise />
        </section>
        <section id="breathing">
          <BreathingOrb />
        </section>
        <section id="sway">
          <SwayingOrbit />
        </section>
        <section id="mismatch">
          <SomaticMismatchPattern />
        </section>
        <section id="features">
          <FeaturesSection />
        </section>
        <section id="methodology">
          <MethodologySection />
        </section>
        <section id="exercises">
          <ExercisesSection />
        </section>
        <section id="pricing">
          <PricingSection />
        </section>
        <section id="heart">
          <HeartSection />
        </section>
      </main>
      <LivingUniverse />
      <VERAFooter />
    </>
  );
}
