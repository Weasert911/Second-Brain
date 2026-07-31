import { getActiveProviderConfig } from '../providers/index';
import { streamChat, chat, listModels } from '../providers/index';
import { getProviderMeta } from '../providers/registry';

function getConfig() {
  const config = getActiveProviderConfig();
  if (!config) {
    throw new Error('No provider configured. Click Settings to set up an AI provider.');
  }
  if (!config.apiKey && getProviderMeta(config.providerId).requiresKey) {
    throw new Error('No API key set. Click Settings to configure your provider.');
  }
  return config;
}

function buildSystemPrompt(agent, topic, mode, conversationHistory) {
  let modeInstructions = '';

  switch (mode) {
    case 'Discussion':
      modeInstructions = 'Maintain a balanced, professional tone. Engage with all points raised by other agents.';
      break;
    case "Devil's Advocate":
      modeInstructions = 'Challenge assumptions aggressively. Push back on weak arguments. Be skeptical of consensus.';
      break;
    case 'Decision':
      modeInstructions = 'Work toward a concrete recommendation. Acknowledge valid points from others and build toward consensus.';
      break;
    case 'Brainstorm':
      modeInstructions = 'Focus on generating ideas and possibilities. Be constructive and expansive. No criticism for the first few exchanges.';
      break;
  }

  return `You are ${agent.name}, a ${agent.role} in an expert panel debate. 
Your personality: ${agent.personality}. 
Your focus: ${agent.focus}. 
The debate topic: ${topic}. 
Mode: ${mode}. ${modeInstructions}
Respond to other agents by name when agreeing or disagreeing. Be direct. No filler. Max 3 sentences unless making a critical argument.
Previous conversation: ${conversationHistory}`;
}

export async function* streamAgentResponse(_messages, agent, topic, mode, conversationHistory) {
  const config = getConfig();
  const systemPrompt = buildSystemPrompt(agent, topic, mode, conversationHistory);

  // Check if agent has its own model assignment
  const agentModel = agent.model || config.model;

  yield* streamChat(
    config.providerId,
    config.apiKey,
    config.endpoint,
    agentModel,
    systemPrompt,
    conversationHistory || 'Start the debate by introducing the topic and your initial perspective.'
  );
}

export async function generateConclusion(topic, messages, agents) {
  const config = getConfig();
  const messageHistory = messages.map((m) => `${m.sender}: ${m.content}`).join('\n');

  const systemPrompt = `You are a debate moderator concluding a panel discussion. 
Analyze the full conversation and provide a structured conclusion.
Topic: ${topic}
Panelists: ${agents.map((a) => `${a.name} (${a.role})`).join(', ')}`;

  const userMessage = `Here is the full debate conversation:\n\n${messageHistory}\n\nPlease provide a conclusion in this exact format:\n\nRecommendation: [Main recommendation in 1-2 sentences]\nWhy:\n- [Point 1]\n- [Point 2]\n- [Point 3]\nRisks:\n- [Risk 1]\n- [Risk 2]\nDissenting view: [If any agent disagreed, note their position. If consensus, say "No significant disagreement"]\nConfidence: [Low/Medium/High]`;

  return chat(config.providerId, config.apiKey, config.endpoint, config.model, systemPrompt, userMessage, 1000);
}

export async function generateSummary(topic, messages, agents) {
  const config = getConfig();
  const messageHistory = messages.map((m) => `${m.sender}: ${m.content}`).join('\n');

  const systemPrompt = 'You are a debate summarizer. Provide a concise bullet-point summary of the current state of agreement and disagreement.';
  const userMessage = `Topic: ${topic}\n\n${messageHistory}\n\nSummarize the key points of agreement and disagreement.`;

  return chat(config.providerId, config.apiKey, config.endpoint, config.model, systemPrompt, userMessage, 500);
}

// Re-export for settings
export { listModels } from '../providers/index';
