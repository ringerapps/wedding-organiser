export const DEFAULT_COLUMNS = [
  {
    id: 'venue',
    title: 'Venue & Location',
    color: '#d4847c',
    icon: '🏛️',
  },
  {
    id: 'catering',
    title: 'Catering & Cake',
    color: '#c9a96e',
    icon: '🍰',
  },
  {
    id: 'attire',
    title: 'Attire & Beauty',
    color: '#c4b5d4',
    icon: '👗',
  },
  {
    id: 'flowers',
    title: 'Flowers & Decor',
    color: '#a8b5a0',
    icon: '💐',
  },
  {
    id: 'photography',
    title: 'Photo & Video',
    color: '#8ba4b8',
    icon: '📸',
  },
  {
    id: 'music',
    title: 'Music & Entertainment',
    color: '#e8c4b8',
    icon: '🎵',
  },
  {
    id: 'guests',
    title: 'Guest List & RSVPs',
    color: '#d4847c',
    icon: '💌',
  },
  {
    id: 'logistics',
    title: 'Logistics & Admin',
    color: '#6b6060',
    icon: '📋',
  },
]

export const CARD_PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
}

export const PRIORITY_LABELS = {
  high: 'Urgent',
  medium: 'Important',
  low: 'Nice to have',
}

export const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-700 border-red-300',
  medium: 'bg-amber-100 text-amber-700 border-amber-300',
  low: 'bg-green-100 text-green-700 border-green-300',
}

export const SAMPLE_CARDS = {
  venue: [
    { title: 'Research venue options', priority: 'high', dueDate: '', notes: 'Consider indoor/outdoor, capacity, parking', done: false },
    { title: 'Book ceremony site', priority: 'high', dueDate: '', notes: '', done: false },
    { title: 'Book reception venue', priority: 'high', dueDate: '', notes: '', done: false },
    { title: 'Arrange site visits', priority: 'medium', dueDate: '', notes: '', done: false },
  ],
  catering: [
    { title: 'Choose caterer', priority: 'high', dueDate: '', notes: 'Get quotes from at least 3', done: false },
    { title: 'Plan menu & tastings', priority: 'medium', dueDate: '', notes: '', done: false },
    { title: 'Order wedding cake', priority: 'medium', dueDate: '', notes: '', done: false },
    { title: 'Arrange bar service', priority: 'low', dueDate: '', notes: '', done: false },
  ],
  attire: [
    { title: 'Shop for wedding dress', priority: 'high', dueDate: '', notes: '', done: false },
    { title: 'Groom suit/tuxedo', priority: 'high', dueDate: '', notes: '', done: false },
    { title: 'Bridesmaid dresses', priority: 'medium', dueDate: '', notes: '', done: false },
    { title: 'Book hair & makeup trial', priority: 'medium', dueDate: '', notes: '', done: false },
  ],
  flowers: [
    { title: 'Choose florist', priority: 'medium', dueDate: '', notes: '', done: false },
    { title: 'Select bouquet style', priority: 'medium', dueDate: '', notes: '', done: false },
    { title: 'Table centrepieces', priority: 'low', dueDate: '', notes: '', done: false },
    { title: 'Ceremony arch decor', priority: 'low', dueDate: '', notes: '', done: false },
  ],
  photography: [
    { title: 'Book photographer', priority: 'high', dueDate: '', notes: 'Check portfolio and reviews', done: false },
    { title: 'Book videographer', priority: 'medium', dueDate: '', notes: '', done: false },
    { title: 'Create shot list', priority: 'low', dueDate: '', notes: '', done: false },
  ],
  music: [
    { title: 'Book DJ or band', priority: 'high', dueDate: '', notes: '', done: false },
    { title: 'Plan first dance song', priority: 'medium', dueDate: '', notes: '', done: false },
    { title: 'Create ceremony playlist', priority: 'low', dueDate: '', notes: '', done: false },
  ],
  guests: [
    { title: 'Compile guest list', priority: 'high', dueDate: '', notes: '', done: false },
    { title: 'Send save-the-dates', priority: 'high', dueDate: '', notes: '', done: false },
    { title: 'Design & send invitations', priority: 'medium', dueDate: '', notes: '', done: false },
    { title: 'Track RSVPs', priority: 'medium', dueDate: '', notes: '', done: false },
    { title: 'Plan seating arrangement', priority: 'low', dueDate: '', notes: '', done: false },
  ],
  logistics: [
    { title: 'Set budget', priority: 'high', dueDate: '', notes: '', done: false },
    { title: 'Book officiant', priority: 'high', dueDate: '', notes: '', done: false },
    { title: 'Apply for marriage licence', priority: 'high', dueDate: '', notes: '', done: false },
    { title: 'Arrange transport', priority: 'medium', dueDate: '', notes: '', done: false },
    { title: 'Book honeymoon', priority: 'low', dueDate: '', notes: '', done: false },
  ],
}
