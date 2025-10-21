import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import { getDb } from "../db";
import { supportTickets, supportMessages } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// Support agent types
type SupportAgent = "support" | "supervisor" | "manager";

// System prompts for each agent
const agentPrompts = {
  support: `You are a friendly and helpful HealthBuddy Support Agent. Your role is to:
- Help users with technical issues, app features, and general questions
- Provide clear and concise answers
- Be empathetic and patient
- If the issue is complex or requires escalation, politely inform the user that you'll connect them with a Supervisor
- Always maintain a professional but warm tone
- Respond in the user's preferred language

When you detect a complex issue that needs escalation, respond with: [ESCALATE_TO_SUPERVISOR]`,

  supervisor: `You are a HealthBuddy Support Supervisor. Your role is to:
- Handle escalated issues from the Support Agent
- Resolve complex technical problems
- Manage subscription and billing issues
- Provide detailed explanations and solutions
- Be professional and authoritative
- If the issue requires management decision, escalate to Manager
- Always maintain a professional tone
- Respond in the user's preferred language

When you detect an issue that needs management attention, respond with: [ESCALATE_TO_MANAGER]`,

  manager: `You are the HealthBuddy Support Manager. Your role is to:
- Handle executive-level issues and decisions
- Address user complaints and feedback
- Make decisions about refunds, compensation, or special accommodations
- Provide final resolutions
- Be empathetic but firm in decision-making
- Represent the company professionally
- Always maintain a professional and authoritative tone
- Respond in the user's preferred language

Your goal is to ensure customer satisfaction and resolve issues at the highest level.`,
};

export const supportRouter = router({
  // Create a new support ticket
  createTicket: protectedProcedure
    .input(
      z.object({
        subject: z.string().min(5).max(200),
        message: z.string().min(10).max(2000),
        category: z.enum([
          "technical",
          "billing",
          "subscription",
          "feature_request",
          "complaint",
          "other",
        ]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const ticketId = uuidv4();

        // Create support ticket
        await db.insert(supportTickets).values({
          id: ticketId,
          userId: ctx.user.id,
          subject: input.subject,
          category: input.category,
          status: "open",
          currentAgent: "support",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // Create initial message
        await db.insert(supportMessages).values({
          id: uuidv4(),
          ticketId,
          sender: "user",
          message: input.message,
          agent: "support",
          createdAt: new Date(),
        });

        return {
          ticketId,
          status: "open",
          agent: "support",
        };
      } catch (error) {
        console.error("Error creating support ticket:", error);
        throw error;
      }
    }),

  // Send message to support agent
  sendMessage: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        message: z.string().min(1).max(2000),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        // Get ticket
        const ticket = await db
          .select()
          .from(supportTickets)
          .where(eq(supportTickets.id, input.ticketId))
          .limit(1);

        if (ticket.length === 0 || ticket[0].userId !== ctx.user.id) {
          throw new Error("Ticket not found");
        }

        const currentTicket = ticket[0];

        // Save user message
        await db.insert(supportMessages).values({
          id: uuidv4(),
          ticketId: input.ticketId,
          sender: "user",
          message: input.message,
          agent: currentTicket.currentAgent,
          createdAt: new Date(),
        });

        // Get conversation history
        const messages = await db
          .select()
          .from(supportMessages)
          .where(eq(supportMessages.ticketId, input.ticketId));

        // Build conversation for LLM
        const conversationHistory = messages.map((msg) => ({
          role: msg.sender === "user" ? ("user" as const) : ("assistant" as const),
          content: msg.message,
        }));

        // Get current agent's response
        const currentAgent = currentTicket.currentAgent as SupportAgent;
        const systemPrompt = agentPrompts[currentAgent];

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            ...conversationHistory,
          ],
        });

        const responseContent = response.choices[0]?.message?.content;
        const agentResponse = typeof responseContent === "string" 
          ? responseContent 
          : "I apologize, but I couldn't generate a response.";

        // Check for escalation
        let nextAgent = currentAgent;
        let escalated = false;

        if (agentResponse.includes("[ESCALATE_TO_SUPERVISOR]")) {
          nextAgent = "supervisor";
          escalated = true;
        } else if (agentResponse.includes("[ESCALATE_TO_MANAGER]")) {
          nextAgent = "manager";
          escalated = true;
        }

        // Save agent response
        await db.insert(supportMessages).values({
          id: uuidv4(),
          ticketId: input.ticketId,
          sender: "agent",
          message: agentResponse
            .replace("[ESCALATE_TO_SUPERVISOR]", "")
            .replace("[ESCALATE_TO_MANAGER]", "")
            .trim(),
          agent: currentAgent,
          createdAt: new Date(),
        });

        // Update ticket if escalated
        if (escalated) {
          await db
            .update(supportTickets)
            .set({
              currentAgent: nextAgent,
              updatedAt: new Date(),
            })
            .where(eq(supportTickets.id, input.ticketId));
        }

        return {
          agentResponse: agentResponse
            .replace("[ESCALATE_TO_SUPERVISOR]", "")
            .replace("[ESCALATE_TO_MANAGER]", "")
            .trim(),
          escalated,
          nextAgent,
          currentAgent,
        };
      } catch (error) {
        console.error("Error sending message:", error);
        throw error;
      }
    }),

  // Get ticket details
  getTicket: protectedProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const ticket = await db
          .select()
          .from(supportTickets)
          .where(eq(supportTickets.id, input.ticketId))
          .limit(1);

        if (ticket.length === 0 || ticket[0].userId !== ctx.user.id) {
          throw new Error("Ticket not found");
        }

        const messages = await db
          .select()
          .from(supportMessages)
          .where(eq(supportMessages.ticketId, input.ticketId));

        return {
          ticket: ticket[0],
          messages,
        };
      } catch (error) {
        console.error("Error getting ticket:", error);
        throw error;
      }
    }),

  // Get all tickets for user
  getTickets: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const tickets = await db
        .select()
        .from(supportTickets)
        .where(eq(supportTickets.userId, ctx.user.id));

      return tickets;
    } catch (error) {
      console.error("Error getting tickets:", error);
      throw error;
    }
  }),

  // Close ticket
  closeTicket: protectedProcedure
    .input(z.object({ ticketId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const ticket = await db
          .select()
          .from(supportTickets)
          .where(eq(supportTickets.id, input.ticketId))
          .limit(1);

        if (ticket.length === 0 || ticket[0].userId !== ctx.user.id) {
          throw new Error("Ticket not found");
        }

        await db
          .update(supportTickets)
          .set({
            status: "closed",
            updatedAt: new Date(),
          })
          .where(eq(supportTickets.id, input.ticketId));

        return { success: true };
      } catch (error) {
        console.error("Error closing ticket:", error);
        throw error;
      }
    }),

  // Rate support interaction
  rateInteraction: protectedProcedure
    .input(
      z.object({
        ticketId: z.string(),
        rating: z.number().min(1).max(5),
        feedback: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const ticket = await db
          .select()
          .from(supportTickets)
          .where(eq(supportTickets.id, input.ticketId))
          .limit(1);

        if (ticket.length === 0 || ticket[0].userId !== ctx.user.id) {
          throw new Error("Ticket not found");
        }

        await db
          .update(supportTickets)
          .set({
            rating: input.rating.toString(),
            feedback: input.feedback || null,
            updatedAt: new Date(),
          })
          .where(eq(supportTickets.id, input.ticketId));

        return { success: true };
      } catch (error) {
        console.error("Error rating interaction:", error);
        throw error;
      }
    }),
});

