import { FiStar } from 'react-icons/fi';
import './OpenSource.css';

const contributions = [
  {
    org: 'NVIDIA',
    repo: 'cudf',
    repoUrl: 'https://github.com/NVIDIA/cudf',
    description: "NVIDIA's GPU-accelerated DataFrame library — cuDF enables pandas-like operations on CUDA GPUs. Written in C++ and Python with CUDA kernels.",
    logo: 'https://github.com/nvidia.png',
    stars: 9767,
    prs: [
      {
        title: '[FEA] Support force_ascii flag in JSON writer',
        url: 'https://github.com/NVIDIA/cudf/pull/23177',
        status: 'merged',
        description: 'Added force_ascii flag to the cuDF JSON engine mirroring the pandas API, allowing non-ASCII characters to be written as-is instead of escaped. Modified the Python backend and added parameterized tests.',
        tags: ['Python', 'C++', 'I/O'],
      },
      {
        title: 'Replace duplicate type-stringify logic with type_to_name',
        url: 'https://github.com/NVIDIA/cudf/pull/23230',
        status: 'merged',
        description: 'Eliminated two hand-maintained type-stringify switches in C++ benchmark code by unifying on type_to_name(), and added a print_type debug utility to the cudf test headers.',
        tags: ['C++', 'CUDA', 'Benchmarks'],
      },
      {
        title: 'Fix ufunc test domains to ensure valid input generation',
        url: 'https://github.com/NVIDIA/cudf/pull/23196',
        status: 'merged',
        description: 'Fixed NumPy ufunc tests (arcsin, arccos, arctanh) that were always producing NaN because inputs fell outside valid domains. Introduced domain-aware random input generation.',
        tags: ['Python', 'Testing', 'NumPy'],
      },
      {
        title: 'Fix IO benchmark naming consistency',
        url: 'https://github.com/NVIDIA/cudf/pull/23180',
        status: 'merged',
        description: 'Standardised nvbench axis labels across ORC and text IO benchmarks, replacing undocumented abbreviations with full snake_case names.',
        tags: ['C++', 'Benchmarks'],
      },
    ],
  },
  {
    org: 'vllm-project',
    repo: 'vllm',
    repoUrl: 'https://github.com/vllm-project/vllm',
    description: "A high-throughput and memory-efficient LLM inference engine used in production by major AI labs. Powers fast serving of models like Llama, Mistral, and Qwen.",
    logo: 'https://github.com/vllm-project.png',
    stars: 92876,
    prs: [
      {
        title: 'Fix platform plugin load error message swallowed',
        url: 'https://github.com/vllm-project/vllm/pull/48326',
        status: 'open',
        description: 'Platform plugin failures were silently caught, causing vLLM to fall back to CPU with no diagnostic. Added explicit warning logging with exception details so operators can identify broken plugin installations immediately.',
        tags: ['Python', 'Diagnostics', 'Plugins'],
      },
    ],
  },
  {
    org: 'ai-dynamo',
    repo: 'dynamo',
    repoUrl: 'https://github.com/ai-dynamo/dynamo',
    description: "NVIDIA's distributed LLM inference framework built in Rust and Python, designed for high-performance multi-node serving with disaggregated prefill and decode.",
    logo: 'https://github.com/nvidia.png',
    stars: 8171,
    prs: [
      {
        title: 'fix(runtime): avoid no-reactor panic during sync OTLP export init',
        url: 'https://github.com/ai-dynamo/dynamo/pull/11547',
        status: 'open',
        description: 'Calling logging::init() from a synchronous entrypoint panicked with "no reactor running" when OTLP export was enabled. Fixed by spinning up a background Tokio runtime for the exporter when none is already active.',
        tags: ['Rust', 'Runtime', 'OpenTelemetry'],
      },
    ],
  },
  {
    org: 'Science-Undergraduate-Society',
    repo: 'www-v2',
    repoUrl: 'https://github.com/Science-Undergraduate-Society/www-v2',
    description: 'The official website for the Science Undergraduate Society at UBC.',
    logo: 'https://github.com/Science-Undergraduate-Society.png',
    prs: [
      {
        title: 'Site-wide dark mode',
        url: 'https://github.com/Science-Undergraduate-Society/www-v2/pull/77',
        status: 'merged',
        description: 'Added a theme provider and dark-mode styles across 35 files, covering every page, the desktop and mobile navbars, and shared UI components.',
        tags: ['Next.js', 'React', 'CSS'],
      },
      {
        title: 'Performance updates: migrate to Next.js Image',
        url: 'https://github.com/Science-Undergraduate-Society/www-v2/pull/79',
        status: 'merged',
        description: 'Replaced raw <img> tags with Next.js <Image> across navigation, footer, and high-traffic pages for automatic lazy loading and modern formats, and updated the 2026/27 executive roster.',
        tags: ['Next.js', 'Performance'],
      },
      {
        title: 'Optimize councilor buttons and fix render-blocking fonts',
        url: 'https://github.com/Science-Undergraduate-Society/www-v2/pull/74',
        status: 'merged',
        description: 'Rebuilt the council panels as accessible accordions, fixed inconsistent card layouts, and removed a global render-blocking font load.',
        tags: ['Next.js', 'Performance', 'Accessibility'],
      },
    ],
  },
];

// Star counts are a snapshot from GitHub; only shown where they signal scale.
const formatStars = (n) =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n).toLowerCase();

function StatusBadge({ status }) {
  return (
    <span className={`os-badge os-badge--${status}`}>
      {status === 'merged' ? '✓ merged' : '↑ in review'}
    </span>
  );
}

const allPrs = contributions.flatMap((c) => c.prs);
const mergedCount = allPrs.filter((pr) => pr.status === 'merged').length;
const openCount = allPrs.length - mergedCount;

function OpenSource() {
  return (
    <div className="os-list">
      <p className="os-summary">
        <span><strong>{mergedCount}</strong> merged</span>
        <span><strong>{openCount}</strong> in review</span>
        <span><strong>{contributions.length}</strong> repositories</span>
      </p>
      {contributions.map((contrib) => (
        <div className="os-repo" key={contrib.repo}>
          <div className="os-repo-header">
            <div className="os-repo-top">
              <a
                href={contrib.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="os-repo-name"
              >
                {contrib.logo && (
                  <img src={contrib.logo} alt="" className="os-repo-logo" />
                )}
                <span className="os-org">{contrib.org}</span>
                <span className="os-slash">/</span>
                <span className="os-repo-label">{contrib.repo}</span>
              </a>
              {contrib.stars >= 1000 && (
                <span className="os-stars" title={`${contrib.stars.toLocaleString()} GitHub stars`}>
                  <FiStar aria-hidden="true" /> {formatStars(contrib.stars)}
                </span>
              )}
            </div>
            <p className="os-repo-desc">{contrib.description}</p>
          </div>
          <div className="os-prs">
            {contrib.prs.map((pr) => (
              <div className="os-pr" key={pr.url}>
                <div className="os-pr-top">
                  <a
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="os-pr-title"
                  >
                    {pr.title}
                  </a>
                  <StatusBadge status={pr.status} />
                </div>
                <p className="os-pr-desc">{pr.description}</p>
                <p className="os-pr-meta">
                  <span className="os-pr-number">#{pr.url.split('/').pop()}</span>
                  {pr.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OpenSource;
