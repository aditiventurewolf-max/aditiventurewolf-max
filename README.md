# Hi, I'm Aditi

I work in the Founder's Office at Bounce and I build AI agents on the side. I'm at IIM Ranchi.

I like the unglamorous parts of agents: the tools they call, how they fail, and whether a person can trust what they did. I build small working systems end to end and write down what broke.

## What I've built

- **[Sourcery](https://github.com/aditiventurewolf-max/sourcery)**: a vendor sourcing tool. You describe a project, Claude turns it into weighted criteria, scores a vendor list against them with a short reason for each score, and drafts the outreach email. A daily job sends follow-ups and stops after three. React, Vite, Tailwind, Express, SQLite.
- **[Market Research Agent](https://github.com/aditiventurewolf-max/market-research-agent)**: a Python agent on Llama 3.3 70B (via Groq) that chooses between four tools: earnings, news sentiment, SEC filings from EDGAR, and price history. It runs tool calls in parallel and writes a report for a ticker.
- **[Recursive Skill Learner](https://github.com/aditiventurewolf-max/recursive-skill-learner)**: a FastMCP server that lets an assistant list, read and save its own reusable skill files as markdown, so a pattern learned in one session is there in the next.
- **[Content Discovery Engine](https://github.com/aditiventurewolf-max/content-discovery-engine-through-vector-embeddings)**: pulls recent posts from five RSS feeds, filters them by embedding similarity to a set of topics I like (Gemini embeddings, Pinecone), then has an LLM score what is left.

## What I'm working on

Making these agents measurable. Next is a small set of test cases for the research agent, so I can say how often it picks the right tool instead of just showing a demo.

## Background

Day to day I work on growth and operations for a gig-delivery rider app. That is where I learned what real users do to a product that looked fine in a demo.

## Reach me

- Portfolio: https://portfolio-sooty-beta-15.vercel.app
- LinkedIn: https://www.linkedin.com/in/venture-with-aditi
