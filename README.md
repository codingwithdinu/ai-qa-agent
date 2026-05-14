# AI QA Agent

🧪 A production-ready AI-powered QA automation tool with browser recording, intelligent test case generation, and a sleek GUI dashboard.

## Features

✅ **Browser Recording** - Captures user interactions as structured JSON  
✅ **Intelligent Test Generation** - Creates 5 types of test cases (Positive, Negative, Edge, Validation, UI)  
✅ **Resilient Runner** - Step-by-step execution with error handling and screenshots  
✅ **Playwright Integration** - Generate executable Playwright specs  
✅ **Security-First** - Okta login with MFA, automatic secret redaction, no password storage  
✅ **GUI Dashboard** - Dark instrument-panel UI with real-time log streaming  
✅ **HTML + Markdown Reports** - Beautiful, tester-friendly output  
✅ **CLI Support** - Full command-line interface for CI/CD integration  

## Quick Start

### 1. Install Dependencies

```bash
git clone https://github.com/codingwithdinu/ai-qa-agent.git
cd ai-qa-agent
npm install
npx playwright install chromium
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env and set your APP_URL
```

### 3. Launch GUI Dashboard

```bash
npm run gui
# Opens http://localhost:5173
```

Then click buttons in the browser dashboard:

- **🟢 FULL PIPELINE** - Run: login → record → generate → run → report
- **🔐 LOGIN** - Authenticate with Okta
- **🎬 RECORD** - Capture user interactions
- **🧠 GENERATE** - Create test cases
- **🏃 RUN TESTS** - Execute all tests
- **📊 REPORT** - Generate HTML + Markdown reports

## CLI Commands

```bash
# Individual commands (for CI/CD)
npm run auth:login          # Authenticate
npm run record              # Record interactions
npm run generate            # Generate test cases
npm run run                 # Execute tests
npm run report              # Generate reports

# Or combine them
npm run full                # Run complete pipeline
```

## Project Structure

```
src/
├── auth/
│   ├── login.ts           (Okta login flow)
│   └── session.ts         (Session management)
├── recorder/
│   └── recorder.ts        (DOM listener + selector logic)
├── generators/
│   ├── test-case-generator.ts
│   └── playwright-generator.ts
├── runner/
│   └── runner.ts          (Resilient executor)
├── reporter/
│   └── reporter.ts        (HTML + Markdown output)
├── logger/
│   └── logger.ts          (Redacting logger)
├── utils/
│   ├── helpers.ts
│   └── validators.ts
├── server.ts              (Express GUI server)
└── cli.ts                 (CLI entry point)

gui/
└── index.html             (Dark dashboard UI)
```

## Security

🔒 **No password storage** - Uses Okta + manual confirmation  
🔒 **Automatic redaction** - Removes passwords/tokens from logs  
🔒 **Secure sessions** - Session files use chmod 600  
🔒 **Localhost only** - Server binds to 127.0.0.1  
🔒 **MFA support** - Handles multi-factor authentication  

## Architecture

### Pipeline Flow

```
LOGIN → RECORD → GENERATE → RUN → REPORT
```

1. **LOGIN** - Authenticate with Okta
   - Opens browser for manual login
   - Optionally pre-fills with environment credentials
   - Saves session to auth-state/storageState.json (chmod 600)

2. **RECORD** - Capture user interactions
   - Injects DOM listener via Playwright's exposeBinding
   - Captures clicks, inputs, changes, keypresses
   - Computes stable selectors (data-testid → id → name → aria-label → tag+nth-of-type)
   - Saves to recordings/recording.json

3. **GENERATE** - Create test cases
   - Rule-based: each action generates 5 test case types
   - Outputs JSON to cases/test-cases.json
   - Generates Playwright spec to cases/generated.spec.ts

4. **RUN** - Execute tests
   - Launches browser and runs each test case
   - Isolated try/catch per step
   - Captures screenshots on failure
   - Runs cross-cutting audits (buttons, images, links)

5. **REPORT** - Generate reports
   - HTML with KPIs, color-coded rows, screenshot links
   - Markdown with test table and verdict
   - Plain-English summaries

### GUI Features

🎨 **Dark Instrument-Panel Aesthetic**
- Monospace status indicators
- Signal-green primary CTA
- Real-time log streaming via SSE
- Artifact status indicators
- Summary cards with pass/fail counts

## Customization

### Extending Test Case Types

Edit `src/generators/test-case-generator.ts` to add more test case types beyond Positive/Negative/Edge/Validation/UI.

### Custom Validators

Add custom validators in `src/utils/validators.ts`:

```typescript
static validateCustomControl(selector: string, label: string): ValidationRule {
  return {
    controlType: 'custom',
    selector,
    label,
    required: true,
    expectedAttribute: 'custom-attr',
  };
}
```

### Integration with Claude API

Add Claude API calls in the generator for richer test case ideation. Example:

```typescript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}` },
  body: JSON.stringify({ model: 'claude-opus', messages: [...] }),
});
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5173 in use | Set `SERVER_PORT=5174` in .env |
| Playwright not found | Run `npx playwright install chromium` |
| Session expired | Delete auth-state/storageState.json and run login again |
| Tests not finding elements | Check selectors are unique (use data-testid on target elements) |
| Screenshots not saving | Ensure write permissions in project directory |

## Environment Variables

```bash
# Required
APP_URL=https://your-app.com

# Optional (Okta pre-fill - requires manual MFA if needed)
OKTA_USERNAME=your-username
OKTA_PASSWORD=your-password

# Optional (Server & Browser)
SERVER_PORT=5173
SERVER_HOST=localhost
HEADLESS=false
SLOW_MO=0
TIMEOUT=30000
LOG_LEVEL=info
REDACT_SECRETS=true
```

## Development

```bash
# TypeScript compilation check
npm run build

# Watch mode (with ts-node)
npm run dev
```

## License

MIT

## Support

For issues or questions:
- 📧 Open an issue on GitHub
- 📚 Check README.md
- 🐛 Review logs in logs/qa-agent.log

---

Built with ❤️ for QA engineers
