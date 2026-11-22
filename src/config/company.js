// ---------------------------------------------------------------------------
// Single source of truth for company / legal details.
// Update values here and they propagate across the Navbar, Footer, About,
// Contact, Terms, Privacy Policy and structured data (SEO).
// ---------------------------------------------------------------------------

export const COMPANY = {
  brandName: 'Nexora Creative Solutions',
  shortName: 'Nexora',
  legalName: 'Nexora Creative Solutions Ltd',
  legalForm: 'Private Limited Company',
  jurisdiction: 'Republic of Kenya',
  incorporationStatement:
    'Nexora Creative Solutions Ltd is a private limited company incorporated in the Republic of Kenya under the Companies Act, 2015.',
  tagline: 'Digital products engineered for ambitious businesses.',
  description:
    'Nexora Creative Solutions Ltd is a Kenyan technology company delivering custom software, web and mobile applications, UI/UX design and digital brand experiences.',

  siteUrl: 'https://nexoracreatives.co.ke',
  email: 'info@nexoracreatives.co.ke',
  phone: '+254 115 332 870',
  phoneHref: 'tel:+254115332870',
  whatsapp: '254115332870',
  hours: 'Mon – Fri, 8:00 AM – 5:00 PM (EAT)',

  // TODO: confirm the exact registered office (building, street, P.O. Box)
  registeredOffice: {
    line1: 'Thika',
    line2: 'Kiambu County',
    postal: '00510',
    country: 'Kenya',
  },

  // TODO: confirm directors / leadership to be listed publicly
  directors: [
    { name: 'Newton Mwangi', role: 'Founder & Managing Director' },
  ],

  socials: {
    facebook: 'https://facebook.com/profile.php?id=100083433616499',
    x: 'https://x.com/newtondesigns_',
    instagram: 'https://instagram.com/nexoracreatives_ke',
    linkedin: 'https://linkedin.com/in/newton-mwangi-9732142a1',
  },
};

export const formatAddress = (o = COMPANY.registeredOffice) =>
  [o.line1, o.line2, o.postal, o.country].filter(Boolean).join(', ');

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': `${COMPANY.siteUrl}/#organization`,
  name: COMPANY.brandName,
  legalName: COMPANY.legalName,
  alternateName: ['Nexora', 'Nexora Creatives', 'NCS', COMPANY.legalName],
  url: `${COMPANY.siteUrl}/`,
  logo: `${COMPANY.siteUrl}/ncs.png`,
  image: `${COMPANY.siteUrl}/ncs.png`,
  description: COMPANY.description,
  telephone: COMPANY.phone,
  email: COMPANY.email,
  priceRange: '$$',
  founder: COMPANY.directors[0] ? { '@type': 'Person', name: COMPANY.directors[0].name } : undefined,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Thika',
    addressRegion: 'Kiambu',
    addressCountry: 'KE',
  },
  sameAs: Object.values(COMPANY.socials),
});
