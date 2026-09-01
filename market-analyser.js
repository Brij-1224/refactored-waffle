/**
 * AI Automation Market Analyser (Multi-Agent)
 * - MarketDataAgent: validates and normalizes input
 * - TrendAgent: detects growth momentum
 * - CompetitionAgent: scores market saturation
 * - OpportunityAgent: calculates weighted opportunity score
 */

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class MarketDataAgent {
  normalize(input) {
    if (!input || typeof input !== 'object') {
      throw new ValidationError('Input must be an object.');
    }

    const required = ['marketSize', 'growthRate', 'adoptionRate', 'competitorCount'];
    for (const key of required) {
      if (!(key in input)) {
        throw new ValidationError(`Missing required field: ${key}`);
      }
      if (typeof input[key] !== 'number' || Number.isNaN(input[key])) {
        throw new ValidationError(`Field "${key}" must be a valid number.`);
      }
      if (input[key] < 0) {
        throw new ValidationError(`Field "${key}" must be non-negative.`);
      }
    }

    return {
      marketSize: input.marketSize,
      growthRate: input.growthRate,
      adoptionRate: input.adoptionRate,
      competitorCount: input.competitorCount,
      regulationRisk: Number(input.regulationRisk ?? 0),
      integrationComplexity: Number(input.integrationComplexity ?? 0)
    };
  }
}

class TrendAgent {
  analyze(data) {
    const growthSignal = this.#clamp(data.growthRate / 100, 0, 1);
    const adoptionSignal = this.#clamp(data.adoptionRate / 100, 0, 1);
    return (growthSignal * 0.6) + (adoptionSignal * 0.4);
  }

  #clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
}

class CompetitionAgent {
  analyze(data) {
    const densityPenalty = this.#clamp(data.competitorCount / 100, 0, 1);
    return 1 - densityPenalty;
  }

  #clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
}

class OpportunityAgent {
  analyze(data, trendScore, competitionScore) {
    const sizeSignal = this.#clamp(Math.log10(data.marketSize + 1) / 6, 0, 1);
    const riskPenalty = this.#clamp(data.regulationRisk / 100, 0, 1);
    const complexityPenalty = this.#clamp(data.integrationComplexity / 100, 0, 1);

    const score =
      (sizeSignal * 0.30) +
      (trendScore * 0.35) +
      (competitionScore * 0.25) -
      (riskPenalty * 0.05) -
      (complexityPenalty * 0.05);

    const normalized = this.#clamp(score, 0, 1);

    return {
      opportunityScore: Number((normalized * 100).toFixed(2)),
      recommendation:
        normalized >= 0.75
          ? 'Strong opportunity'
          : normalized >= 0.5
            ? 'Promising opportunity'
            : normalized >= 0.3
              ? 'Moderate opportunity'
              : 'Low opportunity'
    };
  }

  #clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
}

class AutomationMarketAnalyser {
  constructor() {
    this.marketDataAgent = new MarketDataAgent();
    this.trendAgent = new TrendAgent();
    this.competitionAgent = new CompetitionAgent();
    this.opportunityAgent = new OpportunityAgent();
  }

  analyze(input) {
    const data = this.marketDataAgent.normalize(input);
    const trendScore = this.trendAgent.analyze(data);
    const competitionScore = this.competitionAgent.analyze(data);
    const opportunity = this.opportunityAgent.analyze(data, trendScore, competitionScore);

    return {
      input: data,
      signals: {
        trendScore: Number((trendScore * 100).toFixed(2)),
        competitionScore: Number((competitionScore * 100).toFixed(2))
      },
      ...opportunity
    };
  }
}

module.exports = {
  AutomationMarketAnalyser,
  ValidationError
};

if (require.main === module) {
  const analyser = new AutomationMarketAnalyser();
  const result = analyser.analyze({
    marketSize: 25000000000,
    growthRate: 24,
    adoptionRate: 58,
    competitorCount: 34,
    regulationRisk: 20,
    integrationComplexity: 35
  });

  console.log(JSON.stringify(result, null, 2));
}
