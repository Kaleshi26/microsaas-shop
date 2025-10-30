# MicroSaaS Shop

A modern, full-stack e-commerce platform built with Next.js, NestJS, and cutting-edge technologies. This project demonstrates a complete microservices architecture with modern UI/UX, real-time features, and comprehensive monitoring.

## 🚀 Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **Prisma** - Modern database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching layer
- **OpenSearch** - Search and analytics
- **Kafka (Redpanda)** - Event streaming
- **Stripe** - Payment processing
- **gRPC** - Microservice communication
- **Prometheus** - Metrics collection
- **Grafana** - Monitoring dashboards

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Utility-first CSS
- **shadcn/ui** - Modern UI components
- **Framer Motion** - Smooth animations
- **Auth0** - Authentication
- **SWR** - Data fetching
- **Contentful** - Content management

### Infrastructure
- **Docker Compose** - Local development stack
- **Cloudflare Workers** - Edge caching
- **Kong** - API Gateway
- **Unleash** - Feature flags
- **LocalStack** - AWS services emulation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Cloudflare     │    │   Kong Gateway  │
│   (Frontend)    │◄───┤   Worker        │◄───┤                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                       ┌───────────────────────────────┼───────────────────────────────┐
                       │                               │                               │
              ┌────────▼────────┐              ┌───────▼───────┐              ┌────────▼────────┐
              │   NestJS API    │              │   Inventory   │              │   OpenSearch    │
              │   (Backend)     │              │   gRPC Service│              │   (Search)      │
              └────────┬────────┘              └───────────────┘              └─────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
┌───────▼───────┐ ┌───▼────┐ ┌───────▼───────┐
│  PostgreSQL   │ │ Redis  │ │   Kafka       │
│  (Database)   │ │(Cache) │ │ (Events)      │
└───────────────┘ └────────┘ └────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20-22
- pnpm
- Docker & Docker Compose

### 1. Clone and Install
```bash
git clone <repository-url>
cd microsaas-shop
pnpm install
```

### 2. Start Infrastructure
```bash
cd infra/compose
docker-compose up -d
```

### 3. Setup Database
```bash
cd ../../apps/api
pnpm prisma:migrate
pnpm seed
```

### 4. Start Applications
```bash
# Terminal 1 - API
cd apps/api
pnpm dev

# Terminal 2 - Web App
cd apps/web
pnpm dev

# Terminal 3 - Worker (optional)
cd apps/worker
pnpm dev
```

### 5. Access Applications
- **Web App**: http://localhost:3000
- **API**: http://localhost:3001
- **API Gateway**: http://localhost:8000
- **Grafana**: http://localhost:3002
- **OpenSearch**: http://localhost:9200
- **Unleash**: http://localhost:4242

## 📁 Project Structure

```
microsaas-shop/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── src/
│   │   │   ├── products/    # Products module
│   │   │   ├── orders/      # Orders module
│   │   │   ├── search/      # Search module
│   │   │   ├── inventory/   # Inventory gRPC service
│   │   │   ├── health/      # Health checks
│   │   │   └── metrics/     # Prometheus metrics
│   │   └── prisma/          # Database schema & migrations
│   ├── web/                 # Next.js frontend
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   └── lib/             # Utilities
│   └── worker/              # Cloudflare Worker
├── infra/
│   ├── compose/             # Docker Compose stack
│   └── terraform/           # Infrastructure as Code
└── package.json             # Root package.json
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/microsaas
REDIS_URL=redis://localhost:6379
OPENSEARCH_URL=http://localhost:9200
KAFKA_BROKER=localhost:19092
STRIPE_SECRET_KEY=sk_test_...
UNLEASH_URL=http://localhost:4242/api
UNLEASH_API_TOKEN=default:dev.token
NODE_ENV=development
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE=http://localhost:3001
AUTH0_SECRET=...
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://...
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...
CONTENTFUL_SPACE_ID=...
CONTENTFUL_DELIVERY_TOKEN=...
NEXT_PUBLIC_UNLEASH_URL=http://localhost:4243/api
NEXT_PUBLIC_UNLEASH_CLIENT_KEY=frontend.dev.key
```

## 🎨 Features

### Frontend
- ✨ **Modern UI** - Clean, responsive design with dark/light themes
- 🎭 **Animations** - Smooth transitions with Framer Motion
- 🔍 **Smart Search** - Real-time search with suggestions
- 🛒 **Shopping Cart** - Seamless checkout experience
- 👤 **Authentication** - Secure login with Auth0
- 📱 **Mobile First** - Responsive design for all devices
- ♿ **Accessible** - WCAG AA compliant

### Backend
- 🏗️ **Microservices** - Modular, scalable architecture
- 🔍 **Full-Text Search** - OpenSearch integration
- 📊 **Real-time Metrics** - Prometheus monitoring
- 🔄 **Event Streaming** - Kafka for async processing
- 💳 **Payment Processing** - Stripe integration
- 🏥 **Health Checks** - Comprehensive monitoring
- 🔒 **Security** - Input validation, CORS, rate limiting

### Infrastructure
- 🐳 **Containerized** - Docker for consistent environments
- ☁️ **Edge Caching** - Cloudflare Workers
- 🚪 **API Gateway** - Kong for routing
- 🎛️ **Feature Flags** - Unleash for A/B testing
- 📈 **Monitoring** - Grafana dashboards
- 🔧 **IaC** - Terraform for infrastructure

## 🧪 Testing

### API Tests
```bash
cd apps/api
pnpm test
```

### E2E Tests
```bash
# Run smoke tests
curl http://localhost:3001/health
curl http://localhost:3001/products
curl "http://localhost:3001/search?q=hoodie"
```

## 📊 Monitoring

### Prometheus Metrics
- `http_requests_total` - HTTP request counter
- `http_request_duration_seconds` - Request duration histogram
- `cache_hits_total` - Cache hit counter
- `search_requests_total` - Search request counter
- `kafka_publish_total` - Kafka publish counter

### Grafana Dashboards
Access Grafana at http://localhost:3002 to view:
- API performance metrics
- Database connection status
- Cache hit rates
- Search analytics

## 🚀 Deployment

### Production Checklist
- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Set up monitoring and alerting
- [ ] Configure CDN and caching
- [ ] Set up CI/CD pipeline
- [ ] Configure security headers
- [ ] Set up backup strategy

### Docker Production
```bash
# Build images
docker build -t microsaas-api ./apps/api
docker build -t microsaas-web ./apps/web

# Run with production config
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🎯 What I Learned

### Technical Skills
- **Microservices Architecture** - Designing and implementing scalable microservices
- **Event-Driven Development** - Using Kafka for async communication
- **Search Implementation** - OpenSearch for full-text search capabilities
- **Real-time Monitoring** - Prometheus and Grafana for observability
- **Modern Frontend** - Next.js 14 with App Router and modern React patterns
- **UI/UX Design** - Creating polished, accessible interfaces with shadcn/ui
- **Animation Design** - Implementing smooth, performant animations
- **Type Safety** - Comprehensive TypeScript usage across the stack

### Architecture Patterns
- **Domain-Driven Design** - Organizing code around business domains
- **CQRS** - Separating read and write operations
- **Event Sourcing** - Using events for state changes
- **Circuit Breaker** - Implementing resilience patterns
- **API Gateway** - Centralized routing and cross-cutting concerns

### DevOps & Infrastructure
- **Containerization** - Docker for consistent environments
- **Infrastructure as Code** - Terraform for reproducible infrastructure
- **Monitoring & Observability** - Comprehensive metrics and logging
- **Feature Flags** - A/B testing and gradual rollouts
- **Edge Computing** - Cloudflare Workers for global performance

### Best Practices
- **Code Organization** - Clean architecture and separation of concerns
- **Error Handling** - Graceful degradation and user feedback
- **Performance** - Caching, lazy loading, and optimization
- **Security** - Input validation, authentication, and authorization
- **Accessibility** - WCAG compliance and inclusive design
- **Testing** - Unit, integration, and E2E testing strategies

## 📸 Screenshots

### Home Page
- Modern hero section with gradient background
- Feature cards with hover animations
- Featured products grid with smooth transitions

### Products Page
- Advanced search with real-time suggestions
- Category filtering and view modes
- Product cards with stock indicators and hover effects

### Search Page
- Intelligent search with filters
- Search suggestions and analytics
- Results with relevance scoring

### Checkout Flow
- Multi-step checkout process
- Order summary and payment integration
- Success/error state handling

### Profile Page
- User account management
- Order history and tracking
- Responsive design for all devices

---

Built with ❤️ using modern web technologies and best practices.
