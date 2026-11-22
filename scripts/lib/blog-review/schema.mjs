/**
 * JSON Schema (draft 2020-12 subset) for one review report, plus a tiny
 * dependency-free validator for the keywords the schema uses.
 * docs/blog/review-report.schema.json is generated from REVIEW_REPORT_SCHEMA
 * (scripts/test-blog-review.mjs fails when they drift).
 */
import { CATEGORIES } from './rubric.mjs';

const severity = { enum: ['blocker', 'major', 'minor'] };
const categoryScore = {
  type: 'object',
  additionalProperties: false,
  required: ['score', 'threshold', 'pass'],
  properties: {
    score: { type: 'integer', minimum: 0, maximum: 100 },
    threshold: { type: 'integer', minimum: 0, maximum: 100 },
    pass: { type: 'boolean' },
  },
};

export const REVIEW_REPORT_SCHEMA = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://onboarding.orangecloud.vn/schemas/blog-review-report.json',
  title: 'Blog review report',
  type: 'object',
  additionalProperties: false,
  required: [
    'schemaVersion',
    'rubricVersion',
    'slug',
    'date',
    'round',
    'reviewedAt',
    'reviewer',
    'verdict',
    'overallScore',
    'categories',
    'claims',
    'findings',
    'sourcesChecked',
  ],
  properties: {
    schemaVersion: { const: 1 },
    rubricVersion: { type: 'string', minLength: 1 },
    slug: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
    date: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
    round: { type: 'integer', minimum: 1, maximum: 10 },
    reviewedAt: { type: 'string', minLength: 10 },
    reviewer: {
      type: 'object',
      additionalProperties: false,
      required: ['deterministic', 'model', 'network'],
      properties: {
        deterministic: { const: true },
        model: { type: ['string', 'null'] },
        network: { type: 'boolean' },
      },
    },
    verdict: { enum: ['pass', 'fail'] },
    overallScore: { type: 'integer', minimum: 0, maximum: 100 },
    categories: {
      type: 'object',
      additionalProperties: false,
      required: CATEGORIES,
      properties: Object.fromEntries(CATEGORIES.map((c) => [c, categoryScore])),
    },
    claims: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'text', 'location', 'sourceUrl', 'quote', 'quoteFound', 'verdict'],
        properties: {
          id: { type: 'string', pattern: '^C\\d{1,3}$' },
          text: { type: 'string', minLength: 1 },
          location: { type: 'string', pattern: '^(title|description|excerpt|s\\d+\\.p\\d+|s\\d+\\.heading|faq\\d+\\.(q|a)|image\\d+)$' },
          sourceUrl: { type: 'string', pattern: '^https://' },
          quote: { type: 'string', minLength: 1 },
          quoteFound: { type: 'boolean' },
          verdict: { enum: ['supported', 'contradicted', 'unverifiable', 'outdated'] },
          note: { type: 'string' },
        },
      },
    },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['rule', 'category', 'severity', 'message'],
        properties: {
          rule: { type: 'string', pattern: '^[A-Z][A-Z0-9]*-\\d{3}$' },
          category: { enum: CATEGORIES },
          severity,
          message: { type: 'string', minLength: 1 },
          location: { type: 'string' },
          fix: { type: 'string' },
        },
      },
    },
    sourcesChecked: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['url', 'official', 'status'],
        properties: {
          url: { type: 'string' },
          official: { type: 'boolean' },
          status: { type: ['integer', 'null'] },
        },
      },
    },
  },
};

/** Schema for what the LLM reviewer must return (re-verified by code afterwards). */
export const LLM_REVIEW_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['claims', 'uncitedClaims', 'findings'],
  properties: {
    claims: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'verdict'],
        properties: {
          id: { type: 'string', pattern: '^C\\d{1,3}$' },
          verdict: { enum: ['supported', 'contradicted', 'unverifiable', 'outdated'] },
          note: { type: 'string' },
        },
      },
    },
    uncitedClaims: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['location', 'text'],
        properties: { location: { type: 'string' }, text: { type: 'string' } },
      },
    },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['category', 'severity', 'message'],
        properties: {
          category: { enum: CATEGORIES },
          severity,
          message: { type: 'string', minLength: 1 },
          location: { type: 'string' },
          fix: { type: 'string' },
        },
      },
    },
  },
};

/** Schema for the claims ledger committed next to each post. */
export const CLAIMS_LEDGER_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['slug', 'claims'],
  properties: {
    slug: { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' },
    claims: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'location', 'text', 'sourceUrl', 'quote'],
        properties: {
          id: { type: 'string', pattern: '^C\\d{1,3}$' },
          location: { type: 'string', pattern: '^(title|description|excerpt|s\\d+\\.p\\d+|s\\d+\\.heading|faq\\d+\\.(q|a)|image\\d+)$' },
          text: { type: 'string', minLength: 1 },
          sourceUrl: { type: 'string', pattern: '^https://' },
          quote: { type: 'string', minLength: 20 },
        },
      },
    },
  },
};

function typeOf(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'number' && Number.isInteger(value)) return 'integer';
  return typeof value;
}

function typeMatches(expected, value) {
  const actual = typeOf(value);
  const list = Array.isArray(expected) ? expected : [expected];
  return list.some((t) => t === actual || (t === 'number' && actual === 'integer'));
}

/**
 * @param {object} schema
 * @param {unknown} value
 * @param {string} [at]
 * @returns {string[]} errors (empty when valid)
 */
export function validate(schema, value, at = '$') {
  const errors = [];
  if ('const' in schema && value !== schema.const) errors.push(`${at}: expected ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(value)) errors.push(`${at}: not one of ${schema.enum.join(', ')}`);
  if (schema.type && !typeMatches(schema.type, value)) {
    errors.push(`${at}: expected ${[].concat(schema.type).join('|')}, got ${typeOf(value)}`);
    return errors;
  }
  if (typeof value === 'string') {
    if (schema.minLength != null && value.length < schema.minLength) errors.push(`${at}: shorter than ${schema.minLength}`);
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) errors.push(`${at}: does not match ${schema.pattern}`);
  }
  if (typeof value === 'number') {
    if (schema.minimum != null && value < schema.minimum) errors.push(`${at}: below ${schema.minimum}`);
    if (schema.maximum != null && value > schema.maximum) errors.push(`${at}: above ${schema.maximum}`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems != null && value.length < schema.minItems) errors.push(`${at}: fewer than ${schema.minItems} items`);
    if (schema.items) value.forEach((item, i) => errors.push(...validate(schema.items, item, `${at}[${i}]`)));
  }
  if (typeOf(value) === 'object') {
    for (const key of schema.required || []) {
      if (!(key in value)) errors.push(`${at}: missing ${key}`);
    }
    const props = schema.properties || {};
    for (const [key, child] of Object.entries(value)) {
      if (props[key]) errors.push(...validate(props[key], child, `${at}.${key}`));
      else if (schema.additionalProperties === false) errors.push(`${at}: unexpected property ${key}`);
    }
  }
  return errors;
}
