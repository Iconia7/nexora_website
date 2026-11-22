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
  '@type': ['Organization', 'ProfessionalService'],
  '@id': `${COMPANY.siteUrl}/#organization`,
  name: COMPANY.legalName,
  legalName: COMPANY.legalName,
  alternateName: [COMPANY.brandName, 'Nexora', 'Nexora Creatives', 'NCS'],
  url: `${COMPANY.siteUrl}/`,
  logo: {
    '@type': 'ImageObject',
    url: `${COMPANY.siteUrl}/icon-512.png`,
    width: 512,
    height: 512,
  },
  image: `${COMPANY.siteUrl}/og-image.png`,
  description: COMPANY.description,
  slogan: COMPANY.tagline,
  telephone: COMPANY.phone,
  email: COMPANY.email,
  priceRange: 'KES 15,000 - KES 160,000+',
  founder: COMPANY.directors[0]
    ? { '@type': 'Person', name: COMPANY.directors[0].name, jobTitle: COMPANY.directors[0].role }
    : undefined,
  address: {
    '@type': 'PostalAddress',
    addressLocality: COMPANY.registeredOffice.line1,
    addressRegion: COMPANY.registeredOffice.line2,
    addressCountry: 'KE',
  },
  areaServed: ['Thika', 'Nairobi', 'Kiambu County', 'Kenya', 'East Africa'],
  knowsAbout: [
    'Custom Software Development',
    'Website Development',
    'Mobile App Development',
    'Flutter',
    'React',
    'Django',
    'Safaricom M-Pesa Daraja API Integration',
    'UI/UX Design',
    'Corporate Brand Identity',
    'Technical SEO & AEO',
  ],
  sameAs: Object.values(COMPANY.socials),
});
