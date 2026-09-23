import { EQASchemeDefinition } from '../types';

export const STANDARD_EQA_SCHEMES: EQASchemeDefinition[] = [
  {
    id: 'scheme-riqas',
    code: 'RIQAS',
    shortName: 'RIQAS',
    fullName: 'Randox International Quality Assessment Scheme',
    provider: 'Randox Laboratories Ltd.',
    country: 'United Kingdom',
    category: 'Global / International',
    description: 'Multidisciplinary EQA system utilized by over 50,000 laboratories worldwide. Fortnightly and monthly survey cycles across clinical chemistry, hematology, immunology, and POCT.',
    portalUrl: 'https://riqas.net',
    accreditation: 'ISO/IEC 17043:2023 (UKAS)',
    badgeBg: 'bg-[#1E40AF]',
    badgeText: 'text-white'
  },
  {
    id: 'scheme-cap',
    code: 'CAP',
    shortName: 'CAP',
    fullName: 'College of American Pathologists Proficiency Testing',
    provider: 'College of American Pathologists (CAP)',
    country: 'United States',
    category: 'Global / International',
    description: 'Gold-standard proficiency testing programs covering clinical chemistry, hematology, surgical pathology, molecular microbiology, and genomics.',
    portalUrl: 'https://www.cap.org',
    accreditation: 'ISO/IEC 17043 / CLIA Recognized',
    badgeBg: 'bg-[#0284C7]',
    badgeText: 'text-white'
  },
  {
    id: 'scheme-ukneqas',
    code: 'UKNEQAS',
    shortName: 'UK NEQAS',
    fullName: 'United Kingdom National External Quality Assessment Service',
    provider: 'UK NEQAS Consortium',
    country: 'United Kingdom',
    category: 'Global / International',
    description: 'Specialized diagnostic assessment covering blood transfusion, hemostasis, histopathology, molecular diagnostics, and clinical chemistry.',
    portalUrl: 'https://ukneqas.org.uk',
    accreditation: 'ISO/IEC 17043 (UKAS Accredited)',
    badgeBg: 'bg-[#3B82F6]',
    badgeText: 'text-white'
  },
  {
    id: 'scheme-eqas',
    code: 'EQAS',
    shortName: 'Bio-Rad EQAS',
    fullName: 'Bio-Rad External Quality Assurance Services',
    provider: 'Bio-Rad Laboratories Inc.',
    country: 'United States',
    category: 'Global / International',
    description: 'Monthly proficiency cycles with extensive peer group comparisons via QCNet for immunoassays, clinical chemistry, hemoglobin A1c, and therapeutic drugs.',
    portalUrl: 'https://www.qcnet.com',
    accreditation: 'ISO/IEC 17043:2023 (A2LA)',
    badgeBg: 'bg-[#0F172A]',
    badgeText: 'text-white'
  },
  {
    id: 'scheme-rcpa',
    code: 'RCPA',
    shortName: 'RCPAQAP',
    fullName: 'Royal College of Pathologists of Australasia QAP',
    provider: 'RCPA Quality Assurance Programs Pty Ltd',
    country: 'Australia / Asia-Pacific',
    category: 'Global / International',
    description: 'Comprehensive pathology quality assurance programs recognized across the Asia-Pacific region for hematology, chemical pathology, and biosecurity.',
    portalUrl: 'https://rcpaqap.com.au',
    accreditation: 'ISO/IEC 17043 (NATA Accredited)',
    badgeBg: 'bg-[#0D9488]',
    badgeText: 'text-white'
  },
  {
    id: 'scheme-dmsc-blqs',
    code: 'DMSC_BLQS',
    shortName: 'DMSc / BLQS',
    fullName: 'Bureau of Laboratory Quality Standards EQA (สำนักมาตรฐานห้องปฏิบัติการ กรมวิทย์ฯ)',
    provider: 'Department of Medical Sciences, Ministry of Public Health Thailand',
    country: 'Thailand',
    category: 'National / Regional',
    description: 'National External Quality Assessment for Thai clinical laboratories (EQAC, EQAH, EQAI, EQAM, EQAT). Mandatory compliance for hospital accreditation (HA/LA) and ISO 15189.',
    portalUrl: 'https://blqs.dmsc.moph.go.th',
    accreditation: 'ISO/IEC 17043 (BLQS Certified)',
    badgeBg: 'bg-[#059669]',
    badgeText: 'text-white'
  },
  {
    id: 'scheme-eqam-mahidol',
    code: 'EQAM_MAHIDOL',
    shortName: 'EQAM Mahidol',
    fullName: 'External Quality Assessment in Medical Technology (ศูนย์ EQA คณะเทคนิคการแพทย์ ม.มหิดล)',
    provider: 'Faculty of Medical Technology, Mahidol University',
    country: 'Thailand',
    category: 'National / Regional',
    description: 'Specialized national surveys for clinical microscopy, urinalysis, stool examination, hematology morphology, and cross-matching.',
    portalUrl: 'https://eqathai.com',
    accreditation: 'ISO/IEC 17043 Accredited Provider',
    badgeBg: 'bg-[#D97706]',
    badgeText: 'text-white'
  },
  {
    id: 'scheme-instand',
    code: 'INSTAND',
    shortName: 'INSTAND',
    fullName: 'INSTAND e.V. Society for Promoting Quality Assurance in Medical Labs',
    provider: 'INSTAND e.V. / WHO Collaborating Centre',
    country: 'Germany / Europe',
    category: 'Global / International',
    description: 'European reference proficiency testing organization covering clinical chemistry, bacteriology, virology, and autoimmune diagnostics.',
    portalUrl: 'https://www.instand-ev.de',
    accreditation: 'ISO/IEC 17043 (DAkkS Accredited)',
    badgeBg: 'bg-[#7C3AED]',
    badgeText: 'text-white'
  },
  {
    id: 'scheme-oneworld',
    code: 'ONEWORLD',
    shortName: 'Oneworld Accuracy',
    fullName: 'Oneworld Accuracy International Proficiency Testing',
    provider: 'Oneworld Accuracy Inc. / WHO Initiative',
    country: 'Canada / Global',
    category: 'Global / International',
    description: 'Cloud-native proficiency testing network connecting public health systems and diagnostic labs with comprehensive OASYS informatics.',
    portalUrl: 'https://oneworldaccuracy.com',
    accreditation: 'ISO/IEC 17043:2023',
    badgeBg: 'bg-[#EA580C]',
    badgeText: 'text-white'
  },
  {
    id: 'scheme-ecat',
    code: 'ECAT',
    shortName: 'ECAT',
    fullName: 'ECAT External Quality Control for Assays and Tests in Hemostasis',
    provider: 'ECAT Foundation',
    country: 'Netherlands / Europe',
    category: 'Specialty',
    description: 'World-leading specialist EQA organization dedicated to thrombosis, hemostasis, coagulation factor assays, and platelet function studies.',
    portalUrl: 'https://www.ecat.nl',
    accreditation: 'ISO/IEC 17043 (RvA Accredited)',
    badgeBg: 'bg-[#E11D48]',
    badgeText: 'text-white'
  },
  {
    id: 'scheme-weqas',
    code: 'WEQAS',
    shortName: 'WEQAS',
    fullName: 'Welsh External Quality Assessment Scheme',
    provider: 'Cardiff and Vale University Health Board',
    country: 'United Kingdom',
    category: 'Specialty',
    description: 'Reference EQA provider specializing in traceable commutable samples, point-of-care testing (POCT), and clinical lipid reference measurements.',
    portalUrl: 'https://www.weqas.com',
    accreditation: 'ISO/IEC 17043 (UKAS)',
    badgeBg: 'bg-[#4F46E5]',
    badgeText: 'text-white'
  }
];

export const SCHEME_PALETTE_OPTIONS = [
  { id: 'navy', label: 'Navy Deep', bg: 'bg-[#1E40AF]', text: 'text-white' },
  { id: 'sky', label: 'Sky Blue', bg: 'bg-[#0284C7]', text: 'text-white' },
  { id: 'blue', label: 'Cobalt Blue', bg: 'bg-[#3B82F6]', text: 'text-white' },
  { id: 'emerald', label: 'Medical Emerald', bg: 'bg-[#059669]', text: 'text-white' },
  { id: 'teal', label: 'Teal Cyan', bg: 'bg-[#0D9488]', text: 'text-white' },
  { id: 'amber', label: 'Warm Amber', bg: 'bg-[#D97706]', text: 'text-white' },
  { id: 'purple', label: 'Clinical Purple', bg: 'bg-[#7C3AED]', text: 'text-white' },
  { id: 'orange', label: 'International Orange', bg: 'bg-[#EA580C]', text: 'text-white' },
  { id: 'rose', label: 'Pathology Rose', bg: 'bg-[#E11D48]', text: 'text-white' },
  { id: 'indigo', label: 'Royal Indigo', bg: 'bg-[#4F46E5]', text: 'text-white' },
  { id: 'slate', label: 'Graphite Slate', bg: 'bg-[#0F172A]', text: 'text-white' }
];

/**
 * Combines standard schemes with user-registered custom schemes, filtering out deleted ones
 */
export function getAllSchemes(
  customSchemes: EQASchemeDefinition[] = [],
  deletedSchemeCodes: string[] = []
): EQASchemeDefinition[] {
  const deletedSet = new Set(deletedSchemeCodes.map((c) => c.toUpperCase().trim()));

  // Standard schemes (not deleted)
  const list = STANDARD_EQA_SCHEMES.filter(
    (s) => !deletedSet.has(s.code.toUpperCase()) && !deletedSet.has(s.id.toUpperCase())
  );

  // Custom additions that are not deleted and do not collide
  customSchemes.forEach((cs) => {
    if (
      !deletedSet.has(cs.code.toUpperCase()) &&
      !deletedSet.has(cs.id.toUpperCase()) &&
      !list.some((s) => s.code.toUpperCase() === cs.code.toUpperCase())
    ) {
      list.push(cs);
    }
  });

  return list;
}

/**
 * Resolves scheme info, badge colors, and portal URLs for any scheme code
 */
export function getSchemeInfo(
  codeOrName: string,
  customSchemes: EQASchemeDefinition[] = []
): EQASchemeDefinition {
  if (!codeOrName) {
    return {
      id: 'unknown',
      code: 'EQA',
      shortName: 'EQA',
      fullName: 'External Quality Assessment',
      provider: 'Clinical QA Provider',
      country: 'General',
      badgeBg: 'bg-[#64748B]',
      badgeText: 'text-white'
    };
  }

  const clean = codeOrName.trim().toUpperCase();

  // 1. Check custom schemes
  const customMatch = customSchemes.find(
    (s) => s.code.toUpperCase() === clean || s.shortName.toUpperCase() === clean
  );
  if (customMatch) return customMatch;

  // 2. Check standard schemes
  const standardMatch = STANDARD_EQA_SCHEMES.find(
    (s) =>
      s.code.toUpperCase() === clean ||
      s.shortName.toUpperCase() === clean ||
      s.code.replace(/_/g, '').toUpperCase() === clean.replace(/[\s_-]/g, '')
  );
  if (standardMatch) return standardMatch;

  // 3. Fallback for dynamic/arbitrary user scheme string
  return {
    id: `scheme-${codeOrName.toLowerCase().replace(/\s+/g, '-')}`,
    code: codeOrName,
    shortName: codeOrName,
    fullName: `${codeOrName} Quality Program`,
    provider: 'Designated EQA Provider',
    country: 'International',
    category: 'Custom',
    badgeBg: 'bg-[#475569]',
    badgeText: 'text-white',
    isCustom: true
  };
}
