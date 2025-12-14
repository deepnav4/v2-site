---
title: "Git Diff Is Just LCS"
date: "October 9, 2025"
readTime: "8 min read"
category: "algorithms"
tags: ["algorithms", "computer-science", "how-it-works"]
excerpt: "Every CS student grinds LCS problems on LeetCode. But do they know it powers git diff?"
---

Every CS student grinds LCS problems on LeetCode. But do they know it powers git diff? A deep dive into the Hunt-McIlroy algorithm and why your DSA practice is more relevant than you think.

## The Problem That Powers Everything

I spent a semester grinding dynamic programming problems. LCS (Longest Common Subsequence) was one of those problems that felt purely academic. Given two sequences, find the longest subsequence present in both. Classic DP problem, classic interview question, classic "when will I ever use this?"

Then I looked at how `git diff` works.

Turns out, every time you run `git diff`, you're solving LCS. Every time you see those green `+` and red `-` lines, you're looking at the output of a sophisticated diff algorithm that, at its core, is computing the longest common subsequence between two files.

## Wait, How Does Diff Even Work?

When you modify a file and run `git diff`, Git needs to figure out what changed. It's not just comparing byte by byte—that would be useless. Git needs to understand the **structure** of the changes: which lines were added, which were deleted, and which stayed the same.

The naive approach would be:
1. Compare line by line
2. Mark different lines as changed

But this breaks down quickly. If you add a single line at the top of a file, every line number changes. The naive diff would show the entire file as modified.

What we really want is to find the **minimal set of changes** that transform file A into file B. This is where LCS comes in.

## The LCS Connection

Here's the insight: if you find the longest common subsequence of lines between the old and new file, the lines NOT in the LCS are the changes.

Let's say you have:

**Old file:**
```
def greet():
    print("Hello")
    print("World")
```

**New file:**
```
def greet():
    print("Hello")
    print("Beautiful")
    print("World")
```

The LCS is:
```
def greet():
    print("Hello")
    print("World")
```

Everything else? That's your diff. The line `print("Beautiful")` was added.

## The Classic LCS Algorithm

The textbook LCS solution uses dynamic programming. You build a 2D table where `dp[i][j]` represents the length of LCS between the first `i` elements of sequence A and first `j` elements of sequence B.

```python
def lcs_length(A, B):
    m, n = len(A), len(B)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if A[i-1] == B[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]
```

This works. It's O(mn) in time and space. But for large files, that's expensive. A 10,000 line file would need a 100 million cell table. Git can't afford that.

## Enter Hunt-McIlroy

In 1976, James Hunt and Douglas McIlroy published a faster algorithm for the diff problem. It's still based on LCS, but with clever optimizations that make it practical for real files.

The key insight: most file changes are **localized**. When you edit code, you usually change a few lines, maybe a function or two. You don't randomly modify lines throughout the entire file.

Hunt-McIlroy exploits this by:
1. Finding matching lines first
2. Building a "match list" 
3. Finding the longest increasing subsequence in that list

### The Match List

Instead of comparing every line with every other line, we first identify **which lines in the new file match lines in the old file**. We create a list of (old_line, new_line) pairs for every match.

For our example:
```
Matches:
(1, 1) -> "def greet():"
(2, 2) -> "print(\"Hello\")"
(4, 4) -> "print(\"World\")"
```

### Longest Increasing Subsequence

Now here's the clever part: finding the LCS of lines becomes finding the **longest increasing subsequence** in this match list.

If we have matches `(old1, new1), (old2, new2), ...`, we want the longest sequence where both old line numbers and new line numbers are increasing. This represents lines that appear in the same order in both files.

```python
def longest_increasing_subsequence(matches):
    n = len(matches)
    if n == 0:
        return []
    
    # dp[i] = smallest tail of increasing subsequence of length i+1
    dp = []
    parent = [-1] * n
    
    for i, (old, new) in enumerate(matches):
        # Binary search for position
        pos = binary_search(dp, new)
        
        if pos == len(dp):
            dp.append(new)
        else:
            dp[pos] = new
            
        if pos > 0:
            parent[i] = positions[pos - 1]
    
    return reconstruct_path(parent)
```

This is O(n log n) instead of O(mn). Much faster!

## Why This Matters

Understanding this connection between LCS and diff reveals something profound: **algorithms aren't just interview puzzles**. They're the building blocks of tools you use every day.

Every time you:
- Run `git diff`
- See GitHub's file comparison view
- Use diff tools like `vimdiff` or Beyond Compare
- Watch code review diffs in pull requests

You're seeing the output of an algorithm you probably implemented in a DSA class. The problem that seemed academic and abstract is actually fundamental to modern software development.

## The Practical Impact

Git doesn't just use Hunt-McIlroy for `git diff`. The algorithm is central to:

1. **Merge conflicts**: Git uses diff to find the common ancestor and the changes in both branches
2. **Patches**: When you create a patch file, it's fundamentally a diff
3. **Blame annotations**: `git blame` uses diff to track which commit changed each line
4. **Repository size**: Efficient diffs help Git store file versions compactly

## Modern Improvements

Today's diff implementations have evolved beyond Hunt-McIlroy:

### Myers' Algorithm
Eugene Myers developed an algorithm in 1986 that's even faster in practice. It uses a greedy approach with dynamic programming and is what Git actually uses today.

### Patience Diff
Git supports "patience diff" mode, which tries to find unique lines first and use those as anchors. This produces more intuitive diffs for code.

```bash
git diff --patience
```

### Histogram Diff
An evolution of patience diff that's faster and often produces the most readable output.

```bash
git diff --histogram
```

## The Irony

Here's what I find beautiful: students often complain that LeetCode problems are artificial and disconnected from real work. But LCS is literally one of the most used algorithms in software development.

You might never implement your own diff algorithm, but you use the output of one dozens of times per day. Understanding how it works makes you a better developer. You understand:

- Why some diffs look weird (the algorithm has multiple valid solutions)
- How to structure commits for clearer diffs
- Why certain merge conflicts happen
- How to optimize your code changes for reviewability

## Try It Yourself

Want to see this in action? Here's a minimal diff implementation:

```python
def simple_diff(old_lines, new_lines):
    # Build match list
    matches = []
    for i, old_line in enumerate(old_lines):
        for j, new_line in enumerate(new_lines):
            if old_line == new_line:
                matches.append((i, j))
    
    # Find LIS (simplified)
    lcs_lines = find_lcs(matches)
    
    # Generate diff
    old_idx = 0
    new_idx = 0
    diff = []
    
    for (old_lcs, new_lcs) in lcs_lines:
        # Lines before this match were deleted/added
        while old_idx < old_lcs:
            diff.append(('delete', old_lines[old_idx]))
            old_idx += 1
        while new_idx < new_lcs:
            diff.append(('add', new_lines[new_idx]))
            new_idx += 1
        
        # This line is unchanged
        diff.append(('same', old_lines[old_idx]))
        old_idx += 1
        new_idx += 1
    
    # Handle remaining lines
    while old_idx < len(old_lines):
        diff.append(('delete', old_lines[old_idx]))
        old_idx += 1
    while new_idx < len(new_lines):
        diff.append(('add', new_lines[new_idx]))
        new_idx += 1
    
    return diff
```

## Lessons Learned

1. **Algorithms matter**: That LCS problem you solved on LeetCode? It powers Git.
2. **Optimization matters**: The difference between O(mn) and O(n log n) is the difference between a tool that's useful and one that's too slow.
3. **Theory meets practice**: Understanding the theory helps you use the tool better.

## Conclusion

Next time you're grinding LeetCode problems and wonder "when will I use this?", remember: someone is using it right now. Git uses LCS every day, billions of times, across millions of repositories.

The algorithm you implement in an interview might not be the exact one used in production, but the **concept** definitely is. Understanding how LCS works helps you understand how version control works, which helps you use it better, which makes you a better developer.

That's the real value of algorithmic thinking. Not memorizing solutions, but understanding the patterns that power the tools we use every day.

Now go forth and appreciate your diffs. They're more interesting than you thought.
