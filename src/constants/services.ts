// src/constants/services.ts
export interface ServiceOption {
    label: string;
    options: string[];
  }
  
  export const serviceOptions: ServiceOption[] = [
    {
      label: 'EVENT PLANNING AND MANAGEMENT SERVICES',
      options: [
        'Catering Services',
        'Stage Decoration Services',
        'Photography & Videography',
        'Band Services',
        'Cake Services',
      ],
    },
    {
      label: 'ENTERTAINMENT SERVICES',
      options: [
        'DJ & Music Services',
        'Dance Performances',
        'Fireworks',
      ],
    },
    {
      label: 'LOGISTICS AND SUPPORT SERVICES',
      options: [
        'Transportation',
        'Seating Arrangements',
        'Event Security',
      ],
    },
    {
      label: 'BEAUTY AND GROOMING SERVICES',
      options: [
        'Bridal Makeup and Grooming',
        'Groom Dressing Services',
      ],
    },
    {
      label: 'RELIGIOUS & CULTURAL SERVICES',
      options: [
        'Pandit/Priest Services',
        'Pooja Samagri Suppliers',
      ],
    },
    {
      label: 'DECOR AND AMBIANCE SERVICES',
      options: [
        'Lighting and Effects',
        'Venue Decoration',
        'Welcome Boards and Signages',
      ],
    },
    {
      label: 'SPECIALIZED FOOD AND BEVERAGE SERVICES',
      options: [
        'Live Food Counters',
        'Beverage Stations',
      ],
    },
    {
      label: 'MISCELLANEOUS SERVICES',
      options: [
        'Return Gift Vendors',
        'Invitation Design & Printing',
        'Event Anchors',
        'Others',
      ],
    },
  ];