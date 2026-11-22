// Centralised studio & editorial photography for Nexora Creative Solutions Ltd.
// To swap any photo with your own shoot later, simply replace the matching
// .webp file inside src/assets/photos/.

import heroWorkshop from '../assets/photos/hero-workshop.webp';
import studioInterior from '../assets/photos/studio-interior.webp';
import teamCollaboration from '../assets/photos/team-collaboration.webp';
import nairobiEngineer from '../assets/photos/nairobi-engineer.webp';
import nairobiDeveloper from '../assets/photos/nairobi-developer.webp';
import architectureReview from '../assets/photos/architecture-review.webp';
import mobileEngineering from '../assets/photos/mobile-engineering.webp';
import pairProgramming from '../assets/photos/pair-programming.webp';
import boardroomStrategy from '../assets/photos/boardroom-strategy.webp';
import teamStandup from '../assets/photos/team-standup.webp';
import workstationCode from '../assets/photos/workstation-code.webp';

export const PHOTOS = {
  homeHero: heroWorkshop,
  homeWhyNexora: teamCollaboration,

  aboutStoryLeft: nairobiEngineer,
  aboutStoryRight: studioInterior,

  servicesWhyPartner: architectureReview,
  serviceDetailsHero: teamCollaboration,
  serviceDetailsDiscovery: mobileEngineering,
  serviceDetailsEngineering: pairProgramming,

  projectsGithubFallback: workstationCode,

  blogVisualLeft: nairobiEngineer,
  blogVisualRight: architectureReview,

  careersHero: boardroomStrategy,
  careersCultureMeeting: teamStandup,
  careersCultureDesign: mobileEngineering,
  careersCultureDesk: nairobiDeveloper,
  careersCultureStudio: studioInterior,
};
