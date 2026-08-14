export const config = {
  // Replace these two values with the real booking channels before publishing.
  contactEmail: 'visits@someonethere.es',
  whatsappUrl: 'https://wa.me/393420499966?text=Hi%20SomeoneThere%21%20I%27d%20like%20some%20information%20about%20how%20to%20organise%20a%20rental%20viewing%20with%20you%20in%20Madrid.%0A%0ACould%20you%20please%20explain%20how%20the%20service%20works%2C%20what%20information%20you%20need%20from%20me%2C%20and%20how%20we%20can%20arrange%20the%20visit%3F',
  instagramUrl: '#',
} as const;

export const contactEmailHref = `mailto:${config.contactEmail}?subject=${encodeURIComponent('SomeoneThere rental viewing')}`;
