# AI Academy — Visual System

This document is the source of truth for `/ai-academy` only.

The Serbian AI Academy is intentionally a different product experience from the main AI Explained course.

## Positioning

The Academy should feel like a premium engineering school, technical operating manual and modern professional learning product.

References in spirit:
- technical editorial design
- engineering documentation
- serious developer tools
- premium professional education
- system diagrams, terminals, traces, tables and architecture maps

It must **not** look like a children's learning app, collectible toy interface or character-driven game.

## Non-negotiable rules

- No AI mascots in the visible Academy experience.
- No cartoon robots, floating characters or character-based progress states.
- No chunky black outlines with playful offset shadows.
- No candy/pastel card grids as the primary visual language.
- No random gradients used as decoration.
- No large pill UI unless the content semantically requires a compact tag/filter.
- No emoji as a substitute for system diagrams or status design.
- Phase colors are signals, not large background fills.
- Animation must explain state, hierarchy, execution or progress.
- Hover motion stays subtle: typically 1–3 px.
- Serious hierarchy beats decorative density.

## Core palette

Primary surfaces:
- warm paper / off-white
- pure white
- graphite / near-black
- neutral grey rules and dividers

Primary technical accent:
- electric/engineering blue

Phase colors may remain in the curriculum data, but use them primarily for:
- 2–3 px status rules
- small indicators
- progress markers
- selected states

Do not flood whole cards with phase colors.

## Typography

Use large editorial headlines for hierarchy, with compact monospace labels for technical metadata.

Good uses of monospace:
- status
- step numbers
- HTTP methods
- IDs
- progress
- API fields
- terminal output
- trace metadata

Body copy should remain highly readable and restrained.

## Home page

The Academy home should communicate:
1. program purpose
2. curriculum architecture
3. learner progress
4. mental models
5. complete curriculum
6. certification path

The hero visual should be a program/system architecture panel, not a character stage.

## Lesson shell

Every lesson should look like a technical lesson dossier.

Hero should expose:
- objective
- failure mode
- expected evidence
- method
- current completion state

Top navigation should expose:
- module/phase
- lesson identity
- progress
- current status

No mascot belongs in the lesson topbar, hero, debugging panel, explain-back or quiz result.

## Signature labs

Signature labs should look like engineering workbenches.

Prefer:
- terminal windows
- request/response inspectors
- workflow graphs
- tool registries
- permission matrices
- trace timelines
- architecture diagrams
- logs
- tables
- checklists
- structured editors

Avoid turning every exercise into a colorful card collection.

## Interaction language

Allowed motion:
- progress transitions
- active execution step
- expanding technical detail
- reorder/drag feedback
- request lifecycle movement
- trace activation
- state transitions
- error → recovery transitions

Avoid:
- mascot breathing/blinking
- decorative bouncing
- orbiting labels
- celebration confetti as default feedback
- exaggerated spring motion

## Completion feedback

Completion should feel professional.

Use:
- PASS / FAILED
- VERIFIED
- READY FOR CHECK
- IN PROGRESS
- POLOŽENO
- evidence counters
- completion bars

Not:
- cute character celebrations
- trophy/cartoon metaphors

## Responsive behavior

Mobile must preserve technical hierarchy rather than collapsing into visual clutter.

Priority order:
1. lesson title
2. progress/status
3. current task
4. interaction
5. supporting metadata

## Regression rule

Any future Academy UI that imports or visibly renders the shared `AiMascot` component should be treated as a visual regression unless the user explicitly reverses this direction.
