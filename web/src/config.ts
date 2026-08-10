/**
 * Single place for the external links used by the landing page.
 * All values are placeholders until the real pilot channels exist — replace before publishing.
 */
export const config = {
  pilotFormUrl: 'https://forms.gle/REPLACE_ME',
  contactEmail: 'hello@someonethere.example',
  whatsappUrl: 'https://wa.me/REPLACE_ME',
  privacyUrl: '#privacy-placeholder',
  termsUrl: '#terms-placeholder',
} as const;

export const contactEmailHref = `mailto:${config.contactEmail}`;
