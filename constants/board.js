export const STATUS_COLUMNS = [
  { id: 'todo', title: 'To Do', icon: '📋', color: '#8ba4b8' },
  { id: 'in-progress', title: 'In Progress', icon: '🔨', color: '#c9a96e' },
  { id: 'done', title: 'Done', icon: '✅', color: '#a8b5a0' },
]

export const CATEGORIES = [
  { id: 'venue', label: 'Venue', color: '#d4847c', icon: '🏛️' },
  { id: 'catering', label: 'Catering', color: '#c9a96e', icon: '🍰' },
  { id: 'attire', label: 'Attire', color: '#c4b5d4', icon: '👗' },
  { id: 'flowers', label: 'Flowers', color: '#a8b5a0', icon: '💐' },
  { id: 'photography', label: 'Photo', color: '#8ba4b8', icon: '📸' },
  { id: 'music', label: 'Music', color: '#e8c4b8', icon: '🎵' },
  { id: 'guests', label: 'Guests', color: '#d4847c', icon: '💌' },
  { id: 'logistics', label: 'Logistics', color: '#6b6060', icon: '📋' },
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

export const SAMPLE_CARDS = [
  { title: 'Research venue options', priority: 'high', category: 'venue', notes: 'Consider indoor/outdoor, capacity, parking' },
  { title: 'Book ceremony site', priority: 'high', category: 'venue', notes: '' },
  { title: 'Book reception venue', priority: 'high', category: 'venue', notes: '' },
  { title: 'Arrange site visits', priority: 'medium', category: 'venue', notes: '' },
  { title: 'Choose caterer', priority: 'high', category: 'catering', notes: 'Get quotes from at least 3' },
  { title: 'Plan menu & tastings', priority: 'medium', category: 'catering', notes: '' },
  { title: 'Order wedding cake', priority: 'medium', category: 'catering', notes: '' },
  { title: 'Arrange bar service', priority: 'low', category: 'catering', notes: '' },
  { title: 'Shop for wedding dress', priority: 'high', category: 'attire', notes: '' },
  { title: 'Groom suit/tuxedo', priority: 'high', category: 'attire', notes: '' },
  { title: 'Bridesmaid dresses', priority: 'medium', category: 'attire', notes: '' },
  { title: 'Book hair & makeup trial', priority: 'medium', category: 'attire', notes: '' },
  { title: 'Choose florist', priority: 'medium', category: 'flowers', notes: '' },
  { title: 'Select bouquet style', priority: 'medium', category: 'flowers', notes: '' },
  { title: 'Table centrepieces', priority: 'low', category: 'flowers', notes: '' },
  { title: 'Ceremony arch decor', priority: 'low', category: 'flowers', notes: '' },
  { title: 'Book photographer', priority: 'high', category: 'photography', notes: 'Check portfolio and reviews' },
  { title: 'Book videographer', priority: 'medium', category: 'photography', notes: '' },
  { title: 'Create shot list', priority: 'low', category: 'photography', notes: '' },
  { title: 'Book DJ or band', priority: 'high', category: 'music', notes: '' },
  { title: 'Plan first dance song', priority: 'medium', category: 'music', notes: '' },
  { title: 'Create ceremony playlist', priority: 'low', category: 'music', notes: '' },
  { title: 'Compile guest list', priority: 'high', category: 'guests', notes: '' },
  { title: 'Send save-the-dates', priority: 'high', category: 'guests', notes: '' },
  { title: 'Design & send invitations', priority: 'medium', category: 'guests', notes: '' },
  { title: 'Track RSVPs', priority: 'medium', category: 'guests', notes: '' },
  { title: 'Plan seating arrangement', priority: 'low', category: 'guests', notes: '' },
  { title: 'Set budget', priority: 'high', category: 'logistics', notes: '' },
  { title: 'Book officiant', priority: 'high', category: 'logistics', notes: '' },
  { title: 'Apply for marriage licence', priority: 'high', category: 'logistics', notes: '' },
  { title: 'Arrange transport', priority: 'medium', category: 'logistics', notes: '' },
  { title: 'Book honeymoon', priority: 'low', category: 'logistics', notes: '' },
]

export const RSVP_STATUSES = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
}

export const MEAL_OPTIONS = ['Standard', 'Vegetarian', 'Vegan', 'Gluten-free', 'Other']

export const VENDOR_STATUSES = {
  RESEARCHING: 'researching',
  CONTACTED: 'contacted',
  QUOTED: 'quoted',
  BOOKED: 'booked',
}

export const WEDDING_STYLES = [
  { id: 'classic', label: 'Classic & Elegant', icon: '🏰' },
  { id: 'rustic', label: 'Rustic & Natural', icon: '🌿' },
  { id: 'modern', label: 'Modern & Minimal', icon: '✨' },
  { id: 'bohemian', label: 'Bohemian & Free', icon: '🌸' },
  { id: 'romantic', label: 'Romantic & Dreamy', icon: '💕' },
  { id: 'vintage', label: 'Vintage & Retro', icon: '🎭' },
]
