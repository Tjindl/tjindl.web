import './OpenSource.css';

const contributions = [
  {
    org: 'rapidsai',
    repo: 'cudf',
    repoUrl: 'https://github.com/rapidsai/cudf',
    description: "NVIDIA's GPU-accelerated DataFrame library — cuDF enables pandas-like operations on CUDA GPUs. Written in C++ and Python with CUDA kernels.",
    prs: [
      {
        title: '[FEA] Support force_ascii flag in JSON writer',
        url: 'https://github.com/rapidsai/cudf/pull/23177',
        status: 'open',
        description: 'Added force_ascii flag to the cuDF JSON engine mirroring the pandas API, allowing non-ASCII characters to be written as-is instead of escaped. Modified the Python backend and added parameterized tests.',
        tags: ['Python', 'C++', 'I/O'],
      },
      {
        title: 'Replace duplicate type-stringify logic with type_to_name',
        url: 'https://github.com/rapidsai/cudf/pull/23230',
        status: 'open',
        description: 'Eliminated two hand-maintained type-stringify switches in C++ benchmark code by unifying on type_to_name(), and added a print_type debug utility to the cudf test headers.',
        tags: ['C++', 'CUDA', 'Benchmarks'],
      },
      {
        title: 'Fix ufunc test domains to ensure valid input generation',
        url: 'https://github.com/rapidsai/cudf/pull/23196',
        status: 'open',
        description: 'Fixed NumPy ufunc tests (arcsin, arccos, arctanh) that were always producing NaN because inputs fell outside valid domains. Introduced domain-aware random input generation.',
        tags: ['Python', 'Testing', 'NumPy'],
      },
      {
        title: 'Fix IO benchmark naming consistency',
        url: 'https://github.com/rapidsai/cudf/pull/23180',
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
];

function StatusBadge({ status }) {
  return (
    <span className={`os-badge os-badge--${status}`}>
      {status === 'merged' ? '✓ merged' : '↑ open'}
    </span>
  );
}

function OpenSource() {
  return (
    <div className="os-list">
      {contributions.map((contrib) => (
        <div className="os-repo" key={contrib.repo}>
          <div className="os-repo-header">
            <a
              href={contrib.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="os-repo-name"
            >
              <span className="os-org">{contrib.org}</span>
              <span className="os-slash">/</span>
              <span className="os-repo-label">{contrib.repo}</span>
            </a>
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
                <div className="os-pr-tags">
                  {pr.tags.map((tag) => (
                    <span className="tech-chip" key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OpenSource;
