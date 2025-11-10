# French Reader

A full-stack application for learning French through interactive reading exercises.

## Features

- Interactive French text reading
- Text-to-speech pronunciation
- Progress tracking
- Difficulty levels
- PWA support for offline access

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for bundling
- Tailwind CSS + Radix UI for styling
- PWA support with Workbox
- Vitest for testing
- ESLint + Prettier

### Backend
- Node.js with Express
- TypeScript
- Prisma with PostgreSQL
- Jest for testing
- ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js >= 20
- PostgreSQL >= 15
- npm >= 10

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start development servers:
```bash
npm run dev
```

## Development

- Frontend: http://localhost:3000
- Backend: http://localhost:4000
- API Documentation: http://localhost:4000/api-docs

## Testing

```bash
npm test
```

## Building for Production

```bash
npm run build
```

## Contributing

1. Use conventional commits
2. Follow ESLint and Prettier rules
3. Write tests for new features

## License

MIT