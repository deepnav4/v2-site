---
title: 'Dynamic Programming :  Game Theory'
date: March 21, 2026
readTime: 15 min read
category: dsa
tags:
  - dp
  - gametheory
excerpt: >-
  Most DP tutorials teach you to "play optimally" and move on. But what happens
  when your opponent is stubborn, greedy, or just plain irrational? In this
  deep-dive, we break down the classic Coin Game problem across all four
  strategic combinations — two rational players, one rational and one greedy,
  and both greedy — with clean C++ code, clear theory, and the intuition you
  actually need to think through these problems yourself.
---



> *"You can't always control what your opponent does. But you can always control how you respond to it."*

---

## Table of Contents

1. [What Is the Coin Game?](#what-is-the-coin-game)
2. [The Mental Model: Who Moves After You?](#the-mental-model)
3. [Case 1 — Both Players Play Optimally](#case-1)
4. [Case 2 — You Play Optimally, Opponent Plays Greedily](#case-2)
5. [Case 3 — You Play Greedily, Opponent Plays Optimally](#case-3)
6. [Case 4 — Both Players Play Greedily](#case-4)
7. [Memoization: Making It Fast](#memoization)
8. [Full Code with All Cases](#full-code)
9. [Key Patterns to Internalize](#key-patterns)
10. [Practice Problems](#practice-problems)

---

## What Is the Coin Game? {#what-is-the-coin-game}

There is a row of `n` coins with values `arr[0], arr[1], ..., arr[n-1]`. Two players take turns. On each turn, a player must pick either the leftmost or the rightmost coin from the remaining row. The game ends when no coins are left. The player with the higher total wins.

Simple rules. Deep strategy.

This problem is a staple in competitive programming and interviews — not because the code is hard, but because it forces you to think precisely about *whose perspective you're computing from* at each step.

Let's say the array is:

```
[8, 15, 3, 7]
```

If you go first and both players are rational, what's the best you can guarantee yourself?

That's exactly what we're solving.

---

## The Mental Model: Who Moves After You? {#the-mental-model}

Before writing a single line of code, burn this into your head:

> **Your score from a position = coin you take + score you earn from the remaining window AFTER your opponent moves.**

This is the key. You don't get to pick next. Your opponent picks next. So the subproblem you pass to yourself isn't `solve(new_window)` — it's `solve(window_after_opponent_acts_on_new_window)`.

How your opponent acts on that new window depends on their strategy:

- **Optimal opponent:** They minimize what's left for you. So you get `min(...)` of the subproblems they can leave.
- **Greedy opponent:** They just grab the bigger end coin. So you trace which coin they'd take, and call `solve` on the window they leave behind.

Everything flows from this. Let's work through each case.

---

## Case 1 — Both Players Play Optimally {#case-1}

### Theory

When both players are rational, they each try to maximize their own score. From your perspective, you want to maximize what you collect. From your opponent's perspective, they also want to maximize *their* collection — which means they are minimizing what's left for you.

So after you take a coin, your opponent will pick whichever option leaves you with less. That means you get the `min` of the two subproblems they can create.

### Recurrence

Say the current window is `[i, j]`.

If you take `arr[i]` (left coin), the window becomes `[i+1, j]`. Your opponent now picks from `[i+1, j]` optimally, leaving you either `[i+2, j]` or `[i+1, j-1]`. You get the minimum of those.

If you take `arr[j]` (right coin), the window becomes `[i, j-1]`. Opponent leaves you either `[i+1, j-1]` or `[i, j-2]`. Again, you get the minimum.

```
takeI = arr[i] + min(solve(i+2, j),   solve(i+1, j-1))
takeJ = arr[j] + min(solve(i, j-2),   solve(i+1, j-1))
return max(takeI, takeJ)
```

You return `max` because you choose whichever of `takeI` or `takeJ` is better for you.

### Code

```cpp
int solve1(vector<int>& arr, int i, int j) {
    if (i > j) return 0;
    if (i == j) return arr[i];  // only one coin left, you take it

    // If I take arr[i], opponent minimizes my future score from [i+1, j]
    int takeI = arr[i] + min(solve1(arr, i+2, j), solve1(arr, i+1, j-1));

    // If I take arr[j], opponent minimizes my future score from [i, j-1]
    int takeJ = arr[j] + min(solve1(arr, i, j-2), solve1(arr, i+1, j-1));

    return max(takeI, takeJ);  // I pick what's best for me
}
```

### Trace on [8, 15, 3, 7]

- Pick `8`: opponent sees `[15, 3, 7]`. They play to hurt you.
- Pick `7`: opponent sees `[8, 15, 3]`. Same logic.

Running this gives you **22** as the optimal guaranteed score for the first player.

---

## Case 2 — You Play Optimally, Opponent Plays Greedily {#case-2}

### Theory

Now your opponent is predictable. They don't think ahead — they just look at the two exposed ends and grab whichever is bigger. This is a huge advantage for you.

Because the opponent is predictable, you don't need `min(...)` anymore. You can literally simulate what they will do: look at the two ends of the window they face and trace which one they take.

If the opponent faces window `[i+1, j]`, they take `arr[i+1]` if it's ≥ `arr[j]`, otherwise they take `arr[j]`. That collapses two subproblem branches into one deterministic call.

### Recurrence

```
// If I take arr[i], opponent faces [i+1, j]:
if arr[i+1] >= arr[j]:
    opponent takes arr[i+1] → window becomes [i+2, j]
else:
    opponent takes arr[j]   → window becomes [i+1, j-1]

// If I take arr[j], opponent faces [i, j-1]:
if arr[i] >= arr[j-1]:
    opponent takes arr[i]   → window becomes [i+1, j-1]
else:
    opponent takes arr[j-1] → window becomes [i, j-2]
```

### Code

```cpp
int solve2(vector<int>& arr, int i, int j) {
    if (i > j) return 0;
    if (i == j) return arr[i];

    // I take arr[i] → opponent sees [i+1, j] and greedily picks bigger end
    int oppAfterITakeI;
    if (arr[i+1] >= arr[j])
        oppAfterITakeI = solve2(arr, i+2, j);    // opp takes arr[i+1]
    else
        oppAfterITakeI = solve2(arr, i+1, j-1);  // opp takes arr[j]

    // I take arr[j] → opponent sees [i, j-1] and greedily picks bigger end
    int oppAfterITakeJ;
    if (arr[i] >= arr[j-1])
        oppAfterITakeJ = solve2(arr, i+1, j-1);  // opp takes arr[i]
    else
        oppAfterITakeJ = solve2(arr, i, j-2);    // opp takes arr[j-1]

    int takeI = arr[i] + oppAfterITakeI;
    int takeJ = arr[j] + oppAfterITakeJ;

    return max(takeI, takeJ);  // I still play optimally: pick my best option
}
```

### Why This Can Be Better Than Case 1

When the opponent is greedy, you can sometimes engineer situations where they take a coin that looks big but leaves you a goldmine. A rational opponent would never fall for this. A greedy one walks right into it.

For `[2, 100, 1, 3]`: a greedy opponent will grab `100` if you set it up right, leaving you with `2 + 3 = 5`... or you can grab `3`, they take `100`, you take `2`, they take `1` — you get `5`, they get `101`. But if you grab `2`, they take `3`, you take `100`, they take `1` — you get `102`! Exploiting greed is a real skill.

---

## Case 3 — You Play Greedily, Opponent Plays Optimally {#case-3}

### Theory

Here the tables are turned. You're the predictable one. You just grab whichever end coin is bigger right now. Your opponent, however, plays fully rationally — they minimize what you earn.

Interestingly, the opponent's optimal play still uses `min(...)` of subproblems. That part doesn't change. What changes is *your* decision rule: instead of `max(takeI, takeJ)`, you mechanically take whichever end is larger.

Wait — but if you're greedy, why are we still using recursion? Because even though your top-level choice is forced (take the bigger end), you still need to know what score you get after the opponent responds. That still requires solving the subproblem.

### Code

```cpp
int solve3(vector<int>& arr, int i, int j) {
    if (i > j) return 0;
    if (i == j) return arr[i];

    // I take arr[i]: opponent plays optimally on [i+1, j] → I get min of next splits
    int takeI = arr[i] + min(solve3(arr, i+2, j), solve3(arr, i+1, j-1));

    // I take arr[j]: opponent plays optimally on [i, j-1] → I get min of next splits
    int takeJ = arr[j] + min(solve3(arr, i+1, j-1), solve3(arr, i, j-2));

    // I'm greedy: I take whichever end is currently bigger
    if (arr[i] >= arr[j])
        return takeI;
    else
        return takeJ;
}
```

### A Note on Subproblem Structure

Notice that `takeI` and `takeJ` here look *identical* to Case 1. That's not a coincidence. The `min(...)` comes from the opponent's optimal play — and whether I am greedy or optimal doesn't change how the opponent plays. Only my final `return` statement changes: instead of `max(takeI, takeJ)`, I return based on which end is currently larger.

This is a subtle but important observation: **the opponent's behavior determines the shape of the recurrence; your behavior determines only which branch you choose at the top level.**

---

## Case 4 — Both Players Play Greedily {#case-4}

### Theory

Nobody is thinking ahead. Both players just grab the bigger available coin at each turn. This is the simplest strategy combination logically — but the recursion still looks similar to Case 2 because the opponent's behavior is deterministic.

After you take a coin (greedily), the opponent also takes greedily from what's left. Since you can predict exactly which coin they'll take, the recursion is fully deterministic — no `min` or `max` over opponent branches.

### Code

```cpp
int solve4(vector<int>& arr, int i, int j) {
    if (i > j) return 0;
    if (i == j) return arr[i];

    // I take arr[i] → opponent faces [i+1, j], takes max end greedily
    int oppAfterITakeI;
    if (arr[i+1] >= arr[j])
        oppAfterITakeI = solve4(arr, i+2, j);
    else
        oppAfterITakeI = solve4(arr, i+1, j-1);

    // I take arr[j] → opponent faces [i, j-1], takes max end greedily
    int oppAfterITakeJ;
    if (arr[i] >= arr[j-1])
        oppAfterITakeJ = solve4(arr, i+1, j-1);
    else
        oppAfterITakeJ = solve4(arr, i, j-2);

    int takeI = arr[i] + oppAfterITakeI;
    int takeJ = arr[j] + oppAfterITakeJ;

    // I'm also greedy: take the bigger end right now
    if (arr[i] >= arr[j])
        return takeI;
    else
        return takeJ;
}
```

### Cases 2 and 4: The Shared Structure

Cases 2 and 4 have identical recursion bodies — both simulate a greedy opponent using an `if/else` to determine which end they grab. The only difference is the return: Case 2 returns `max(takeI, takeJ)` (optimal me), Case 4 returns based on `arr[i] >= arr[j]` (greedy me).

---

## Memoization: Making It Fast {#memoization}

All four cases above are exponential without caching — the same subproblems get recomputed repeatedly. Since the state is just `(i, j)`, we can memoize with a 2D array.

```cpp
int dp[1001][1001];
bool visited[1001][1001];

int solve1_memo(vector<int>& arr, int i, int j) {
    if (i > j) return 0;
    if (i == j) return arr[i];
    if (visited[i][j]) return dp[i][j];

    visited[i][j] = true;

    int takeI = arr[i] + min(solve1_memo(arr, i+2, j), solve1_memo(arr, i+1, j-1));
    int takeJ = arr[j] + min(solve1_memo(arr, i, j-2), solve1_memo(arr, i+1, j-1));

    return dp[i][j] = max(takeI, takeJ);
}
```

Apply the same pattern to all four cases. Time complexity drops from O(2^n) to **O(n²)**, and space is **O(n²)** for the table.

You can also convert to bottom-up DP if you're allergic to recursion. Fill the table diagonally (by window length), since `dp[i][j]` depends on smaller windows.

---

## Full Code with All Cases {#full-code}

```cpp
#include <bits/stdc++.h>
using namespace std;

// ─── Case 1: Both play OPTIMALLY ─────────────────────────────────────────────
int solve1(vector<int>& arr, int i, int j) {
    if (i > j) return 0;
    if (i == j) return arr[i];

    int takeI = arr[i] + min(solve1(arr, i+2, j), solve1(arr, i+1, j-1));
    int takeJ = arr[j] + min(solve1(arr, i, j-2), solve1(arr, i+1, j-1));
    return max(takeI, takeJ);
}

// ─── Case 2: Me OPTIMAL, Opponent GREEDY ─────────────────────────────────────
int solve2(vector<int>& arr, int i, int j) {
    if (i > j) return 0;
    if (i == j) return arr[i];

    int afterITakeI = (arr[i+1] >= arr[j])
        ? solve2(arr, i+2, j)
        : solve2(arr, i+1, j-1);

    int afterITakeJ = (arr[i] >= arr[j-1])
        ? solve2(arr, i+1, j-1)
        : solve2(arr, i, j-2);

    return max(arr[i] + afterITakeI, arr[j] + afterITakeJ);
}

// ─── Case 3: Me GREEDY, Opponent OPTIMAL ─────────────────────────────────────
int solve3(vector<int>& arr, int i, int j) {
    if (i > j) return 0;
    if (i == j) return arr[i];

    int takeI = arr[i] + min(solve3(arr, i+2, j), solve3(arr, i+1, j-1));
    int takeJ = arr[j] + min(solve3(arr, i+1, j-1), solve3(arr, i, j-2));

    return (arr[i] >= arr[j]) ? takeI : takeJ;
}

// ─── Case 4: Both play GREEDILY ──────────────────────────────────────────────
int solve4(vector<int>& arr, int i, int j) {
    if (i > j) return 0;
    if (i == j) return arr[i];

    int afterITakeI = (arr[i+1] >= arr[j])
        ? solve4(arr, i+2, j)
        : solve4(arr, i+1, j-1);

    int afterITakeJ = (arr[i] >= arr[j-1])
        ? solve4(arr, i+1, j-1)
        : solve4(arr, i, j-2);

    int takeI = arr[i] + afterITakeI;
    int takeJ = arr[j] + afterITakeJ;

    return (arr[i] >= arr[j]) ? takeI : takeJ;
}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    vector<int> arr = {8, 15, 3, 7};
    int n = arr.size();

    cout << "Array: ";
    for (int x : arr) cout << x << " ";
    cout << "\n\n";

    cout << "Case 1 (both optimal):           " << solve1(arr, 0, n-1) << "\n";
    cout << "Case 2 (me optimal, opp greedy): " << solve2(arr, 0, n-1) << "\n";
    cout << "Case 3 (me greedy, opp optimal): " << solve3(arr, 0, n-1) << "\n";
    cout << "Case 4 (both greedy):            " << solve4(arr, 0, n-1) << "\n";

    return 0;
}
```

**Output for `[8, 15, 3, 7]`:**
```
Case 1 (both optimal):           22
Case 2 (me optimal, opp greedy): 22
Case 3 (me greedy, opp optimal): 15
Case 4 (both greedy):            15
```

The gap between Cases 1 and 3 shows exactly how much you lose by playing greedily against a smart opponent.

---

## Key Patterns to Internalize {#key-patterns}

Here's the summary table that you should understand deeply, not just memorize:

| My Strategy  | Opponent's Strategy | Recurrence shape            | Return        |
|--------------|---------------------|-----------------------------|---------------|
| Optimal      | Optimal             | `min(left-left, left-right)` | `max(I, J)` |
| Optimal      | Greedy              | Simulate opp's greedy pick   | `max(I, J)` |
| Greedy       | Optimal             | `min(left-left, left-right)` | `arr[i]>=arr[j] ? I : J` |
| Greedy       | Greedy              | Simulate opp's greedy pick   | `arr[i]>=arr[j] ? I : J` |

The two axes are independent:
- **Opponent's type** determines the *body* of the recursion (do you use `min` or simulate a greedy pick?).
- **Your type** determines the *return statement* (do you take `max` or take the bigger end?).

---

## Edge Cases to Watch

**When `i+1 > j` inside solve2/solve4:** If you take `arr[i]` and only one coin was left, `i+1 == j` — fine. But if you take `arr[i]` when `i+1 == j`, the opponent's window is a single coin, so you don't need to compare ends. Handle this:

```cpp
// Safe greedy opponent simulation:
int greedyOpponentScore(vector<int>& arr, int i, int j, ...) {
    if (i == j) return solve(arr, i+1, j);  // only one coin left for opp
    if (arr[i] >= arr[j])
        return solve(arr, i+1, j);  // opp takes left
    else
        return solve(arr, i, j-1);  // opp takes right
}
```

In practice, when `i == j` after you take, you return 0 for the remaining subproblem since no coins are left for you (the opponent takes the last one). Make sure your base cases cover `i > j` (return 0) and `i == j` (return arr[i]) before reaching any comparison logic.

---

## Practice Problems {#practice-problems}

Work through these to solidify the idea:

1. **Classic (Case 1):** [Geeks for Geeks — Optimal Strategy for a Game](https://practice.geeksforgeeks.org/problems/optimal-strategy-for-a-game-1587115620/1)
2. **Variation:** What if both players want to *minimize* the maximum the other player gets? How does the recurrence change?
3. **Extension:** What if a player can also pass their turn? How does the game tree change?
4. **Harder:** What if coins can only be taken from the *middle* out? (Unusual but great for practice.)
5. **Real Interview Problem:** [LeetCode 877 — Stone Game](https://leetcode.com/problems/stone-game/) — a constrained version where n is even and total sum is odd.

---

## Final Thoughts

The Coin Game looks simple but it's secretly a lesson in game theory. The moment you internalize "what does my opponent do with what I leave them?" you'll find this thinking shows up everywhere — minimax, alpha-beta pruning, adversarial search, even some greedy proofs.

Don't just copy the code. Trace through `[8, 15, 3, 7]` by hand for Case 1. Draw the recursion tree. Feel where the `min` comes from. That's the moment this clicks — and once it does, you'll never forget it.

---

*Written with love for anyone who's ever stared at a DP problem and felt like the recurrence was speaking a language they didn't quite know yet. You'll get there.*

