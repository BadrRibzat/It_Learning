// server/data/stacks/redis.ts
import { Flashcard, QAItem } from '../flashcards';

export const redisStack = {
  id: 'redis',
  name: {
    en: 'Redis',
    fr: 'Redis',
    es: 'Redis',
    de: 'Redis',
    ar: 'ريديس'
  },
  description: {
    en: 'In-memory data structure store used as a database, cache, and message broker.',
    fr: 'Stockage de structures de données en mémoire utilisé comme base de données, cache et courtier de messages.',
    es: 'Almacén de estructuras de datos en memoria utilizado como base de datos, caché y broker de mensajes.',
    de: 'In-Memory-Datenspeicher für Datenbank, Cache und Nachrichtenbroker.',
    ar: 'مخزن هياكل بيانات في الذاكرة يستخدم كقاعدة بيانات، وكاش، ووسيط رسائل.'
  },
  totalCardCount: 15,
  flashcards: [
    {
      cardId: 'redis_cli_connect',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['connect', 'login'],
      command: 'redis-cli',
      explanation_translations: {
        en: 'Connect to a local Redis server using the CLI.',
        fr: 'Se connecter à un serveur Redis local via l\'interface CLI.',
        es: 'Conectarse a un servidor Redis local usando la CLI.',
        de: 'Verbindet mit einem lokalen Redis-Server über die CLI.',
        ar: 'يتصل بخادم ريديس محلي باستخدام واجهة سطر الأوامر.'
      },
      question_translations: {
        en: 'How do you access the Redis command-line interface?',
        fr: 'Comment accéder à l\'interface en ligne de commande Redis ?',
        es: '¿Cómo accedes a la interfaz de línea de comandos de Redis?',
        de: 'Wie greift man auf die Redis-Befehlszeilenschnittstelle zu?',
        ar: 'كيف تصل إلى واجهة سطر أوامر ريديس؟'
      },
      valid_answers: ['redis-cli'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'redis_set',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['strings', 'write'],
      command: 'SET username john',
      explanation_translations: {
        en: 'Store a key-value pair in Redis.',
        fr: 'Stocker une paire clé-valeur dans Redis.',
        es: 'Almacena un par clave-valor en Redis.',
        de: 'Speichert ein Schlüssel-Wert-Paar in Redis.',
        ar: 'يُخزن زوج مفتاح-قيمة في ريديس.'
      },
      question_translations: {
        en: 'How do you store a username in Redis?',
        fr: 'Comment stocker un nom d\'utilisateur dans Redis ?',
        es: '¿Cómo almacenas un nombre de usuario en Redis?',
        de: 'Wie speichert man einen Benutzernamen in Redis?',
        ar: 'كيف تُخزن اسم مستخدم في ريديس؟'
      },
      valid_answers: ['SET username john'],
      answer_match: { mode: 'regex', pattern: '^SET\\s+\\S+\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'redis_get',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['strings', 'read'],
      command: 'GET username',
      explanation_translations: {
        en: 'Retrieve the value of a key from Redis.',
        fr: 'Récupérer la valeur d\'une clé depuis Redis.',
        es: 'Recupera el valor de una clave de Redis.',
        de: 'Holt den Wert eines Schlüssels aus Redis.',
        ar: 'يسترجع قيمة مفتاح من ريديس.'
      },
      question_translations: {
        en: 'How do you retrieve a stored username?',
        fr: 'Comment récupérer un nom d\'utilisateur stocké ?',
        es: '¿Cómo recuperas un nombre de usuario almacenado?',
        de: 'Wie ruft man einen gespeicherten Benutzernamen ab?',
        ar: 'كيف تسترجع اسم مستخدم مخزن؟'
      },
      valid_answers: ['GET username'],
      answer_match: { mode: 'regex', pattern: '^GET\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'redis_expire',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['ttl', 'caching'],
      command: 'EXPIRE session:123 3600',
      explanation_translations: {
        en: 'Set a key to expire in 3600 seconds (1 hour).',
        fr: 'Définit une clé pour expirer dans 3600 secondes (1 heure).',
        es: 'Establece que una clave expire en 3600 segundos (1 hora).',
        de: 'Setzt, dass ein Schlüssel in 3600 Sekunden (1 Stunde) abläuft.',
        ar: 'يُعيّن مفتاحًا لانتهاء صلاحيته بعد 3600 ثانية (ساعة واحدة).'
      },
      question_translations: {
        en: 'How do you make a session key expire after 1 hour?',
        fr: 'Comment faire expirer une clé de session après 1 heure ?',
        es: '¿Cómo haces que una clave de sesión expire después de 1 hora?',
        de: 'Wie lässt man einen Sitzungsschlüssel nach 1 Stunde ablaufen?',
        ar: 'كيف تجعل مفتاح الجلسة ينتهي بعد ساعة؟'
      },
      valid_answers: ['EXPIRE session:123 3600'],
      answer_match: { mode: 'regex', pattern: '^EXPIRE\\s+\\S+\\s+3600', case_sensitive: false }
    },
    {
      cardId: 'redis_ttl',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['ttl', 'inspect'],
      command: 'TTL session:123',
      explanation_translations: {
        en: 'Check how many seconds until a key expires.',
        fr: 'Vérifie combien de secondes restent avant l\'expiration d\'une clé.',
        es: 'Comprueba cuántos segundos faltan para que expire una clave.',
        de: 'Prüft, wie viele Sekunden bis zum Ablaufen eines Schlüssels verbleiben.',
        ar: 'يتحقق من عدد الثواني المتبقية قبل انتهاء مفتاح.'
      },
      question_translations: {
        en: 'How do you check the remaining time on a session key?',
        fr: 'Comment vérifier le temps restant sur une clé de session ?',
        es: '¿Cómo compruebas el tiempo restante en una clave de sesión?',
        de: 'Wie prüft man die verbleibende Zeit eines Sitzungsschlüssels?',
        ar: 'كيف تتحقق من الوقت المتبقي على مفتاح جلسة؟'
      },
      valid_answers: ['TTL session:123'],
      answer_match: { mode: 'regex', pattern: '^TTL\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'redis_incr',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['counters', 'analytics'],
      command: 'INCR page_views',
      explanation_translations: {
        en: 'Atomically increment a numeric value by 1.',
        fr: 'Incrémenter atomiquement une valeur numérique de 1.',
        es: 'Incrementa atómicamente un valor numérico en 1.',
        de: 'Erhöht einen numerischen Wert atomar um 1.',
        ar: 'يزيد القيمة العددية بـ 1 بشكل ذري.'
      },
      question_translations: {
        en: 'How do you increment a page view counter?',
        fr: 'Comment incrémenter un compteur de vues de page ?',
        es: '¿Cómo incrementas un contador de visitas de página?',
        de: 'Wie erhöht man einen Seitenaufrufzähler?',
        ar: 'كيف تزيد عداد مشاهدات الصفحة؟'
      },
      valid_answers: ['INCR page_views'],
      answer_match: { mode: 'regex', pattern: '^INCR\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'redis_hset',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['hashes', 'objects'],
      command: 'HSET user:1000 name Alice email alice@example.com',
      explanation_translations: {
        en: 'Store multiple fields of an object in a Redis hash.',
        fr: 'Stocker plusieurs champs d\'un objet dans un hachage Redis.',
        es: 'Almacena múltiples campos de un objeto en un hash de Redis.',
        de: 'Speichert mehrere Felder eines Objekts in einem Redis-Hash.',
        ar: 'يُخزن حقولًا متعددة لكائن في هاش ريديس.'
      },
      question_translations: {
        en: 'How do you store user data with multiple fields?',
        fr: 'Comment stocker des données utilisateur avec plusieurs champs ?',
        es: '¿Cómo almacenas datos de usuario con múltiples campos?',
        de: 'Wie speichert man Benutzerdaten mit mehreren Feldern?',
        ar: 'كيف تُخزن بيانات المستخدم بحقول متعددة؟'
      },
      valid_answers: ['HSET user:1000 name Alice email alice@example.com'],
      answer_match: { mode: 'regex', pattern: '^HSET\\s+\\S+\\s+(name|email)', case_sensitive: false }
    },
    {
      cardId: 'redis_hgetall',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['hashes', 'read'],
      command: 'HGETALL user:1000',
      explanation_translations: {
        en: 'Retrieve all fields and values from a Redis hash.',
        fr: 'Récupérer tous les champs et valeurs d\'un hachage Redis.',
        es: 'Recupera todos los campos y valores de un hash de Redis.',
        de: 'Holt alle Felder und Werte aus einem Redis-Hash.',
        ar: 'يسترجع جميع الحقول والقيم من هاش ريديس.'
      },
      question_translations: {
        en: 'How do you get all data for a user stored in a hash?',
        fr: 'Comment obtenir toutes les données d\'un utilisateur stockées dans un hachage ?',
        es: '¿Cómo obtienes todos los datos de un usuario almacenados en un hash?',
        de: 'Wie erhält man alle Daten eines Benutzers aus einem Hash?',
        ar: 'كيف تسترجع كل بيانات المستخدم المخزنة في هاش؟'
      },
      valid_answers: ['HGETALL user:1000'],
      answer_match: { mode: 'regex', pattern: '^HGETALL\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'redis_del',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['cleanup', 'delete'],
      command: 'DEL session:123',
      explanation_translations: {
        en: 'Delete a key and its value from Redis.',
        fr: 'Supprimer une clé et sa valeur de Redis.',
        es: 'Elimina una clave y su valor de Redis.',
        de: 'Löscht einen Schlüssel und seinen Wert aus Redis.',
        ar: 'يحذف مفتاحًا وقيمة من ريديس.'
      },
      question_translations: {
        en: 'How do you delete a session key?',
        fr: 'Comment supprimer une clé de session ?',
        es: '¿Cómo eliminas una clave de sesión?',
        de: 'Wie löscht man einen Sitzungsschlüssel?',
        ar: 'كيف تحذف مفتاح جلسة؟'
      },
      valid_answers: ['DEL session:123'],
      answer_match: { mode: 'regex', pattern: '^DEL\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'redis_flushdb',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['danger', 'cleanup'],
      command: 'FLUSHDB',
      explanation_translations: {
        en: 'Delete all keys in the current Redis database.',
        fr: 'Supprimer toutes les clés de la base de données Redis courante.',
        es: 'Elimina todas las claves en la base de datos Redis actual.',
        de: 'Löscht alle Schlüssel in der aktuellen Redis-Datenbank.',
        ar: 'يحذف جميع المفاتيح في قاعدة بيانات ريديس الحالية.'
      },
      question_translations: {
        en: 'How do you clear all data in the current Redis database?',
        fr: 'Comment effacer toutes les données de la base Redis courante ?',
        es: '¿Cómo limpias todos los datos en la base de datos Redis actual?',
        de: 'Wie löscht man alle Daten in der aktuellen Redis-Datenbank?',
        ar: 'كيف تُفرغ جميع البيانات في قاعدة بيانات ريديس الحالية؟'
      },
      valid_answers: ['FLUSHDB'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ],
  qa_mode: [
    {
      qaId: 'redis_qa_1',
      difficulty: 'intermediate',
      question_translations: {
        en: 'What is the main use case for Redis hashes?',
        fr: 'Quel est le cas d\'usage principal des hachages Redis ?',
        es: '¿Cuál es el caso de uso principal de los hashes de Redis?',
        de: 'Was ist der Hauptanwendungsfall für Redis-Hashes?',
        ar: 'ما الاستخدام الرئيسي لهياكل ريديس؟'
      },
      explanation_translations: {
        en: 'To store objects with multiple fields (like a user profile) in a single key.',
        fr: 'Pour stocker des objets avec plusieurs champs (comme un profil utilisateur) dans une seule clé.',
        es: 'Para almacenar objetos con múltiples campos (como un perfil de usuario) en una sola clave.',
        de: 'Um Objekte mit mehreren Feldern (wie ein Benutzerprofil) in einem einzigen Schlüssel zu speichern.',
        ar: 'لتخزين كائنات بحقول متعددة (مثل ملف تعريفي للمستخدم) في مفتاح واحد.'
      },
      valid_answers: ['store objects', 'multiple fields in one key'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'redis_qa_2',
      difficulty: 'advanced',
      question_translations: {
        en: 'Why is Redis often used as a cache?',
        fr: 'Pourquoi Redis est-il souvent utilisé comme cache ?',
        es: '¿Por qué Redis se usa a menudo como caché?',
        de: 'Warum wird Redis oft als Cache verwendet?',
        ar: 'لماذا يُستخدم ريديس غالبًا ككاش؟'
      },
      explanation_translations: {
        en: 'Because it stores data in memory, making reads and writes extremely fast compared to disk-based databases.',
        fr: 'Car il stocke les données en mémoire, ce qui rend les lectures et écritures extrêmement rapides par rapport aux bases de données basées sur disque.',
        es: 'Porque almacena datos en memoria, lo que hace que las lecturas y escrituras sean extremadamente rápidas en comparación con bases de datos basadas en disco.',
        de: 'Da es Daten im Arbeitsspeicher speichert, sind Lese- und Schreibvorgänge extrem schnell im Vergleich zu datenträgerbasierten Datenbanken.',
        ar: 'لأنه يخزن البيانات في الذاكرة، مما يجعل القراءة والكتابة أسرع بكثير مقارنة بقواعد البيانات القائمة على القرص.'
      },
      valid_answers: ['in-memory', 'fast reads/writes', 'low latency'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'redis_qa_3',
      difficulty: 'basic',
      question_translations: {
        en: 'How do you check if a key exists in Redis?',
        fr: 'Comment vérifier si une clé existe dans Redis ?',
        es: '¿Cómo compruebas si una clave existe en Redis?',
        de: 'Wie prüft man, ob ein Schlüssel in Redis existiert?',
        ar: 'كيف تتحقق إذا كان المفتاح موجودًا في ريديس؟'
      },
      explanation_translations: {
        en: 'Use the `EXISTS` command.',
        fr: 'Utilisez la commande `EXISTS`.',
        es: 'Usa el comando `EXISTS`.',
        de: 'Verwende den `EXISTS`-Befehl.',
        ar: 'استخدم أمر `EXISTS`.'
      },
      valid_answers: ['EXISTS key', 'EXISTS'],
      answer_match: { mode: 'regex', pattern: '^EXISTS\\s+\\S+', case_sensitive: false }
    }
  ]
};
