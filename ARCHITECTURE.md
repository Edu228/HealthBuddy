# HealthBuddy Architecture Guide

## System Overview

HealthBuddy is built using a modern full-stack architecture with clear separation of concerns. The application follows the tRPC-first approach, where type-safe procedures define the contract between frontend and backend.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (React)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages & Components (UI)                             │  │
│  │  - Home, Profile, Dashboard, Community, etc.        │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  tRPC Client (Type-Safe API Calls)                  │  │
│  │  - React Query Integration                          │  │
│  │  - Automatic Caching & Invalidation                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   API Layer (Express + tRPC)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  tRPC Routers (Type-Safe Procedures)                │  │
│  │  - subscription.ts  (Payment & Subscriptions)       │  │
│  │  - profile.ts       (User Profiles & Health Data)   │  │
│  │  - ai.ts            (AI Recommendations)            │  │
│  │  - wellness.ts      (Fitness & Nutrition)           │  │
│  │  - social.ts        (Community & Gamification)      │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Business Logic Layer                               │  │
│  │  - Authentication & Authorization                   │  │
│  │  - Data Validation & Transformation                 │  │
│  │  - External Service Integration                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer (Drizzle ORM)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Database Queries (Type-Safe)                        │  │
│  │  - User Management                                   │  │
│  │  - Health Tracking                                   │  │
│  │  - Community Data                                    │  │
│  │  - Subscription & Payment Records                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   MySQL Database                             │
│  - User Profiles & Authentication                           │
│  - Health & Wellness Data                                   │
│  - Community Posts & Comments                               │
│  - Subscription & Payment Information                       │
│  - Video Classes & Content Library                          │
│  - AI Conversation History                                  │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Architecture

The React frontend is organized into logical layers:

**Pages Layer**: Each page component represents a route in the application. Pages handle routing, layout, and orchestrate component interactions.

**Components Layer**: Reusable UI components built with shadcn/ui and Tailwind CSS. Components are stateless and receive data via props.

**Hooks Layer**: Custom React hooks encapsulate business logic and data fetching. Examples include `useAuth()`, `useProfile()`, and tRPC hooks.

**Context Layer**: React contexts manage global state like authentication, theme, and user preferences.

**Utilities Layer**: Helper functions for data transformation, formatting, and validation.

### Backend Architecture

The Express backend follows a layered architecture:

**Router Layer** (`server/routers/`): tRPC routers define type-safe procedures. Each router handles a specific domain (subscription, profile, AI, wellness, social).

**Database Layer** (`server/db.ts`): Query functions encapsulate database access. All database operations go through these functions.

**Business Logic Layer**: Procedures implement business rules, validation, and orchestration of database queries and external services.

**Core Infrastructure** (`server/_core/`): Shared utilities including authentication, LLM integration, image generation, and voice transcription.

## Data Flow

### Typical Request Flow

1. **User Action**: User interacts with React component (e.g., clicks button)
2. **tRPC Call**: Component calls tRPC procedure with input data
3. **API Request**: tRPC client sends HTTP request to `/api/trpc/[router].[procedure]`
4. **Authentication**: Express middleware validates JWT token and user session
5. **Input Validation**: Zod schema validates input data
6. **Business Logic**: Procedure executes business logic
7. **Database Query**: Query function fetches/updates data from MySQL
8. **Response**: Procedure returns typed response
9. **Client Update**: React Query caches response and updates UI
10. **UI Render**: Component re-renders with new data

### Example: Get Workout Recommendations

```
User clicks "Get Recommendations"
    ↓
wellness.getRecommendedWorkouts.useQuery() called
    ↓
POST /api/trpc/wellness.getRecommendedWorkouts
    ↓
Server: Check authentication
    ↓
Server: Validate input (user ID, preferences)
    ↓
Server: Call getRecommendedWorkouts(userId) from db.ts
    ↓
Database: Query workouts matching user profile
    ↓
Server: Call invokeLLM() to personalize recommendations
    ↓
Server: Return recommendations array
    ↓
Client: Cache response in React Query
    ↓
Component: Render recommendations list
```

## Database Schema

The database consists of 18 tables organized by domain:

### Authentication & User Management

**users**: Core user table with authentication info
- id, name, email, loginMethod, role, createdAt, lastSignedIn

**userProfiles**: Extended user information
- userId, ageGroup, gender, fitnessLevel, healthGoals, menstrualCycle, menopauseStatus, etc.

### Subscription & Payment

**subscriptionPlans**: Available subscription tiers
- id, name, price, features, duration

**userSubscriptions**: User subscription records
- userId, planId, startDate, endDate, status, autoRenew

**paymentTransactions**: Payment history
- id, userId, amount, currency, status, stripeTransactionId, createdAt

### Health & Wellness

**healthTracking**: User health metrics
- userId, date, steps, calories, waterIntake, sleepHours, mood, energy, etc.

**nutritionTracking**: Food and nutrition logs
- userId, date, mealType, foodItems, calories, macros, notes

**workoutLibrary**: Available exercises
- id, name, category, difficulty, targetAgeGroup, duration, instructions, videoUrl

**meditationLibrary**: Meditation sessions
- id, title, category, duration, instructor, audioUrl, targetAgeGroup

**nutritionPlans**: Meal plans
- id, name, targetAgeGroup, dietType, duration, meals, macros

**recipeLibrary**: Recipes
- id, title, ingredients, instructions, calories, macros, difficulty, isPremium

### Community & Social

**communityPosts**: User posts
- id, userId, content, imageUrl, category, likes, comments, createdAt

**communityComments**: Comments on posts
- id, postId, userId, content, likes, createdAt

**userPoints**: Gamification data
- userId, totalPoints, currentStreak, longestStreak, level, rank

**userAchievements**: Unlocked badges
- id, userId, badgeId, badgeName, badgeDescription, badgeIcon, unlockedAt

**userNotifications**: User notifications
- id, userId, type, title, message, isRead, actionUrl, createdAt

### AI & Content

**videoClasses**: Video lessons
- id, title, description, category, instructor, duration, difficulty, targetAgeGroup, videoUrl, isPremium

**aiConversations**: Chat history
- id, userId, messages (JSON), context (JSON), createdAt

## API Design

### tRPC Router Structure

Each router exports a set of procedures that follow a consistent pattern:

```typescript
export const myRouter = router({
  // Public procedure (no authentication required)
  getPublicData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Implementation
    }),

  // Protected procedure (authentication required)
  getPrivateData: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      // ctx.user contains authenticated user
      // Implementation
    }),

  // Mutation (data modification)
  updateData: protectedProcedure
    .input(z.object({ id: z.string(), data: z.any() }))
    .mutation(async ({ ctx, input }) => {
      // Implementation
    }),
});
```

### Response Format

All tRPC responses follow a consistent format:

```typescript
// Query responses
{
  data: T,
  error?: undefined
}

// Error responses
{
  error: {
    code: string,
    message: string
  }
}
```

## Authentication Flow

HealthBuddy uses OAuth-based authentication with JWT tokens:

1. **User Login**: User clicks login, redirected to OAuth provider
2. **OAuth Callback**: OAuth provider redirects back with authorization code
3. **Token Exchange**: Backend exchanges code for access token
4. **Session Creation**: Backend creates JWT token and sets secure cookie
5. **Authenticated Requests**: Frontend includes cookie in all requests
6. **Token Validation**: Backend validates token on each request
7. **User Context**: `ctx.user` contains authenticated user info in procedures

## External Service Integration

### LLM Integration

HealthBuddy integrates with language models for AI features:

- **Recommendations**: Generate personalized workout and nutrition recommendations
- **Chat**: Conversational AI for health advice
- **Motivation**: Generate motivational messages based on user state
- **Analysis**: Analyze health data and provide insights

LLM calls are made asynchronously with timeout handling and fallback messages.

### Payment Processing

Stripe integration handles subscriptions and payments:

- **Subscription Creation**: Create/update subscriptions via Stripe API
- **Payment Webhooks**: Handle payment events (succeeded, failed, refunded)
- **Invoice Management**: Track invoices and payment history
- **Customer Portal**: Allow users to manage subscriptions

### Video Streaming

Video classes are stored and streamed from S3 storage:

- **Upload**: Instructors upload videos to S3
- **Streaming**: Videos are served with adaptive bitrate
- **Access Control**: Premium features check subscription status

## Performance Considerations

### Caching Strategy

- **Query Caching**: tRPC automatically caches query results
- **Cache Invalidation**: Mutations invalidate related caches
- **TTL**: Configurable time-to-live for different query types
- **Database Indexes**: Strategic indexes on frequently queried columns

### Optimization Techniques

- **Pagination**: Community posts and notifications are paginated
- **Lazy Loading**: Database connections initialized on demand
- **Async Processing**: LLM calls and heavy computations are async
- **Connection Pooling**: MySQL connections are pooled for efficiency

## Security Architecture

### Authentication & Authorization

- **OAuth**: Secure OAuth-based authentication
- **JWT Tokens**: Stateless session management with JWT
- **Secure Cookies**: Session tokens stored in secure, httpOnly cookies
- **Role-Based Access**: Admin and user roles for authorization

### Data Protection

- **Input Validation**: All inputs validated with Zod schemas
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM
- **CSRF Protection**: CSRF tokens for state-changing operations
- **HTTPS**: All communications encrypted in transit
- **Sensitive Data**: Passwords and payment info never logged

### API Security

- **Rate Limiting**: Prevent abuse with rate limiting
- **CORS**: Restrict cross-origin requests
- **API Keys**: Secure API key management for external services
- **Error Handling**: Generic error messages to prevent information leakage

## Deployment Architecture

The application is designed for easy deployment:

- **Stateless Backend**: Express server is stateless, allowing horizontal scaling
- **Database Separation**: Database can be scaled independently
- **Environment Configuration**: All configuration via environment variables
- **Docker Support**: Containerized deployment with Docker
- **CI/CD Ready**: Automated testing and deployment pipelines

## Monitoring & Observability

### Logging

- **Structured Logging**: JSON-formatted logs for easy parsing
- **Log Levels**: Debug, info, warn, error levels
- **Log Aggregation**: Logs can be sent to centralized logging service

### Metrics

- **API Performance**: Response times per endpoint
- **Database Performance**: Query execution times
- **Error Rates**: Track API errors and failures
- **User Engagement**: Monitor feature usage

### Health Checks

- **Liveness**: `/health` endpoint for basic health check
- **Readiness**: Database connectivity check
- **Performance**: Response time monitoring

## Future Architecture Improvements

1. **GraphQL**: Consider GraphQL for more flexible data fetching
2. **Redis Caching**: Add Redis for distributed caching
3. **Message Queue**: Implement message queue for async tasks
4. **Microservices**: Split into microservices for better scalability
5. **Event Sourcing**: Implement event sourcing for audit trail
6. **Machine Learning**: Integrate ML models for better recommendations

---

This architecture provides a solid foundation for HealthBuddy's growth while maintaining code quality, security, and performance.

