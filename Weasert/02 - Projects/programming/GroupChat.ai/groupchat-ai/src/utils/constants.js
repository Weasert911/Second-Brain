export const AGENT_COLORS = {
  CTO: '#5B8DEF',
  Founder: '#E07C54',
  Critic: '#E05454',
  Researcher: '#7CC87C',
  Moderator: '#B07CE8',
};

export const DEBATE_MODES = {
  Discussion: 'Discussion',
  'Devil\'s Advocate': "Devil's Advocate",
  Decision: 'Decision',
  Brainstorm: 'Brainstorm',
};

export const DEFAULT_AGENTS = [
  {
    id: 'cto',
    name: 'CTO',
    role: 'Technical Lead',
    color: AGENT_COLORS.CTO,
    personality: 'Pragmatic, technical, focused on implementation feasibility',
    focus: 'Architecture, scalability, technical debt, engineering trade-offs',
    model: null,
    isCustom: false,
  },
  {
    id: 'founder',
    name: 'Founder',
    role: 'Business Visionary',
    color: AGENT_COLORS.Founder,
    personality: 'Visionary, market-driven, focused on growth and user needs',
    focus: 'Market fit, strategy, revenue, competitive positioning',
    model: null,
    isCustom: false,
  },
  {
    id: 'critic',
    name: 'Critic',
    role: 'Quality Guardian',
    color: AGENT_COLORS.Critic,
    personality: 'Skeptical, detail-oriented, identifies risks and flaws',
    focus: 'Risk assessment, edge cases, potential failures, devil\'s advocate',
    model: null,
    isCustom: false,
  },
  {
    id: 'researcher',
    name: 'Researcher',
    role: 'Data Analyst',
    color: AGENT_COLORS.Researcher,
    personality: 'Analytical, evidence-based, focused on data and trends',
    focus: 'Research, data analysis, industry trends, best practices',
    model: null,
    isCustom: false,
  },
  {
    id: 'moderator',
    name: 'Moderator',
    role: 'Discussion Facilitator',
    color: AGENT_COLORS.Moderator,
    personality: 'Balanced, fair, ensures all voices are heard',
    focus: 'Consensus building, summarizing, keeping discussion on track',
    model: null,
    isCustom: false,
  },
];
