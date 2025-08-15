// server/data/stacks/mongodb.ts
import { Flashcard, QAItem } from '../flashcards';

export const mongodbStack = {
  id: 'mongodb',
  name: {
    en: 'MongoDB',
    fr: 'MongoDB',
    es: 'MongoDB',
    de: 'MongoDB',
    ar: 'مونغو دي بي'
  },
  description: {
    en: 'NoSQL document database that stores data in flexible, JSON-like documents.',
    fr: 'Base de données documentaire NoSQL qui stocke des données dans des documents flexibles, similaires à JSON.',
    es: 'Base de datos documental NoSQL que almacena datos en documentos flexibles, similares a JSON.',
    de: 'NoSQL-Dokumentendatenbank, die Daten in flexiblen, JSON-ähnlichen Dokumenten speichert.',
    ar: 'قاعدة بيانات مستندات NoSQL تُخزن البيانات في مستندات مرنة تشبه JSON.'
  },
  totalCardCount: 15,
  flashcards: [
    {
      cardId: 'mongo_connect',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['connect', 'login'],
      command: 'mongosh mongodb://localhost:27017',
      explanation_translations: {
        en: 'Connect to a local MongoDB instance.',
        fr: 'Se connecter à une instance MongoDB locale.',
        es: 'Conectarse a una instancia MongoDB local.',
        de: 'Verbindet mit einer lokalen MongoDB-Instanz.',
        ar: 'يتصل بنسخة محلية من مونغو دي بي.'
      },
      question_translations: {
        en: 'How do you connect to a local MongoDB server?',
        fr: 'Comment se connecter à un serveur MongoDB local ?',
        es: '¿Cómo te conectas a un servidor MongoDB local?',
        de: 'Wie verbindet man sich mit einem lokalen MongoDB-Server?',
        ar: 'كيف تتصل بخادم مونغو دي بي محلي؟'
      },
      valid_answers: ['mongosh mongodb://localhost:27017'],
      answer_match: { mode: 'regex', pattern: '^mongosh\\s+mongodb://localhost:\\d+', case_sensitive: false }
    },
    {
      cardId: 'mongo_show_dbs',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['databases', 'list'],
      command: 'show dbs',
      explanation_translations: {
        en: 'List all databases on the MongoDB server.',
        fr: 'Liste toutes les bases de données sur le serveur MongoDB.',
        es: 'Lista todas las bases de datos en el servidor MongoDB.',
        de: 'Listet alle Datenbanken auf dem MongoDB-Server auf.',
        ar: 'يعرض جميع قواعد البيانات على خادم مونغو دي بي.'
      },
      question_translations: {
        en: 'How do you list all MongoDB databases?',
        fr: 'Comment lister toutes les bases de données MongoDB ?',
        es: '¿Cómo listas todas las bases de datos MongoDB?',
        de: 'Wie listet man alle MongoDB-Datenbanken auf?',
        ar: 'كيف تعرض جميع قواعد بيانات مونغو دي بي؟'
      },
      valid_answers: ['show dbs'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'mongo_use_db',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['databases', 'switch'],
      command: 'use myapp',
      explanation_translations: {
        en: 'Switch to a database (creates it if it doesn’t exist).',
        fr: 'Changer de base de données (la crée si elle n\'existe pas).',
        es: 'Cambia a una base de datos (la crea si no existe).',
        de: 'Wechselt zu einer Datenbank (erstellt sie, falls nicht vorhanden).',
        ar: 'ينتقل إلى قاعدة بيانات (ينشئها إذا لم تكن موجودة).'
      },
      question_translations: {
        en: 'How do you select or create a database?',
        fr: 'Comment sélectionner ou créer une base de données ?',
        es: '¿Cómo seleccionas o creas una base de datos?',
        de: 'Wie wählt man eine Datenbank aus oder erstellt sie?',
        ar: 'كيف تختار أو تنشئ قاعدة بيانات؟'
      },
      valid_answers: ['use myapp'],
      answer_match: { mode: 'regex', pattern: '^use\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'mongo_show_collections',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['collections', 'list'],
      command: 'show collections',
      explanation_translations: {
        en: 'List all collections in the current database.',
        fr: 'Liste toutes les collections de la base de données courante.',
        es: 'Lista todas las colecciones en la base de datos actual.',
        de: 'Listet alle Sammlungen der aktuellen Datenbank auf.',
        ar: 'يعرض جميع المجموعات في قاعدة البيانات الحالية.'
      },
      question_translations: {
        en: 'How do you list all collections in the current database?',
        fr: 'Comment lister toutes les collections de la base de données courante ?',
        es: '¿Cómo listas todas las colecciones en la base de datos actual?',
        de: 'Wie listet man alle Sammlungen der aktuellen Datenbank auf?',
        ar: 'كيف تعرض جميع المجموعات في قاعدة البيانات الحالية؟'
      },
      valid_answers: ['show collections'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'mongo_insert_one',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['insert', 'write'],
      command: 'db.users.insertOne({ name: "Alice", email: "alice@example.com" })',
      explanation_translations: {
        en: 'Insert a single document into a collection.',
        fr: 'Insère un document unique dans une collection.',
        es: 'Inserta un documento único en una colección.',
        de: 'Fügt ein einzelnes Dokument in eine Sammlung ein.',
        ar: 'يُدخل مستنداً واحداً إلى مجموعة.'
      },
      question_translations: {
        en: 'How do you add a single user to the users collection?',
        fr: 'Comment ajouter un seul utilisateur à la collection users ?',
        es: '¿Cómo agregas un solo usuario a la colección users?',
        de: 'Wie fügt man einen einzelnen Benutzer zur users-Sammlung hinzu?',
        ar: 'كيف تضيف مستخدمًا واحدًا إلى مجموعة users؟'
      },
      valid_answers: ['db.users.insertOne({ name: "Alice", email: "alice@example.com" })'],
      answer_match: { mode: 'regex', pattern: '^db\\.\\S+\\.insertOne\\(\\{.*\\}\\)$', case_sensitive: false }
    },
    {
      cardId: 'mongo_find_all',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['query', 'read'],
      command: 'db.users.find()',
      explanation_translations: {
        en: 'Retrieve all documents from a collection.',
        fr: 'Récupère tous les documents d\'une collection.',
        es: 'Recupera todos los documentos de una colección.',
        de: 'Holt alle Dokumente aus einer Sammlung ab.',
        ar: 'يسترجع جميع المستندات من مجموعة.'
      },
      question_translations: {
        en: 'How do you retrieve all users from the users collection?',
        fr: 'Comment récupérer tous les utilisateurs de la collection users ?',
        es: '¿Cómo recuperas todos los usuarios de la colección users?',
        de: 'Wie ruft man alle Benutzer aus der users-Sammlung ab?',
        ar: 'كيف تسترجع جميع المستخدمين من مجموعة users؟'
      },
      valid_answers: ['db.users.find()'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'mongo_find_filtered',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['query', 'filter'],
      command: 'db.users.find({ age: { $gt: 25 } })',
      explanation_translations: {
        en: 'Find documents where age is greater than 25.',
        fr: 'Trouver les documents où l\'âge est supérieur à 25.',
        es: 'Encuentra documentos donde la edad es mayor que 25.',
        de: 'Findet Dokumente, bei denen das Alter größer als 25 ist.',
        ar: 'يبحث عن المستندات التي يكون فيها العمر أكبر من 25.'
      },
      question_translations: {
        en: 'How do you find users older than 25?',
        fr: 'Comment trouver les utilisateurs de plus de 25 ans ?',
        es: '¿Cómo encuentras usuarios mayores de 25 años?',
        de: 'Wie findet man Benutzer über 25 Jahre?',
        ar: 'كيف تجد المستخدمين الأكبر من 25 سنة؟'
      },
      valid_answers: ['db.users.find({ age: { $gt: 25 } })'],
      answer_match: { mode: 'regex', pattern: '^db\\.\\S+\\.find\\(\\{.*\\$gt.*\\}\\)$', case_sensitive: false }
    },
    {
      cardId: 'mongo_update_one',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['update', 'modify'],
      command: 'db.users.updateOne({ name: "Alice" }, { $set: { email: "alice@new.com" } })',
      explanation_translations: {
        en: 'Update a single document matching the filter.',
        fr: 'Met à jour un seul document correspondant au filtre.',
        es: 'Actualiza un solo documento que coincida con el filtro.',
        de: 'Aktualisiert ein einzelnes Dokument, das dem Filter entspricht.',
        ar: 'يُحدّث مستنداً واحداً يطابق الفلتر.'
      },
      question_translations: {
        en: 'How do you update Alice’s email address?',
        fr: 'Comment mettre à jour l\'adresse e-mail d\'Alice ?',
        es: '¿Cómo actualizas la dirección de correo de Alice?',
        de: 'Wie aktualisiert man die E-Mail-Adresse von Alice?',
        ar: 'كيف تُحدّث عنوان بريد أليس؟'
      },
      valid_answers: ['db.users.updateOne({ name: "Alice" }, { $set: { email: "alice@new.com" } })'],
      answer_match: { mode: 'regex', pattern: '^db\\.\\S+\\.updateOne\\(\\{.*\\$set.*\\}\\)$', case_sensitive: false }
    },
    {
      cardId: 'mongo_delete_one',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['delete', 'remove'],
      command: 'db.users.deleteOne({ name: "Alice" })',
      explanation_translations: {
        en: 'Delete a single document matching the filter.',
        fr: 'Supprime un seul document correspondant au filtre.',
        es: 'Elimina un solo documento que coincida con el filtro.',
        de: 'Löscht ein einzelnes Dokument, das dem Filter entspricht.',
        ar: 'يحذف مستنداً واحداً يطابق الفلتر.'
      },
      question_translations: {
        en: 'How do you remove a user named Alice?',
        fr: 'Comment supprimer un utilisateur nommé Alice ?',
        es: '¿Cómo eliminas un usuario llamado Alice?',
        de: 'Wie entfernt man einen Benutzer namens Alice?',
        ar: 'كيف تحذف مستخدمًا اسمه أليس؟'
      },
      valid_answers: ['db.users.deleteOne({ name: "Alice" })'],
      answer_match: { mode: 'regex', pattern: '^db\\.\\S+\\.deleteOne\\(\\{.*\\}\\)$', case_sensitive: false }
    },
    {
      cardId: 'mongo_create_index',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['indexes', 'performance'],
      command: 'db.users.createIndex({ email: 1 })',
      explanation_translations: {
        en: 'Create an index on the email field to improve query performance.',
        fr: 'Crée un index sur le champ email pour améliorer les performances des requêtes.',
        es: 'Crea un índice en el campo email para mejorar el rendimiento de las consultas.',
        de: 'Erstellt einen Index auf dem E-Mail-Feld zur Verbesserung der Abfrageleistung.',
        ar: 'ينشئ فهرسًا على حقل البريد الإلكتروني لتحسين أداء الاستعلام.'
      },
      question_translations: {
        en: 'How do you create an index on the email field?',
        fr: 'Comment créer un index sur le champ email ?',
        es: '¿Cómo creas un índice en el campo email?',
        de: 'Wie erstellt man einen Index auf dem E-Mail-Feld?',
        ar: 'كيف تنشئ فهرسًا على حقل البريد الإلكتروني؟'
      },
      valid_answers: ['db.users.createIndex({ email: 1 })'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ],
  qa_mode: [
    {
      qaId: 'mongodb_qa_1',
      difficulty: 'intermediate',
      question_translations: {
        en: 'What is the difference between `insertOne()` and `insertMany()`?',
        fr: 'Quelle est la différence entre `insertOne()` et `insertMany()` ?',
        es: '¿Cuál es la diferencia entre `insertOne()` y `insertMany()`?',
        de: 'Was ist der Unterschied zwischen `insertOne()` und `insertMany()`?',
        ar: 'ما الفرق بين `insertOne()` و `insertMany()`؟'
      },
      explanation_translations: {
        en: '`insertOne()` inserts a single document. `insertMany()` inserts multiple documents in one operation.',
        fr: '`insertOne()` insère un seul document. `insertMany()` insère plusieurs documents en une seule opération.',
        es: '`insertOne()` inserta un solo documento. `insertMany()` inserta múltiples documentos en una sola operación.',
        de: '`insertOne()` fügt ein einzelnes Dokument ein. `insertMany()` fügt mehrere Dokumente in einer Operation ein.',
        ar: '`insertOne()` يُدخل مستنداً واحداً. `insertMany()` يُدخل مستندات متعددة في عملية واحدة.'
      },
      valid_answers: ['one vs many', 'single vs multiple'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'mongodb_qa_2',
      difficulty: 'advanced',
      question_translations: {
        en: 'What does the `$set` operator do in an update?',
        fr: 'Que fait l\'opérateur `$set` dans une mise à jour ?',
        es: '¿Qué hace el operador `$set` en una actualización?',
        de: 'Was bewirkt der `$set`-Operator in einem Update?',
        ar: 'ماذا يفعل عامل التشغيل `$set` في التحديث؟'
      },
      explanation_translations: {
        en: 'It sets the value of a field in the document. If the field doesn’t exist, it creates it.',
        fr: 'Il définit la valeur d\'un champ dans le document. Si le champ n\'existe pas, il le crée.',
        es: 'Establece el valor de un campo en el documento. Si el campo no existe, lo crea.',
        de: 'Setzt den Wert eines Feldes im Dokument. Wenn das Feld nicht existiert, wird es erstellt.',
        ar: 'يُعيّن قيمة حقل في المستند. إذا لم يكن الحقل موجودًا، فإنه يُنشئه.'
      },
      valid_answers: ['sets field value', 'creates field if not exists'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'mongodb_qa_3',
      difficulty: 'basic',
      question_translations: {
        en: 'How do you exit the MongoDB shell?',
        fr: 'Comment quitter l\'interpréteur MongoDB ?',
        es: '¿Cómo sales del shell de MongoDB?',
        de: 'Wie verlässt man die MongoDB-Shell?',
        ar: 'كيف تخرج من واجهة مونغو دي بي؟'
      },
      explanation_translations: {
        en: 'Use `exit` or press Ctrl+C to leave the MongoDB shell.',
        fr: 'Utilisez `exit` ou appuyez sur Ctrl+C pour quitter l\'interpréteur MongoDB.',
        es: 'Usa `exit` o presiona Ctrl+C para salir del shell de MongoDB.',
        de: 'Verwende `exit` oder drücke Strg+C, um die MongoDB-Shell zu verlassen.',
        ar: 'استخدم `exit` أو اضغط على Ctrl+C للخروج من واجهة مونغو دي بي.'
      },
      valid_answers: ['exit', 'Ctrl+C'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ]
};
