// server/data/stacks/postgresql.ts
import { Flashcard, QAItem } from '../flashcards';

export const postgresqlStack = {
  id: 'postgresql',
  name: {
    en: 'PostgreSQL',
    fr: 'PostgreSQL',
    es: 'PostgreSQL',
    de: 'PostgreSQL',
    ar: 'بوستغريس كيو إل'
  },
  description: {
    en: 'Open-source relational database system known for reliability, extensibility, and SQL compliance.',
    fr: 'Système de base de données relationnelle open-source reconnu pour sa fiabilité, son extensibilité et sa conformité SQL.',
    es: 'Sistema de base de datos relacional de código abierto conocido por su fiabilidad, escalabilidad y cumplimiento SQL.',
    de: 'Open-Source-Relationales Datenbanksystem, bekannt für Zuverlässigkeit, Erweiterbarkeit und SQL-Konformität.',
    ar: 'نظام قاعدة بيانات علائقية مفتوح المصدر، معروف بالموثوقية، القابلية للتوسيع، والامتثال لـ SQL.'
  },
  totalCardCount: 15,
  flashcards: [
    {
      cardId: 'psql_connect',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['connect', 'login'],
      command: 'psql -h localhost -U user -d dbname',
      explanation_translations: {
        en: 'Connect to a PostgreSQL database on localhost.',
        fr: 'Se connecter à une base de données PostgreSQL sur localhost.',
        es: 'Conectarse a una base de datos PostgreSQL en localhost.',
        de: 'Verbindet mit einer PostgreSQL-Datenbank auf localhost.',
        ar: 'يتصل بقاعدة بيانات بوستغريس على المضيف المحلي.'
      },
      question_translations: {
        en: 'How do you connect to a local PostgreSQL database?',
        fr: 'Comment se connecter à une base de données PostgreSQL locale ?',
        es: '¿Cómo te conectas a una base de datos PostgreSQL local?',
        de: 'Wie verbindet man sich mit einer lokalen PostgreSQL-Datenbank?',
        ar: 'كيف تتصل بقاعدة بيانات بوستغريس محلية؟'
      },
      valid_answers: ['psql -h localhost -U user -d dbname'],
      answer_match: { mode: 'regex', pattern: '^psql\\s+-h\\s+localhost\\s+-U\\s+\\S+\\s+-d\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'psql_list_dbs',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['databases', 'list'],
      command: '\\l',
      explanation_translations: {
        en: 'List all available databases.',
        fr: 'Liste toutes les bases de données disponibles.',
        es: 'Lista todas las bases de datos disponibles.',
        de: 'Listet alle verfügbaren Datenbanken auf.',
        ar: 'يعرض جميع قواعد البيانات المتاحة.'
      },
      question_translations: {
        en: 'How do you list all PostgreSQL databases?',
        fr: 'Comment lister toutes les bases de données PostgreSQL ?',
        es: '¿Cómo listas todas las bases de datos PostgreSQL?',
        de: 'Wie listet man alle PostgreSQL-Datenbanken auf?',
        ar: 'كيف تعرض جميع قواعد بيانات بوستغريس؟'
      },
      valid_answers: ['\\l'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'psql_list_tables',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['tables', 'schema'],
      command: '\\dt',
      explanation_translations: {
        en: 'List all tables in the current database.',
        fr: 'Liste toutes les tables de la base de données courante.',
        es: 'Lista todas las tablas en la base de datos actual.',
        de: 'Listet alle Tabellen der aktuellen Datenbank auf.',
        ar: 'يعرض جميع الجداول في قاعدة البيانات الحالية.'
      },
      question_translations: {
        en: 'How do you list all tables in the current database?',
        fr: 'Comment lister toutes les tables de la base de données courante ?',
        es: '¿Cómo listas todas las tablas en la base de datos actual?',
        de: 'Wie listet man alle Tabellen der aktuellen Datenbank auf?',
        ar: 'كيف تعرض جميع الجداول في قاعدة البيانات الحالية؟'
      },
      valid_answers: ['\\dt'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'psql_describe_table',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['inspect', 'schema'],
      command: '\\d table_name',
      explanation_translations: {
        en: 'Show the structure of a table (columns, types, indexes).',
        fr: 'Affiche la structure d\'une table (colonnes, types, index).',
        es: 'Muestra la estructura de una tabla (columnas, tipos, índices).',
        de: 'Zeigt die Struktur einer Tabelle (Spalten, Typen, Indizes) an.',
        ar: 'يعرض هيكل الجدول (الأعمدة، الأنواع، الفهارس).'
      },
      question_translations: {
        en: 'How do you inspect the schema of a table?',
        fr: 'Comment inspecter le schéma d\'une table ?',
        es: '¿Cómo inspeccionas el esquema de una tabla?',
        de: 'Wie prüft man das Schema einer Tabelle?',
        ar: 'كيف تفحص هيكل جدول؟'
      },
      valid_answers: ['\\d table_name'],
      answer_match: { mode: 'regex', pattern: '^\\\\d\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'psql_execute_sql_file',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['import', 'batch'],
      command: 'psql -d dbname -f script.sql',
      explanation_translations: {
        en: 'Execute SQL commands from a file.',
        fr: 'Exécute des commandes SQL à partir d\'un fichier.',
        es: 'Ejecuta comandos SQL desde un archivo.',
        de: 'Führt SQL-Befehle aus einer Datei aus.',
        ar: 'ينفذ أوامر SQL من ملف.'
      },
      question_translations: {
        en: 'How do you run SQL commands from a file?',
        fr: 'Comment exécuter des commandes SQL à partir d\'un fichier ?',
        es: '¿Cómo ejecutas comandos SQL desde un archivo?',
        de: 'Wie führt man SQL-Befehle aus einer Datei aus?',
        ar: 'كيف تُنفّذ أوامر SQL من ملف؟'
      },
      valid_answers: ['psql -d dbname -f script.sql'],
      answer_match: { mode: 'regex', pattern: '^psql\\s+-d\\s+\\S+\\s+-f\\s+\\S+\\.sql', case_sensitive: false }
    },
    {
      cardId: 'psql_copy_to_csv',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['export', 'backup'],
      command: "COPY (SELECT * FROM users) TO '/tmp/users.csv' WITH CSV HEADER",
      explanation_translations: {
        en: 'Export query results to a CSV file.',
        fr: 'Exporte les résultats d\'une requête vers un fichier CSV.',
        es: 'Exporta los resultados de una consulta a un archivo CSV.',
        de: 'Exportiert Abfrageergebnisse in eine CSV-Datei.',
        ar: 'يُصدّر نتائج الاستعلام إلى ملف CSV.'
      },
      question_translations: {
        en: 'How do you export data from a table to a CSV file?',
        fr: 'Comment exporter des données d\'une table vers un fichier CSV ?',
        es: '¿Cómo exportas datos de una tabla a un archivo CSV?',
        de: 'Wie exportiert man Daten aus einer Tabelle in eine CSV-Datei?',
        ar: 'كيف تُصدّر بيانات من جدول إلى ملف CSV؟'
      },
      valid_answers: ["COPY (SELECT * FROM users) TO '/tmp/users.csv' WITH CSV HEADER"],
      answer_match: { mode: 'regex', pattern: '^COPY\\s+\\(SELECT.*\\)\\s+TO\\s+\'[^\\s]+\\.csv\'\\s+WITH\\s+CSV\\s+HEADER', case_sensitive: false }
    },
    {
      cardId: 'psql_create_db',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['databases', 'create'],
      command: 'CREATE DATABASE myapp;',
      explanation_translations: {
        en: 'Create a new database.',
        fr: 'Crée une nouvelle base de données.',
        es: 'Crea una nueva base de datos.',
        de: 'Erstellt eine neue Datenbank.',
        ar: 'ينشئ قاعدة بيانات جديدة.'
      },
      question_translations: {
        en: 'How do you create a new PostgreSQL database?',
        fr: 'Comment créer une nouvelle base de données PostgreSQL ?',
        es: '¿Cómo creas una nueva base de datos PostgreSQL?',
        de: 'Wie erstellt man eine neue PostgreSQL-Datenbank?',
        ar: 'كيف تنشئ قاعدة بيانات بوستغريس جديدة؟'
      },
      valid_answers: ['CREATE DATABASE myapp;'],
      answer_match: { mode: 'regex', pattern: '^CREATE\\s+DATABASE\\s+\\S+;', case_sensitive: false }
    },
    {
      cardId: 'psql_create_user',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['roles', 'security'],
      command: "CREATE USER analyst WITH PASSWORD 'secure123';",
      explanation_translations: {
        en: 'Create a new database user with a password.',
        fr: 'Crée un nouvel utilisateur de base de données avec un mot de passe.',
        es: 'Crea un nuevo usuario de base de datos con una contraseña.',
        de: 'Erstellt einen neuen Datenbankbenutzer mit einem Passwort.',
        ar: 'ينشئ مستخدم قاعدة بيانات جديدًا مع كلمة مرور.'
      },
      question_translations: {
        en: 'How do you create a user with a password in PostgreSQL?',
        fr: 'Comment créer un utilisateur avec un mot de passe dans PostgreSQL ?',
        es: '¿Cómo creas un usuario con contraseña en PostgreSQL?',
        de: 'Wie erstellt man einen Benutzer mit Passwort in PostgreSQL?',
        ar: 'كيف تنشئ مستخدمًا بكلمة مرور في بوستغريس؟'
      },
      valid_answers: ["CREATE USER analyst WITH PASSWORD 'secure123';"],
      answer_match: { mode: 'regex', pattern: '^CREATE\\s+USER\\s+\\S+\\s+WITH\\s+PASSWORD\\s+\'[^\\s]+\'', case_sensitive: false }
    },
    {
      cardId: 'psql_grant_select',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['roles', 'permissions'],
      command: 'GRANT SELECT ON users TO analyst;',
      explanation_translations: {
        en: 'Grant read-only access to a table for a user.',
        fr: 'Accorde un accès en lecture seule à une table pour un utilisateur.',
        es: 'Otorga acceso de solo lectura a una tabla para un usuario.',
        de: 'Gewährt Lesezugriff auf eine Tabelle für einen Benutzer.',
        ar: 'يمنح صلاحية القراءة فقط على جدول لمستخدم.'
      },
      question_translations: {
        en: 'How do you give a user read-only access to a table?',
        fr: 'Comment donner un accès en lecture seule à une table pour un utilisateur ?',
        es: '¿Cómo das acceso de solo lectura a una tabla a un usuario?',
        de: 'Wie gewährt man einem Benutzer Lesezugriff auf eine Tabelle?',
        ar: 'كيف تمنح مستخدمًا صلاحية قراءة فقط على جدول؟'
      },
      valid_answers: ['GRANT SELECT ON users TO analyst;'],
      answer_match: { mode: 'regex', pattern: '^GRANT\\s+SELECT\\s+ON\\s+\\S+\\s+TO\\s+\\S+;', case_sensitive: false }
    },
    {
      cardId: 'psql_enable_extensions',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['extensions', 'json'],
      command: 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";',
      explanation_translations: {
        en: 'Enable a PostgreSQL extension (e.g., for UUID generation).',
        fr: 'Active une extension PostgreSQL (ex: pour la génération de UUID).',
        es: 'Habilita una extensión PostgreSQL (ej: para generación de UUID).',
        de: 'Aktiviert eine PostgreSQL-Erweiterung (z.B. für UUID-Generierung).',
        ar: 'يُفعّل امتداد بوستغريس (مثلًا لتوليد UUID).'
      },
      question_translations: {
        en: 'How do you enable the UUID generation extension?',
        fr: 'Comment activer l\'extension de génération de UUID ?',
        es: '¿Cómo habilitas la extensión de generación de UUID?',
        de: 'Wie aktiviert man die UUID-Generierungserweiterung?',
        ar: 'كيف تُفعّل امتداد توليد UUID؟'
      },
      valid_answers: ['CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ],
  qa_mode: [
    {
      qaId: 'pg_qa_1',
      difficulty: 'intermediate',
      question_translations: {
        en: 'What is the difference between `TEXT` and `VARCHAR` in PostgreSQL?',
        fr: 'Quelle est la différence entre `TEXT` et `VARCHAR` dans PostgreSQL ?',
        es: '¿Cuál es la diferencia entre `TEXT` y `VARCHAR` en PostgreSQL?',
        de: 'Was ist der Unterschied zwischen `TEXT` und `VARCHAR` in PostgreSQL?',
        ar: 'ما الفرق بين `TEXT` و `VARCHAR` في بوستغريس؟'
      },
      explanation_translations: {
        en: 'In PostgreSQL, `TEXT` and `VARCHAR` have no performance difference. `TEXT` has no length limit, while `VARCHAR(n)` limits to n characters.',
        fr: 'En PostgreSQL, `TEXT` et `VARCHAR` n\'ont aucune différence de performance. `TEXT` n\'a pas de limite de longueur, `VARCHAR(n)` est limité à n caractères.',
        es: 'En PostgreSQL, `TEXT` y `VARCHAR` no tienen diferencia de rendimiento. `TEXT` no tiene límite de longitud, `VARCHAR(n)` se limita a n caracteres.',
        de: 'In PostgreSQL gibt es keinen Leistungsunterschied zwischen `TEXT` und `VARCHAR`. `TEXT` hat keine Längenbeschränkung, `VARCHAR(n)` ist auf n Zeichen begrenzt.',
        ar: 'في بوستغريس، لا يوجد فرق في الأداء بين `TEXT` و `VARCHAR`. `TEXT` ليس له حد للطول، بينما `VARCHAR(n)` محدود بـ n حرف.'
      },
      valid_answers: ['text no limit, varchar has', 'no performance difference'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'pg_qa_2',
      difficulty: 'advanced',
      question_translations: {
        en: 'What does `VACUUM` do in PostgreSQL?',
        fr: 'Que fait `VACUUM` dans PostgreSQL ?',
        es: '¿Qué hace `VACUUM` en PostgreSQL?',
        de: 'Was bewirkt `VACUUM` in PostgreSQL?',
        ar: 'ماذا يفعل `VACUUM` في بوستغريس؟'
      },
      explanation_translations: {
        en: '`VACUUM` reclaims storage occupied by dead tuples and updates statistics for the query planner.',
        fr: '`VACUUM` récupère le stockage occupé par les tuples morts et met à jour les statistiques pour le planificateur de requêtes.',
        es: '`VACUUM` reclama almacenamiento ocupado por tuplas muertas y actualiza estadísticas para el planificador de consultas.',
        de: '`VACUUM` gibt Speicherplatz von toten Tupeln frei und aktualisiert Statistiken für den Abfrageplaner.',
        ar: '`VACUUM` يسترد المساحة المشغولة بواسطة العناصر الميتة ويحدّث الإحصائيات لمُخطّط الاستعلام.'
      },
      valid_answers: ['reclaim dead tuples', 'update query planner stats'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'pg_qa_3',
      difficulty: 'basic',
      question_translations: {
        en: 'How do you exit the psql prompt?',
        fr: 'Comment quitter l\'invite psql ?',
        es: '¿Cómo sales del prompt psql?',
        de: 'Wie verlässt man die psql-Eingabeaufforderung?',
        ar: 'كيف تخرج من واجهة psql؟'
      },
      explanation_translations: {
        en: 'Use `\\q` to quit the psql interactive session.',
        fr: 'Utilisez `\\q` pour quitter la session interactive psql.',
        es: 'Usa `\\q` para salir de la sesión interactiva psql.',
        de: 'Verwende `\\q`, um die psql-Interaktionssitzung zu beenden.',
        ar: 'استخدم `\\q` للخروج من الجلسة التفاعلية لـ psql.'
      },
      valid_answers: ['\\q'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ]
};
