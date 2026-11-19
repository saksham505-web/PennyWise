// Seeded sample demonstration datasets for Pennywise

export const INITIAL_TRACKER_DATA = {
  openingBalance: 10000,
  selectedMonth: new Date().toISOString().slice(0, 7), // YYYY-MM
  budgetCategories: [
    { id: 'cat-food', name: 'Food', budget: 2000, color: '#C5E86C' },
    { id: 'cat-trans', name: 'Transportation', budget: 1000, color: '#087985' },
    { id: 'cat-shop', name: 'Shopping', budget: 1500, color: '#B7D16A' },
    { id: 'cat-ent', name: 'Entertainment', budget: 1000, color: '#D7ECE5' },
    { id: 'cat-sav', name: 'Savings', budget: 2500, color: '#10B981' },
    { id: 'cat-health', name: 'Health', budget: 0, color: '#F87171' },
    { id: 'cat-edu', name: 'Education', budget: 0, color: '#38BDF8' },
    { id: 'cat-bills', name: 'Bills', budget: 0, color: '#FB923C' },
    { id: 'cat-other', name: 'Other', budget: 0, color: '#94A3B8' }
  ],
  transactions: [
    {
      id: 'tx-1',
      type: 'income',
      amount: 8000,
      category: 'Allowance / Stipend',
      date: new Date().toISOString().slice(0, 10),
      description: 'Monthly student allowance'
    },
    {
      id: 'tx-2',
      type: 'expense',
      amount: 1200,
      category: 'Food',
      date: new Date().toISOString().slice(0, 10),
      description: 'Weekly groceries & canteen'
    },
    {
      id: 'tx-3',
      type: 'expense',
      amount: 450,
      category: 'Transportation',
      date: new Date().toISOString().slice(0, 10),
      description: 'Metro recharge card'
    },
    {
      id: 'tx-4',
      type: 'expense',
      amount: 850,
      category: 'Shopping',
      date: new Date().toISOString().slice(0, 10),
      description: 'Reference books & notebook'
    },
    {
      id: 'tx-5',
      type: 'expense',
      amount: 350,
      category: 'Entertainment',
      date: new Date().toISOString().slice(0, 10),
      description: 'Weekend movie ticket'
    }
  ],
  savingsGoals: [
    {
      id: 'goal-1',
      name: 'Emergency Buffer Fund',
      targetAmount: 15000,
      savedAmount: 6000,
      targetDate: '2026-12-31'
    },
    {
      id: 'goal-2',
      name: 'Study Laptop Fund',
      targetAmount: 50000,
      savedAmount: 18000,
      targetDate: '2027-03-31'
    },
    {
      id: 'goal-3',
      name: 'Financial Literacy Course',
      targetAmount: 4000,
      savedAmount: 4000,
      targetDate: '2026-11-30'
    }
  ]
};

// Tooltip glossary definitions for stock fundamentals
export const FUNDAMENTALS_TOOLTIPS = {
  'Market Capitalisation': 'The total market value of a company\'s shares.',
  'P/E Ratio': 'Shows how much investors pay for each unit of a company\'s earnings.',
  'P/B Ratio': 'Compares a company\'s market value with its book value.',
  'Industry P/E': 'The average P/E ratio of companies in the same industry.',
  'Debt-to-Equity': 'Compares how much a company owes with the money invested by its owners.',
  'ROE': 'Shows how effectively a company uses shareholders\' money to generate profit.',
  'EPS': 'The company\'s earnings divided by its number of shares.',
  'Dividend Yield': 'Shows dividend income compared with the share price.',
  'Book Value': 'The accounting value of a company\'s assets after subtracting liabilities.',
  'Face Value': 'The nominal value assigned to one share by the company.'
};

// Five fictional stocks as required by spec
export const FICTIONAL_STOCKS = [
  {
    id: 'novatech',
    name: 'NovaTech',
    symbol: 'NOVAT',
    industry: 'Technology',
    price: 1420.50,
    change: 42.30,
    changePercent: 3.07,
    description: 'Specializes in energy-efficient neural accelerator chips and edge AI computing infrastructure for enterprise cloud systems.',
    chartHistory: [
      { time: '09:15', price: 1378.20 },
      { time: '10:30', price: 1395.00 },
      { time: '11:45', price: 1388.50 },
      { time: '13:00', price: 1405.10 },
      { time: '14:15', price: 1412.80 },
      { time: '15:30', price: 1420.50 }
    ],
    fundamentals: {
      'Market Capitalisation': '₹1,42,800 Cr',
      'P/E Ratio': '28.4',
      'P/B Ratio': '4.8',
      'Industry P/E': '32.1',
      'Debt-to-Equity': '0.18',
      'ROE': '22.4%',
      'EPS': '₹50.02',
      'Dividend Yield': '0.85%',
      'Book Value': '₹295.90',
      'Face Value': '₹2.00'
    },
    performance: {
      quarterly: [
        { period: 'Q1 FY26', revenue: 3200, profit: 640 },
        { period: 'Q2 FY26', revenue: 3450, profit: 710 },
        { period: 'Q3 FY26', revenue: 3800, profit: 820 },
        { period: 'Q4 FY26', revenue: 4120, profit: 915 }
      ],
      yearly: [
        { period: 'FY23', revenue: 9800, profit: 1750 },
        { period: 'FY24', revenue: 11600, profit: 2180 },
        { period: 'FY25', revenue: 13400, profit: 2650 },
        { period: 'FY26', revenue: 14570, profit: 3085 }
      ]
    }
  },
  {
    id: 'greengrid',
    name: 'GreenGrid',
    symbol: 'GRNGRD',
    industry: 'Renewable Energy',
    price: 685.20,
    change: -12.40,
    changePercent: -1.78,
    description: 'Pioneers high-capacity battery storage systems and decentralized micro-grids for distributed rural solar cooperatives.',
    chartHistory: [
      { time: '09:15', price: 697.60 },
      { time: '10:30', price: 692.00 },
      { time: '11:45', price: 695.50 },
      { time: '13:00', price: 688.00 },
      { time: '14:15', price: 682.30 },
      { time: '15:30', price: 685.20 }
    ],
    fundamentals: {
      'Market Capitalisation': '₹54,200 Cr',
      'P/E Ratio': '35.6',
      'P/B Ratio': '3.2',
      'Industry P/E': '38.0',
      'Debt-to-Equity': '0.65',
      'ROE': '15.8%',
      'EPS': '₹19.25',
      'Dividend Yield': '0.42%',
      'Book Value': '₹214.10',
      'Face Value': '₹5.00'
    },
    performance: {
      quarterly: [
        { period: 'Q1 FY26', revenue: 1800, profit: 210 },
        { period: 'Q2 FY26', revenue: 1950, profit: 235 },
        { period: 'Q3 FY26', revenue: 2100, profit: 260 },
        { period: 'Q4 FY26', revenue: 2320, profit: 295 }
      ],
      yearly: [
        { period: 'FY23', revenue: 5400, profit: 580 },
        { period: 'FY24', revenue: 6500, profit: 740 },
        { period: 'FY25', revenue: 7600, profit: 890 },
        { period: 'FY26', revenue: 8170, profit: 1000 }
      ]
    }
  },
  {
    id: 'urbannest',
    name: 'UrbanNest',
    symbol: 'URBNST',
    industry: 'Real Estate',
    price: 310.80,
    change: 5.60,
    changePercent: 1.83,
    description: 'Develops energy-positive residential complexes and flexible community co-living spaces with carbon-neutral certification.',
    chartHistory: [
      { time: '09:15', price: 305.20 },
      { time: '10:30', price: 307.40 },
      { time: '11:45', price: 306.80 },
      { time: '13:00', price: 309.50 },
      { time: '14:15', price: 311.20 },
      { time: '15:30', price: 310.80 }
    ],
    fundamentals: {
      'Market Capitalisation': '₹22,450 Cr',
      'P/E Ratio': '16.2',
      'P/B Ratio': '1.4',
      'Industry P/E': '19.5',
      'Debt-to-Equity': '0.45',
      'ROE': '11.6%',
      'EPS': '₹19.18',
      'Dividend Yield': '2.40%',
      'Book Value': '₹222.00',
      'Face Value': '₹10.00'
    },
    performance: {
      quarterly: [
        { period: 'Q1 FY26', revenue: 1100, profit: 140 },
        { period: 'Q2 FY26', revenue: 1250, profit: 165 },
        { period: 'Q3 FY26', revenue: 1300, profit: 175 },
        { period: 'Q4 FY26', revenue: 1450, profit: 195 }
      ],
      yearly: [
        { period: 'FY23', revenue: 3800, profit: 420 },
        { period: 'FY24', revenue: 4300, profit: 510 },
        { period: 'FY25', revenue: 4850, profit: 590 },
        { period: 'FY26', revenue: 5100, profit: 675 }
      ]
    }
  },
  {
    id: 'freshcart',
    name: 'FreshCart',
    symbol: 'FRSHCRT',
    industry: 'Consumer Goods',
    price: 890.00,
    change: 14.20,
    changePercent: 1.62,
    description: 'Manages an integrated farm-to-table supply network delivering organic produce and staples directly to Tier 1 and 2 households.',
    chartHistory: [
      { time: '09:15', price: 875.80 },
      { time: '10:30', price: 882.00 },
      { time: '11:45', price: 880.50 },
      { time: '13:00', price: 886.10 },
      { time: '14:15', price: 892.40 },
      { time: '15:30', price: 890.00 }
    ],
    fundamentals: {
      'Market Capitalisation': '₹38,900 Cr',
      'P/E Ratio': '24.1',
      'P/B Ratio': '3.9',
      'Industry P/E': '27.4',
      'Debt-to-Equity': '0.22',
      'ROE': '18.9%',
      'EPS': '₹36.93',
      'Dividend Yield': '1.15%',
      'Book Value': '₹228.20',
      'Face Value': '₹2.00'
    },
    performance: {
      quarterly: [
        { period: 'Q1 FY26', revenue: 2400, profit: 260 },
        { period: 'Q2 FY26', revenue: 2600, profit: 295 },
        { period: 'Q3 FY26', revenue: 2900, profit: 340 },
        { period: 'Q4 FY26', revenue: 3100, profit: 375 }
      ],
      yearly: [
        { period: 'FY23', revenue: 7800, profit: 710 },
        { period: 'FY24', revenue: 9100, profit: 920 },
        { period: 'FY25', revenue: 10200, profit: 1100 },
        { period: 'FY26', revenue: 11000, profit: 1270 }
      ]
    }
  },
  {
    id: 'aerolink',
    name: 'AeroLink',
    symbol: 'AEROLNK',
    industry: 'Transportation',
    price: 520.40,
    change: -8.90,
    changePercent: -1.68,
    description: 'Builds zero-emission regional electric aircraft prototypes and autonomous high-speed cargo delivery corridors.',
    chartHistory: [
      { time: '09:15', price: 529.30 },
      { time: '10:30', price: 525.00 },
      { time: '11:45', price: 526.40 },
      { time: '13:00', price: 521.10 },
      { time: '14:15', price: 518.50 },
      { time: '15:30', price: 520.40 }
    ],
    fundamentals: {
      'Market Capitalisation': '₹31,100 Cr',
      'P/E Ratio': '21.5',
      'P/B Ratio': '2.6',
      'Industry P/E': '22.8',
      'Debt-to-Equity': '0.52',
      'ROE': '14.2%',
      'EPS': '₹24.20',
      'Dividend Yield': '0.70%',
      'Book Value': '₹200.15',
      'Face Value': '₹5.00'
    },
    performance: {
      quarterly: [
        { period: 'Q1 FY26', revenue: 1650, profit: 155 },
        { period: 'Q2 FY26', revenue: 1780, profit: 175 },
        { period: 'Q3 FY26', revenue: 1890, profit: 190 },
        { period: 'Q4 FY26', revenue: 2050, profit: 215 }
      ],
      yearly: [
        { period: 'FY23', revenue: 5100, profit: 460 },
        { period: 'FY24', revenue: 5900, profit: 570 },
        { period: 'FY25', revenue: 6700, profit: 660 },
        { period: 'FY26', revenue: 7370, profit: 735 }
      ]
    }
  }
];

// Fictional Mutual Funds for SIP Simulation
export const FICTIONAL_FUNDS = [
  {
    id: 'fund-bluechip',
    name: 'Pennywise Bluechip Equity Fund',
    category: 'Large Cap Equity',
    risk: 'Moderately High',
    initialNav: 42.50,
    currentNav: 44.80,
    description: 'Invests in top 100 well-established Indian market leaders with strong balance sheets and proven track records.',
    // 30-day realistic NAV movement showing realistic market volatility & growth
    navCurve: [
      42.50, 42.80, 43.10, 42.60, 42.20, 42.90, 43.40, 43.80, 43.20, 42.90,
      43.50, 44.10, 44.60, 44.20, 43.80, 44.40, 45.10, 44.70, 44.10, 44.60,
      45.20, 45.80, 45.30, 44.90, 45.50, 46.20, 45.90, 45.40, 46.00, 46.80
    ]
  },
  {
    id: 'fund-clean-energy',
    name: 'EcoFuture Clean Energy Index Fund',
    category: 'Thematic / ESG',
    risk: 'High',
    initialNav: 28.50,
    currentNav: 29.20,
    description: 'Passively mirrors an index of top solar, wind, and green hydrogen power generation companies in India.',
    navCurve: [
      28.50, 28.20, 27.90, 28.40, 28.90, 29.30, 28.80, 28.20, 27.80, 28.10,
      28.70, 29.40, 30.10, 29.60, 29.00, 29.80, 30.50, 30.10, 29.40, 30.00,
      30.80, 31.40, 30.90, 30.20, 30.90, 31.70, 31.20, 30.60, 31.50, 32.40
    ]
  },
  {
    id: 'fund-balanced',
    name: 'SteadyGrowth Balanced Advantage Fund',
    category: 'Dynamic Asset Allocation (Hybrid)',
    risk: 'Moderate',
    initialNav: 34.00,
    currentNav: 35.10,
    description: 'Dynamically shifts between equities and fixed-income debt instruments based on market valuations to curb downside risk.',
    navCurve: [
      34.00, 34.15, 34.25, 34.20, 34.10, 34.30, 34.45, 34.60, 34.50, 34.40,
      34.65, 34.80, 34.95, 34.90, 34.80, 35.00, 35.20, 35.15, 35.05, 35.25,
      35.40, 35.55, 35.50, 35.40, 35.60, 35.80, 35.75, 35.65, 35.90, 36.15
    ]
  },
  {
    id: 'fund-smallcap',
    name: 'Discovery Small Cap Horizons',
    category: 'Small Cap Equity',
    risk: 'Very High',
    initialNav: 55.00,
    currentNav: 53.80,
    description: 'High-growth potential fund investing in agile, emerging smaller enterprises. Characterized by higher price volatility.',
    navCurve: [
      55.00, 56.20, 54.80, 53.50, 52.80, 54.10, 55.60, 54.20, 52.90, 51.80,
      53.20, 54.90, 56.40, 55.10, 53.60, 55.20, 57.00, 55.50, 53.80, 55.40,
      57.50, 59.10, 57.40, 55.60, 57.20, 59.80, 58.20, 56.40, 58.60, 60.50
    ]
  },
  {
    id: 'fund-liquid',
    name: 'Liquid Safety Overnight Fund',
    category: 'Debt / Money Market',
    risk: 'Low',
    initialNav: 18.50,
    currentNav: 18.62,
    description: 'Invests strictly in overnight repo securities and top-rated sovereign treasury bills. Ideal for parking emergency funds safely.',
    navCurve: [
      18.50, 18.51, 18.51, 18.52, 18.52, 18.53, 18.54, 18.54, 18.55, 18.56,
      18.56, 18.57, 18.58, 18.58, 18.59, 18.60, 18.60, 18.61, 18.62, 18.62,
      18.63, 18.64, 18.64, 18.65, 18.66, 18.66, 18.67, 18.68, 18.68, 18.69
    ]
  }
];

// Initial Trading & Sims state
export const INITIAL_SIMS_STATE = {
  virtualCash: 100000, // ₹1,00,000 starting cash
  holdings: [
    {
      stockId: 'novatech',
      shares: 10,
      avgPrice: 1380.00
    }
  ],
  activities: [
    {
      id: 'act-init-1',
      assetType: 'stock',
      name: 'NovaTech',
      type: 'BUY',
      shares: 10,
      price: 1380.00,
      totalValue: 13800.00,
      date: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ],
  activeSipExperiment: null
};

// Curriculum: Exactly TWO Units as per spec
export const CURRICULUM_UNITS = [
  {
    id: 'unit-1',
    title: 'Unit 1: Financial Literacy',
    description: 'Understand the foundations of money, income, cash flow, and rational financial habits.',
    lessons: [
      {
        id: 'u1-l1',
        title: 'Money & Why We Use It',
        shortDesc: 'The transition from barter to universally trusted mediums of exchange.',
        dialogue: [
          { speaker: 'Aarav', text: 'Why did people stop exchanging goats for grain? Wouldn’t that be simpler?' },
          { speaker: 'Mr. LLAMA', text: 'Only until you need half an apple! Money solves the "coincidence of wants" so everyone agrees on a standard value unit.' }
        ],
        concept: 'Money is an agreed-upon tool that serves three key roles: a Medium of Exchange (you don’t need to trade your laptop for shoes), a Unit of Account (prices can be accurately compared), and a Store of Value (you can save today’s earnings for future needs).',
        example: 'If a coffee costs ₹150 and a metro ticket costs ₹50, money lets you directly see that one coffee is equivalent to three metro trips.',
        activityType: 'mcq',
        question: 'What fundamental economic friction does standard money eliminate compared to a barter system?',
        options: [
          'The Coincidence of Wants (both parties must want what the other has)',
          'All taxes and tariffs',
          'The need for banks and institutions',
          'Market price volatility'
        ],
        correctIndex: 0,
        explanation: 'Barter requires that both parties coincidentally desire what the other holds. Universal money eliminates this by serving as an intermediate medium.'
      },
      {
        id: 'u1-l2',
        title: 'What Financial Literacy Means',
        shortDesc: 'Applying financial awareness to make sound life decisions.',
        dialogue: [
          { speaker: 'Priya', text: 'Is financial literacy just memorizing complex math formulas?' },
          { speaker: 'Mr. LLAMA', text: 'Not at all! It is about behavior: knowing how to protect, grow, and align your rupees with what truly matters to you.' }
        ],
        concept: 'Financial literacy is the ability to understand and effectively use various financial skills, including personal financial management, budgeting, saving, and investing. It turns theoretical knowledge into everyday financial self-defense.',
        example: 'A financially literate person checks whether an EMI has hidden processing fees and ensures their emergency fund is in place before taking on credit.',
        activityType: 'scenario',
        question: 'Rohan just earned his first freelance paycheck of ₹10,000. Which choice reflects the most financially literate approach?',
        options: [
          'Spend ₹9,000 immediately on high-end gadgets to celebrate and leave ₹1,000 for food',
          'Take out a loan to multiply his earnings in an unregulated scheme',
          'Record the income, cover essential living needs, allocate ₹2,000 to emergency savings, and enjoy a modest guilt-free reward',
          'Keep the entire cash hidden under a mattress without tracking future bills'
        ],
        correctIndex: 2,
        explanation: 'Balancing immediate needs, long-term security (savings), and mindful enjoyment is the hallmark of financial literacy.'
      },
      {
        id: 'u1-l3',
        title: 'Income, Expenses & Balance',
        shortDesc: 'The simple equation that defines financial survival and wealth building.',
        dialogue: [
          { speaker: 'Aarav', text: 'My balance keeps dropping even though my salary arrived last week.' },
          { speaker: 'Mr. LLAMA', text: 'Every rupee must be accounted for! Balance = Opening Balance + Income - Expenses. Unchecked small expenses add up quietly!' }
        ],
        concept: 'Your financial reality rests on one immutable equation: Total Balance = Opening Balance + Total Income - Total Expenses. When income exceeds expenses, you generate positive cash flow (surplus). When expenses exceed income, you incur a deficit.',
        example: 'Starting with ₹10,000: Earn ₹5,000 -> balance ₹15,000. Spend ₹3,000 -> balance ₹12,000. Net surplus for the month = ₹2,000.',
        activityType: 'calculation',
        question: 'You start November with ₹8,000. You earn ₹12,000 from tutoring and spend ₹7,500 on rent, food, and transport. What is your final closing balance?',
        options: [
          '₹4,500',
          '₹12,500',
          '₹19,500',
          '₹8,000'
        ],
        correctIndex: 1,
        explanation: 'Closing Balance = ₹8,000 (opening) + ₹12,000 (income) - ₹7,500 (expenses) = ₹12,500.'
      },
      {
        id: 'u1-l4',
        title: 'Needs Versus Wants',
        shortDesc: 'Categorizing expenses to prevent lifestyle inflation.',
        dialogue: [
          { speaker: 'Priya', text: 'Is the newest smartphone with 5 cameras a need for my college coursework?' },
          { speaker: 'Mr. LLAMA', text: 'Communication and internet access are needs; a ₹90,000 luxury upgrade when your current phone works is a want!' }
        ],
        concept: 'Needs are essential expenditures required for physical survival, health, basic safety, and earning a living (basic groceries, modest shelter, essential utilities, commute). Wants are discretionary lifestyle choices that make life more comfortable or entertaining but are not essential.',
        example: 'Nutritious dal-chawal at home is a need. Dining at a trendy rooftop bistro three nights a week is a want.',
        activityType: 'sorting',
        question: 'Which of the following items is strictly a NEED for a college commuter?',
        options: [
          'A monthly metro pass to travel to university classes',
          'A designer leather backpack',
          'Noise-cancelling flagship wireless earbuds',
          'Daily iced caramel macchiatos from a premium cafe'
        ],
        correctIndex: 0,
        explanation: 'Reliable transit to classes directly impacts your ability to study and work, making a basic transit pass a core need.'
      },
      {
        id: 'u1-l5',
        title: 'Making Smart Financial Decisions',
        shortDesc: 'Overcoming cognitive biases and consumer impulses.',
        dialogue: [
          { speaker: 'Aarav', text: 'I saw a flash sale saying "50% OFF FOR THE NEXT 20 MINUTES!" Should I buy it?' },
          { speaker: 'Mr. LLAMA', text: 'Pause! Use the 48-Hour Rule: if you didn’t plan to buy it yesterday, a 50% discount on an unneeded item is still 100% money wasted!' }
        ],
        concept: 'Smart financial decision-making involves cooling-off periods (like the 48-Hour Rule for discretionary purchases), comparing price-per-use, and avoiding the "sunk cost fallacy". Every rupee you spend today is a rupee you cannot compound tomorrow.',
        example: 'Buying a sturdy ₹2,000 pair of shoes you wear 500 times costs ₹4/use. Buying a ₹5,000 party outfit worn twice costs ₹2,500/use.',
        activityType: 'mcq',
        question: 'What is the purpose of applying the "48-Hour Rule" before making non-essential purchases?',
        options: [
          'To ensure banks process the UPI transaction faster',
          'To let impulsive emotional spikes fade so rational evaluation can take over',
          'To wait for inflation to reduce the price of the product',
          'To check your credit score'
        ],
        correctIndex: 1,
        explanation: 'A 48-hour cooling-off period separates urgent emotional dopamine hits from genuine lifestyle utility.'
      }
    ]
  },
  {
    id: 'unit-2',
    title: 'Unit 2: Budgeting and Saving',
    description: 'Master practical budgeting frameworks, emergency funds, and consistent wealth preservation.',
    lessons: [
      {
        id: 'u2-l1',
        title: 'What Is a Budget?',
        shortDesc: 'A blueprint that tells your money where to go instead of wondering where it went.',
        dialogue: [
          { speaker: 'Priya', text: 'Does having a budget mean I can never have fun or buy ice cream?' },
          { speaker: 'Mr. LLAMA', text: 'Quite the opposite! A good budget specifically reserves guilt-free money for ice cream so you never feel anxious afterward.' }
        ],
        concept: 'A budget is not a financial straitjacket; it is a conscious spending roadmap. It assigns every rupee a job before the month begins, aligning your real-life spending with your personal goals.',
        example: 'A ₹8,000 monthly student budget designates ₹2,000 for food, ₹1,000 for travel, ₹1,500 for shopping, ₹1,000 for fun, and ₹2,500 for future savings.',
        activityType: 'mcq',
        question: 'What is the primary role of a proactive personal budget?',
        options: [
          'To punish yourself for spending any money on relaxation',
          'To give your money clear direction before spending happens, avoiding unexpected deficits',
          'To guarantee 100% returns on the stock market',
          'To eliminate the need for an emergency fund'
        ],
        correctIndex: 1,
        explanation: 'A budget acts as a proactive guide rather than a retroactive post-mortem of where cash leaked away.'
      },
      {
        id: 'u2-l2',
        title: 'Fixed vs. Variable Expenses',
        shortDesc: 'Differentiating between non-negotiable bills and flexible daily expenses.',
        dialogue: [
          { speaker: 'Aarav', text: 'My hostel rent is the exact same ₹5,000 every month, but my food bill fluctuates wildly.' },
          { speaker: 'Mr. LLAMA', text: 'Spot on! Rent is a Fixed Expense; groceries and eating out are Variable Expenses that you can dial up or down.' }
        ],
        concept: 'Fixed expenses occur at predictable intervals and constant amounts (rent, subscriptions, minimum insurance premiums). Variable expenses change in frequency and amount based on your day-to-day choices (groceries, leisure, electricity, shopping). Cutting variable expenses is the quickest way to survive tight months.',
        example: 'Hostel rent: ₹5,000/mo (Fixed). Weekend dining and snacks: ₹1,200 to ₹3,500/mo (Variable).',
        activityType: 'sorting',
        question: 'If you urgently need to save an extra ₹1,500 this week, which category is easiest to adjust immediately?',
        options: [
          'Variable expenses like dining out, leisure coffees, and ride-shares',
          'Your contracted monthly apartment rent',
          'Your college semester tuition fees',
          'Your annual property insurance premium'
        ],
        correctIndex: 0,
        explanation: 'Variable day-to-day discretionary spending can be altered on an hourly basis, unlike contracted fixed obligations.'
      },
      {
        id: 'u2-l3',
        title: 'Tracking Where Money Goes',
        shortDesc: 'The power of daily micro-tracking to spot cash leaks.',
        dialogue: [
          { speaker: 'Priya', text: 'Where did ₹1,500 vanish this week? I only bought chai and snacks!' },
          { speaker: 'Mr. LLAMA', text: 'A ₹50 chai twice a day plus a ₹50 pastry is ₹150 daily—over 10 days, that is ₹1,500! Tracking unmasks the leaks.' }
        ],
        concept: 'Micro-spending—frequent small purchases under ₹100—is the most common cause of budget failure. By recording expenses immediately using a simple tool like Pennywise, you maintain continuous awareness of your remaining category limits.',
        example: 'Logging your ₹60 bus ticket and ₹120 lunch prevents you from accidentally overspending your remaining ₹500 weekly allowance.',
        activityType: 'scenario',
        question: 'Why is logging an expense immediately after purchase more effective than reviewing bank statements at month-end?',
        options: [
          'It provides real-time feedback while you still have remaining budget to adjust your behavior',
          'It changes your bank account interest rate',
          'Bank statements never show debit card payments',
          'It prevents income tax audits'
        ],
        correctIndex: 0,
        explanation: 'Real-time logging prevents overspending before it occurs; monthly reviews only tell you damage after it is already done.'
      },
      {
        id: 'u2-l4',
        title: 'Creating Your First Budget',
        shortDesc: 'Step-by-step formula for building a resilient beginner monthly plan.',
        dialogue: [
          { speaker: 'Aarav', text: 'What are the 3 numbers I need to start my budget right now?' },
          { speaker: 'Mr. LLAMA', text: '1. Net monthly income. 2. Non-negotiable fixed costs. 3. Desired savings target. Whatever is left is your flexible spending pool!' }
        ],
        concept: 'To build a functional budget: First, record your realistic net take-home income. Second, deduct your fixed essentials. Third, set aside your savings first ("Pay Yourself First"). Finally, distribute the remaining balance among variable categories.',
        example: 'Income ₹10,000. Pay yourself first: ₹2,000 into savings. Fixed bills: ₹4,000. Remaining flexible pool: ₹4,000 for food, travel, and personal hobbies.',
        activityType: 'calculation',
        question: 'If your net monthly income is ₹15,000 and you decide to save 20% first, how much should you transfer to savings before spending on anything else?',
        options: [
          '₹1,500',
          '₹3,000',
          '₹5,000',
          '₹7,500'
        ],
        correctIndex: 1,
        explanation: '20% of ₹15,000 = (0.20 × 15,000) = ₹3,000.'
      },
      {
        id: 'u2-l5',
        title: 'The 50/30/20 Budgeting Rule',
        shortDesc: 'The gold-standard baseline framework for balanced cash allocation.',
        dialogue: [
          { speaker: 'Priya', text: 'How should I allocate my ₹20,000 stipend under 50/30/20?' },
          { speaker: 'Mr. LLAMA', text: '₹10,000 (50%) for Needs, ₹6,000 (30%) for Wants, and ₹4,000 (20%) for Savings and debt repayment!' }
        ],
        concept: 'Popularized by Sen. Elizabeth Warren, the 50/30/20 guideline divides after-tax income into: 50% for Needs (groceries, rent, basic transit, healthcare), 30% for Wants (hobbies, dining out, streaming services), and 20% for Savings & Debt Payoff (emergency fund, SIPs, debt reduction).',
        example: 'Under 50/30/20 on ₹10,000 income: ₹5,000 Needs, ₹3,000 Wants, ₹2,000 Savings.',
        activityType: 'slider',
        question: 'Under the 50/30/20 guideline, which category does a Netflix subscription belong to?',
        options: [
          'Needs (50%)',
          'Wants (30%)',
          'Savings (20%)',
          'Fixed Debt Obligation'
        ],
        correctIndex: 1,
        explanation: 'Entertainment streaming is a recreational preference (want), not an essential requirement for survival.'
      },
      {
        id: 'u2-l6',
        title: 'Planned vs. Unplanned Expenses',
        shortDesc: 'Preparing for non-monthly irregular expenses before they strike.',
        dialogue: [
          { speaker: 'Aarav', text: 'My laptop charger exploded! Does that ruin my entire monthly budget?' },
          { speaker: 'Mr. LLAMA', text: 'Only if you didn’t have a miscellaneous buffer! We distinguish planned monthly expenses from irregular surprise repairs.' }
        ],
        concept: 'Planned expenses are expected and budgeted for in advance. Unplanned expenses are unforeseen disruptions (bike tire puncture, sudden dental checkup, broken device). Building a modest "miscellaneous buffer" into your monthly budget absorbs shocks without derailing your savings.',
        example: 'Allocating ₹500/month into a "buffer envelope" means an unexpected ₹400 lab manual doesn\'t force you into borrowing.',
        activityType: 'mcq',
        question: 'What is the most effective way to protect a monthly budget against irregular expenses like festival gifts or device repairs?',
        options: [
          'Pre-fund a sinking fund or buffer allocation across multiple months',
          'Stop paying rent for that month',
          'Borrow from high-interest payday loan apps',
          'Pretend the expense did not happen and ignore it'
        ],
        correctIndex: 0,
        explanation: 'A sinking fund smoothly distributes irregular or shock expenses across monthly increments so no single month is wrecked.'
      },
      {
        id: 'u2-l7',
        title: 'The Emergency Fund',
        shortDesc: 'Your personal financial shock absorber and peace of mind.',
        dialogue: [
          { speaker: 'Priya', text: 'Should I invest all my savings in the stock market right away?' },
          { speaker: 'Mr. LLAMA', text: 'Never invest money you might need tomorrow! First, build 3 to 6 months of living expenses in a liquid, safe bank account.' }
        ],
        concept: 'An emergency fund is a safety net kept in cash, high-interest savings accounts, or liquid funds. It covers 3 to 6 months of core living expenses. It prevents you from being forced to liquidate investments at a loss or take high-interest loans during emergencies.',
        example: 'If your essential needs cost ₹6,000/month, a 3-month beginner emergency fund target is ₹18,000.',
        activityType: 'scenario',
        question: 'Where should your emergency fund be stored for maximum safety and immediate availability?',
        options: [
          'In a liquid savings account or overnight fund with instant withdrawal access',
          'In volatile small-cap crypto tokens',
          'Locked in a 10-year real estate parcel',
          'In high-risk penny stocks'
        ],
        correctIndex: 0,
        explanation: 'Emergency funds must prioritize liquidity and capital preservation over aggressive high returns.'
      },
      {
        id: 'u2-l8',
        title: 'Saving Consistently',
        shortDesc: 'The compound magic of small, automated habits.',
        dialogue: [
          { speaker: 'Aarav', text: 'Is it worth saving just ₹500 a month? That feels too small to matter.' },
          { speaker: 'Mr. LLAMA', text: '₹500 saved every month builds the habit muscle! Consistency compounds knowledge, discipline, and capital over time.' }
        ],
        concept: '"Pay Yourself First" is the secret of consistent savers. Rather than saving whatever happens to be left at the end of the month (which is usually zero), transfer your savings amount on day one when your income arrives.',
        example: 'Formula for wealth: Income - Savings = Spending. (NOT Income - Spending = Savings).',
        activityType: 'mcq',
        question: 'What does the principle "Pay Yourself First" mean in personal finance?',
        options: [
          'Treating yourself to an expensive party immediately after payday',
          'Transferring your intended savings to a separate account the moment income arrives, before paying discretionary expenses',
          'Paying your credit card bills with a new personal loan',
          'Spending all your money on clothes first'
        ],
        correctIndex: 1,
        explanation: 'Paying yourself first guarantees your future financial self is prioritized before day-to-day spending chips away at your funds.'
      },
      {
        id: 'u2-l9',
        title: 'Understanding Opportunity Cost',
        shortDesc: 'Every financial choice is also a decision to say NO to something else.',
        dialogue: [
          { speaker: 'Priya', text: 'If a friend offers to buy me a dinner for ₹2,000, did it cost me nothing?' },
          { speaker: 'Mr. LLAMA', text: 'In money, yes; but in time and attention, there is always an opportunity cost! Opportunity cost is the value of the next best alternative you sacrificed.' }
        ],
        concept: 'Opportunity cost is the loss of potential gain from other alternatives when one alternative is chosen. When you spend ₹5,000 on a luxury jacket today, the opportunity cost isn\'t just ₹5,000 cash—it is the ₹25,000 that ₹5,000 could have grown into over 15 years in an index fund.',
        example: 'Spending ₹3,000 on an impulse watch vs. investing ₹3,000 in your career certification that increases your salary by ₹5,000/month.',
        activityType: 'scenario',
        question: 'Which of the following best demonstrates an understanding of opportunity cost?',
        options: [
          'Recognizing that spending ₹4,000 on concert tickets means giving up the chance to fund your emergency savings goal this month',
          'Believing that if you have cash in your wallet, spending it has no consequence',
          'Assuming that any sale with a discount is free money',
          'Ignoring the future growth potential of invested money'
        ],
        correctIndex: 0,
        explanation: 'Every rupee spent on one choice cannot simultaneously fund another priority—that trade-off is opportunity cost.'
      }
    ]
  }
];

export const INITIAL_USER_STATS = {
  xp: 140,
  streak: 3,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  completedLessons: ['u1-l1', 'u1-l2'], // Demo completed lessons
  masteredUnits: []
};
