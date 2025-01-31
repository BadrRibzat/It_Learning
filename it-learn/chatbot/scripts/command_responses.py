COMMAND_RESPONSES = {
    'ls': {
        'description': 'List directory contents',
        'syntax': 'ls [OPTION]... [FILE]...',
        'common_options': [
            '-l - use a long listing format',
            '-a - show hidden files',
            '-h - human readable sizes',
            '-R - list subdirectories recursively'
        ],
        'examples': [
            'ls - list current directory',
            'ls -la ~ - list all files in home directory with details',
            'ls -lh /var/log - list logs with human-readable sizes'
        ],
        'tips': [
            'Use ls -la to see all files with details',
            'Combine options like -lh for better readability',
            'Use tab completion with ls to explore directories'
        ],
        'warnings': [
            'Hidden files start with . and need -a to be visible',
            'Large directories may take time with -R option'
        ],
        'related_commands': ['cd', 'pwd', 'tree', 'find']
    },
    # Add more commands...
}

CONVERSATION_PATTERNS = {
    'greeting': [
        "Hello! I'm your Linux command learning assistant. How can I help you today?",
        "Hi there! Ready to learn about Linux commands?",
        "Welcome! I'm here to help you master the command line!"
    ],
    'farewell': [
        "Goodbye! Keep practicing those commands!",
        "See you later! Don't forget to try out what you learned!",
        "Bye! Come back anytime for more command line learning!"
    ],
    'help': [
        "I can help you learn about Linux commands, their usage, and best practices. What would you like to know?",
        "I can teach you about file operations, system navigation, permissions, and more. Where shall we start?",
        "I'm here to explain Linux commands and concepts. What topic interests you?"
    ],
    # Add more patterns...
}

LEARNING_PATHS = {
    'beginner': [
        {
            'topic': 'Basic Navigation',
            'commands': ['pwd', 'cd', 'ls'],
            'concepts': ['Current directory', 'Absolute vs relative paths', 'Directory structure'],
            'exercises': [
                'List files in your home directory',
                'Navigate to different directories',
                'Show hidden files'
            ]
        },
        # Add more topics...
    ],
    # Add more levels...
}
