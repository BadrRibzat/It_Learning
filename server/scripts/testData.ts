// server/scripts/testData.ts
import { data } from '../data/flashcards';

// Extract the Stack type from data.stacks
type Stack = (typeof data.stacks)[0];

console.log(`✅ Loaded ${data.stacks.length} stacks:`);

data.stacks.forEach((stack: Stack) => {
  console.log(`  - ${stack.id} (${stack.totalCardCount} cards)`);
});

console.log("\n🌍 UI Translations loaded for:", data.ui_translations.languages_supported.join(", "));
