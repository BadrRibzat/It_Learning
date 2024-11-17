class FillInTheBlankValidator:
    @staticmethod
    def validate_answer(user_answer, correct_answer, threshold=0.8):
        """
        Validate fill-in-the-blank answers with flexible matching
        """
        import difflib
        
        user_answer = user_answer.lower().strip()
        correct_answer = correct_answer.lower().strip()
        
        # Basic similarity check
        similarity = difflib.SequenceMatcher(None, user_answer, correct_answer).ratio()
        
        # Additional checks
        checks = [
            similarity >= threshold,
            user_answer in correct_answer,
            correct_answer in user_answer,
            len(user_answer) >= len(correct_answer) * 0.7,
            len(user_answer) <= len(correct_answer) * 1.3
        ]
        
        return any(checks)
