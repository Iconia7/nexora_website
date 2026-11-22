import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { fetchCompanyProfile } from '../api';
import {
  COMPANY as FALLBACK_COMPANY,
  formatAddress as defaultFormatAddress,
} from '../config/company';

const CompanyContext = createContext({
  company: FALLBACK_COMPANY,
  formatAddress: defaultFormatAddress,
  organizationSchema: () => ({}),
  loaded: false,
});

const buildPhoneHref = (phone) => {
  const digits = String(phone || '').replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : FALLBACK_COMPANY.phoneHref;
};

const mergeCompany = (remote) => {
  if (!remote || typeof remote !== 'object' || Object.keys(remote).length === 0) {
    return FALLBACK_COMPANY;
  }

  const phone = remote.phone || FALLBACK_COMPANY.phone;

  return {
    ...FALLBACK_COMPANY,
    brandName: remote.brand_name || FALLBACK_COMPANY.brandName,
    shortName: remote.short_name || FALLBACK_COMPANY.shortName,
    legalName: remote.legal_name || FALLBACK_COMPANY.legalName,
    legalForm: remote.legal_form || FALLBACK_COMPANY.legalForm,
    jurisdiction: remote.jurisdiction || FALLBACK_COMPANY.jurisdiction,
    registrationNumber: remote.registration_number || '',
    kraPin: remote.kra_pin || '',
    incorporationStatement:
      remote.incorporation_statement || FALLBACK_COMPANY.incorporationStatement,
    tagline: remote.tagline || FALLBACK_COMPANY.tagline,
    description: remote.description || FALLBACK_COMPANY.description,
    mission:
      remote.mission ||
      'To help organisations grow by designing and engineering secure, scalable and beautifully crafted digital products.',
    vision:
      remote.vision ||
      'To be East Africa’s most trusted technology partner for businesses building the digital economy.',
    siteUrl: (remote.site_url || FALLBACK_COMPANY.siteUrl).replace(/\/$/, ''),
    email: remote.email || FALLBACK_COMPANY.email,
    phone,
    phoneHref: buildPhoneHref(phone),
    whatsapp: remote.whatsapp || FALLBACK_COMPANY.whatsapp,
    hours: remote.hours || FALLBACK_COMPANY.hours,
    registeredOffice: {
      line1: remote.office_line1 || FALLBACK_COMPANY.registeredOffice.line1,
      line2: remote.office_line2 ?? FALLBACK_COMPANY.registeredOffice.line2,
      postal: remote.office_postal ?? FALLBACK_COMPANY.registeredOffice.postal,
      country: remote.office_country || FALLBACK_COMPANY.registeredOffice.country,
    },
    directors:
      Array.isArray(remote.directors) && remote.directors.length > 0
        ? remote.directors.map((d) => ({ name: d.name, role: d.role }))
        : FALLBACK_COMPANY.directors,
    socials: {
      facebook: remote.facebook || FALLBACK_COMPANY.socials.facebook,
      x: remote.twitter || FALLBACK_COMPANY.socials.x,
      instagram: remote.instagram || FALLBACK_COMPANY.socials.instagram,
      linkedin: remote.linkedin || FALLBACK_COMPANY.socials.linkedin,
    },
  };
};

export const CompanyProvider = ({ children }) => {
  const [company, setCompany] = useState(FALLBACK_COMPANY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetchCompanyProfile()
      .then((res) => {
        if (!active) return;
        setCompany(mergeCompany(res.data));
        setLoaded(true);
      })
      .catch(() => {
        if (!active) return;
        setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => {
    const formatAddress = (o = company.registeredOffice) =>
      [o?.line1, o?.line2, o?.postal, o?.country].filter(Boolean).join(', ');

    const organizationSchema = () => ({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      '@id': `${company.siteUrl}/#organization`,
      name: company.brandName,
      legalName: company.legalName,
      alternateName: ['Nexora', 'Nexora Creatives', 'NCS', company.legalName],
      url: `${company.siteUrl}/`,
      logo: `${company.siteUrl}/ncs.png`,
      image: `${company.siteUrl}/ncs.png`,
      description: company.description,
      telephone: company.phone,
      email: company.email,
      priceRange: '$$',
      founder: company.directors[0]
        ? { '@type': 'Person', name: company.directors[0].name }
        : undefined,
      address: {
        '@type': 'PostalAddress',
        streetAddress: company.registeredOffice.line1,
        addressLocality: company.registeredOffice.line1,
        addressRegion: company.registeredOffice.line2,
        postalCode: company.registeredOffice.postal || undefined,
        addressCountry: 'KE',
      },
      sameAs: Object.values(company.socials).filter(Boolean),
    });

    return { company, formatAddress, organizationSchema, loaded };
  }, [company, loaded]);

  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCompany = () => useContext(CompanyContext);
