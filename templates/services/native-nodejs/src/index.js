const express = require('express');
const { logger } = require('./logger');
const { metricsMiddleware, metricsEndpoint } = require('./metrics');
const { transform } = require('./transform');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(metricsMiddleware);

// --- Health endpoint (replaces ACE admin API /apiv2/servers check) ---
app.get('/health', (_req, res) => {
  res.json({ status: 'UP' });
});

// --- Prometheus metrics (replaces ACE server statistics) ---
app.get('/metrics', metricsEndpoint);

/**
 * Main integration endpoint — replaces ACE HTTPInput → Compute → HTTPReply.
 *
 * ACE equivalent:
 *   HTTPInput "/api/process" → Compute_Transform (ESQL) → HTTPReply
 */
app.post('/api/process', (req, res) => {
  const input = req.body;
  logger.info({ type: input.type }, 'Received integration request');

  try {
    const result = transform(input);
    res.json(result);
  } catch (err) {
    logger.error({ err }, 'Transformation failed');
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Service started');
});
