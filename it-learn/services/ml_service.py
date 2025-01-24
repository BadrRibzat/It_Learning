import spacy
from typing import Dict
from config import config

class MLContentService:
    def __init__(self):
        self.nlp = spacy.load(config.ML_MODEL_PATH)
    
    def generate_flashcard_content(self, command: str) -> Dict:
        """Generate flashcard content using NLP"""
        prompt = f"""
        Explain the Linux/macOS command {command} in this structure:
        1. Command: {command}
        2. Purpose: [1-sentence description]
        3. Common Usage: [3 common use cases]
        4. Example: [realistic example with {command} highlighted]
        5. Warning: [potential misuse warning]
        """
        
        doc = self.nlp(prompt)
        return self._parse_ml_output(doc, command)
    
    def generate_quiz_question(self, command: str) -> Dict:
        """Generate fill-in-the-blank question"""
        prompt = f"""
        Create a fill-in-the-blank question about the {command} command where:
        - The blank is where {command} should be
        - Context shows a realistic usage scenario
        - Wrong options are plausible alternatives
        """
        
        doc = self.nlp(prompt)
        return {
            'question': self._extract_first_sentence(doc),
            'answer': command,
            'distractors': self._generate_distractors(command)
        }
    
    def _parse_ml_output(self, doc, command: str) -> Dict:
        """Parses the output from the ML Model."""
        parts = [sent.text for sent in doc.sents]
        
        if len(parts) < 5:
            return {
                'command': command,
                'purpose': f"Description for {command} is missing",
                'usage': [],
                'example': f"Example for {command} is missing",
                'warning': f"Warning for {command} is missing"
            }

        try:
            return {
                'command': parts[0].split(':')[-1].strip(),
                'purpose': parts[1].split(':')[-1].strip(),
                'usage': [item.strip() for item in parts[2].split(':')[-1].split('-')],
                'example': parts[3].split(':')[-1].strip(),
                'warning': parts[4].split(':')[-1].strip()
            }
        except Exception:
             return {
                'command': command,
                'purpose': f"Description for {command} is missing",
                'usage': [],
                'example': f"Example for {command} is missing",
                'warning': f"Warning for {command} is missing"
            }


    def _extract_first_sentence(self, doc) -> str:
        """Extracts the first sentence from a spaCy Doc object."""
        return next(doc.sents).text if doc.sents else ""
    
    def _generate_distractors(self, command: str) -> list:
        """Generates distractors for quiz questions (Placeholder)"""
        
        distractors = [
             "ls", "cd", "mkdir", "rmdir", "touch", "cp",
            "mv", "rm", "cat", "echo", "grep", "find", 
            "head", "tail", "chmod", "chown", "ps", "kill",
             "df", "du", "top", "history", "alias", "unalias",
              "export", "source", "wget", "curl", "tar", "ssh", "sudo"
          ]
        
        return  random.sample([d for d in distractors if d != command], 3)
