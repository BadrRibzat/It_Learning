import sys
import os

# project root to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

import random
from datetime import datetime
from pymongo import MongoClient
import spacy
from services.ml_service import MLContentService
from werkzeug.security import generate_password_hash
import logging
from config import config

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def populate_initial_data():
    """Populate the database with initial data."""
    try:
        client = MongoClient(config.MONGODB_URI)
        db = client['e-learn']
        nlp = spacy.load(config.ML_MODEL_PATH)
        ml = MLContentService()

        logging.info("Clearing existing data...")
        collections = ['levels', 'lessons', 'flashcards', 'quizzes', 'questions',
                      'level_tests', 'level_test_questions', 'quiz_submissions', 'users']
        for col in collections:
            db[col].delete_many({})

        logging.info("Creating levels...")
        levels = [
            {'name': 'beginner', 'order': 1, 'created_at': datetime.utcnow()},
            {'name': 'intermediate', 'order': 2, 'created_at': datetime.utcnow()},
            {'name': 'advanced', 'order': 3, 'created_at': datetime.utcnow()},
            {'name': 'expert', 'order': 4, 'created_at': datetime.utcnow()}
        ]
        level_ids = []
        for level in levels:
            level_id = db.levels.insert_one(level).inserted_id
            level_ids.append(level_id)
            logger.info(f"Created level: {level['name']} with ID: {level_id}")

        logging.info("Creating lessons and content...")
        command_examples = {
            'beginner': ['ls', 'cd', 'mkdir', 'rmdir', 'touch'],
            'intermediate': ['cp', 'mv', 'rm', 'cat', 'echo'],
            'advanced': ['grep', 'find', 'head', 'tail', 'chmod'],
            'expert': ['chown', 'ps', 'kill', 'df', 'du', 'top', 'history', 'alias', 'unalias', 'export', 'source', 'wget', 'curl', 'tar', 'ssh', 'sudo']
        }

        command_details = {
            'ls': {
                'explanation': 'The ls command lists the contents of a directory.',
                'example': 'ls -l',
                'formatted_example': '```sh\nls -l\n```'
            },
            'cd': {
                'explanation': 'The cd command changes the current directory.',
                'example': 'cd /home/user',
                'formatted_example': '```sh\ncd /home/user\n```'
            },
            'mkdir': {
                'explanation': 'The mkdir command creates a new directory.',
                'example': 'mkdir new_folder',
                'formatted_example': '```sh\nmkdir new_folder\n```'
            },
            'rmdir': {
                'explanation': 'Removes empty directories. Cannot delete directories containing files or other directories.',
                'example': 'rmdir empty_folder',
                'formatted_example': '```sh\nrmdir empty_folder\n```'
            },
            'touch': {
                'explanation': 'Creates new empty files or updates file timestamps.',
                'example': 'touch new_file.txt',
                'formatted_example': '```sh\ntouch new_file.txt\n```'
            },
            'cp': {
                'explanation': 'Copies files and directories. Use -r flag for directories.',
                'example': 'cp -r source_dir/ destination_dir/',
                'formatted_example': '```sh\ncp -r source_dir/ destination_dir/\n```'
            },
            'mv': {
                'explanation': 'Moves or renames files/directories. Also used for bulk renaming.',
                'example': 'mv old_name.txt new_name.txt',
                'formatted_example': '```sh\nmv old_name.txt new_name.txt\n```'
            },
            'rm': {
                'explanation': 'Removes files/directories permanently. Use with caution!',
                'example': 'rm -rf directory/',
                'formatted_example': '```sh\nrm -rf directory/\n```',
                'warning': '⚠️ Dangerous command: Deletes files permanently'
            },
            'cat': {
                'explanation': 'Displays file contents. Often used with pipes for processing.',
                'example': 'cat file.txt | grep "search"',
                'formatted_example': '```sh\ncat file.txt | grep "search"\n```'
            },
            'echo': {
                'explanation': 'Prints text to terminal or redirects to files.',
                'example': 'echo "Hello World" > greeting.txt',
                'formatted_example': '```sh\necho "Hello World" > greeting.txt\n```'
            },
            'grep': {
                'explanation': 'Searches text patterns using regular expressions.',
                'example': 'grep -ri "error" /var/log/',
                'formatted_example': '```sh\ngrep -ri "error" /var/log/\n```'
            },
            'find': {
                'explanation': 'Searches for files/directories matching criteria.',
                'example': 'find /home -name "*.jpg" -size +1M',
                'formatted_example': '```sh\nfind /home -name "*.jpg" -size +1M\n```'
            },
            'head': {
                'explanation': 'Displays first 10 lines of a file by default.',
                'example': 'head -n 20 large_file.log',
                'formatted_example': '```sh\nhead -n 20 large_file.log\n```'
            },
            'tail': {
                'explanation': 'Displays last 10 lines of a file. Useful for logs.',
                'example': 'tail -f /var/log/system.log',
                'formatted_example': '```sh\ntail -f /var/log/system.log\n```'
            },
            'chmod': {
                'explanation': 'Changes file permissions using numeric or symbolic modes.',
                'example': 'chmod 755 script.sh',
                'formatted_example': '```sh\nchmod 755 script.sh\n```'
            },
            'chown': {
                'explanation': 'Changes file owner and group.',
                'example': 'chown user:group file.txt',
                'formatted_example': '```sh\nchown user:group file.txt\n```'
            },
            'ps': {
                'explanation': 'Displays information about running processes.',
                'example': 'ps aux | grep nginx',
                'formatted_example': '```sh\nps aux | grep nginx\n```'
            },
            'kill': {
                'explanation': 'Terminates processes by PID. Use -9 for force kill.',
                'example': 'kill -9 1234',
                'formatted_example': '```sh\nkill -9 1234\n```'
            },
            'df': {
                'explanation': 'Shows disk space usage. -h flag for human-readable format.',
                'example': 'df -h',
                'formatted_example': '```sh\ndf -h\n```'
            },
            'du': {
                'explanation': 'Estimates file/directory space usage.',
                'example': 'du -sh *',
                'formatted_example': '```sh\ndu -sh *\n```'
            },
            'top': {
                'explanation': 'Dynamic real-time view of running system/processes.',
                'example': 'top',
                'formatted_example': '```sh\ntop\n```'
            },
            'history': {
                'explanation': 'Displays command history. Use !n to repeat command number n.',
                'example': 'history | grep "ssh"',
                'formatted_example': '```sh\nhistory | grep "ssh"\n```'
            },
            'alias': {
                'explanation': 'Creates shortcuts for commands.',
                'example': 'alias ll="ls -alh"',
                'formatted_example': '```sh\nalias ll="ls -alh"\n```'
            },
            'unalias': {
                'explanation': 'Removes command aliases.',
                'example': 'unalias ll',
                'formatted_example': '```sh\nunalias ll\n```'
            },
            'export': {
                'explanation': 'Sets environment variables.',
                'example': 'export PATH=$PATH:/new/path',
                'formatted_example': '```sh\nexport PATH=$PATH:/new/path\n```'
            },
            'source': {
                'explanation': 'Reloads shell configuration files.',
                'example': 'source ~/.bashrc',
                'formatted_example': '```sh\nsource ~/.bashrc\n```'
            },
            'wget': {
                'explanation': 'Downloads files from the web.',
                'example': 'wget https://example.com/file.zip',
                'formatted_example': '```sh\nwget https://example.com/file.zip\n```'
            },
            'curl': {
                'explanation': 'Transfers data from/to servers. Supports multiple protocols.',
                'example': 'curl -O https://example.com/file.jpg',
                'formatted_example': '```sh\ncurl -O https://example.com/file.jpg\n```'
            },
            'tar': {
                'explanation': 'Archiving utility. Common flags: -c (create), -x (extract), -z (gzip), -v (verbose), -f (file)',
                'example': 'tar -czvf archive.tar.gz folder/',
                'formatted_example': '```sh\ntar -czvf archive.tar.gz folder/\n```'
            },
            'ssh': {
                'explanation': 'Secure shell client for remote server access.',
                'example': 'ssh user@remote.server.com',
                'formatted_example': '```sh\nssh user@remote.server.com\n```'
            },
            'sudo': {
                'explanation': 'Executes commands with superuser privileges.',
                'example': 'sudo apt update',
                'formatted_example': '```sh\nsudo apt update\n```'
            }
        }

        for level_id, level_info in zip(level_ids, levels):
            level_name = level_info['name']
            logger.info(f"Creating lessons for level: {level_name} (ID: {level_id})")
            
            for lesson_num in range(1, 6):
                lesson = {
                    'level': level_id,
                    'title': f"Lesson {lesson_num} for {level_name}",
                    'description': '',
                    'order': lesson_num,
                    'created_at': datetime.utcnow()
                }
                lesson_id = db.lessons.insert_one(lesson).inserted_id
                logger.info(f"Created lesson {lesson_num} with ID: {lesson_id}")

                # Create flashcards
                for i, cmd in enumerate(command_examples[level_name]):
                    details = command_details.get(cmd, {})
                    explanation = details.get('explanation', f"The {cmd} command is used in Linux/macOS for [detailed explanation].")
                    example = details.get('example', f"Example usage of {cmd}: {cmd} [options]")
                    formatted_example = details.get('formatted_example', f"```sh\n{cmd} [options]\n```")
                    question = f"What is the purpose of the {cmd} command?"
                    answer = explanation
                    
                    flashcard = {
                        'lesson': lesson_id,
                        'command': cmd,
                        'explanation': explanation,
                        'example': example,
                        'formatted_example': formatted_example,
                        'question': question,
                        'answer': answer,
                        'order': i + 1,
                        'created_at': datetime.utcnow()
                    }
                    flashcard_id = db.flashcards.insert_one(flashcard).inserted_id
                    logger.info(f"Created flashcard for {cmd} with ID: {flashcard_id}")

                # Create quiz
                quiz = {
                    'lesson': lesson_id,
                    'level': level_id,
                    'passing_score': 0.8,
                    'created_at': datetime.utcnow()
                }
                quiz_id = db.quizzes.insert_one(quiz).inserted_id
                logger.info(f"Created quiz with ID: {quiz_id}")

                # Create quiz questions
                flashcards = list(db.flashcards.find({'lesson': lesson_id}))
                for j in range(5):
                    if flashcards:
                        flashcard = flashcards[j % len(flashcards)]
                        question = {
                            'quiz': quiz_id,
                            'type': 'fill_blank',
                            'question': f'What is the purpose of {flashcard["command"]}?',
                            'answer': flashcard["command"],
                            'command': flashcard["command"],
                            'flashcard_id': str(flashcard["_id"]),
                            'order': j + 1,
                            'created_at': datetime.utcnow()
                        }
                        question_id = db.questions.insert_one(question).inserted_id
                        logger.info(f"Created quiz question with ID: {question_id}")

        logging.info("Creating level tests...")
        for level in db.levels.find():
            if level['name'] != 'beginner':
                test = {
                    'level': level['_id'],
                    'passing_score': 0.8,
                    'created_at': datetime.utcnow()
                }
                test_id = db.level_tests.insert_one(test).inserted_id
                logger.info(f"Created level test for {level['name']} with ID: {test_id}")

                # Add test questions
                prev_level = db.levels.find_one({'order': level['order'] - 1})
                quizzes = list(db.quizzes.find({'level': prev_level['_id']}))
                questions = []
                for quiz in quizzes:
                    questions.extend(list(db.questions.find({'quiz': quiz['_id']})))

                random.shuffle(questions)
                for k, question in enumerate(questions[:10]):
                    test_question = {
                        'level_test': test_id,
                        'type': 'fill_blank',
                        'question': question['question'],
                        'answer': question['answer'],
                        'order': k + 1,
                        'created_at': datetime.utcnow()
                    }
                    test_question_id = db.level_test_questions.insert_one(test_question).inserted_id
                    logger.info(f"Created level test question with ID: {test_question_id}")

        logging.info("Creating test user...")
        test_user = {
            'email': 'test@example.com',
            'password': generate_password_hash('Test123!'),
            'full_name': 'Test User',
            'is_staff': False,
            'is_active': True,
            'current_level': 1,
            'total_points': 0,
            'created_at': datetime.utcnow()
        }
        user_id = db.users.insert_one(test_user).inserted_id
        logger.info(f"Created test user with ID: {user_id}")

        logging.info("Creating admin user...")
        if not db.users.find_one({'email': 'admin@admin.com'}):
            admin_user = {
                'email': 'admin@admin.com',
                'password': generate_password_hash('admin'),
                'full_name': 'Admin',
                'is_staff': True,
                'is_active': True,
                'created_at': datetime.utcnow()
            }
            admin_id = db.users.insert_one(admin_user).inserted_id
            logger.info(f"Created admin user with ID: {admin_id}")

        client.close()
        logging.info("Data population completed successfully!")

    except Exception as e:
        logging.error(f"Error during data population: {e}")
        raise

if __name__ == '__main__':
    populate_initial_data()
