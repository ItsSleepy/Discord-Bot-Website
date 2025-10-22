// Bot Invite URL - REPLACE THIS WITH YOUR ACTUAL BOT INVITE LINK
const BOT_INVITE_URL = 'https://discord.com/oauth2/authorize?client_id=1430443493188173956&permissions=8&integration_type=0&scope=applications.commands+bot';

// Set invite links
document.addEventListener('DOMContentLoaded', () => {
    // Update all invite buttons with the bot invite URL
    const inviteButtons = document.querySelectorAll('#inviteBtn, #inviteBtn2');
    inviteButtons.forEach(btn => {
        btn.href = BOT_INVITE_URL;
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 31, 58, 0.98)';
        } else {
            navbar.style.background = 'rgba(26, 31, 58, 0.95)';
        }
    });

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger?.addEventListener('click', () => {
        navLinks?.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Animate stats on scroll
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stat-number, .stat-box h3').forEach(stat => {
        statsObserver.observe(stat);
    });

    // Feature cards entrance animation
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .command-category, .support-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        featureObserver.observe(card);
    });

    // Update stats dynamically (simulated - in production, fetch from API)
    updateBotStats();
    
    // Update stats every 30 seconds
    setInterval(updateBotStats, 30000);
});

// Animate number counting
function animateValue(element) {
    if (element.dataset.animated) return;
    
    const text = element.textContent;
    const hasPercent = text.includes('%');
    const value = parseFloat(text.replace(/[^0-9.]/g, ''));
    
    if (isNaN(value)) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
            current = value;
            clearInterval(timer);
            element.dataset.animated = 'true';
        }
        
        if (hasPercent) {
            element.textContent = current.toFixed(1) + '%';
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / steps);
}

// Update bot statistics (showing Coming Soon status)
async function updateBotStats() {
    try {
        // Try to fetch live bot stats from API
        const response = await fetch('http://localhost:5000/api/stats');
        
        if (!response.ok) {
            throw new Error('API not responding');
        }
        
        const data = await response.json();
        
        if (data.status === 'online') {
            // Update main stats with live data
            document.getElementById('serverCount').textContent = data.servers || '-';
            document.getElementById('userCount').textContent = data.users || '-';
            document.getElementById('statServers').textContent = data.servers || '-';
            document.getElementById('statUsers').textContent = data.users || '-';
        } else {
            throw new Error('Bot not online');
        }
        
    } catch (error) {
        // Show placeholder when API is unavailable
        document.getElementById('serverCount').textContent = '-';
        document.getElementById('userCount').textContent = '-';
        document.getElementById('statServers').textContent = '-';
        document.getElementById('statUsers').textContent = '-';
    }
}

// Add particle effect to hero section (optional)
function createParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(88, 101, 242, 0.5);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${3 + Math.random() * 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        hero.appendChild(particle);
    }
}

// Call particle creation (uncomment if desired)
// createParticles();

// Command search functionality (for future enhancement)
function searchCommands(query) {
    const commands = document.querySelectorAll('.command');
    const lowerQuery = query.toLowerCase();

    commands.forEach(cmd => {
        const text = cmd.textContent.toLowerCase();
        const parent = cmd.closest('.command-category');
        
        if (text.includes(lowerQuery)) {
            cmd.style.display = 'block';
            parent.style.display = 'block';
        } else {
            cmd.style.display = 'none';
        }
    });
}

// Command Details Database
const commandDetails = {
    '/help': {
        syntax: '/help [category:optional]',
        description: 'Display all available commands organized by category. You can optionally specify a category to see commands for that specific category only.',
        examples: ['/help', '/help category:Economy', '/help category:Gaming'],
        permissions: 'None'
    },
    '/setup': {
        syntax: '/setup',
        description: 'Launch the bot setup wizard that guides server administrators through configuring MegaBot for their server.',
        examples: ['/setup'],
        permissions: 'Administrator'
    },
    '/info': {
        syntax: '/info',
        description: 'Display information about MegaBot including statistics, features, and links.',
        examples: ['/info'],
        permissions: 'None'
    },
    '/dashboard': {
        syntax: '/dashboard',
        description: 'Get the link to access the MegaBot web dashboard. The dashboard features real-time statistics, complete command documentation with interactive overlays, and a beautiful responsive interface.',
        examples: ['/dashboard'],
        permissions: 'None'
    },
    '/balance': {
        syntax: '/balance [user:optional]',
        description: 'Check your current balance in the economy system or view another user\'s balance.',
        examples: ['/balance', '/balance user:@JohnDoe'],
        permissions: 'None'
    },
    '/daily': {
        syntax: '/daily',
        description: 'Claim your daily reward of virtual currency. Can be claimed once every 24 hours.',
        examples: ['/daily'],
        permissions: 'None'
    },
    '/work': {
        syntax: '/work',
        description: 'Work to earn virtual currency. Has a cooldown period between uses.',
        examples: ['/work'],
        permissions: 'None'
    },
    '/shop': {
        syntax: '/shop',
        description: 'Browse items that boost your earnings! Buy power-ups like Lucky Charm (2x gambling), Briefcase (2x work), Energy Drink (no cooldowns), Diamond Multiplier (3x all earnings), and more.',
        examples: ['/shop'],
        permissions: 'None'
    },
    '/buy': {
        syntax: '/buy <item>',
        description: 'Purchase an item from the shop. Buy earning boosters, multipliers, and instant cash items to increase your wealth!',
        examples: ['/buy item:Lucky Charm', '/buy item:Energy Drink', '/buy item:Stock Market Tip'],
        permissions: 'None'
    },
    '/slots': {
        syntax: '/slots <amount>',
        description: 'Play the slot machine! Bet virtual currency for a chance to win big.',
        examples: ['/slots amount:100', '/slots amount:500'],
        permissions: 'None'
    },
    '/blackjack': {
        syntax: '/blackjack <amount>',
        description: 'Play a game of blackjack against the dealer. Try to get as close to 21 as possible without going over!',
        examples: ['/blackjack amount:100', '/blackjack amount:250'],
        permissions: 'None'
    },
    '/playing': {
        syntax: '/playing <game>',
        description: 'Set what game you\'re currently playing. This helps others find teammates for the same game.',
        examples: ['/playing game:Valorant', '/playing game:Minecraft'],
        permissions: 'None'
    },
    '/lfg': {
        syntax: '/lfg <game> <slots> [description:optional]',
        description: 'Create a Looking For Group post to find other players for a specific game.',
        examples: ['/lfg game:Valorant slots:3', '/lfg game:Fortnite slots:2 description:Ranked matches'],
        permissions: 'None'
    },
    '/gamerole': {
        syntax: '/gamerole <game>',
        description: 'Get or remove a role for a specific game to show what games you play.',
        examples: ['/gamerole game:Valorant', '/gamerole game:League of Legends'],
        permissions: 'None'
    },
    '/gamedeal': {
        syntax: '/gamedeal <game>',
        description: 'Search for the best deals and discounts for a specific game.',
        examples: ['/gamedeal game:Cyberpunk 2077'],
        permissions: 'None'
    },
    '/steam': {
        syntax: '/steam <username>',
        description: 'View detailed Steam profile information including account status, game library, total playtime, and top played games. Works with Steam vanity URLs or 64-bit Steam IDs.',
        examples: ['/steam username:gabelogannewell', '/steam username:76561197960287930'],
        permissions: 'None'
    },
    '/currentgames': {
        syntax: '/currentgames',
        description: 'See what games everyone in the server is currently playing.',
        examples: ['/currentgames'],
        permissions: 'None'
    },
    '/kick': {
        syntax: '/kick <user> [reason:optional]',
        description: 'Kick a member from the server. Optionally provide a reason for the kick.',
        examples: ['/kick user:@BadUser', '/kick user:@Spammer reason:Spam messages'],
        permissions: 'Kick Members'
    },
    '/ban': {
        syntax: '/ban <user> [reason:optional]',
        description: 'Ban a member from the server. They will not be able to rejoin unless unbanned.',
        examples: ['/ban user:@BadUser', '/ban user:@Troll reason:Harassment'],
        permissions: 'Ban Members'
    },
    '/mute': {
        syntax: '/mute <user> <duration> [reason:optional]',
        description: 'Temporarily mute a member, preventing them from sending messages.',
        examples: ['/mute user:@User duration:1h', '/mute user:@Spammer duration:30m reason:Spam'],
        permissions: 'Manage Messages'
    },
    '/warn': {
        syntax: '/warn <user> <reason>',
        description: 'Issue a warning to a member. Warnings are logged and can be viewed later.',
        examples: ['/warn user:@User reason:Breaking rule #3', '/warn user:@Member reason:Inappropriate language'],
        permissions: 'Manage Messages'
    },
    '/clear': {
        syntax: '/clear <amount>',
        description: 'Delete a specified number of messages from the current channel.',
        examples: ['/clear amount:10', '/clear amount:50'],
        permissions: 'Manage Messages'
    },
    '/poll': {
        syntax: '/poll <question> <options>',
        description: 'Create a poll with multiple options (up to 10). Separate options with commas.',
        examples: ['/poll question:Best pizza topping? options:Pepperoni, Mushrooms, Pineapple', '/poll question:Movie night? options:Action, Comedy, Horror'],
        permissions: 'None'
    },
    '/remind': {
        syntax: '/remind <time> <message>',
        description: 'Set a reminder. The bot will DM you when the time is up.',
        examples: ['/remind time:30m message:Check the oven', '/remind time:2h message:Meeting at 3PM'],
        permissions: 'None'
    },
    '/translate': {
        syntax: '/translate <text> <to_language>',
        description: 'Translate text to another language.',
        examples: ['/translate text:Hello World to_language:Spanish', '/translate text:Good morning to_language:French'],
        permissions: 'None'
    },
    '/calculate': {
        syntax: '/calculate <expression>',
        description: 'Calculate a mathematical expression.',
        examples: ['/calculate expression:2+2', '/calculate expression:(15*3)+7'],
        permissions: 'None'
    },
    '/joke': {
        syntax: '/joke',
        description: 'Get a random joke to lighten the mood!',
        examples: ['/joke'],
        permissions: 'None'
    },
    '/meme': {
        syntax: '/meme',
        description: 'Get a random meme from popular subreddits.',
        examples: ['/meme'],
        permissions: 'None'
    },
    '/8ball': {
        syntax: '/8ball <question>',
        description: 'Ask the magic 8-ball a yes/no question and receive a mystical answer.',
        examples: ['/8ball question:Will I win the lottery?', '/8ball question:Should I study today?'],
        permissions: 'None'
    },
    '/trivia': {
        syntax: '/trivia [category:optional]',
        description: 'Play a trivia game! Test your knowledge across various categories.',
        examples: ['/trivia', '/trivia category:Science'],
        permissions: 'None'
    },
    '/transfer': {
        syntax: '/transfer <user> <amount>',
        description: 'Transfer virtual currency to another user.',
        examples: ['/transfer user:@Friend amount:500', '/transfer user:@John amount:1000'],
        permissions: 'None'
    },
    '/leaderboard': {
        syntax: '/leaderboard',
        description: 'View the top 10 richest users in the server economy.',
        examples: ['/leaderboard'],
        permissions: 'None'
    },
    '/unmute': {
        syntax: '/unmute <user>',
        description: 'Remove a timeout/mute from a member, allowing them to send messages again.',
        examples: ['/unmute user:@Member'],
        permissions: 'Moderate Members'
    },
    '/unban': {
        syntax: '/unban <user_id>',
        description: 'Unban a user from the server using their User ID.',
        examples: ['/unban user_id:123456789012345678'],
        permissions: 'Ban Members'
    },
    '/slowmode': {
        syntax: '/slowmode <seconds>',
        description: 'Set slowmode in a channel. Users can only send messages every X seconds (0 to disable).',
        examples: ['/slowmode seconds:5', '/slowmode seconds:0'],
        permissions: 'Manage Channels'
    },
    '/lock': {
        syntax: '/lock',
        description: 'Lock the current channel, preventing non-moderators from sending messages.',
        examples: ['/lock'],
        permissions: 'Manage Channels'
    },
    '/unlock': {
        syntax: '/unlock',
        description: 'Unlock a previously locked channel, allowing everyone to send messages again.',
        examples: ['/unlock'],
        permissions: 'Manage Channels'
    },
    '/setwelcome': {
        syntax: '/setwelcome <channel> <message>',
        description: 'Set a welcome message that will be sent when new members join the server.',
        examples: ['/setwelcome channel:#welcome message:Welcome to the server!'],
        permissions: 'Administrator'
    },
    '/setautorole': {
        syntax: '/setautorole <role>',
        description: 'Set a role that will automatically be given to new members when they join.',
        examples: ['/setautorole role:@Member'],
        permissions: 'Administrator'
    },
    '/userinfo': {
        syntax: '/userinfo [user:optional]',
        description: 'Display detailed information about a user including join date, roles, and account creation date.',
        examples: ['/userinfo', '/userinfo user:@John'],
        permissions: 'None'
    },
    '/serverinfo': {
        syntax: '/serverinfo',
        description: 'Display detailed information about the current server including member count, creation date, and more.',
        examples: ['/serverinfo'],
        permissions: 'None'
    },
    '/avatar': {
        syntax: '/avatar [user:optional]',
        description: 'Display a user\'s avatar in full size with download link.',
        examples: ['/avatar', '/avatar user:@Friend'],
        permissions: 'None'
    },
    '/flip': {
        syntax: '/flip',
        description: 'Flip a coin! Get either Heads or Tails.',
        examples: ['/flip'],
        permissions: 'None'
    },
    '/roll': {
        syntax: '/roll [sides:optional]',
        description: 'Roll a dice! Default is 6 sides, but you can specify any number.',
        examples: ['/roll', '/roll sides:20', '/roll sides:100'],
        permissions: 'None'
    },
    '/choose': {
        syntax: '/choose <options>',
        description: 'Let the bot choose between multiple options. Separate options with commas.',
        examples: ['/choose options:Pizza, Burger, Tacos', '/choose options:Movie, Game, Sleep'],
        permissions: 'None'
    },
    '/fortune': {
        syntax: '/fortune',
        description: 'Get your fortune told! Receive a mystical fortune cookie message.',
        examples: ['/fortune'],
        permissions: 'None'
    },
    '/rate': {
        syntax: '/rate <thing>',
        description: 'Have the bot rate something on a scale of 1-10.',
        examples: ['/rate thing:Pizza', '/rate thing:My profile picture'],
        permissions: 'None'
    },
    '/pomodoro': {
        syntax: '/pomodoro <duration> <break_duration>',
        description: 'Start a Pomodoro study timer with work and break intervals.',
        examples: ['/pomodoro duration:25 break_duration:5', '/pomodoro duration:50 break_duration:10'],
        permissions: 'None'
    },
    '/homework': {
        syntax: '/homework <subject> <task> <due_date>',
        description: 'Add a homework assignment to your personal tracker.',
        examples: ['/homework subject:Math task:Chapter 5 problems due_date:2025-10-25', '/homework subject:English task:Essay due_date:Friday'],
        permissions: 'None'
    },
    '/listhomework': {
        syntax: '/listhomework',
        description: 'View all your pending homework assignments.',
        examples: ['/listhomework'],
        permissions: 'None'
    },
    '/completehomework': {
        syntax: '/completehomework <id>',
        description: 'Mark a homework assignment as complete.',
        examples: ['/completehomework id:1', '/completehomework id:5'],
        permissions: 'None'
    },
    '/quiz': {
        syntax: '/quiz <question> <correct_answer> <wrong_answers>',
        description: 'Create a quiz question for others to answer.',
        examples: ['/quiz question:What is 2+2? correct_answer:4 wrong_answers:3,5,6'],
        permissions: 'None'
    },
    '/viewquiz': {
        syntax: '/viewquiz',
        description: 'View and answer available quiz questions.',
        examples: ['/viewquiz'],
        permissions: 'None'
    },
    '/flashcard': {
        syntax: '/flashcard <front> <back>',
        description: 'Create a study flashcard with a question and answer.',
        examples: ['/flashcard front:Capital of France back:Paris', '/flashcard front:H2O back:Water'],
        permissions: 'None'
    },
    '/viewflashcard': {
        syntax: '/viewflashcard',
        description: 'Review your saved flashcards for studying.',
        examples: ['/viewflashcard'],
        permissions: 'None'
    },
    '/serverstats': {
        syntax: '/serverstats',
        description: 'View comprehensive statistics about the server including member growth, activity, and more.',
        examples: ['/serverstats'],
        permissions: 'None'
    },
    '/channelstats': {
        syntax: '/channelstats <channel>',
        description: 'View statistics about a specific channel including message count and activity.',
        examples: ['/channelstats channel:#general', '/channelstats channel:#gaming'],
        permissions: 'None'
    },
    '/roleinfo': {
        syntax: '/roleinfo <role>',
        description: 'Display detailed information about a server role.',
        examples: ['/roleinfo role:@Moderator', '/roleinfo role:@VIP'],
        permissions: 'None'
    },
    '/topchatters': {
        syntax: '/topchatters',
        description: 'See the most active members in the server based on message count.',
        examples: ['/topchatters'],
        permissions: 'None'
    },
    '/emojistats': {
        syntax: '/emojistats',
        description: 'View statistics about emoji usage in the server.',
        examples: ['/emojistats'],
        permissions: 'None'
    },
    '/membercount': {
        syntax: '/membercount',
        description: 'Display the current member count and member growth statistics.',
        examples: ['/membercount'],
        permissions: 'None'
    },
    '/tournament create': {
        syntax: '/tournament create <name> <max_players>',
        description: 'Create a new tournament with specified name and player limit.',
        examples: ['/tournament create name:FridayNightShowdown max_players:16', '/tournament create name:ChampionsLeague max_players:32'],
        permissions: 'Manage Events'
    },
    '/tournament join': {
        syntax: '/tournament join <tournament_id>',
        description: 'Join an existing tournament.',
        examples: ['/tournament join tournament_id:1'],
        permissions: 'None'
    },
    '/tournament leave': {
        syntax: '/tournament leave <tournament_id>',
        description: 'Leave a tournament you previously joined.',
        examples: ['/tournament leave tournament_id:1'],
        permissions: 'None'
    },
    '/tournament info': {
        syntax: '/tournament info <tournament_id>',
        description: 'View detailed information about a tournament including participants and status.',
        examples: ['/tournament info tournament_id:1'],
        permissions: 'None'
    },
    '/tournament start': {
        syntax: '/tournament start <tournament_id>',
        description: 'Start a tournament and begin the bracket matches.',
        examples: ['/tournament start tournament_id:1'],
        permissions: 'Manage Events'
    },
    '/tournament list': {
        syntax: '/tournament list',
        description: 'View all active tournaments in the server.',
        examples: ['/tournament list'],
        permissions: 'None'
    },
    '/tournament delete': {
        syntax: '/tournament delete <tournament_id>',
        description: 'Delete a tournament permanently.',
        examples: ['/tournament delete tournament_id:1'],
        permissions: 'Manage Events'
    }
};

// Command Overlay Functionality
function showCommandOverlay(commandName) {
    const overlay = document.getElementById('commandOverlay');
    const details = commandDetails[commandName];
    
    if (!details) {
        return;
    }
    
    // Update overlay content
    document.getElementById('overlayCommandName').textContent = commandName;
    document.getElementById('overlayCommandSyntax').textContent = details.syntax;
    document.getElementById('overlayCommandDescription').textContent = details.description;
    
    // Update examples
    const examplesList = document.getElementById('overlayExamplesList');
    examplesList.innerHTML = '';
    details.examples.forEach(example => {
        const exampleDiv = document.createElement('div');
        exampleDiv.className = 'command-example';
        exampleDiv.textContent = example;
        examplesList.appendChild(exampleDiv);
    });
    
    // Update permissions
    document.getElementById('overlayPermissionsList').innerHTML = 
        `<span class="permission-badge">${details.permissions}</span>`;
    
    // Show overlay
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeCommandOverlay() {
    const overlay = document.getElementById('commandOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

// Initialize command click handlers
document.querySelectorAll('.command').forEach(cmd => {
    cmd.style.cursor = 'pointer';
    cmd.title = 'Click for details';
    
    cmd.addEventListener('click', (e) => {
        e.stopPropagation();
        const commandName = cmd.textContent.trim();
        showCommandOverlay(commandName);
    });
});

// Close overlay handlers
document.getElementById('closeOverlay')?.addEventListener('click', closeCommandOverlay);
document.getElementById('commandOverlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'commandOverlay') {
        closeCommandOverlay();
    }
});

// Close overlay on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCommandOverlay();
    }
});

