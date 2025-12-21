---
title: IIO Guide - I
date: 2025-11-14
---

> **Source**: [interviewing.io Part 1](https://interviewing.io/guides/system-design-interview#introduction-to-system-design)
 

# System Design Interview Guide - Part 1: How to Approach

## Core Understanding

### Design vs Engineering Problems
- **Engineering**: One best solution, data-driven, reproducible
- **Design**: No single answer, exploratory, creative process
- System design = creating a map, not solving a puzzle
- Less code = better (conceptual thinking over implementation)

### Interview Reality Check
- No distributed systems experience needed to pass
- Even FAANG engineers learn from interview guides, not just work experience
- Performance in interviews ≠ worth as engineer
- Focus on interview skills, not just technical knowledge

## Mental Framework

### Role Play Mindset
- **You are**: Tech Lead explaining to junior engineers
- **They will**: Implement your design tomorrow (MVP mindset)
- **Goal**: Get it done, not make it perfect
- Think: "1999 garage startup" - simple, functional, quick

### Communication is Critical
- More conversational than coding interviews
- Back-and-forth dialogue required
- Practice with different interviewer styles (warm vs cold)
- Adjust communication based on audience

## No "Right" Answer

### Key Principle
- Two experts = two different valid designs
- Beautiful solutions exist in multiple forms
- Justification matters more than the solution itself

### The Jedi Mind Trick
- Leave breadcrumbs for interviewer to follow
- Guide them toward your strengths
- Make them think it was their idea to explore topics you know well
- Success = what you get interviewer to say, not just what you say

## Interviewer's Goals

### What They Want
- Enough data to justify hiring you
- Evidence you understand system fundamentals (end-to-end)
- Ability to name and explain each system part
- Understanding of tradeoffs
- A working solution

### What They Don't Need
- Expert-level knowledge in any single area
- Optimal solutions
- Real-world implementation details
- Knowledge of every technology

## Critical Behaviors

### Must Do
- **Ask questions** about vague requirements
- **Clarify assumptions** before diving in
- **Make decisions** and justify them
- **Discuss tradeoffs** for each choice
- **Admit gaps** in knowledge honestly
- **Guide interview** toward your strengths

### Avoid
- Assuming details from minimal prompts
- Making decisions reflexively (e.g., "I'll use auto-incrementing IDs")
- Name-dropping tech brands you don't know deeply
- Listing options without choosing one
- Talking just to fill silence (for mid-level)

## Key Distinctions by Level

### Mid-Level Expectations
- Interviewer drives direction and pace
- Following > leading
- Silent pauses acceptable
- Answering questions > asking them

### Senior+ Expectations
- Candidate directs interview flow
- Leading > following
- Awkward pauses hurt you
- Asking questions demonstrates leadership

## Red Flags vs Green Flags

### 🚩 Red Flags
- Talking for the sake of talking
- Ignoring interviewer feedback
- Not admitting when stuck
- Skipping clarifying questions
- Over-confidence without substance

### ✅ Green Flags
- Collaborative dialogue
- Integrating interviewer feedback
- Asking probing questions
- Admitting gaps honestly
- Justifying decisions clearly
- Treating it like working with a coworker

## Practical Guidance

### When Stuck
- Take time to think (silence is OK)
- Ask interviewer for help
- Explain your thought process from first principles
- Don't waste time pretending you know

### Decision Making
- **Bad**: "We could use DB X, Y, or Z... here are pros/cons" → move on
- **Good**: "We could use DB X, Y, or Z... here are pros/cons... I'll use X because [reason]"
- Always conclude with a decision

### Technology Naming
- **Avoid**: "I'll use Cassandra/Kafka" (unless you're an expert)
- **Prefer**: "I'll use a NoSQL database/queue because [reason]"
- Generic component names > brand names

### Scope Management
- Think about **user experience**, not just technical details
- Anchor decisions to how they affect users
- Consider different types of services (Instagram vs Flickr vs Imgur)
- Every detail has consequences (even ID formats)

## Interview Structure Awareness

### Non-Linear Path
- Like "Choose Your Own Adventure" book
- Interviewer may dive deep into one component
- Or stay at high level
- Follow their lead, but influence direction by showing interest/expertise

### Feedback Integration
- If interviewer redirects you → they've seen others fail that way
- Integrate their suggestions
- OK to push back with justification (art to this)
- Listen to hints about direction

## Common Pitfalls

### Mistake: Extrapolating from Vague Prompts
- "Design a photo sharing service" ≠ "Design Instagram"
- Could be Imgur, Flickr, 500px, or something else
- Always clarify requirements first

### Mistake: Default Decisions
- Don't auto-pilot decisions
- Every choice needs consideration
- Example: ID format affects user experience, security, scalability

### Mistake: Trying to Impress
- Simple > complex
- Working > elegant
- Clear > clever

## Remember
- 20% of knowledge covers 80% of interviews
- Honest dialogue > pretending to know
- Process > result
- Justification > solution
- Communication = everything in system design

---