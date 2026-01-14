import {
  Sparkles,
  Calendar,
  LayoutGrid,
  CheckSquare,
  Rocket,
  BookOpen,
  Clock,
  Users,
  Zap,
  Award,
  MousePointer,
  Bell,
  Search,
  Plus,
  Eye,
  Target,
  Coffee,
  AlertCircle,
  TrendingUp,
  Mail,
  Inbox,
  Brain,
  Lightbulb,
  ArrowRight,
  Play,
  Hand,
  GraduationCap
} from 'lucide-react';

export const slidesConfig = [
  // ============================================
  // WELCOME
  // ============================================
  {
    id: 'welcome',
    type: 'title',
    title: 'Productivity Tools Training',
    subtitle: 'Google Calendar • Trello • Asana',
    icon: Sparkles,
    accent: 'cyan',
    showLogo: true,
    steps: 1,
    notes: {
      say: `Good morning everyone! Welcome to today's productivity tools training.

I know what you might be thinking - "another software training." But I promise you, by the end of this session, you'll have three tools that will genuinely make your work life easier.

Today we'll cover:
• Google Calendar - to protect your time
• Trello - to see all your tasks at a glance
• Asana - for bigger, complex projects

This is hands-on, so you'll leave with these set up on YOUR computer. Ready? Let's go!`,
      do: [
        'Smile and make eye contact with the room',
        'Wait for people to settle in before starting'
      ],
      time: '2 min'
    }
  },

  // ============================================
  // WHAT YOU'LL LEARN (NEW)
  // ============================================
  {
    id: 'learning-outcomes',
    type: 'columns',
    title: 'By The End of This Session...',
    columns: [
      {
        icon: Clock,
        title: 'Protect Your Time',
        description: 'Block focus time so meetings don\'t consume your entire day',
        gradient: 'from-blue-500 to-cyan-500',
      },
      {
        icon: Eye,
        title: 'See Your Work',
        description: 'One place to view everything you need to do',
        gradient: 'from-indigo-500 to-purple-500',
      },
      {
        icon: Target,
        title: 'Stay On Track',
        description: 'Never forget a deadline or lose track of a task',
        gradient: 'from-rose-500 to-orange-500',
      },
    ],
    steps: 4,
    notes: {
      say: `Here's what you'll walk away with today:

First, you'll learn to PROTECT YOUR TIME. How many of you look at your calendar and it's just wall-to-wall meetings? We'll fix that.

Second, you'll be able to SEE YOUR WORK. Instead of tasks scattered in emails, sticky notes, and your head - everything in one place.

Third, you'll STAY ON TRACK. No more "oh no, I forgot about that" moments.

Sound good? These are real skills you'll use starting TODAY.`,
      keyPoint: 'These three outcomes are the whole point - keep coming back to them',
      time: '1 min'
    }
  },

  // ============================================
  // THE PROBLEM
  // ============================================
  {
    id: 'problem',
    type: 'comparison',
    title: 'Does Your Day Look Like This?',
    bad: [
      'Searching through 50+ emails for one update',
      'Realizing at 4pm you forgot a deadline',
      'Back-to-back meetings with no breaks',
      '"Wait, who was supposed to do that?"'
    ],
    good: [
      'All tasks visible in one place',
      'Reminders before deadlines',
      'Protected time for real work',
      'Clear ownership of every task'
    ],
    steps: 1,
    notes: {
      say: `Before we learn the tools, let's talk about WHY we need them.

Look at the left side. Does any of this sound familiar?

[Pause and look around - people will nod]

Digging through your inbox trying to find that one thing... Forgetting something until it's urgent... No time between meetings to actually DO your work...

Now look at the right side. THIS is what's possible. And it's not complicated - it just takes the right tools and about 5 minutes of setup.

Let's make this transformation happen.`,
      do: ['Point to each side as you describe it', 'Pause after asking "sound familiar?" - let it land'],
      time: '2 min'
    }
  },

  // ============================================
  // THREE TOOLS OVERVIEW
  // ============================================
  {
    id: 'three-tools',
    type: 'columns',
    title: 'Three Tools, Three Superpowers',
    columns: [
      {
        icon: Calendar,
        title: 'Google Calendar',
        description: 'Control your TIME',
        gradient: 'from-blue-500 to-cyan-500',
      },
      {
        icon: LayoutGrid,
        title: 'Trello',
        description: 'SEE your work',
        gradient: 'from-indigo-500 to-purple-500',
      },
      {
        icon: CheckSquare,
        title: 'Asana',
        description: 'Manage COMPLEXITY',
        gradient: 'from-rose-500 to-orange-500',
      },
    ],
    steps: 4,
    notes: {
      say: `Alright, here are our three tools. Each one solves a different problem:

GOOGLE CALENDAR - This is about your TIME. Meetings, focus blocks, reminders. Everyone should use this.

TRELLO - Think of it as a visual to-do list. You can SEE everything at once. Great for personal tasks or small teams.

ASANA - This is for COMPLEX work. Big projects with lots of moving pieces and multiple people.

We're going to start with Calendar because literally everyone needs it. Then Trello. Then Asana.

You don't need all three - use what fits YOUR work. But you'll know how to use each one.`,
      keyPoint: 'Emphasize they don\'t need ALL three - reduces overwhelm',
      time: '1.5 min'
    }
  },

  // ============================================
  // PART 1: GOOGLE CALENDAR
  // ============================================
  {
    id: 'calendar-intro',
    type: 'section',
    section: 'Part 1',
    title: 'Google Calendar',
    subtitle: 'Take control of your time',
    icon: Calendar,
    accent: 'cyan',
    steps: 1,
    notes: {
      say: `Alright, Part 1: Google Calendar.

Here's the thing about your calendar - most people think it's just for meetings. But your calendar is actually your most powerful tool for PROTECTING your time.

Let me show you what I mean.`,
      time: '30 sec'
    }
  },

  // Calendar: The big insight
  {
    id: 'calendar-insight',
    type: 'keypoint',
    icon: Lightbulb,
    title: 'Your Calendar is a Shield',
    subtitle: 'Most people use their calendar to record meetings. Smart people use it to PROTECT time for real work.',
    color: 'cyan',
    notes: {
      say: `I want you to think about your calendar differently.

Most people treat their calendar like a record of what's happening TO them. Meetings appear, they go to them.

But the smartest, most productive people? They use their calendar as a SHIELD. They block time for important work BEFORE meetings can take over.

That's what we're going to learn: how to be proactive with your calendar, not reactive.`,
      keyPoint: 'This mindset shift is the most important thing in the whole Calendar section',
      time: '1.5 min'
    }
  },

  // Calendar: Step by step - Create an event
  {
    id: 'calendar-create-event',
    type: 'stepbystep',
    title: 'Creating an Event (The Basics)',
    tool: 'calendar',
    steps: [
      { text: 'Click on any time slot', hint: 'Just click directly on your calendar' },
      { text: 'Type what it\'s for', detail: 'Be specific: "Budget Review Meeting" not just "Meeting"' },
      { text: 'Adjust the time if needed', hint: 'Drag the edges to change duration' },
      { text: 'Click Save', hint: 'That\'s it!' },
    ],
    notes: {
      say: `Let me quickly show you the basics of creating an event. This is probably review for some of you, but let's make sure everyone's on the same page.

Step 1: Click anywhere on your calendar grid - right on the time you want.

Step 2: Type what it's for. Pro tip: be specific. "Meeting" tells you nothing next week. "Budget Review with Finance Team" - now you know exactly what's happening.

Step 3: Drag the edges if you need to change how long it is.

Step 4: Click save. Done.

Simple, right? But here's where it gets powerful...`,
      time: '1 min'
    }
  },

  // Calendar: The big tip - Time Blocking
  {
    id: 'calendar-timeblock',
    type: 'keypoint',
    icon: Clock,
    title: 'Block Your Focus Time FIRST',
    subtitle: 'Put "Focus Time" on your calendar BEFORE meetings fill it up. If it\'s not on your calendar, someone will book over it.',
    color: 'cyan',
    notes: {
      say: `Here's the #1 tip I want you to remember:

Block your focus time FIRST.

Every Monday morning - or better, Friday afternoon for the next week - look at your calendar and put FOCUS TIME blocks on there.

Call it "Focus Time - Do Not Book" or "Busy - Project Work" - whatever you want.

Here's why this matters: if that time is empty, people will book meetings there. But if it shows as busy? They'll find another time.

You're not being antisocial. You're being productive. You can't do your actual job if you're in meetings 8 hours a day.`,
      keyPoint: 'This is THE tip. Make sure everyone understands it.',
      do: ['Emphasize with your voice: "FIRST" and "Do Not Book"'],
      time: '2 min'
    }
  },

  // Calendar: Demo
  {
    id: 'calendar-demo',
    type: 'demo',
    demoType: 'calendar',
    title: 'A Well-Organized Week',
    steps: 4,
    notes: {
      say: `Here's what a good calendar looks like. Take a look at this example.

See the colors? Different types of events have different colors. Meetings in one color, focus time in another. At a glance, you can see what kind of week you have.

See the white space? There are GAPS between meetings. That's intentional. That's when you grab coffee, respond to emails, or just breathe.

See those big focus time blocks? That's protected time for actual work.

A good calendar is NOT completely full. If every slot is booked, you have no flexibility. Aim for 60-70% scheduled, max.`,
      do: ['Point to the screen as you describe each element', 'Pause on the focus time blocks'],
      time: '2 min'
    }
  },

  // Calendar: ACTION - Do it now
  {
    id: 'calendar-action',
    type: 'action',
    action: 'Open Google Calendar NOW',
    subtext: 'Create a 2-hour "Focus Time" block for tomorrow morning',
    icon: Calendar,
    color: 'cyan',
    notes: {
      say: `Okay, it's YOUR turn! Everyone open Google Calendar right now.

Go to calendar.google.com - or click the Calendar icon if you have it bookmarked.

Now I want you to create a 2-hour block for tomorrow morning. Call it "Focus Time - Do Not Book."

I'll give you 3 minutes. When you're done, give me a thumbs up!`,
      do: [
        'Walk around the room',
        'Help anyone who looks stuck',
        'Common issues: people not logged into Google, wrong calendar selected'
      ],
      ifAsked: [
        { q: 'What time should I block?', a: 'Whenever you\'re most productive. For most people, mornings work best.' },
        { q: 'What if I already have a meeting then?', a: 'Pick a different morning, or block afternoon time instead.' }
      ],
      time: '4 min'
    }
  },

  // Calendar: Quick Tips
  {
    id: 'calendar-tips',
    type: 'content',
    title: 'Pro Tips for Calendar',
    items: [
      { title: 'Use "Find a time"', description: 'When scheduling with others, this shows when everyone is free' },
      { title: 'Make meetings 25 or 50 minutes', description: 'Enable "Speedy meetings" in Settings → Event settings. Gives you buffer time between meetings!' },
      { title: 'Add video links automatically', description: 'Click "Add Google Meet" - link appears for everyone invited' },
    ],
    listType: 'solution',
    steps: 4,
    notes: {
      say: `Three quick pro tips before we move on:

First: "Find a time" - when you're scheduling with others, there's a tab called "Find a time" that shows everyone's availability. No more emailing back and forth asking "does 2pm work?"

Second: Make your meetings 25 or 50 minutes instead of 30 or 60. Here's a game-changer - Google Calendar can do this AUTOMATICALLY! Go to Settings, then Event settings, and turn on "Speedy meetings." Now every 30-minute meeting becomes 25, and every hour becomes 50. You get built-in buffer time to breathe, walk to the next meeting, or grab coffee.

Third: Add video links with one click. If you're scheduling a virtual meeting, click "Add Google Meet" and the link is automatically included.

Any questions on Calendar before we move to Trello?`,
      do: ['Show where Settings is (gear icon top right)', 'Mention this is a one-time setup that saves time forever'],
      ifAsked: [
        { q: 'How do I share my calendar?', a: 'Click the three dots next to your calendar name, then "Settings and sharing." You can make it visible to your team.' },
        { q: 'Can I have multiple calendars?', a: 'Yes! Many people have Work, Personal, and maybe a Team calendar. You can toggle them on and off.' },
        { q: 'Where is Speedy meetings?', a: 'Click the gear icon (Settings) → Event settings → check "Speedy meetings" box.' }
      ],
      time: '2 min'
    }
  },

  // Calendar: Quick Win
  {
    id: 'calendar-quickwin',
    type: 'keypoint',
    icon: Award,
    title: 'Quick Win: You Just Protected 2 Hours!',
    subtitle: 'That Focus Time block you created? That\'s 2 hours this week that meetings CAN\'T steal from you. Do this every week.',
    color: 'emerald',
    notes: {
      say: `Before we move on - let's acknowledge what you just did.

You created a Focus Time block. That's 2 hours this week that are PROTECTED. When someone tries to schedule over that time, they'll see you're busy.

That's a real win. Do this every week - spend 5 minutes on Friday blocking focus time for the next week.

Now, let's move on to Trello!`,
      keyPoint: 'Celebrate the small win - builds confidence',
      time: '45 sec'
    }
  },

  // Calendar: Mobile Setup
  {
    id: 'calendar-mobile-setup',
    type: 'mobilesetup',
    tool: 'calendar',
    steps: 1,
    notes: {
      say: `Here's how to get Calendar on your phone - it's really simple.

For Android, the app is usually pre-installed. Just open it and sign in with your Gmail.

For iPhone, download Google Calendar from the App Store, then sign in.

You can download this guide to take with you - there's a button on the slide.`,
      keyPoint: 'Having Calendar on your phone means you can block time from anywhere',
      time: '1 min'
    }
  },

  // ============================================
  // PART 2: TRELLO
  // ============================================
  {
    id: 'trello-intro',
    type: 'section',
    section: 'Part 2',
    title: 'Trello',
    subtitle: 'See your work at a glance',
    icon: LayoutGrid,
    accent: 'indigo',
    steps: 1,
    notes: {
      say: `Part 2: Trello!

Calendar controls your time. Trello helps you SEE your work.

Think of Trello as a digital whiteboard with sticky notes. Except these sticky notes can't fall off, and you can access them from anywhere.`,
      time: '30 sec'
    }
  },

  // Trello: Key concept
  {
    id: 'trello-concept',
    type: 'keypoint',
    icon: LayoutGrid,
    title: 'Boards → Lists → Cards',
    subtitle: 'A Board is your project. Lists are columns (To Do, Doing, Done). Cards are tasks that you drag between lists.',
    color: 'purple',
    notes: {
      say: `Trello has three pieces. Let me explain:

A BOARD is like a whiteboard for one project - or in your case, maybe all your tasks.

LISTS are the columns. The most common setup is "To Do", "Doing", and "Done" - but you can customize these.

CARDS are the individual tasks - like sticky notes. You create a card in "To Do", and when you start working on it, you drag it to "Doing". When it's finished, drag it to "Done."

That's it. That's the whole concept. Simple, visual, satisfying.`,
      do: ['Use hand gestures: left for To Do, middle for Doing, right for Done', 'Mime dragging a card'],
      time: '1.5 min'
    }
  },

  // Trello: Demo
  {
    id: 'trello-demo',
    type: 'demo',
    demoType: 'trello',
    title: 'A Trello Board in Action',
    steps: 4,
    notes: {
      say: `Here's what a Trello board looks like.

See the columns? To Do, In Progress, Under Review, Done. Tasks flow left to right.

See the cards? Each one is a task. They have titles, and some have labels - those colored tags help you categorize. Maybe red for urgent, blue for planning, green for finance.

Here's the magic: when you finish something, you drag it to Done. There's something deeply satisfying about that drag. You FEEL the progress.

The board IS your status update. Anyone can look at it and know exactly where things stand.`,
      do: ['Point to different parts of the board', 'If the demo is interactive, drag a card to demonstrate'],
      time: '2 min'
    }
  },

  // Trello: Step by step
  {
    id: 'trello-create-board',
    type: 'stepbystep',
    title: 'Create Your First Board',
    tool: 'trello',
    steps: [
      { text: 'Go to trello.com and sign in', hint: 'Use your work email - free account' },
      { text: 'Click "Create" → "Create board"', hint: 'Top right corner' },
      { text: 'Name it "My Tasks"', detail: 'Start simple - you can always rename it' },
      { text: 'Add 3 lists: To Do, Doing, Done', hint: 'Click "+ Add a list"' },
      { text: 'Add a few cards to "To Do"', hint: 'Click "+ Add a card" and type a task' },
    ],
    notes: {
      say: `Here's exactly how to create your first board:

Step 1: Go to trello.com. Sign in with your work email - it's free.

Step 2: Click "Create" in the top right, then "Create board."

Step 3: Name it "My Tasks" - we're starting simple.

Step 4: Add three lists. Click "Add a list" and type "To Do". Then add "Doing" and "Done."

Step 5: Add some real tasks. Click "Add a card" in the To Do list and type something you actually need to do this week.

Everyone follow along - I'll give you time to do this in a moment.`,
      time: '1 min'
    }
  },

  // Trello: ACTION
  {
    id: 'trello-action',
    type: 'action',
    action: 'Open Trello NOW',
    subtext: 'Create a board with 3 lists and add 5 REAL tasks you need to do this week',
    icon: LayoutGrid,
    color: 'purple',
    notes: {
      say: `Your turn! Everyone go to trello.com now.

Create an account if you don't have one - use your work email.

Create a board called "My Tasks."

Add three lists: To Do, Doing, Done.

Now here's the important part - add 5 REAL tasks. Not fake practice tasks. Things you actually need to do this week.

You have 5 minutes. I'll walk around to help!`,
      do: [
        'Walk around the room actively',
        'Look for people who seem stuck',
        'Common issues: trouble creating account, can\'t find Create button'
      ],
      ifAsked: [
        { q: 'What if I already have Trello?', a: 'Great! Create a new board for this exercise, or show me your existing setup.' },
        { q: 'What kind of tasks should I add?', a: 'Anything on your plate: reports to write, meetings to prep for, emails to send, calls to make.' }
      ],
      time: '6 min'
    }
  },

  // Trello: Daily habit
  {
    id: 'trello-habit',
    type: 'comparison',
    title: 'The Daily Trello Habit',
    bad: [
      'Open Trello once a week',
      'Let cards pile up in To Do forever',
      'Never celebrate finishing tasks',
      'Forget it exists'
    ],
    good: [
      'Check Trello every morning (5 min)',
      'Move cards as you work on them',
      'Drag to Done with satisfaction!',
      'Keep it open in a browser tab'
    ],
    notes: {
      say: `Now, here's the secret to making Trello actually work: you need a daily habit.

The left side doesn't work. If you only open Trello occasionally, it becomes useless. Cards pile up, and you stop trusting it.

The right side works:
• Every morning, spend 5 minutes looking at your board. What's on for today?
• When you start a task, drag it to Doing.
• When you finish, drag it to Done. Enjoy that moment!
• Keep Trello open in a tab so you see it throughout the day.

The tool is simple. The habit is what makes it powerful.`,
      keyPoint: 'The habit matters more than the tool itself',
      time: '1.5 min'
    }
  },

  // Trello: Quick Win
  {
    id: 'trello-quickwin',
    type: 'keypoint',
    icon: Award,
    title: 'Quick Win: You Have a Task Dashboard!',
    subtitle: 'That board you just created? Check it tomorrow morning. Drag one task to Done. Feel the satisfaction.',
    color: 'emerald',
    notes: {
      say: `Another quick win! You now have a visual dashboard of your tasks.

Here's your homework: tomorrow morning, open that board. Look at your To Do list. Pick one task, do it, and drag it to Done.

That feeling of dragging to Done? That's the whole point. It's simple, but it works.

Now let's look at Asana for when things get more complex.`,
      time: '45 sec'
    }
  },

  // Trello: Mobile Setup
  {
    id: 'trello-mobile-setup',
    type: 'mobilesetup',
    tool: 'trello',
    steps: 1,
    notes: {
      say: `Want Trello on your phone? Here's how to set it up.

Download the Trello app from the Play Store or App Store. Sign in with the same account you just created.

The mobile app is great for quickly adding tasks when you think of them - waiting for a meeting to start, on your commute, wherever.

Download this guide to reference later!`,
      keyPoint: 'Mobile Trello = capture tasks anywhere, anytime',
      time: '1 min'
    }
  },

  // ============================================
  // PART 3: ASANA
  // ============================================
  {
    id: 'asana-intro',
    type: 'section',
    section: 'Part 3',
    title: 'Asana',
    subtitle: 'For complex projects',
    icon: CheckSquare,
    accent: 'rose',
    steps: 1,
    notes: {
      say: `Part 3: Asana!

So if Calendar is for time and Trello is for simple task tracking, what's Asana for?

Asana is for COMPLEX work. Projects with multiple people, lots of subtasks, deadlines that depend on each other.

If Trello is a sticky-note board, Asana is a full project management system.`,
      time: '30 sec'
    }
  },

  // Asana: When to use
  {
    id: 'asana-when',
    type: 'comparison',
    title: 'Trello vs Asana: Use the Right Tool',
    bad: [
      'Simple personal tasks → Asana (overkill)',
      'Complex 10-person project → Trello (not enough)',
      'Tasks with subtasks → Trello (limited)'
    ],
    good: [
      'Simple personal tasks → Trello',
      'Complex 10-person project → Asana',
      'Tasks with many subtasks → Asana'
    ],
    notes: {
      say: `Here's when to use each tool:

TRELLO is great for:
• Personal task management
• Simple team boards
• When you want visual and simple

ASANA is better for:
• Complex projects with many people
• When tasks have subtasks inside them
• When Task B can't start until Task A is done

Think of it this way: Trello for simple, Asana for complex.

And honestly? Many people use both. Trello for daily tasks, Asana for big projects.`,
      ifAsked: [
        { q: 'Can I just use one?', a: 'Absolutely! Start with Trello. Add Asana only if you need more complexity.' },
        { q: 'What if my team uses something different?', a: 'Use what your team uses. These concepts apply to any tool - Monday, Jira, whatever.' }
      ],
      time: '1.5 min'
    }
  },

  // Asana: Demo
  {
    id: 'asana-demo',
    type: 'demo',
    demoType: 'asana',
    title: 'An Asana Project',
    steps: 3,
    notes: {
      say: `Here's an Asana project. Notice how it's more structured than Trello.

See the sections? That's how you group related tasks - like chapters in a book.

Click on a task and you can see SUBTASKS inside it. That's Asana's superpower. "Launch Website" might have 15 subtasks inside.

See the dates and assignees? Everyone knows who's responsible for what and when it's due.

This is great for projects like: office moves, annual reports, new employee onboarding - anything with lots of pieces.`,
      do: ['Point to sections, subtasks, and assignees', 'Click to expand a task if the demo supports it'],
      time: '2 min'
    }
  },

  // Asana: Key concept
  {
    id: 'asana-subtasks',
    type: 'keypoint',
    icon: CheckSquare,
    title: 'Break Down Big Tasks',
    subtitle: 'Asana\'s superpower is subtasks. "Complete Q1 Report" becomes 5 smaller, doable steps. Big feels impossible. Small feels doable.',
    color: 'orange',
    notes: {
      say: `Here's the key to using Asana well: break things down.

When a task feels too big - like "Complete Q1 Report" - you don't know where to start. It's overwhelming.

But break it into subtasks:
1. Gather data from team leads
2. Draft executive summary
3. Create charts and graphs
4. Review with manager
5. Submit final version

Now each step is clear and doable. THAT'S why Asana is powerful for complex work.`,
      keyPoint: 'Subtasks are the key Asana skill. Make sure this lands.',
      time: '1.5 min'
    }
  },

  // Asana: Step by step
  {
    id: 'asana-create-project',
    type: 'stepbystep',
    title: 'Create an Asana Project',
    tool: 'asana',
    steps: [
      { text: 'Go to app.asana.com', hint: 'Free account with work email' },
      { text: 'Click "+ Create" → "Project"', hint: 'Left sidebar or top area' },
      { text: 'Choose "Blank project"', detail: 'Templates are useful later, but start blank' },
      { text: 'Name it after a real project', hint: 'Something you\'re actually working on' },
      { text: 'Add 3-5 tasks', hint: 'Major pieces of the project' },
      { text: 'Click a task → add 2-3 subtasks', hint: 'Break down one big task' },
    ],
    notes: {
      say: `Here's how to create an Asana project:

Step 1: Go to app.asana.com and sign in with your work email. It's free.

Step 2: Click "Create" and select "Project."

Step 3: Choose "Blank project" - templates are nice, but let's start simple.

Step 4: Name it after something REAL. A project you're actually working on.

Step 5: Add a few tasks - the major pieces of the project.

Step 6: Now the key part - click into one of those tasks and add subtasks. Break it down.`,
      time: '1 min'
    }
  },

  // Asana: ACTION
  {
    id: 'asana-action',
    type: 'action',
    action: 'Open Asana NOW',
    subtext: 'Create a project and break ONE big task into 3+ subtasks',
    icon: CheckSquare,
    color: 'orange',
    notes: {
      say: `Alright, last hands-on exercise! Go to app.asana.com.

Create a project for something REAL you're working on. Not a fake project.

Add a few tasks, and then - this is the important part - pick the BIGGEST task and break it into at least 3 subtasks.

You have 5 minutes. I'll help!`,
      do: [
        'Walk around actively',
        'Help with account setup - most common blocker',
        'Encourage them to use real projects, not fake examples'
      ],
      ifAsked: [
        { q: 'I don\'t have a complex project right now', a: 'Try your annual review, a certification process, or planning for an upcoming event. Anything with multiple steps.' },
        { q: 'What\'s the difference between tasks and subtasks?', a: 'Tasks are the major milestones. Subtasks are the specific steps within each milestone.' }
      ],
      time: '6 min'
    }
  },

  // Asana: Mobile Setup
  {
    id: 'asana-mobile-setup',
    type: 'mobilesetup',
    tool: 'asana',
    steps: 1,
    notes: {
      say: `Here's how to get Asana on your phone.

Download Asana from your app store and sign in with the same work email.

The mobile app lets you check on projects, mark tasks complete, and add notes from anywhere.

Perfect for when you're away from your desk but want to stay on top of things.`,
      keyPoint: 'Mobile Asana = project visibility on the go',
      time: '1 min'
    }
  },

  // ============================================
  // WHICH TOOL WHEN?
  // ============================================
  {
    id: 'which-tool',
    type: 'content',
    title: 'Your Toolkit Summary',
    items: [
      { title: 'Google Calendar', description: 'ALWAYS use this. Block focus time. Protect your schedule.' },
      { title: 'Trello', description: 'Personal tasks, simple projects, when you want visual.' },
      { title: 'Asana', description: 'Complex projects, team work, when tasks have subtasks.' },
    ],
    listType: 'solution',
    steps: 4,
    notes: {
      say: `Let's recap your toolkit:

GOOGLE CALENDAR - Use this no matter what. Block your focus time every week.

TRELLO - Use when you want simple and visual. Great for personal task management.

ASANA - Use when things are complex. Multiple people, lots of subtasks, dependencies.

You don't have to use all three! Start with Calendar - everyone needs that. Add Trello or Asana based on your work.`,
      keyPoint: 'Don\'t overwhelm them - it\'s okay to start with just Calendar',
      time: '1.5 min'
    }
  },

  // ============================================
  // GETTING STARTED
  // ============================================
  {
    id: 'getting-started',
    type: 'checklist',
    title: 'Before You Leave: Quick Check',
    items: [
      'You have a Focus Time block on your calendar',
      'You have a Trello board with real tasks',
      'You\'ve tried Asana (optional - if you have complex projects)',
      'You know which tool to use for what'
    ],
    timer: 'Check now!',
    notes: {
      say: `Before we wrap up, quick check:

Raise your hand if you have a Focus Time block on your calendar. [Wait]

Raise your hand if you created a Trello board with real tasks. [Wait]

Anyone try Asana?

Anyone confused about which tool to use when?

If you're missing anything, take 2 minutes right now to finish up. I'm here to help.`,
      do: ['Ask each question and wait for raised hands', 'Offer help to anyone who didn\'t raise their hand'],
      time: '3 min'
    }
  },

  // ============================================
  // TOP 3 TIPS
  // ============================================
  {
    id: 'top-tips',
    type: 'content',
    title: 'The 3 Things to Remember',
    items: [
      { title: '1. Block your time FIRST', description: 'Friday afternoon, block focus time for next week' },
      { title: '2. Check your tools DAILY', description: '5 minutes every morning looking at your board' },
      { title: '3. Keep it SIMPLE', description: 'Complicated systems get abandoned. Simple ones get used.' },
    ],
    listType: 'solution',
    steps: 4,
    notes: {
      say: `If you remember nothing else, remember these three things:

ONE: Block your time FIRST. Spend 5 minutes Friday afternoon protecting next week's focus time.

TWO: Check your tools DAILY. Just 5 minutes in the morning. Look at your board. See what's on for today.

THREE: Keep it SIMPLE. Don't create 50 labels and 10 columns. Simple systems get used. Complex ones get abandoned.

That's it. Three habits that will change how you work.`,
      keyPoint: 'These three habits are more important than any feature',
      time: '2 min'
    }
  },

  // ============================================
  // RESOURCES
  // ============================================
  {
    id: 'resources',
    type: 'content',
    title: 'Need Help Later?',
    items: [
      { title: 'Google Calendar Help', description: 'support.google.com/calendar' },
      { title: 'Trello Guide', description: 'trello.com/guide' },
      { title: 'Asana Guide', description: 'asana.com/guide' },
      { title: 'IT Help Desk', description: 'For account issues or access problems' },
    ],
    listType: 'bullet',
    icon: BookOpen,
    steps: 5,
    notes: {
      say: `If you get stuck after today, here's where to find help:

Each tool has excellent help documentation - these links have tutorials for everything.

And of course, the IT Help Desk is here for account issues.

I'd recommend bookmarking the Trello and Asana guides - they have great video tutorials.`,
      time: '1 min'
    }
  },

  // ============================================
  // MOBILE GUIDES DOWNLOAD
  // ============================================
  {
    id: 'all-guides-download',
    type: 'allguides',
    steps: 1,
    notes: {
      say: `Before we finish, here's something useful to take with you.

You can download mobile setup guides for all three tools - Google Calendar, Trello, and Asana.

Each guide has step-by-step instructions for both Android and iPhone.

Take a moment to download these - tap any card for individual guides, or the big green button for all three at once.`,
      do: ['Give everyone a moment to download', 'Help anyone having trouble'],
      keyPoint: 'Tangible takeaways help retention',
      time: '2 min'
    }
  },

  // ============================================
  // PRACTICE PLATFORM
  // ============================================
  {
    id: 'practice-platform',
    type: 'practice',
    title: 'Interactive Practice Lab',
    subtitle: 'Master Google Calendar & Trello with hands-on challenges',
    icon: GraduationCap,
    accent: 'cyan',
    steps: 1,
    notes: {
      say: `Now for the fun part - let's practice!

This is our Interactive Practice Lab. You can choose to practice either Google Calendar or Trello.

Each tool has guided challenges that will walk you through the key features. You'll earn points as you complete them, and you can track your progress.

Take your time and explore. The best way to learn is by doing!

I'll be walking around to help. Choose Calendar or Trello and start practicing!`,
      do: [
        'Walk around helping people who are stuck',
        'Celebrate when people complete challenges',
        'Point out the hint feature for struggling learners'
      ],
      keyPoint: 'Hands-on practice is where learning sticks',
      time: '15 min'
    }
  },

  // ============================================
  // CLOSING
  // ============================================
  {
    id: 'thank-you',
    type: 'title',
    title: 'You\'re Ready!',
    subtitle: 'Start using your tools TODAY. Questions?',
    icon: Award,
    accent: 'emerald',
    steps: 1,
    notes: {
      say: `That's it! You're ready.

You've got Focus Time on your calendar. You've got a Trello board. You know when to use Asana.

The most important thing now? USE IT. Starting today. Not "someday when I have time."

Keep those tabs open. Check your board tomorrow morning. Protect your focus time.

I'll open it up for questions now. What would you like to know?`,
      ifAsked: [
        { q: 'What if I forget how to do something?', a: 'Google it! Seriously. "How to add subtasks in Asana" will give you step-by-step tutorials.' },
        { q: 'Should I make my team use these?', a: 'Start with yourself. Show results. Others will get curious and ask what you\'re using.' },
        { q: 'What about Microsoft tools / Outlook?', a: 'Same concepts apply! Block time in Outlook. Use Microsoft Planner instead of Trello. The principles are the same.' }
      ],
      do: ['Thank everyone', 'Stay for questions', 'Offer to help people one-on-one after'],
      time: '5 min for Q&A'
    }
  },
];

export default slidesConfig;
