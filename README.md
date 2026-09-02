# AI Explained

An interactive AI learning product built around one rule: **do not explain with a wall of text when the learner can touch, move, break or simulate the idea instead.**

## Current build

Batch 01 implements the production lesson shell and the first complete lesson: **What is Artificial Intelligence?**

Included now:

- Next.js 16.3.3 + React 19.2
- Motion-powered interaction and animation
- Persistent local lesson progress
- Lessons/progress drawer
- Simple / Real / Expert explanation depth
- Eight required interactive scenes
- Drag, reorder, click, type and slider exercises
- Quiz locked until all lesson sections and tasks are completed
- Quiz attempts, best score and completion persisted locally
- Responsive layout and reduced-motion fallback
- Firebase App Hosting runtime config

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000/lessons/what-is-ai`.

## Build

```bash
npm run typecheck
npm run build
```

## Progress storage

The first batch intentionally stores progress in `localStorage` (`ai-explained-progress-v1`) so the interaction model works before auth is introduced. A later checkpoint will add Firebase Authentication + Firestore persistence and merge anonymous progress after sign-in.

See [`BUILD_GUIDE.md`](./BUILD_GUIDE.md) for the curriculum and build checkpoints.
