function ConclusionCard({ conclusion }) {
  const parseConclusion = (text) => {
    const sections = {
      recommendation: '',
      why: [],
      risks: [],
      dissentingView: '',
      confidence: '',
    };

    const lines = text.split('\n');
    let currentSection = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.toLowerCase().startsWith('recommendation:')) {
        sections.recommendation = trimmed.replace(/recommendation:\s*/i, '');
        currentSection = 'recommendation';
      } else if (trimmed.toLowerCase().startsWith('why:')) {
        currentSection = 'why';
      } else if (trimmed.toLowerCase().startsWith('risks:')) {
        currentSection = 'risks';
      } else if (trimmed.toLowerCase().startsWith('dissenting view:')) {
        sections.dissentingView = trimmed.replace(/dissenting view:\s*/i, '');
        currentSection = 'dissenting';
      } else if (trimmed.toLowerCase().startsWith('confidence:')) {
        sections.confidence = trimmed.replace(/confidence:\s*/i, '');
        currentSection = 'confidence';
      } else if (currentSection === 'why' && trimmed.startsWith('-')) {
        sections.why.push(trimmed.replace(/^-\s*/, ''));
      } else if (currentSection === 'risks' && trimmed.startsWith('-')) {
        sections.risks.push(trimmed.replace(/^-\s*/, ''));
      }
    }

    return sections;
  };

  const parsed = parseConclusion(conclusion);

  return (
    <div className="conclusion-card mb-4">
      <div className="font-mono text-sm text-[#C8FF00] mb-4 tracking-wide">
        CONCLUSION
      </div>

      <div className="mb-4">
        <div className="text-xs text-[#666666] mb-1.5 font-mono uppercase tracking-wide">Recommendation</div>
        <div className="text-base text-[#E8E8E8] font-medium leading-relaxed">
          {parsed.recommendation}
        </div>
      </div>

      {parsed.why.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-[#666666] mb-2 font-mono uppercase tracking-wide">Why</div>
          <ul className="list-none space-y-1.5">
            {parsed.why.map((item, i) => (
              <li key={i} className="text-sm text-[#B0B0B0] flex items-start gap-2 leading-relaxed">
                <span className="text-[#C8FF00] mt-0.5">-</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {parsed.risks.length > 0 && (
        <div className="mb-4">
          <div className="text-xs text-[#666666] mb-2 font-mono uppercase tracking-wide">Risks</div>
          <ul className="list-none space-y-1.5">
            {parsed.risks.map((item, i) => (
              <li key={i} className="text-sm text-[#B0B0B0] flex items-start gap-2 leading-relaxed">
                <span className="text-[#E05454] mt-0.5">-</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {parsed.dissentingView && (
        <div className="mb-4">
          <div className="text-xs text-[#666666] mb-1.5 font-mono uppercase tracking-wide">Dissenting View</div>
          <div className="text-sm text-[#B0B0B0] leading-relaxed">{parsed.dissentingView}</div>
        </div>
      )}

      {parsed.confidence && (
        <div className="flex items-center gap-2.5">
          <span className="text-xs text-[#666666] font-mono uppercase tracking-wide">Confidence</span>
          <span
            className={`px-2.5 py-1 text-xs font-mono rounded ${
              parsed.confidence.toLowerCase().includes('high')
                ? 'bg-[#1A2510] text-[#7CC87C] border border-[#7CC87C]'
                : parsed.confidence.toLowerCase().includes('medium')
                ? 'bg-[#1A1510] text-[#E07C54] border border-[#E07C54]'
                : 'bg-[#1A1010] text-[#E05454] border border-[#E05454]'
            }`}
          >
            {parsed.confidence}
          </span>
        </div>
      )}
    </div>
  );
}

export default ConclusionCard;
