---
title: "What Actually Happens When You Press ^C?"
date: "October 19, 2025"
readTime: "10 min read"
category: "low-level"
tags: ["c", "low-level", "how-it-works", "operating-systems"]
excerpt: "Ctrl+C feels instant. But between your keypress and process termination, there's a whole pipeline: terminal drivers, kernel signal delivery, process groups, and default handlers. Here's the full journey."
---

Every CS student has pressed Ctrl+C a thousand times. It's muscle memory. Program hangs? Ctrl+C. Infinite loop? Ctrl+C. Accidentally ran `cat /dev/urandom`? Ctrl+C, fast.

But what actually happens between the moment your fingers hit those two keys and the moment your program dies?

Turns out, it's not simple. There's a terminal emulator, a kernel TTY subsystem, a signal delivery mechanism, process groups, and a default handler all involved. It's one of those things that feels like a single action but is really a whole pipeline — and understanding it connects half the OS concepts you study in school.

---

## Step 1: The Terminal Emulator Catches the Keypress

When you press Ctrl+C, the first thing that receives it is your terminal emulator — iTerm2, Windows Terminal, GNOME Terminal, whatever you use. The terminal emulator is just a GUI application. It gets a keyboard event like any other app.

But here's the thing: the terminal emulator doesn't send the character `^C` (ASCII 0x03) directly to the running program's stdin. Instead, it writes that byte to the **master side of a pseudo-terminal** (PTY).

A PTY is a pair: a master side (owned by the terminal emulator) and a slave side (connected to your shell and its child processes). Every terminal session has one. When the terminal emulator writes `0x03` to the master side, the kernel's TTY layer — the *line discipline* — intercepts it before it ever reaches the program.

This distinction matters. The program never "sees" Ctrl+C as input. The kernel intercepts it first.

---

## Step 2: The TTY Line Discipline Translates It

The kernel's TTY subsystem has a component called the **line discipline**. It sits between the PTY master and slave, and it's responsible for translating raw terminal input into behavior.

When the line discipline sees the byte `0x03` (which corresponds to the `VINTR` character in the terminal settings), it doesn't pass it through. Instead, it triggers a signal.

You can actually see and change which character triggers this:

```bash
$ stty -a
...
intr = ^C; quit = ^\; erase = ^?; kill = ^U;
...
```

That `intr = ^C` line? That's the kernel saying "when I see this byte, send SIGINT." You can change it:

```bash
$ stty intr ^X
```

Now Ctrl+X sends SIGINT and Ctrl+C does nothing special. The mapping is configurable, not hardcoded. The "magic" of Ctrl+C is just a lookup table in the TTY driver.

> The terminal doesn't kill your process. The kernel's TTY layer does. The terminal just writes a byte.

---

## Step 3: The Kernel Sends SIGINT to the Foreground Process Group

This is where it gets interesting. The kernel doesn't send SIGINT to a single process. It sends it to the entire **foreground process group** of the terminal.

Every terminal session has a **session** and one or more **process groups**. At any given time, one process group is in the foreground (can read from and write to the terminal), and the rest are in the background.

When you run a command like:

```bash
$ cat file.txt | grep "error" | sort
```

All three processes — `cat`, `grep`, and `sort` — are placed into the same process group. When you hit Ctrl+C, all three get SIGINT. Not just one. All of them.

This is why Ctrl+C kills an entire pipeline, not just the last command. The kernel delivers the signal to every process in the foreground group.

### How Process Groups Work

Every process has a **PGID** (Process Group ID). You can inspect them:

```bash
$ ps -o pid,pgid,comm
  PID  PGID COMMAND
 1234  1234 bash
 5678  5678 cat
 5679  5678 grep
 5680  5678 sort
```

Notice that `cat`, `grep`, and `sort` all share PGID 5678. That's their process group. `bash` has its own group (it's the session leader).

In C, you can create and manage process groups:

```c
#include <unistd.h>
#include <stdio.h>

int main() {
    printf("PID: %d\n", getpid());
    printf("PGID: %d\n", getpgrp());

    // Create a new process group with this process as leader
    setpgid(0, 0);
    printf("New PGID: %d\n", getpgrp());

    return 0;
}
```

The shell does this automatically when it launches pipelines. Each pipeline becomes a process group, and the shell calls `tcsetpgrp()` to make it the foreground group of the terminal.

---

## Step 4: The Signal Handler Decides What Happens

When SIGINT arrives at a process, what happens next depends entirely on the process's **signal disposition** — how it has chosen to handle that signal.

There are three options:

1. **Default action**: Terminate the process (this is what happens if you don't set up a handler)
2. **Custom handler**: Run a function you registered
3. **Ignore**: Do nothing

Most programs never set up a handler, so they just die. But programs that need graceful shutdown — servers, databases, editors — register custom handlers.

### Writing a Custom SIGINT Handler

Here's the simplest version using `signal()`:

```c
#include <stdio.h>
#include <signal.h>
#include <unistd.h>

void handle_sigint(int sig) {
    printf("\nCaught SIGINT (signal %d). Cleaning up...\n", sig);
    // flush buffers, close files, release locks
    _exit(0);
}

int main() {
    signal(SIGINT, handle_sigint);

    printf("Running... Press Ctrl+C to stop.\n");
    while (1) {
        sleep(1);
    }

    return 0;
}
```

This works, but `signal()` has portability issues. The behavior varies between System V and BSD semantics. The modern, portable way is `sigaction()`:

```c
#include <stdio.h>
#include <signal.h>
#include <unistd.h>
#include <string.h>

volatile sig_atomic_t running = 1;

void handle_sigint(int sig) {
    running = 0;
}

int main() {
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = handle_sigint;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = 0;

    sigaction(SIGINT, &sa, NULL);

    printf("Server running on port 8080...\n");

    while (running) {
        // accept connections, do work
        sleep(1);
    }

    printf("Graceful shutdown complete.\n");
    return 0;
}
```

The key difference: `sigaction()` gives you explicit control over signal masking, handler reset behavior, and restartability. In production code, always use `sigaction()`.

> `signal()` is like `gets()` — it works, it's in every textbook, and you should never use it in real code.

---

## The Signal Comparison: SIGINT vs SIGTERM vs SIGKILL vs SIGSTOP

Not all signals are created equal. Here's the breakdown:

| Signal | Number | Default Action | Catchable? | Sent By | Purpose |
|--------|--------|---------------|------------|---------|---------|
| SIGINT | 2 | Terminate | Yes | Ctrl+C / `kill -2` | Polite interrupt from terminal |
| SIGTERM | 15 | Terminate | Yes | `kill` (default) | Polite termination request |
| SIGKILL | 9 | Terminate | **No** | `kill -9` | Forceful, unconditional kill |
| SIGSTOP | 19 | Stop (pause) | **No** | Ctrl+Z / `kill -19` | Suspend process, no handler possible |
| SIGTSTP | 20 | Stop (pause) | Yes | Ctrl+Z | Suspendable, but process can catch it |
| SIGQUIT | 3 | Terminate + core dump | Yes | `Ctrl+\` | Terminate and dump core for debugging |

The critical insight: **SIGKILL and SIGSTOP cannot be caught, blocked, or ignored.** The kernel enforces them unconditionally. That's why `kill -9` always works — the process never gets a chance to say "no."

SIGTERM is what well-behaved systems send first. It says "please shut down." SIGINT is similar but specifically means "the user at the terminal wants you to stop." SIGKILL is the last resort — it doesn't ask, it just kills.

> The escalation path is: SIGINT → SIGTERM → SIGKILL. Each step is less polite. If you're reaching for `kill -9` regularly, something is wrong with your signal handling.

---

## Real-World: What Ctrl+C Does to Things You Actually Run

### Docker Containers

When you Ctrl+C a `docker run` session, Docker sends SIGINT to PID 1 inside the container. Here's the catch: if PID 1 is your application started with the shell form of `CMD`, it's actually running under `/bin/sh`, which doesn't forward signals to child processes.

```dockerfile
# Bad: shell form — sh ignores SIGINT forwarding
CMD python app.py

# Good: exec form — python IS PID 1 and receives SIGINT directly
CMD ["python", "app.py"]
```

If your container doesn't stop on Ctrl+C and Docker has to `SIGKILL` it after 10 seconds, this is usually why. The signal never reaches your app.

### Node.js Servers

Node.js handles SIGINT gracefully by default — it terminates. But if you register a handler, you take responsibility:

```javascript
process.on('SIGINT', () => {
    console.log('Received SIGINT. Closing server...');
    server.close(() => {
        console.log('All connections drained. Exiting.');
        process.exit(0);
    });

    // Force exit if connections don't drain in 5 seconds
    setTimeout(() => {
        console.error('Forced exit after timeout');
        process.exit(1);
    }, 5000);
});
```

Without that timeout, a Node server with long-lived connections (WebSockets, SSE) will hang indefinitely on Ctrl+C, waiting for connections to close that never will.

### Shell Pipelines

When you run `cat hugefile.txt | head -5` and it returns instantly, what happened? `head` reads 5 lines and exits. When `head` exits, `cat` tries to write to the pipe, gets `SIGPIPE` (broken pipe), and dies. Ctrl+C wasn't even involved.

But if you Ctrl+C that pipeline before `head` exits, both `cat` and `head` get SIGINT because they're in the same process group. The shell set that up when it created the pipeline.

---

## Session Leaders and Job Control

There's one more layer: **sessions**. A session is a collection of process groups, typically everything launched from a single login or terminal.

```
Session (sid: 1234)
├── Process Group 1234 (bash - session leader)
├── Process Group 5678 (foreground: vim)
└── Process Group 9012 (background: make &)
```

The **session leader** is typically your shell. It's the process that opened the controlling terminal. When the terminal closes (you close the window, SSH drops), the kernel sends `SIGHUP` to the session leader, which then propagates it to all process groups in the session.

That's why background jobs die when you close the terminal — unless you use `nohup` or `disown`, which detach processes from the session's signal propagation.

```bash
# Dies when terminal closes
$ long_running_job &

# Survives terminal close
$ nohup long_running_job &

# Or detach after the fact
$ long_running_job &
$ disown %1
```

This entire system — sessions, process groups, foreground/background, signal delivery — is called **job control**. It's how your shell manages multiple running programs, and it all connects back to that Ctrl+C you pressed.

---

## The Full Pipeline, Summarized

Here's the complete journey of Ctrl+C, start to finish:

```
Your fingers hit Ctrl+C
       │
       ▼
Terminal emulator writes 0x03 to PTY master
       │
       ▼
Kernel TTY line discipline sees VINTR character
       │
       ▼
Kernel identifies foreground process group of the terminal
       │
       ▼
Kernel sends SIGINT to every process in that group
       │
       ▼
Each process checks its signal disposition:
  ├── Default handler → process terminates
  ├── Custom handler  → handler function runs
  └── SIG_IGN         → signal is ignored
```

Six steps. Three subsystems (terminal emulator, kernel TTY driver, signal delivery). One keystroke.

---

## Lessons Learned

1. **Ctrl+C is not magic** — it's a configurable byte (`0x03` by default) that the TTY line discipline translates into SIGINT. You can even remap it.

2. **Signals target process groups, not individual processes** — this is why Ctrl+C kills entire pipelines and why understanding process groups matters for anything involving multiple processes.

3. **Always use `sigaction()` over `signal()`** — portability and explicit control matter. `signal()` behavior is implementation-defined in too many edge cases.

4. **SIGKILL is the nuclear option** — if you're reaching for `kill -9` as your first instinct, your process probably has a signal handling bug. Fix the handler, don't escalate the signal.

5. **Containers need exec form CMD** — if your Docker container ignores Ctrl+C, the signal isn't reaching your application. PID 1 in a container is special.

6. **Job control is underrated** — sessions, process groups, foreground/background — this stuff isn't trivia. It's how your shell actually works, and understanding it makes you dramatically better at debugging process management issues.

---

## Conclusion

Every OS course covers signals. You learn that SIGINT is signal number 2, you memorize the difference between `kill` and `kill -9`, and you move on. But tracing the full path of Ctrl+C — from keypress to terminal emulator to PTY to line discipline to kernel signal delivery to handler execution — connects those isolated facts into a coherent system.

The next time you hit Ctrl+C and your program doesn't stop, you'll know exactly where to look. Is the signal being caught? Is the handler hanging? Is the process even in the foreground group? Is PID 1 forwarding signals in your container?

Suddenly, debugging goes from "I don't know why it won't stop" to "I know exactly which part of the pipeline is broken."

That's the payoff of understanding what's really going on beneath the abstractions. Not trivia — leverage.
