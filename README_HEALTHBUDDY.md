# HealthBuddy - Your Personal Health & Wellness AI Companion

## Overview

HealthBuddy is a revolutionary health and wellness application designed to be your best friend in your health journey. Powered by advanced AI, HealthBuddy provides personalized fitness recommendations, mental wellness guidance, nutrition planning, and community support across iOS, Android, and web platforms.

The application is tailored for three distinct age groups (young adults, middle-aged, and seniors) and both genders, with special attention to health conditions like menopause and menstrual cycles. HealthBuddy adapts its recommendations based on your mood, energy levels, and current state, providing natural, non-manipulative guidance toward a healthier lifestyle.

## Key Features

### Personalized AI Companion

The heart of HealthBuddy is its intelligent AI system that understands your unique health profile. The AI learns from your inputs about age, gender, fitness level, health goals, and current state (mood, energy, menstrual cycle, menopausal symptoms) to provide tailored recommendations that feel like advice from a trusted friend.

### Fitness & Workout Recommendations

HealthBuddy offers a comprehensive library of workouts adapted for different age groups and fitness levels. Whether you prefer gym sessions, outdoor activities, or home workouts, the AI recommends exercises that match your preferences and current state. For example, if you're experiencing low mood, the AI might suggest energizing HIIT workouts or uplifting dance classes.

### Mental Wellness & Meditation

The application includes guided meditations, breathing exercises, and stress management techniques specifically designed for different age groups. The AI recommends meditation sessions based on your emotional state and can provide motivational support when you need it most.

### Nutrition & Meal Planning

HealthBuddy provides personalized nutrition plans, healthy recipes, and calorie tracking adapted to your dietary preferences and health goals. The AI considers your age group and any specific health conditions when recommending meals and nutritional guidance.

### Video Classes & Tutorials

Access a library of video classes covering yoga, HIIT, pilates, dance, and more. Classes are categorized by difficulty level and age-appropriateness. Premium subscribers get unlimited access to all video content.

### Community & Social Features

Connect with other users, share your progress, participate in challenges, and receive support from the community. The app includes features for posting progress updates, commenting on others' achievements, and building accountability partnerships.

### Gamification & Achievements

Stay motivated with a points system, levels, and badges. Earn points for completing workouts, logging meals, meditating, and engaging with the community. Unlock achievements and climb the ranks from Beginner to Platinum.

### Subscription Model

HealthBuddy offers three tiers:

**Free Trial (7 Days)**: Full access to all premium features for one week, perfect for exploring the app.

**Basic Plan (£5/month)**: Access to personalized recommendations, basic workout library, and community features.

**Premium Plan (£12/month)**: Unlimited access to all video classes, advanced nutrition planning, priority AI support, and exclusive content.

## Technical Architecture

### Frontend

The application is built with React and TypeScript, providing a responsive user interface that works seamlessly across web, iOS, and Android platforms. The frontend uses modern UI components from shadcn/ui and Tailwind CSS for consistent styling.

### Backend

The backend is built with Express.js and tRPC, providing type-safe API endpoints. All data is validated and processed securely on the server side.

### Database

MySQL (TiDB compatible) stores all user data, health tracking information, community posts, and subscription details. The database is optimized with strategic indexing for fast queries.

### AI Integration

HealthBuddy integrates with advanced language models (LLMs) for natural conversation and personalized recommendations. The AI system is designed to be helpful, ethical, and non-manipulative, always prioritizing the user's wellbeing.

### Authentication

OAuth-based authentication ensures secure user access. Sessions are managed with JWT tokens stored in secure cookies.

### Payment Processing

Stripe integration handles subscription payments securely. The application supports multiple payment methods and currencies.

## Project Structure

```
HealthBuddyApp/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── contexts/         # React contexts
│   │   └── lib/              # Utility functions
│   └── public/               # Static assets
├── server/                    # Express backend
│   ├── routers/              # tRPC routers
│   │   ├── subscription.ts   # Subscription management
│   │   ├── profile.ts        # User profile
│   │   ├── ai.ts             # AI recommendations
│   │   ├── wellness.ts       # Fitness & wellness
│   │   └── social.ts         # Community & gamification
│   ├── db.ts                 # Database queries
│   └── _core/                # Core infrastructure
├── drizzle/                   # Database schema & migrations
├── DEPLOYMENT.md             # Deployment instructions
├── TESTING.md                # Testing guide
├── OPTIMIZATION.md           # Performance optimization
└── package.json              # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- pnpm package manager
- MySQL database (TiDB or compatible)
- Stripe account for payment processing
- OAuth credentials from Manus

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/HealthBuddyApp.git
cd HealthBuddyApp
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

4. Initialize the database:
```bash
pnpm db:push
```

5. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## Development Workflow

### Adding a New Feature

1. **Update Database Schema**: Add new tables or columns to `drizzle/schema.ts`
2. **Run Migrations**: Execute `pnpm db:push` to apply schema changes
3. **Add Database Queries**: Implement query functions in `server/db.ts`
4. **Create API Procedures**: Add tRPC procedures in appropriate router file
5. **Build Frontend**: Create React components in `client/src/pages/`
6. **Test**: Write tests in corresponding `.test.ts` files
7. **Deploy**: Follow deployment instructions in DEPLOYMENT.md

### Testing

Run tests with:
```bash
pnpm vitest
```

Run tests in watch mode:
```bash
pnpm vitest --watch
```

For more details, see TESTING.md.

## Deployment

### Web Deployment

The application can be deployed to any Node.js hosting platform. See DEPLOYMENT.md for detailed instructions for:
- Vercel
- AWS Elastic Beanstalk
- Heroku
- Docker

### Mobile Deployment

For iOS and Android deployment, see the Mobile Deployment section in DEPLOYMENT.md. The process includes:
- Building native apps with React Native
- Code signing and certificates
- App Store and Google Play submission

## Configuration

### Environment Variables

Key environment variables for production:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | MySQL connection string |
| `JWT_SECRET` | Session signing secret |
| `STRIPE_SECRET_KEY` | Stripe API key for payments |
| `BUILT_IN_FORGE_API_KEY` | LLM service API key |
| `VITE_APP_TITLE` | Application title |
| `VITE_APP_LOGO` | Logo URL |

See DEPLOYMENT.md for complete list.

### Database Configuration

The application uses Drizzle ORM with MySQL. Connection pooling is configured automatically. For optimal performance, ensure your database has proper indexes on frequently queried columns.

## Performance & Optimization

HealthBuddy is optimized for performance across all platforms:

- **API Response Times**: < 2 seconds for AI recommendations, < 500ms for standard queries
- **Database Queries**: Optimized with strategic indexing
- **Video Streaming**: Adaptive quality based on network conditions
- **Offline Support**: Critical data cached locally

See OPTIMIZATION.md for detailed performance strategies.

## Security

HealthBuddy implements multiple security measures:

- **Data Encryption**: All sensitive data is encrypted in transit and at rest
- **Authentication**: OAuth-based with JWT tokens
- **Authorization**: Role-based access control (user, admin)
- **Input Validation**: All inputs validated server-side
- **Rate Limiting**: API endpoints protected against abuse
- **HTTPS**: All communications encrypted

## Monitoring & Support

### Health Checks

Monitor application health with:
```bash
curl https://your-domain.com/health
```

### Logging

Application logs are available in production environment. Configure log aggregation with tools like Datadog or New Relic.

### Error Tracking

Sentry integration provides real-time error tracking and alerting.

## Contributing

To contribute to HealthBuddy:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -am 'Add feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request

Please ensure all tests pass and code follows the project style guide.

## Roadmap

Future enhancements planned for HealthBuddy:

- **Wearable Integration**: Connect with Apple Watch, Fitbit, and other wearables
- **Advanced Analytics**: Detailed health insights and progress tracking
- **Live Classes**: Real-time group fitness classes with instructors
- **AI Coaching**: More advanced AI coaching with voice interaction
- **Nutrition Tracking**: Enhanced meal logging with barcode scanning
- **Social Features**: Friend connections and group challenges

## Troubleshooting

### Common Issues

**Database Connection Error**:
- Verify `DATABASE_URL` is correct
- Check database server is running
- Ensure network connectivity

**LLM Service Timeout**:
- Check API key validity
- Verify network connectivity
- Increase timeout in environment

**Payment Processing Failures**:
- Verify Stripe keys are correct
- Check webhook configuration
- Review transaction logs

See DEPLOYMENT.md for more troubleshooting tips.

## Support

For support and questions:

- Check the documentation in DEPLOYMENT.md, TESTING.md, and OPTIMIZATION.md
- Review the project's GitHub issues
- Contact the development team

## License

HealthBuddy is proprietary software. All rights reserved.

## Acknowledgments

HealthBuddy was built with modern web technologies including React, Express, tRPC, Drizzle ORM, and advanced AI integration. Special thanks to all contributors and the open-source community.

## Contact

For more information about HealthBuddy, visit our website or contact the development team.

---

**HealthBuddy - Your Best Friend in Health & Wellness**

*Empowering millions to live healthier, happier lives through personalized AI guidance.*

