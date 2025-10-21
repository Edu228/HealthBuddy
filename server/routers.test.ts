import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';

describe('tRPC Routers', () => {
  describe('Auth Router', () => {
    it('should have auth procedures', () => {
      expect(appRouter._def.procedures.auth).toBeDefined();
    });

    it('should have me and logout procedures', () => {
      const authRouter = appRouter._def.procedures.auth;
      expect(authRouter._def.procedures.me).toBeDefined();
      expect(authRouter._def.procedures.logout).toBeDefined();
    });
  });

  describe('Subscription Router', () => {
    it('should have subscription procedures', () => {
      expect(appRouter._def.procedures.subscription).toBeDefined();
    });
  });

  describe('Profile Router', () => {
    it('should have profile procedures', () => {
      expect(appRouter._def.procedures.profile).toBeDefined();
    });
  });

  describe('AI Router', () => {
    it('should have AI procedures', () => {
      expect(appRouter._def.procedures.ai).toBeDefined();
    });

    it('should have recommendation and chat procedures', () => {
      const aiRouter = appRouter._def.procedures.ai;
      expect(aiRouter._def.procedures.getRecommendation).toBeDefined();
      expect(aiRouter._def.procedures.chat).toBeDefined();
      expect(aiRouter._def.procedures.getMotivation).toBeDefined();
    });
  });

  describe('Wellness Router', () => {
    it('should have wellness procedures', () => {
      expect(appRouter._def.procedures.wellness).toBeDefined();
    });

    it('should have workout and meditation procedures', () => {
      const wellnessRouter = appRouter._def.procedures.wellness;
      expect(wellnessRouter._def.procedures.getRecommendedWorkouts).toBeDefined();
      expect(wellnessRouter._def.procedures.getRecommendedMeditations).toBeDefined();
    });
  });

  describe('Social Router', () => {
    it('should have social procedures', () => {
      expect(appRouter._def.procedures.social).toBeDefined();
    });

    it('should have community and gamification procedures', () => {
      const socialRouter = appRouter._def.procedures.social;
      expect(socialRouter._def.procedures.getCommunityPosts).toBeDefined();
      expect(socialRouter._def.procedures.getUserStats).toBeDefined();
      expect(socialRouter._def.procedures.getNotifications).toBeDefined();
    });
  });
});

