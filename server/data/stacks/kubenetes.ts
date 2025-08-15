// server/data/stacks/kubernetes.ts
import { Flashcard, QAItem } from '../flashcards';

export const kubernetesStack = {
  id: 'kubernetes',
  name: {
    en: 'Kubernetes',
    fr: 'Kubernetes',
    es: 'Kubernetes',
    de: 'Kubernetes',
    ar: 'كُبرنتيس'
  },
  description: {
    en: 'Container orchestration platform for automating deployment, scaling, and management of containerized applications.',
    fr: 'Plateforme d\'orchestration de conteneurs pour automatiser le déploiement, la mise à l\'échelle et la gestion des applications conteneurisées.',
    es: 'Plataforma de orquestación de contenedores para automatizar el despliegue, escalado y gestión de aplicaciones contenerizadas.',
    de: 'Container-Orchestrierungsplattform zur Automatisierung von Bereitstellung, Skalierung und Verwaltung containerisierter Anwendungen.',
    ar: 'منصة تنسيق الحاويات لأتمتة النشر، والتوسيع، وإدارة التطبيقات المُوحّدة.'
  },
  totalCardCount: 15,
  flashcards: [
    {
      cardId: 'kubectl_get_pods',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['pods', 'status'],
      command: 'kubectl get pods',
      explanation_translations: {
        en: 'List all pods in the current namespace.',
        fr: 'Liste tous les pods dans l\'espace de noms courant.',
        es: 'Lista todos los pods en el espacio de nombres actual.',
        de: 'Listet alle Pods im aktuellen Namespace auf.',
        ar: 'يعرض جميع البودات في المساحة الاسمية الحالية.'
      },
      question_translations: {
        en: 'How do you list all running pods?',
        fr: 'Comment lister tous les pods en cours d\'exécution ?',
        es: '¿Cómo listas todos los pods en ejecución?',
        de: 'Wie listet man alle laufenden Pods auf?',
        ar: 'كيف تعرض جميع البودات قيد التشغيل؟'
      },
      valid_answers: ['kubectl get pods'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'kubectl_get_pods_all_namespaces',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['pods', 'namespaces'],
      command: 'kubectl get pods --all-namespaces',
      explanation_translations: {
        en: 'List pods across all namespaces.',
        fr: 'Liste les pods dans tous les espaces de noms.',
        es: 'Lista pods en todos los espacios de nombres.',
        de: 'Listet Pods über alle Namespaces hinweg auf.',
        ar: 'يعرض البودات عبر جميع المساحات الاسمية.'
      },
      question_translations: {
        en: 'How do you see pods in all namespaces?',
        fr: 'Comment voir les pods dans tous les espaces de noms ?',
        es: '¿Cómo ves los pods en todos los espacios de nombres?',
        de: 'Wie sieht man Pods in allen Namespaces?',
        ar: 'كيف ترى البودات في جميع المساحات الاسمية؟'
      },
      valid_answers: ['kubectl get pods --all-namespaces', 'kubectl get pods -A'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      cardId: 'kubectl_describe_pod',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['debug', 'inspect'],
      command: 'kubectl describe pod my-pod',
      explanation_translations: {
        en: 'Show detailed information about a pod, including events and status.',
        fr: 'Affiche des informations détaillées sur un pod, y compris les événements et l\'état.',
        es: 'Muestra información detallada sobre un pod, incluyendo eventos y estado.',
        de: 'Zeigt detaillierte Informationen über einen Pod, einschließlich Ereignisse und Status.',
        ar: 'يعرض معلومات مفصلة عن بود، بما في ذلك الأحداث والحالة.'
      },
      question_translations: {
        en: 'How do you debug why a pod is not starting?',
        fr: 'Comment déboguer pourquoi un pod ne démarre pas ?',
        es: '¿Cómo depuras por qué un pod no se inicia?',
        de: 'Wie debuggt man, warum ein Pod nicht startet?',
        ar: 'كيف تُصلح سبب عدم بدء بود؟'
      },
      valid_answers: ['kubectl describe pod my-pod'],
      answer_match: { mode: 'regex', pattern: '^kubectl\\s+describe\\s+pod\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'kubectl_logs',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['logs', 'debug'],
      command: 'kubectl logs my-pod',
      explanation_translations: {
        en: 'View logs from a pod.',
        fr: 'Affiche les journaux d\'un pod.',
        es: 'Muestra los registros de un pod.',
        de: 'Zeigt Protokolle eines Pods an.',
        ar: 'يعرض سجلات من بود.'
      },
      question_translations: {
        en: 'How do you check the logs of a pod?',
        fr: 'Comment consulter les journaux d\'un pod ?',
        es: '¿Cómo revisas los registros de un pod?',
        de: 'Wie prüft man die Protokolle eines Pods?',
        ar: 'كيف تتحقق من سجلات بود؟'
      },
      valid_answers: ['kubectl logs my-pod'],
      answer_match: { mode: 'regex', pattern: '^kubectl\\s+logs\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'kubectl_create_deployment',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['deployments', 'run'],
      command: 'kubectl create deployment nginx --image=nginx',
      explanation_translations: {
        en: 'Create a deployment running the Nginx image.',
        fr: 'Crée un déploiement exécutant l\'image Nginx.',
        es: 'Crea un despliegue ejecutando la imagen Nginx.',
        de: 'Erstellt ein Deployment, das das Nginx-Image ausführt.',
        ar: 'ينشئ نشرًا يشغل صورة Nginx.'
      },
      question_translations: {
        en: 'How do you deploy an Nginx container?',
        fr: 'Comment déployer un conteneur Nginx ?',
        es: '¿Cómo despliegas un contenedor Nginx?',
        de: 'Wie stellt man einen Nginx-Container bereit?',
        ar: 'كيف تنشر حاوية Nginx؟'
      },
      valid_answers: ['kubectl create deployment nginx --image=nginx'],
      answer_match: { mode: 'regex', pattern: '^kubectl\\s+create\\s+deployment\\s+nginx\\s+--image=nginx', case_sensitive: false }
    },
    {
      cardId: 'kubectl_expose_deployment',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['services', 'network'],
      command: 'kubectl expose deployment nginx --port=80',
      explanation_translations: {
        en: 'Expose a deployment as a Service on port 80.',
        fr: 'Expose un déploiement en tant que Service sur le port 80.',
        es: 'Expone un despliegue como un Servicio en el puerto 80.',
        de: 'Stellt ein Deployment als Service auf Port 80 bereit.',
        ar: 'يُعرض نشرًا كخدمة على المنفذ 80.'
      },
      question_translations: {
        en: 'How do you expose a deployment on port 80?',
        fr: 'Comment exposer un déploiement sur le port 80 ?',
        es: '¿Cómo expones un despliegue en el puerto 80?',
        de: 'Wie stellt man ein Deployment auf Port 80 bereit?',
        ar: 'كيف تعرض نشرًا على المنفذ 80؟'
      },
      valid_answers: ['kubectl expose deployment nginx --port=80'],
      answer_match: { mode: 'regex', pattern: '^kubectl\\s+expose\\s+deployment\\s+\\S+\\s+--port=80', case_sensitive: false }
    },
    {
      cardId: 'kubectl_scale_deployment',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['scaling', 'replicas'],
      command: 'kubectl scale deployment myapp --replicas=5',
      explanation_translations: {
        en: 'Scale a deployment to 5 replicas.',
        fr: 'Met à l\'échelle un déploiement à 5 réplicas.',
        es: 'Escala un despliegue a 5 réplicas.',
        de: 'Skaliert ein Deployment auf 5 Replikate.',
        ar: 'يُوسع نشرًا إلى 5 نُسخ.'
      },
      question_translations: {
        en: 'How do you scale a deployment to 5 instances?',
        fr: 'Comment mettre un déploiement à l\'échelle de 5 instances ?',
        es: '¿Cómo escalas un despliegue a 5 instancias?',
        de: 'Wie skaliert man ein Deployment auf 5 Instanzen?',
        ar: 'كيف تُوسع نشرًا إلى 5 حالات؟'
      },
      valid_answers: ['kubectl scale deployment myapp --replicas=5'],
      answer_match: { mode: 'regex', pattern: '^kubectl\\s+scale\\s+deployment\\s+\\S+\\s+--replicas=5', case_sensitive: false }
    },
    {
      cardId: 'kubectl_apply',
      type: 'flashcard',
      difficulty: 'intermediate',
      tags: ['yaml', 'declarative'],
      command: 'kubectl apply -f deployment.yaml',
      explanation_translations: {
        en: 'Apply configuration from a YAML file.',
        fr: 'Applique une configuration à partir d\'un fichier YAML.',
        es: 'Aplica configuración desde un archivo YAML.',
        de: 'Wendet Konfiguration aus einer YAML-Datei an.',
        ar: 'يطبق التكوين من ملف YAML.'
      },
      question_translations: {
        en: 'How do you deploy from a YAML manifest?',
        fr: 'Comment déployer à partir d\'un manifeste YAML ?',
        es: '¿Cómo despliegas desde un manifiesto YAML?',
        de: 'Wie stellt man aus einem YAML-Manifest bereit?',
        ar: 'كيف تنشر من ملف تعريف YAML؟'
      },
      valid_answers: ['kubectl apply -f deployment.yaml'],
      answer_match: { mode: 'regex', pattern: '^kubectl\\s+apply\\s+-f\\s+\\S+\\.yaml', case_sensitive: false }
    },
    {
      cardId: 'kubectl_delete',
      type: 'flashcard',
      difficulty: 'basic',
      tags: ['cleanup', 'delete'],
      command: 'kubectl delete pod my-pod',
      explanation_translations: {
        en: 'Delete a pod.',
        fr: 'Supprime un pod.',
        es: 'Elimina un pod.',
        de: 'Löscht einen Pod.',
        ar: 'يحذف بود.'
      },
      question_translations: {
        en: 'How do you delete a pod?',
        fr: 'Comment supprimer un pod ?',
        es: '¿Cómo eliminas un pod?',
        de: 'Wie löscht man einen Pod?',
        ar: 'كيف تحذف بود؟'
      },
      valid_answers: ['kubectl delete pod my-pod'],
      answer_match: { mode: 'regex', pattern: '^kubectl\\s+delete\\s+pod\\s+\\S+', case_sensitive: false }
    },
    {
      cardId: 'kubectl_port_forward',
      type: 'flashcard',
      difficulty: 'advanced',
      tags: ['debug', 'local'],
      command: 'kubectl port-forward pod/my-pod 8080:80',
      explanation_translations: {
        en: 'Forward a local port to a pod port for debugging.',
        fr: 'Redirige un port local vers un port de pod pour le débogage.',
        es: 'Reenvía un puerto local a un puerto de pod para depuración.',
        de: 'Leitet einen lokalen Port zu einem Pod-Port für Debugging weiter.',
        ar: 'يُحول منفذ محلي إلى منفذ بود لأغراض التصحيح.'
      },
      question_translations: {
        en: 'How do you access a pod’s port locally?',
        fr: 'Comment accéder au port d\'un pod localement ?',
        es: '¿Cómo accedes al puerto de un pod localmente?',
        de: 'Wie greift man lokal auf einen Pod-Port zu?',
        ar: 'كيف تصل إلى منفذ بود محليًا؟'
      },
      valid_answers: ['kubectl port-forward pod/my-pod 8080:80'],
      answer_match: { mode: 'regex', pattern: '^kubectl\\s+port-forward\\s+pod\\/\\S+\\s+\\d+:\\d+', case_sensitive: false }
    }
  ],
  qa_mode: [
    {
      qaId: 'k8s_qa_1',
      difficulty: 'intermediate',
      question_translations: {
        en: 'What is the difference between a Pod and a Deployment?',
        fr: 'Quelle est la différence entre un Pod et un Déploiement ?',
        es: '¿Cuál es la diferencia entre un Pod y un Despliegue?',
        de: 'Was ist der Unterschied zwischen einem Pod und einem Deployment?',
        ar: 'ما الفرق بين بود ونشر؟'
      },
      explanation_translations: {
        en: 'A Pod is the smallest deployable unit. A Deployment manages Pods and enables scaling, rolling updates, and self-healing.',
        fr: 'Un Pod est l\'unité déployable la plus petite. Un Déploiement gère les Pods et permet la mise à l\'échelle, les mises à jour progressives et l\'auto-réparation.',
        es: 'Un Pod es la unidad desplegable más pequeña. Un Despliegue gestiona Pods y permite escalado, actualizaciones progresivas y autoreparación.',
        de: 'Ein Pod ist die kleinste bereitstellbare Einheit. Ein Deployment verwaltet Pods und ermöglicht Skalierung, rollierende Updates und Selbstheilung.',
        ar: 'البود هو أصغر وحدة قابلة للنشر. النشر يُدار البودات ويدعم التوسيع، والتحديثات المتدرجة، والشفاء الذاتي.'
      },
      valid_answers: ['pod smallest unit, deployment manages', 'deployment enables scaling'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'k8s_qa_2',
      difficulty: 'advanced',
      question_translations: {
        en: 'What is a ConfigMap used for in Kubernetes?',
        fr: 'À quoi sert un ConfigMap dans Kubernetes ?',
        es: '¿Para qué se usa un ConfigMap en Kubernetes?',
        de: 'Wofür wird ein ConfigMap in Kubernetes verwendet?',
        ar: 'ما الغرض من استخدام ConfigMap في كبرنتيس؟'
      },
      explanation_translations: {
        en: 'To inject configuration data (like environment variables or config files) into containers.',
        fr: 'Injecter des données de configuration (variables d\'environnement, fichiers de config) dans les conteneurs.',
        es: 'Inyectar datos de configuración (variables de entorno o archivos de configuración) en contenedores.',
        de: 'Um Konfigurationsdaten (Umgebungsvariablen oder Konfigurationsdateien) in Container einzubringen.',
        ar: 'لإدخال بيانات التكوين (مثل متغيرات البيئة أو ملفات التكوين) إلى الحاويات.'
      },
      valid_answers: ['inject config data', 'pass environment variables'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    },
    {
      qaId: 'k8s_qa_3',
      difficulty: 'basic',
      question_translations: {
        en: 'What does `kubectl get nodes` show?',
        fr: 'Que montre `kubectl get nodes` ?',
        es: '¿Qué muestra `kubectl get nodes`?',
        de: 'Was zeigt `kubectl get nodes` an?',
        ar: 'ماذا يعرض `kubectl get nodes`؟'
      },
      explanation_translations: {
        en: 'The list of worker and control-plane nodes in the cluster.',
        fr: 'La liste des nœuds worker et de contrôle du cluster.',
        es: 'La lista de nodos worker y de plano de control en el clúster.',
        de: 'Die Liste der Worker- und Control-Plane-Knoten im Cluster.',
        ar: 'قائمة عقد العمال وعقدة التحكم في العنقود.'
      },
      valid_answers: ['list of nodes', 'cluster nodes'],
      answer_match: { mode: 'normalized', case_sensitive: false }
    }
  ]
};
