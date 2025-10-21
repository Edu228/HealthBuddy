# HealthBuddy Testing Guide

## Overview

This document outlines the testing strategy for the HealthBuddy application, including unit tests, integration tests, and performance considerations.

## Running Tests

To run all tests:

```bash
pnpm vitest run
```

To run tests in watch mode:

```bash
pnpm vitest
```

To run tests with UI:

```bash
pnpm vitest --ui
```

## Test Structure

### Database Tests (`server/db.test.ts`)

Tests for database query functions:
- User retrieval and profile management
- Points and gamification data
- Error handling when database is unavailable

### Router Tests (`server/routers.test.ts`)

Tests for tRPC router structure:
- Verifies all expected routers are defined
- Checks that procedures exist and are properly configured
- Validates router hierarchy

## Test Coverage

The application includes tests for:

1. **Database Layer**
   - User profile queries
   - Points and achievements
   - Community posts and comments
   - Notifications

2. **API Layer (tRPC)**
   - Authentication procedures
   - Subscription management
   - Profile management
   - AI recommendations
   - Wellness features
   - Social features

3. **Integration**
   - End-to-end subscription flow
   - Profile creation and updates
   - AI recommendation generation
   - Community interaction

## Performance Considerations

### API Response Times

- Recommendation endpoints: < 2 seconds
- Profile queries: < 500ms
- Community posts: < 1 second
- Notifications: < 500ms

### Database Optimization

- Indexes on frequently queried columns (userId, createdAt)
- Connection pooling for MySQL
- Query result caching where appropriate

### AI Integration

- LLM calls are async and non-blocking
- Timeout handling for slow responses
- Fallback messages for service unavailability

## Security Testing

### Authentication

- Protected procedures require valid user context
- Session cookies are properly validated
- Logout clears session state

### Data Privacy

- User health data is isolated per user
- Community posts can be made private
- Notifications are user-specific

### Subscription Verification

- Premium features check subscription status
- Trial period is enforced
- Payment transactions are logged

## Manual Testing Checklist

### User Registration & Authentication
- [ ] User can sign up with OAuth
- [ ] User receives welcome notification
- [ ] 7-day trial is automatically activated
- [ ] User can view subscription status

### Profile Setup
- [ ] User can complete profile with age, gender, fitness level
- [ ] User can specify health goals
- [ ] User can set menstrual cycle preferences
- [ ] Profile updates are saved correctly

### AI Interactions
- [ ] AI provides personalized recommendations
- [ ] Recommendations adapt to user mood/energy
- [ ] Chat responses are natural and helpful
- [ ] Motivational messages are appropriate for age group

### Wellness Features
- [ ] Workout recommendations match fitness level
- [ ] Meditations are categorized correctly
- [ ] Nutrition plans adapt to dietary preferences
- [ ] Exercise suggestions change based on menstrual cycle

### Community Features
- [ ] Users can create posts
- [ ] Users can comment on posts
- [ ] Like counts update correctly
- [ ] Community feed loads efficiently

### Gamification
- [ ] Points are awarded for activities
- [ ] Levels increase with points
- [ ] Badges are unlocked correctly
- [ ] Notifications appear for achievements

### Subscription Management
- [ ] Basic plan blocks premium content
- [ ] Premium plan allows all content
- [ ] Upgrade/downgrade works correctly
- [ ] Cancellation is processed

## Continuous Integration

Tests should be run on every commit:

```yaml
# Example CI configuration
test:
  script:
    - pnpm install
    - pnpm vitest run
    - pnpm build
```

## Known Limitations

1. Database tests require a test database connection
2. LLM tests are mocked to avoid API costs
3. Payment processing is tested with Stripe test keys
4. Video streaming is tested with mock URLs

## Future Improvements

1. Add E2E tests with Playwright
2. Add performance benchmarks
3. Add load testing for concurrent users
4. Add accessibility testing
5. Add visual regression testing

