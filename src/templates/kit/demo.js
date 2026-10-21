// Sample content for demo invitations. Every template can use it as-is or pass its own.

export function entourage({ a, b }) {
  return [
    { title: 'Parents of the Groom', names: ['Mr. Roberto Villanueva', 'Mrs. Teresa Villanueva'] },
    { title: 'Parents of the Bride', names: ['Mr. Eduardo Santiago', 'Mrs. Carmela Santiago'] },
    {
      title: 'Principal Sponsors',
      wide: true,
      pairs: [
        ['Mr. Antonio Ramos', 'Mrs. Lourdes Ramos'],
        ['Mr. Fernando Cruz', 'Mrs. Isabel Cruz'],
        ['Dr. Manuel Torres', 'Dr. Patricia Torres'],
        ['Mr. Ricardo Lim', 'Mrs. Angela Lim'],
      ],
    },
    { title: 'Best Man', names: ['Joaquin Villanueva'] },
    { title: 'Maid of Honor', names: ['Camille Santiago'] },
    { title: 'Groomsmen', names: ['Paolo Reyes', 'Marco Dizon', 'Luis Navarro'] },
    { title: 'Bridesmaids', names: ['Bea Reyes', 'Nina Aquino', 'Trisha Mendoza'] },
    { title: 'Candle · Veil · Cord', wide: true, pairs: [['Mr. Jun Castro', 'Ms. Rina Castro'], ['Mr. Leo Bautista', 'Ms. Joy Bautista'], ['Mr. Carlo Sison', 'Ms. Mae Sison']] },
    { title: 'Ring & Coin Bearers', names: ['Gabriel Ramos', 'Elijah Cruz'] },
    { title: 'Flower Girls', names: ['Sophia Torres', 'Ava Lim'] },
  ].map((g) => ({ ...g, couple: `${a} & ${b}` }));
}

export const faq = [
  { q: 'When should I RSVP by?', a: 'Please reply through the RSVP form on this page by the date shown, so we can confirm numbers with the venue.' },
  { q: 'Can I bring a plus-one?', a: 'Your invitation shows the seats we have reserved for you. If something has changed, message us and we will do our best.' },
  { q: 'Are children welcome?', a: 'We love your little ones, but apart from our entourage this will be an adults-only celebration.' },
  { q: 'What should I wear?', a: 'Please follow the dress code and colour palette above. Comfortable shoes are a good idea for the garden.' },
  { q: 'Is there parking at the venue?', a: 'Yes. Free parking is available on site, and attendants will guide you from the entrance.' },
  { q: 'Can I take photos during the ceremony?', a: 'We are having an unplugged ceremony. Our photographers will capture everything, and you can snap away at the reception.' },
];

export function gifts({ a, b }) {
  return {
    note: `Your presence is the greatest gift. If you wish to bless ${a} and ${b} as they start their new home, a monetary gift would be warmly appreciated.`,
    accounts: [
      { label: 'GCash', name: `${a} ${b[0]}.`, number: '0917 555 0143' },
      { label: 'BPI Savings', name: `${b} ${a[0]}.`, number: '1234 5678 90' },
    ],
  };
}

export const program = [
  { time: '3:00 PM', label: 'Guest arrival', icon: 'users' },
  { time: '3:30 PM', label: 'Wedding ceremony', icon: 'rings' },
  { time: '4:30 PM', label: 'Photos & cocktails', icon: 'camera' },
  { time: '6:00 PM', label: 'Dinner reception', icon: 'dinner' },
  { time: '8:00 PM', label: 'First dance', icon: 'music' },
  { time: '8:30 PM', label: 'Party & send-off', icon: 'cheers' },
];

export const story = [
  { when: '2018', title: 'How we met', text: 'A friend’s birthday dinner, two seats left at the end of the table, and a conversation that lasted until closing time.' },
  { when: '2020', title: 'First adventure', text: 'A road trip with a broken radio and one playlist on repeat. We still know every word.' },
  { when: '2025', title: 'The proposal', text: 'At sunrise, on the same beach where we said “I love you” for the first time.' },
];
