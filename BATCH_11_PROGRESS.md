# Batch 11 — Reinforcement Learning

Status: **implemented in code; local runtime/browser QA pending**

- [x] Create `/lessons/reinforcement-learning` with nine-section task/quiz gating.
- [x] Create arcade environment visual language with POLI policy character and REWARD orb.
- [x] Simple / Real / Expert copy for state/observation, action, reward and next-state concepts.
- [x] Activity 01: inspect the State → Policy → Action → Environment → Reward + Next State loop.
- [x] Activity 02: manually play a 4×4 gridworld with step cost, trap, one-time coin and terminal goal reward.
- [x] Require at least six actions and successful goal completion.
- [x] Activity 03: run 30+ training episodes and inspect a toy value/Q cell.
- [x] Activity 04: epsilon-greedy exploration vs exploitation playground; test low/mid/high exploration and sample 18+ actions.
- [x] Activity 05: reward-design sliders that change learned toy path preference between shortest route and coin detour.
- [x] Activity 06: delayed-reward/discount-factor comparison between immediate +3 and later +10.
- [x] Explicitly note discounting is a teaching convention here, not a universal mandatory setup.
- [x] Activity 07: deliberately flawed `spin_in_place: +1` reward creates specification gaming/reward hacking.
- [x] Require learner to let the agent exploit the reward, then repair the spec and rerun the policy.
- [x] Activity 08: classify eight feedback examples as supervised target labels vs RL rewards.
- [x] Activity 09: typed explain-back covering observation/state, action, environment, reward, policy and cumulative/future return.
- [x] Seven-question final quiz with wrong-answer explanations, pass 6/7.
- [x] Quiz locked behind all 9 sections + 9 tasks.
- [x] Responsive/reduced-motion arcade CSS.

## Integration still to fold into central course files

- [ ] Mark `reinforcement-learning` available in `content/course.ts`.
- [ ] Move route-local section map into central course map.
- [ ] Fold this receipt into `BUILD_PROGRESS.md`.
- [ ] Local typecheck/build and browser visual QA.

## Next batch

Build **Generalization, Underfitting, Overfitting and Bias/Variance** as a living curve-fitting playground: users should physically increase/decrease model complexity, add noise, split train/new-data panels, memorize individual training points, watch train error fall while test error rises, and debug whether a model needs more flexibility, more data/regularization, or a different representation.
