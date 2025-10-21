# HealthBuddy Setup Guide

## Local Development Setup

This guide walks you through setting up HealthBuddy for local development.

## Prerequisites

Before starting, ensure you have:

- **Node.js**: Version 18 or higher ([download](https://nodejs.org/))
- **pnpm**: Package manager ([install guide](https://pnpm.io/installation))
- **MySQL**: Version 5.7 or higher ([download](https://www.mysql.com/downloads/))
- **Git**: Version control ([download](https://git-scm.com/))

### Verify Installations

```bash
node --version    # Should be v18+
pnpm --version    # Should be 8+
mysql --version   # Should be 5.7+
git --version     # Should be 2.0+
```

## Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/HealthBuddyApp.git
cd HealthBuddyApp
```

## Step 2: Install Dependencies

```bash
pnpm install
```

This installs all required packages for both frontend and backend.

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Database Configuration
DATABASE_URL=mysql://root:password@localhost:3306/healthbuddy

# Authentication
JWT_SECRET=your-secret-key-here-min-32-chars
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_APP_ID=your-app-id-from-manus

# Application Configuration
VITE_APP_TITLE=HealthBuddy
VITE_APP_LOGO=https://your-domain.com/logo.png

# Stripe Configuration (for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# LLM & API Configuration
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key-here

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=https://analytics.your-domain.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# Owner Configuration
OWNER_NAME=Your Name
OWNER_OPEN_ID=your-open-id
```

### Getting API Keys

**Manus OAuth**: Register at [Manus](https://manus.im) to get OAuth credentials.

**Stripe**: Create a test account at [Stripe Dashboard](https://dashboard.stripe.com).

**LLM API**: Contact your LLM service provider for API keys.

## Step 4: Set Up Database

### Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE healthbuddy;
USE healthbuddy;
EXIT;
```

### Run Migrations

```bash
pnpm db:push
```

This creates all necessary tables and applies migrations.

### Verify Database

```bash
mysql -u root -p healthbuddy -e "SHOW TABLES;"
```

You should see tables like `users`, `userProfiles`, `subscriptionPlans`, etc.

## Step 5: Start Development Server

```bash
pnpm dev
```

The application will start on `http://localhost:3000`.

### What This Does

- Starts the Express backend server
- Starts the Vite development server for the React frontend
- Enables hot module reloading for rapid development
- Watches for file changes and auto-reloads

## Step 6: Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

You should see the HealthBuddy home page with an "Example Button".

## Development Workflow

### Making Changes

**Backend Changes**: Edit files in `server/` directory. Changes are automatically reloaded.

**Frontend Changes**: Edit files in `client/src/` directory. Changes are automatically reflected in the browser.

**Database Schema Changes**: Edit `drizzle/schema.ts`, then run `pnpm db:push`.

### Running Tests

```bash
# Run all tests
pnpm vitest

# Run tests in watch mode
pnpm vitest --watch

# Run tests with UI
pnpm vitest --ui
```

### Building for Production

```bash
pnpm build
```

This creates optimized production builds in the `dist/` directory.

## Common Tasks

### Add a New Database Table

1. Edit `drizzle/schema.ts`:
```typescript
export const myTable = mysqlTable("myTable", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: varchar("name", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow(),
});
```

2. Run migration:
```bash
pnpm db:push
```

3. Add query functions in `server/db.ts`:
```typescript
export async function getMyTableData(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(myTable).where(eq(myTable.id, id));
  return result.length > 0 ? result[0] : undefined;
}
```

4. Create tRPC procedure in appropriate router file.

### Add a New API Endpoint

1. Create or edit router file in `server/routers/`:
```typescript
export const myRouter = router({
  getData: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await getMyTableData(input.id);
    }),
});
```

2. Add router to `server/routers.ts`:
```typescript
import { myRouter } from "./routers/my";

export const appRouter = router({
  // ... other routers
  my: myRouter,
});
```

3. Use in frontend:
```typescript
const { data } = trpc.my.getData.useQuery({ id: "123" });
```

### Add a New Frontend Page

1. Create component in `client/src/pages/MyPage.tsx`:
```typescript
export default function MyPage() {
  return <div>My Page Content</div>;
}
```

2. Register route in `client/src/App.tsx`:
```typescript
<Route path="/my-page" component={MyPage} />
```

3. Add navigation link in layout.

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 pnpm dev
```

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

**Solution**: Ensure MySQL is running:
```bash
# macOS
brew services start mysql

# Linux
sudo systemctl start mysql

# Windows
net start MySQL80
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

### TypeScript Errors

```bash
# Rebuild TypeScript
pnpm build

# Check for type errors
pnpm tsc --noEmit
```

## IDE Setup

### Visual Studio Code

Install recommended extensions:

- **ES7+ React/Redux/React-Native snippets** (dsznajder.es7-react-js-snippets)
- **Prettier - Code formatter** (esbenp.prettier-vscode)
- **ESLint** (dbaeumer.vscode-eslint)
- **Drizzle ORM** (drizzle-team.drizzle-orm-vscode)

### WebStorm/IntelliJ

- Built-in support for TypeScript, React, and Node.js
- Configure run configuration for `pnpm dev`
- Enable ESLint integration

## Next Steps

After setup, explore:

1. **Backend Development**: Check `server/routers/` to understand API structure
2. **Frontend Development**: Review `client/src/pages/` for UI components
3. **Database**: Study `drizzle/schema.ts` for data model
4. **Testing**: Run `pnpm vitest` to see test examples
5. **Documentation**: Read DEPLOYMENT.md for production setup

## Getting Help

- Check existing issues on GitHub
- Review documentation files (TESTING.md, OPTIMIZATION.md, DEPLOYMENT.md)
- Contact the development team

## Additional Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/)
- [tRPC Documentation](https://trpc.io/)
- [Drizzle ORM Guide](https://orm.drizzle.team/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

**Happy coding! 🚀**

