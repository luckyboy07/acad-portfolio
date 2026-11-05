export const professorData = {
  name: "Dharel P. Acut",
  title: "Assistant Professor of Computer Science",
  institution: "University of the Philippines Diliman",
  bio: "I research the intersection of natural language processing and cognitive linguistics. My work focuses on how machines can better understand the nuanced, contextual meaning of human language across different cultures.",
  email: "dharelacut@gmail.com",
  office: "Room 404, Exactum Building",
  socials: {
    twitter: "https://twitter.com/",
  }
};

export const papers = [
  {
    id: 1,
    title: "Contextual Embeddings for Low-Resource Uralic Languages",
    authors: "Jane Eriksson, M. Virtanen",
    year: 2024,
    venue: "ACL 2024",
    description: "A novel approach to training contextual embeddings using bilingual dictionary constraints to improve performance on low-resource Uralic languages.",
    link: "#"
  },
  {
    id: 2,
    title: "Syntactic Parsing as a Cognitive Model of Reading Constraints",
    authors: "T. Korhonen, Jane Eriksson",
    year: 2023,
    venue: "Cognitive Science",
    description: "Investigating whether modern dependency parsers capture the reading time constraints observed in human subjects reading complex Finnish texts.",
    link: "#"
  },
  {
    id: 3,
    title: "Zero-Shot Cross-Lingual Transfer in Dialog Systems",
    authors: "Jane Eriksson, S. Ahmed, P. Davis",
    year: 2023,
    venue: "EMNLP 2023",
    description: "Evaluating zero-shot transfer capabilities of large language models on task-oriented dialog datasets in 15 previously unseen languages.",
    link: "#"
  },
  {
    id: 4,
    title: "Beyond BLEU: Semantic Evaluation Metrics for Morphologically Rich Languages",
    authors: "Jane Eriksson, K. Laine",
    year: 2022,
    venue: "NAACL 2022",
    description: "Proposing a new semantic textual similarity metric that correlates better with human judgment for highly agglutinative languages.",
    link: "#"
  },
  {
    id: 5,
    title: "Historical Corpora Construction via Optical Character Recognition",
    authors: "A. Niemi, Jane Eriksson",
    year: 2021,
    venue: "LREC 2021",
    description: "A pipeline for extracting and cleaning text from 19th-century Finnish newspapers for linguistic analysis.",
    link: "#"
  },
  {
    id: 6,
    title: "The Role of Prosody in disambiguating spoken instructions",
    authors: "Jane Eriksson",
    year: 2020,
    venue: "Interspeech 2020",
    description: "Analyzing the role of pitch and duration in resolving syntactic ambiguities in spoken multi-modal tasks.",
    link: "#"
  }
];

export const courses = [
  {
    id: 1,
    courseCode: "COMP-LING-401",
    title: "Introduction to Natural Language Processing",
    semester: "Fall 2024",
    description: "Fundamentals of NLP, including text processing, linguistic structure, sequence modeling, and an introduction to neural network approaches.",
  },
  {
    id: 2,
    courseCode: "COMP-LING-550",
    title: "Advanced Deep Learning for Text",
    semester: "Spring 2024",
    description: "Seminar-style course focusing on transformer architectures, fine-tuning large language models, and alignment techniques.",
  },
  {
    id: 3,
    courseCode: "COGS-302",
    title: "Language and Cognition",
    semester: "Fall 2023",
    description: "An interdisciplinary look at how language shapes thought, covering psycholinguistics, sentence processing, and computational models of cognition.",
  },
  {
    id: 4,
    courseCode: "COMP-LING-600",
    title: "Semantic Representation in AI systems",
    semester: "Spring 2023",
    description: "Graduate seminar evaluating classical symbolic representations versus distributed representations, and their unification.",
  }
];

export const presentations = [
  {
    id: 1,
    title: "Keynote: The Future of Multilingual LLMs",
    venue: "Nordic NLP Symposium",
    year: 2024
  },
  {
    id: 2,
    title: "Invited Talk: Computational Modeling of Finnic Languages",
    venue: "Stanford NLP Seminar",
    year: 2023
  }
];
