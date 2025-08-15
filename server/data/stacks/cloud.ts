// server/data/stacks/cloud.ts
import { Flashcard, QAItem } from '../flashcards';

export const cloudStack = {
  id: 'cloud',
  name: {
    en: 'Cloud CLI',
    fr: 'CLI Cloud',
    es: 'CLI de la Nube',
    de: 'Cloud-Befehlszeile',
    ar: 'واجهة سطر أوامر السحابة'
  },
  description: {
    en: 'Command-line tools for managing cloud resources on AWS, Azure, and Google Cloud.',
    fr: 'Outils en ligne de commande pour gérer les ressources cloud sur AWS, Azure et Google Cloud.',
    es: 'Herramientas de línea de comandos para gestionar recursos en la nube en AWS, Azure y Google Cloud.',
    de: 'Befehlszeilenwerkzeuge zur Verwaltung von Cloud-Ressourcen auf AWS, Azure und Google Cloud.',
    ar: 'أدوات سطر الأوامر لإدارة الموارد السحابية على AWS وAzure وGoogle Cloud.'
  },
  totalCardCount: 15,
  flashcards: [
    {
      cardId: 'aws_configure',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['auth', 'setup'],
      command: 'aws configure',
      explanation_translations: {
        en: 'Set up AWS credentials and default region.',
        fr: 'Configurer les identifiants AWS et la région par défaut.',
        es: 'Configura las credenciales de AWS y la región por defecto.',
        de: 'Einrichten von AWS-Anmeldeinformationen und Standardregion.',
        ar: 'يُعدّد بيانات اعتماد AWS والمنطقة الافتراضية.'
      },
      question_translations: {
        en: 'How do you configure AWS CLI with your credentials?',
        fr: 'Comment configurer l\'AWS CLI avec vos identifiants ?',
        es: '¿Cómo configuras AWS CLI con tus credenciales?',
        de: 'Wie konfiguriert man die AWS CLI mit Anmeldeinformationen?',
        ar: 'كيف تُعدّد واجهة AWS CLI ببيانات الاعتماد الخاصة بك؟'
      },
      valid_answers: ['aws configure'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'aws_s3_ls',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['storage', 's3'],
      command: 'aws s3 ls',
      explanation_translations: {
        en: 'List all S3 buckets in your AWS account.',
        fr: 'Liste tous les buckets S3 dans votre compte AWS.',
        es: 'Lista todos los buckets S3 en tu cuenta AWS.',
        de: 'Listet alle S3-Buckets in Ihrem AWS-Konto auf.',
        ar: 'يعرض جميع صناديق S3 في حساب AWS الخاص بك.'
      },
      question_translations: {
        en: 'How do you list all S3 buckets?',
        fr: 'Comment lister tous les buckets S3 ?',
        es: '¿Cómo listas todos los buckets S3?',
        de: 'Wie listet man alle S3-Buckets auf?',
        ar: 'كيف تعرض جميع صناديق S3؟'
      },
      valid_answers: ['aws s3 ls'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'aws_s3_cp',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['storage', 's3'],
      command: 'aws s3 cp file.txt s3://my-bucket/',
      explanation_translations: {
        en: 'Upload a file to an S3 bucket.',
        fr: 'Téléverser un fichier vers un bucket S3.',
        es: 'Sube un archivo a un bucket S3.',
        de: 'Lädt eine Datei in einen S3-Bucket hoch.',
        ar: 'يرفع ملفًا إلى صندوق S3.'
      },
      question_translations: {
        en: 'How do you upload a file to S3?',
        fr: 'Comment téléverser un fichier vers S3 ?',
        es: '¿Cómo subes un archivo a S3?',
        de: 'Wie lädt man eine Datei in S3 hoch?',
        ar: 'كيف ترفع ملفًا إلى S3؟'
      },
      valid_answers: ['aws s3 cp file.txt s3://my-bucket/'],
      answer_match: { mode: 'regex', pattern: '^aws\\s+s3\\s+cp\\s+\\S+\\s+s3://', case_sensitive: false }
    },
    {
      cardId: 'aws_ec2_run',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['compute', 'ec2'],
      command: 'aws ec2 run-instances --image-id ami-12345678 --count 1 --instance-type t3.micro',
      explanation_translations: {
        en: 'Launch a new EC2 instance.',
        fr: 'Lancer une nouvelle instance EC2.',
        es: 'Inicia una nueva instancia EC2.',
        de: 'Startet eine neue EC2-Instanz.',
        ar: 'يشغّل مثيل EC2 جديد.'
      },
      question_translations: {
        en: 'How do you launch a new EC2 instance?',
        fr: 'Comment lancer une nouvelle instance EC2 ?',
        es: '¿Cómo inicias una nueva instancia EC2?',
        de: 'Wie startet man eine neue EC2-Instanz?',
        ar: 'كيف تُشغّل مثيل EC2 جديد؟'
      },
      valid_answers: ['aws ec2 run-instances'],
      answer_match: { mode: 'regex', pattern: '^aws\\s+ec2\\s+run-instances', case_sensitive: false }
    },
    {
      cardId: 'aws_ec2_describe',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['compute', 'ec2'],
      command: 'aws ec2 describe-instances',
      explanation_translations: {
        en: 'List all EC2 instances and their status.',
        fr: 'Liste toutes les instances EC2 et leur état.',
        es: 'Lista todas las instancias EC2 y su estado.',
        de: 'Listet alle EC2-Instanzen und deren Status auf.',
        ar: 'يعرض جميع مثيلات EC2 وحالتها.'
      },
      question_translations: {
        en: 'How do you check the status of your EC2 instances?',
        fr: 'Comment vérifier l\'état de vos instances EC2 ?',
        es: '¿Cómo compruebas el estado de tus instancias EC2?',
        de: 'Wie prüft man den Status der EC2-Instanzen?',
        ar: 'كيف تتحقق من حالة مثيلات EC2؟'
      },
      valid_answers: ['aws ec2 describe-instances'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'gcloud_auth_login',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['auth', 'gcp'],
      command: 'gcloud auth login',
      explanation_translations: {
        en: 'Authenticate with Google Cloud using a web browser.',
        fr: 'S\'authentifier avec Google Cloud via un navigateur web.',
        es: 'Autenticarse con Google Cloud usando un navegador web.',
        de: 'Authentifizierung bei Google Cloud über einen Webbrowser.',
        ar: 'يُوثّق مع Google Cloud باستخدام متصفح ويب.'
      },
      question_translations: {
        en: 'How do you log in to Google Cloud CLI?',
        fr: 'Comment se connecter à Google Cloud CLI ?',
        es: '¿Cómo inicias sesión en Google Cloud CLI?',
        de: 'Wie meldet man sich bei Google Cloud CLI an?',
        ar: 'كيف تُسجّل الدخول إلى واجهة Google Cloud CLI؟'
      },
      valid_answers: ['gcloud auth login'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'gcloud_config_set',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['config', 'gcp'],
      command: 'gcloud config set project my-project-id',
      explanation_translations: {
        en: 'Set the active Google Cloud project.',
        fr: 'Définir le projet Google Cloud actif.',
        es: 'Establece el proyecto de Google Cloud activo.',
        de: 'Legt das aktive Google Cloud-Projekt fest.',
        ar: 'يُعيّن مشروع Google Cloud النشط.'
      },
      question_translations: {
        en: 'How do you set your current GCP project?',
        fr: 'Comment définir votre projet GCP actuel ?',
        es: '¿Cómo estableces tu proyecto GCP actual?',
        de: 'Wie setzt man das aktuelle GCP-Projekt?',
        ar: 'كيف تُعيّن مشروع GCP الحالي؟'
      },
      valid_answers: ['gcloud config set project my-project-id'],
      answer_match: { mode: 'regex', pattern: '^gcloud\\s+config\\s+set\\s+project\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'az_login',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['auth', 'azure'],
      command: 'az login',
      explanation_translations: {
        en: 'Log in to Azure CLI using a web browser.',
        fr: 'Se connecter à Azure CLI via un navigateur web.',
        es: 'Iniciar sesión en Azure CLI usando un navegador web.',
        de: 'Anmeldung bei Azure CLI über einen Webbrowser.',
        ar: 'تُسجّل الدخول إلى Azure CLI باستخدام متصفح ويب.'
      },
      question_translations: {
        en: 'How do you authenticate with Azure CLI?',
        fr: 'Comment s\'authentifier avec Azure CLI ?',
        es: '¿Cómo te autentificas con Azure CLI?',
        de: 'Wie authentifiziert man sich bei Azure CLI?',
        ar: 'كيف تُوثّق مع Azure CLI؟'
      },
      valid_answers: ['az login'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'az_vm_list',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['compute', 'azure'],
      command: 'az vm list --resource-group my-rg',
      explanation_translations: {
        en: 'List all virtual machines in a resource group.',
        fr: 'Lister toutes les machines virtuelles dans un groupe de ressources.',
        es: 'Lista todas las máquinas virtuales en un grupo de recursos.',
        de: 'Listet alle virtuellen Maschinen in einer Ressourcengruppe auf.',
        ar: 'يعرض جميع الآلات الافتراضية في مجموعة موارد.'
      },
      question_translations: {
        en: 'How do you list VMs in an Azure resource group?',
        fr: 'Comment lister les machines virtuelles dans un groupe de ressources Azure ?',
        es: '¿Cómo listas máquinas virtuales en un grupo de recursos de Azure?',
        de: 'Wie listet man VMs in einer Azure-Ressourcengruppe auf?',
        ar: 'كيف تعرض الآلات الافتراضية في مجموعة موارد Azure؟'
      },
      valid_answers: ['az vm list --resource-group my-rg'],
      answer_match: { mode: 'regex', pattern: '^az\\s+vm\\s+list\\s+--resource-group\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'aws_create_vpc',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['networking', 'vpc'],
      command: 'aws ec2 create-vpc --cidr-block 10.0.0.0/16',
      explanation_translations: {
        en: 'Create a new Virtual Private Cloud (VPC).',
        fr: 'Créer un nouveau cloud privé virtuel (VPC).',
        es: 'Crear una nueva nube privada virtual (VPC).',
        de: 'Erstellt eine neue virtuelle private Cloud (VPC).',
        ar: 'ينشئ سحابة خاصة افتراضية جديدة (VPC).'
      },
      question_translations: {
        en: 'How do you create a new VPC in AWS?',
        fr: 'Comment créer un nouveau VPC dans AWS ?',
        es: '¿Cómo creas un nuevo VPC en AWS?',
        de: 'Wie erstellt man eine neue VPC in AWS?',
        ar: 'كيف تنشئ VPC جديدًا في AWS؟'
      },
      valid_answers: ['aws ec2 create-vpc --cidr-block 10.0.0.0/16'],
      answer_match: { mode: 'regex', pattern: '^aws\\s+ec2\\s+create-vpc\\s+--cidr-block\\s+\\S+', case_sensitive: false }
    }
  ],
  qa_mode: [
    {
      qaId: 'cloud_qa_1',
      difficulty: 'intermediate',
      question_translations: {
        en: 'What is the purpose of IAM in AWS?',
        fr: 'Quel est l\'objectif d\'IAM dans AWS ?',
        es: '¿Cuál es el propósito de IAM en AWS?',
        de: 'Was ist der Zweck von IAM in AWS?',
        ar: 'ما الغرض من IAM في AWS؟'
      },
      explanation_translations: {
        en: 'IAM (Identity and Access Management) controls user permissions and access to AWS resources.',
        fr: 'IAM contrôle les permissions des utilisateurs et l\'accès aux ressources AWS.',
        es: 'IAM controla los permisos de los usuarios y el acceso a los recursos de AWS.',
        de: 'IAM steuert Benutzerberechtigungen und den Zugriff auf AWS-Ressourcen.',
        ar: 'IAM يتحكم في أذونات المستخدمين والوصول إلى موارد AWS.'
      },
      valid_answers: ['manage permissions', 'identity and access management'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'cloud_qa_2',
      difficulty: 'advanced',
      question_translations: {
        en: 'Why use infrastructure as code (IaC) tools like Terraform or CloudFormation?',
        fr: 'Pourquoi utiliser des outils d\'infrastructure as code comme Terraform ou CloudFormation ?',
        es: '¿Por qué usar herramientas de infraestructura como código como Terraform o CloudFormation?',
        de: 'Warum Infrastructure-as-Code-Tools wie Terraform oder CloudFormation verwenden?',
        ar: 'لماذا تستخدم أدوات البنية التحتية ككود مثل Terraform أو CloudFormation؟'
      },
      explanation_translations: {
        en: 'To version, automate, and safely reproduce cloud infrastructure using code instead of manual CLI commands.',
        fr: 'Pour versionner, automatiser et reproduire en toute sécurité l\'infrastructure cloud via du code.',
        es: 'Para versionar, automatizar y reproducir de forma segura la infraestructura en la nube mediante código.',
        de: 'Um Cloud-Infrastruktur versionierbar, automatisiert und sicher mittels Code zu verwalten.',
        ar: 'لإصدار البنية التحتية السحابية، وأتمتتها، وإعادة إنتاجها بأمان باستخدام الكود بدلاً من أوامر CLI يدوية.'
      },
      valid_answers: ['automate infrastructure', 'version and reproduce'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'cloud_qa_3',
      difficulty: 'basic',
      question_translations: {
        en: 'What does S3 stand for?',
        fr: 'Que signifie S3 ?',
        es: '¿Qué significa S3?',
        de: 'Wofür steht S3?',
        ar: 'ماذا يعني S3؟'
      },
      explanation_translations: {
        en: 'Simple Storage Service.',
        fr: 'Simple Storage Service.',
        es: 'Servicio de Almacenamiento Simple.',
        de: 'Einfacher Speicherdienst.',
        ar: 'خدمة تخزين بسيطة.'
      },
      valid_answers: ['simple storage service', 's3'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ]
};
