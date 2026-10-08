export type AnswerValue = string | string[]
export type Answers = Record<string, AnswerValue>

export interface Choice {
  id: string
  label: string
  exclusive?: boolean
}

export interface Question {
  id: string
  section: string
  prompt: string
  label: string
  kind: 'text' | 'phone' | 'number' | 'date' | 'choice' | 'multi' | 'note'
  options?: Choice[]
  optional?: boolean
  placeholder?: string
  when?: (answers: Answers) => boolean
}

function is(answers: Answers, id: string, value: string) {
  return answers[id] === value
}

const yesNo: Choice[] = [
  { id: 'yes', label: 'Yes' },
  { id: 'no', label: 'No' },
]

export const checklistQuestions: Question[] = [
  { id: 'clientName', section: 'About you', prompt: 'What is your name?', label: 'Client name', kind: 'text', placeholder: 'Your name' },
  { id: 'contact', section: 'About you', prompt: 'What is your phone number?', label: 'Contact no.', kind: 'phone', placeholder: 'Phone number' },
  { id: 'location', section: 'About you', prompt: 'Where is your plot?', label: 'Project location', kind: 'text', placeholder: 'Place, district' },
  { id: 'checklistDate', section: 'About you', prompt: 'Which date should we put on your checklist?', label: 'Date', kind: 'date' },

  { id: 'plotSize', section: 'Project', prompt: 'How big is your plot, in cents?', label: 'Plot size', kind: 'number', placeholder: 'Cents' },
  { id: 'houseSize', section: 'Project', prompt: 'How large should your house be, in square feet?', label: 'House size', kind: 'number', placeholder: 'Sq.ft' },
  { id: 'bedrooms', section: 'Project', prompt: 'How many bedrooms do you want?', label: 'Number of bedrooms', kind: 'number', placeholder: 'Number' },
  {
    id: 'parking',
    section: 'Project',
    prompt: 'How many cars do you need to park?',
    label: 'Parking',
    kind: 'choice',
    options: [
      { id: '1', label: '1 car' },
      { id: '2', label: '2 cars' },
      { id: '3', label: '3 cars' },
      { id: 'more', label: 'More' },
    ],
  },
  {
    id: 'parkingMore',
    section: 'Project',
    prompt: 'How many cars?',
    label: 'Parking, more',
    kind: 'text',
    placeholder: 'Number of cars',
    when: (answers) => is(answers, 'parking', 'more'),
  },
  {
    id: 'style',
    section: 'Project',
    prompt: 'Which architectural style do you prefer?',
    label: 'Preferred architectural style',
    kind: 'choice',
    options: [
      { id: 'modern', label: 'Modern' },
      { id: 'contemporary', label: 'Contemporary' },
      { id: 'kerala', label: 'Traditional Kerala' },
      { id: 'european', label: 'European' },
      { id: 'minimalist', label: 'Minimalist' },
      { id: 'other', label: 'Other' },
    ],
  },
  {
    id: 'styleOther',
    section: 'Project',
    prompt: 'Describe the style you have in mind.',
    label: 'Style, other',
    kind: 'text',
    placeholder: 'Style',
    when: (answers) => is(answers, 'style', 'other'),
  },
  { id: 'budget', section: 'Project', prompt: 'What budget do you have in mind, in rupees?', label: 'Estimated budget', kind: 'text', placeholder: '₹', optional: true },
  { id: 'startDate', section: 'Project', prompt: 'When would you like to start?', label: 'Start date', kind: 'date', optional: true },
  { id: 'completion', section: 'Project', prompt: 'When would you like the house finished?', label: 'Expected completion', kind: 'date', optional: true },

  {
    id: 'sitOut',
    section: 'Ground floor',
    prompt: 'Do you want a sit-out?',
    label: 'Sit-out',
    kind: 'choice',
    options: [
      { id: 'required', label: 'Required' },
      { id: 'not-required', label: 'Not required' },
    ],
  },
  {
    id: 'sitOutSeating',
    section: 'Ground floor',
    prompt: 'How many people should the sit-out seat?',
    label: 'Sit-out seating',
    kind: 'choice',
    options: [
      { id: '2', label: '2' },
      { id: '4', label: '4' },
      { id: '6', label: '6' },
    ],
    when: (answers) => is(answers, 'sitOut', 'required'),
  },
  {
    id: 'sitOutRemarks',
    section: 'Ground floor',
    prompt: 'Anything you want to note about the sit-out?',
    label: 'Sit-out remarks',
    kind: 'note',
    optional: true,
    when: (answers) => is(answers, 'sitOut', 'required'),
  },
  {
    id: 'living',
    section: 'Ground floor',
    prompt: 'How do you want the living room?',
    label: 'Living room',
    kind: 'choice',
    options: [
      { id: 'formal', label: 'Formal living' },
      { id: 'family', label: 'Family living' },
      { id: 'both', label: 'Both' },
    ],
  },
  { id: 'livingRemarks', section: 'Ground floor', prompt: 'Anything you want to note about the living room?', label: 'Living room remarks', kind: 'note', optional: true },
  {
    id: 'dining',
    section: 'Ground floor',
    prompt: 'How do you want the dining planned?',
    label: 'Dining',
    kind: 'choice',
    options: [
      { id: 'open', label: 'Open dining' },
      { id: 'separate', label: 'Separate dining' },
      { id: 'kitchen', label: 'Dining with kitchen' },
    ],
  },
  { id: 'diningRemarks', section: 'Ground floor', prompt: 'Anything you want to note about dining?', label: 'Dining remarks', kind: 'note', optional: true },
  {
    id: 'kitchen',
    section: 'Ground floor',
    prompt: 'Which kitchen do you want?',
    label: 'Kitchen',
    kind: 'choice',
    options: [
      { id: 'open', label: 'Open kitchen' },
      { id: 'closed', label: 'Closed kitchen' },
      { id: 'island', label: 'Island kitchen' },
    ],
  },
  { id: 'kitchenRemarks', section: 'Ground floor', prompt: 'Anything you want to note about the kitchen?', label: 'Kitchen remarks', kind: 'note', optional: true },
  { id: 'groundBedrooms', section: 'Ground floor', prompt: 'Do you need bedrooms on the ground floor?', label: 'Ground floor bedrooms', kind: 'choice', options: yesNo },
  {
    id: 'groundBedroomCount',
    section: 'Ground floor',
    prompt: 'How many bedrooms do you want on the ground floor?',
    label: 'Ground floor bedroom count',
    kind: 'number',
    when: (answers) => is(answers, 'groundBedrooms', 'yes'),
  },
  {
    id: 'patio',
    section: 'Ground floor',
    prompt: 'Do you want a patio?',
    label: 'Patio',
    kind: 'choice',
    options: [
      { id: 'required', label: 'Required' },
      { id: 'not-required', label: 'Not required' },
    ],
  },
  { id: 'groundAttachedBaths', section: 'Ground floor', prompt: 'How many attached bathrooms do you want on the ground floor?', label: 'Ground floor attached bathrooms', kind: 'number', placeholder: '0 if none' },
  { id: 'groundCommonBaths', section: 'Ground floor', prompt: 'How many common bathrooms do you want on the ground floor?', label: 'Ground floor common bathrooms', kind: 'number', placeholder: '0 if none' },

  { id: 'store', section: 'Additional', prompt: 'Do you need a store room?', label: 'Store room', kind: 'choice', options: yesNo },
  { id: 'workArea', section: 'Additional', prompt: 'Do you need a work area?', label: 'Work area', kind: 'choice', options: yesNo },
  {
    id: 'laundry',
    section: 'Additional',
    prompt: 'Where should your laundry be?',
    label: 'Laundry area',
    kind: 'choice',
    options: [
      { id: 'ground', label: 'Ground floor' },
      { id: 'first', label: 'First floor' },
      { id: 'outdoor', label: 'Outdoor' },
      { id: 'not-required', label: 'Not required' },
    ],
  },
  { id: 'outdoorPatio', section: 'Additional', prompt: 'Do you want an outdoor patio?', label: 'Outdoor patio', kind: 'choice', options: yesNo },
  {
    id: 'pool',
    section: 'Additional',
    prompt: 'Do you want a swimming pool?',
    label: 'Swimming pool',
    kind: 'choice',
    options: [
      { id: 'required', label: 'Required' },
      { id: 'future', label: 'Future provision' },
      { id: 'not-required', label: 'Not required' },
    ],
  },
  { id: 'courtyard', section: 'Additional', prompt: 'Do you want a courtyard?', label: 'Courtyard', kind: 'choice', options: yesNo },
  {
    id: 'doubleHeight',
    section: 'Additional',
    prompt: 'Where do you want a double-height space? Choose all that apply.',
    label: 'Double height space',
    kind: 'multi',
    options: [
      { id: 'living', label: 'Living room' },
      { id: 'dining', label: 'Dining' },
      { id: 'stair', label: 'Stair area' },
      { id: 'not-required', label: 'Not required', exclusive: true },
    ],
  },

  { id: 'firstBedrooms', section: 'First floor', prompt: 'How many bedrooms do you want on the first floor?', label: 'First floor bedrooms', kind: 'number' },
  {
    id: 'firstLiving',
    section: 'First floor',
    prompt: 'What living space do you want upstairs? Choose all that apply.',
    label: 'First floor living',
    kind: 'multi',
    options: [
      { id: 'family', label: 'Family living' },
      { id: 'tv', label: 'TV lounge' },
      { id: 'not-required', label: 'Not required', exclusive: true },
    ],
  },
  { id: 'firstAttachedBaths', section: 'First floor', prompt: 'How many attached bathrooms do you want on the first floor?', label: 'First floor attached bathrooms', kind: 'number', placeholder: '0 if none' },
  { id: 'firstCommonBaths', section: 'First floor', prompt: 'How many common bathrooms do you want on the first floor?', label: 'First floor common bathrooms', kind: 'number', placeholder: '0 if none' },
  {
    id: 'balcony',
    section: 'First floor',
    prompt: 'Where do you want balconies? Choose all that apply.',
    label: 'Balcony',
    kind: 'multi',
    options: [
      { id: 'front', label: 'Front' },
      { id: 'rear', label: 'Rear' },
      { id: 'side', label: 'Side' },
      { id: 'not-required', label: 'Not required', exclusive: true },
    ],
  },
  {
    id: 'terrace',
    section: 'First floor',
    prompt: 'Where do you want an open terrace? Choose all that apply.',
    label: 'Open terrace',
    kind: 'multi',
    options: [
      { id: 'front', label: 'Front' },
      { id: 'rear', label: 'Rear' },
      { id: 'side', label: 'Side' },
      { id: 'full', label: 'Full terrace' },
      { id: 'not-required', label: 'Not required', exclusive: true },
    ],
  },
  {
    id: 'theatre',
    section: 'First floor',
    prompt: 'Do you want a home theatre?',
    label: 'Home theatre',
    kind: 'choice',
    options: [
      { id: 'required', label: 'Required' },
      { id: 'future', label: 'Future provision' },
      { id: 'not-required', label: 'Not required' },
    ],
  },
  { id: 'bar', section: 'First floor', prompt: 'Do you want a bar counter?', label: 'Bar counter', kind: 'choice', options: yesNo },

  {
    id: 'outdoor',
    section: 'Outdoor',
    prompt: 'Which outdoor pieces do you want? Choose all that apply.',
    label: 'Outdoor planning',
    kind: 'multi',
    options: [
      { id: 'front-garden', label: 'Front garden' },
      { id: 'backyard', label: 'Backyard garden' },
      { id: 'lawn', label: 'Lawn' },
      { id: 'play', label: "Children's play area" },
      { id: 'seating', label: 'Outdoor seating' },
      { id: 'bbq', label: 'BBQ area' },
      { id: 'water', label: 'Water feature' },
      { id: 'compound', label: 'Compound wall' },
      { id: 'sliding-gate', label: 'Sliding gate' },
      { id: 'swing-gate', label: 'Swing gate' },
      { id: 'none', label: 'None of these', exclusive: true },
    ],
  },
  {
    id: 'special',
    section: 'Special',
    prompt: 'Which of these do you want in the house? Choose all that apply.',
    label: 'Special requirements',
    kind: 'multi',
    options: [
      { id: 'office', label: 'Home office' },
      { id: 'prayer', label: 'Prayer room' },
      { id: 'lift-provision', label: 'Lift provision' },
      { id: 'lift', label: 'Lift' },
      { id: 'solar', label: 'Solar panels' },
      { id: 'ev', label: 'EV charging point' },
      { id: 'rain', label: 'Rainwater harvesting' },
      { id: 'smart', label: 'Smart home automation' },
      { id: 'cctv', label: 'CCTV' },
      { id: 'security', label: 'Security room' },
      { id: 'maid', label: 'Maid room' },
      { id: 'driver', label: 'Driver room' },
      { id: 'access', label: 'Wheelchair accessibility' },
      { id: 'none', label: 'None of these', exclusive: true },
    ],
  },
  { id: 'specialOther', section: 'Special', prompt: 'Anything else you want us to include?', label: 'Other requirements', kind: 'note', optional: true },

  { id: 'colours', section: 'Design', prompt: 'Do you have a colour theme in mind?', label: 'Preferred colour theme', kind: 'text', optional: true, placeholder: 'Colours' },
  { id: 'flooring', section: 'Design', prompt: 'What flooring do you prefer?', label: 'Preferred flooring', kind: 'text', optional: true, placeholder: 'Flooring' },
  { id: 'roofing', section: 'Design', prompt: 'What roofing style do you prefer?', label: 'Preferred roofing style', kind: 'text', optional: true, placeholder: 'Roof' },
  { id: 'inspiration', section: 'Design', prompt: 'Any design you want us to follow?', label: 'Special design inspirations', kind: 'note', optional: true },
  { id: 'remarks', section: 'Remarks', prompt: 'Anything else you want us to know?', label: 'Client remarks', kind: 'note', optional: true },
  { id: 'signature', section: 'Remarks', prompt: 'Type your name to confirm this checklist.', label: 'Client signature', kind: 'text', placeholder: 'Your name' },
]

export function visibleQuestions(answers: Answers) {
  return checklistQuestions.filter((question) => !question.when || question.when(answers))
}

export function choiceLabel(question: Question, value: string) {
  return question.options?.find((option) => option.id === value)?.label ?? value
}

export function formatAnswer(question: Question, value: AnswerValue) {
  if (Array.isArray(value)) {
    if (value.length === 0) return 'Not specified'
    return value.map((item) => choiceLabel(question, item)).join(', ')
  }
  if (!value) return 'Not specified'
  return choiceLabel(question, value)
}
