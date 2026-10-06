// Featured projects render as cards with stat tiles; the rest render as a compact list.
// `link` is the source repo, `live` is a deployed site. Private repos should only have `live`.
// Featured cards take an `accent`: 'violet', 'coral' or 'amber' (the primary colour is the default).
const Data = [
    {
        name: "BitSmith",
        featured: true,
        accent: "violet",
        link: "https://github.com/Tjindl/BitSmith",
        tagline: "INT4 LLM quantization research + a from-scratch C++ inference engine",
        description: "Compressed GPT-2 by 50% with AWQ and uniform quantization, then ran paired statistical tests (bootstrap CI, McNemar's) and found perplexity is a misleading proxy for quality: a 5× perplexity jump under AWQ INT4 collapsed LAMBADA accuracy but left HellaSwag unchanged. Also built PageRank-guided structured pruning and a zero-dependency C++ engine with packed INT4 weights and ARM NEON SIMD kernels.",
        stats: [
            { value: "~10×", label: "lower INT4 perplexity with AWQ vs uniform quantization" },
            { value: "p < 1e-10", label: "LAMBADA accuracy collapse, while HellaSwag held (p = 0.44)" },
            { value: "50%", label: "smaller GPT-2 with packed INT4 weights" },
        ],
        tech: ["Python", "C++", "PyBind11", "ARM NEON", "LLMs"],
    },
    {
        name: "Lore",
        featured: true,
        accent: "coral",
        live: "https://getlore.tech/",
        npm: "https://www.npmjs.com/package/lore-memory",
        tagline: "Persistent project memory for developers and their AI assistants",
        description: "Captures the decisions, invariants, gotchas, and abandoned approaches that usually live in your head, stores them as git-native JSON, and serves them to AI coding assistants through an MCP server. Ships as a CLI with a background file watcher, a local web dashboard, and semantic search via Ollama.",
        stats: [
            { value: "npm", label: "published as lore-memory, v0.5" },
            { value: "MCP", label: "server injects project memory into AI context" },
            { value: "git", label: "native storage: memory is versioned with the code" },
        ],
        tech: ["Node.js", "MCP SDK", "SQLite", "Ollama", "Express"],
    },
    {
        name: "Pairs Trading",
        featured: true,
        accent: "amber",
        link: "https://github.com/Tjindl/pairs-trading",
        tagline: "Cointegration-based statistical arbitrage, built and backtested from scratch",
        description: "Market-neutral strategy on Mastercard / Visa: tests for cointegration, estimates the hedge ratio by OLS, and trades z-score deviations of the spread, backtested over 2020–2024 with realistic entry and exit rules.",
        stats: [
            { value: "45.5%", label: "total return over 4 years, beating buy-and-hold on both legs" },
            { value: "0.97", label: "Sharpe ratio" },
            { value: "16%", label: "of the time in the market" },
        ],
        tech: ["Python", "statsmodels", "pandas", "Time Series"],
    },
    {
        name: "Corpus",
        link: "https://github.com/Tjindl/aipapers",
        live: "https://corpusai-nine.vercel.app/",
        tagline: "Daily AI research reader: arXiv + lab papers, deduplicated, auto-tagged, and summarized by Claude",
        tech: ["Next.js", "Prisma", "PostgreSQL", "Claude API"],
    },
    {
        name: "AxiomForge",
        link: "https://github.com/Tjindl/AxiomForge",
        tagline: "DQN agent that learns to simplify polynomials and solve equations via algebraic rewrite rules",
        tech: ["PyTorch", "SymPy", "Reinforcement Learning"],
    },
    {
        name: "Verifex",
        link: "https://github.com/Tjindl/Verifex",
        tagline: "Neuro-symbolic code explainer: tree-sitter static analysis + LLM reasoning about invariants and termination",
        tech: ["Python", "tree-sitter", "FastAPI", "React"],
    },
    {
        name: "UBC Course Assistant",
        link: "https://github.com/Tjindl/ubc-course-assistant",
        tagline: "Semantic search chatbot over UBC's course catalog using sentence-transformer embeddings in ChromaDB",
        tech: ["Python", "ChromaDB", "Sentence Transformers"],
    },
    {
        name: "MontrWalk",
        link: "https://github.com/Tjindl/Conuhacks-X",
        tagline: "Accessibility navigation with live Gemini street-view scene descriptions (ConUHacks X)",
        tech: ["Python", "Gemini API", "FastAPI", "React"],
    },
    {
        name: "Aether",
        link: "https://github.com/Tjindl/Aether",
        tagline: "AR air-whiteboard driven by fingertip tracking and a 98%+ accurate gesture classifier",
        tech: ["OpenCV", "MediaPipe", "scikit-learn"],
    },
    {
        name: "Handly",
        link: "https://github.com/Tjindl/Handly",
        tagline: "Control your Mac with hand gestures, using a 99.3% accurate classifier on MediaPipe landmarks",
        tech: ["MediaPipe", "scikit-learn", "AppleScript"],
    },
    {
        name: "Snowdesk",
        live: "https://snowdesk.vercel.app",
        tagline: "Live BC ski-resort conditions from Puppeteer scrapers on a 30-minute GitHub Actions cron",
        tech: ["React", "Puppeteer", "GitHub Actions"],
    },
    {
        name: "Code Lantern",
        link: "https://github.com/naomichenruoxi/code-lantern",
        tagline: "Reconstructs dependency and call graphs from uploaded projects with a hybrid regex + AST parser",
        tech: ["Python", "FastAPI", "Cytoscape.js"],
    },
    {
        name: "AwardScope",
        link: "https://github.com/Tjindl/AwardScope",
        live: "https://awardscope.vercel.app/",
        tagline: "Scholarship matching with eligibility scoring and AI-generated essay strategies",
        tech: ["TypeScript", "Node.js", "MongoDB", "Gemini API"],
    },
    {
        name: "Resume Optimizer",
        link: "https://github.com/Tjindl/resOptimizer",
        tagline: "ATS checks, section detection, and TF-IDF skill matching for resumes",
        tech: ["Python", "spaCy", "scikit-learn", "React"],
    },
    {
        name: "ASL Recognition",
        link: "https://github.com/Tjindl/asl",
        tagline: "Real-time ASL gesture recognition from webcam with a 99%+ accurate TensorFlow CNN",
        tech: ["TensorFlow", "OpenCV", "Flask"],
    },
    {
        name: "DevStats",
        link: "https://github.com/Tjindl/DevStats",
        tagline: "GitHub OAuth backend that syncs a developer's pull requests and scores their activity",
        tech: ["FastAPI", "PostgreSQL", "SQLAlchemy"],
    },
    {
        name: "EzBooks",
        link: "https://github.com/calebblo/ezbooks",
        tagline: "Receipt parsing and bookkeeping for small businesses (UBC BizTech Kickstart 2025)",
        tech: ["Flask", "AWS Textract", "DynamoDB"],
    },
    {
        name: "CryptoStream",
        link: "https://github.com/Tjindl/Cryptostream",
        tagline: "A blockchain implementation for sending and receiving cryptocurrency",
        tech: ["Java", "Cryptography"],
    },
    {
        name: "Messaging App",
        link: "https://github.com/Tjindl/messagingApp",
        tagline: "Real-time chat with Socket.IO",
        tech: ["React", "Node.js", "Socket.IO"],
    },
    {
        name: "Sports Rental App",
        link: "https://github.com/Tjindl/Project-Starter",
        tagline: "Inventory and customer management for a sports rental business",
        tech: ["Java", "Swing", "JDBC"],
    },
];

export default Data;
