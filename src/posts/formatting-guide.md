---
title: Formatting guide
date: 2026-09-28
summary: Every formatting feature the blog supports, in one place. Copy this file to start a new post.
tags: [meta]
draft: true
---

This post is a **draft**, so it shows up when you run `npm run dev` but is never included in the
production build. Copy it to `src/posts/your-post-slug.md`, change the frontmatter, and delete
`draft: true` when you're ready to publish. The file name becomes the URL: `/blog/your-post-slug`.

## Frontmatter

Every post starts with a block like this. `title` and `date` are required; the rest are optional.

```yaml
---
title: Perplexity is a misleading proxy for quality
date: 2026-10-01
summary: One or two sentences. Shown in the post list, link previews and RSS.
tags: [llms, statistics]
draft: true
---
```

If the post was first published somewhere else, add `originalUrl: https://medium.com/@you/...`. The
post page then links back to it ("Originally on Medium") and notes where readers can comment.

## Text

Paragraphs are separated by a blank line. You can write *italic*, **bold**, `inline code`,
~~strikethrough~~ and [links](https://github.com/tjindl). Links to other sites open in a new tab.
Straight quotes and dashes are typeset automatically: "quotes", 'single' -- and --- dashes.

Footnotes are written like this[^stats] and collected at the end of the post.

[^stats]: A footnote can hold a citation, an aside, or a caveat about a p-value.

> Blockquotes are good for quoting a paper or setting an idea apart.
> They can span several lines.

## Lists

1. Ordered lists
2. are numbered
   - and can nest
   - unordered lists

## Maths

Inline maths goes between single dollar signs: Euler's identity $e^{i\pi} + 1 = 0$, or an estimator
$\hat{\theta}$. Display maths goes between double dollar signs on their own lines:

$$
\hat{\beta} = \arg\min_{\beta} \lVert y - X\beta \rVert_2^2 = (X^\top X)^{-1} X^\top y
$$

$$
\begin{aligned}
\mathrm{PPL}(x) &= \exp\Big(-\frac{1}{N} \sum_{i=1}^{N} \log p_\theta(x_i \mid x_{<i})\Big) \\
\chi^2 &= \frac{(b - c)^2}{b + c}
\end{aligned}
$$

It's rendered by KaTeX when the site is built, so any LaTeX that KaTeX supports will work.

## Code

Fenced code blocks are highlighted when you name the language, and readers get a copy button.

```python
import numpy as np

def bootstrap_ci(x, stat=np.mean, n=10_000, alpha=0.05, seed=0):
    rng = np.random.default_rng(seed)
    samples = rng.choice(x, size=(n, len(x)), replace=True)
    stats = np.apply_along_axis(stat, 1, samples)
    return np.quantile(stats, [alpha / 2, 1 - alpha / 2])
```

```cpp
// Dot product of packed INT4 weights with a float activation vector.
float dot_int4(const uint8_t* w, const float* x, int n, float scale) {
    float acc = 0.f;
    for (int i = 0; i < n; i += 2) {
        acc += ((w[i / 2] & 0x0F) - 8) * x[i] + ((w[i / 2] >> 4) - 8) * x[i + 1];
    }
    return acc * scale;
}
```

```bash
npm run dev   # preview posts, including drafts, at localhost:5173/tjindl.web/blog
```

## Tables

| Method   | Bits | Perplexity |
| -------- | ---: | ---------: |
| FP16     |   16 |      35.05 |
| AWQ      |    4 |        188 |
| Uniform  |    4 |      1,978 |

## Images

Put images in `public/posts/<your-post-slug>/` and reference them relative to `public/posts/`:

```markdown
![Perplexity vs bits](your-post-slug/perplexity.png)
```

### Smaller headings

`##` and `###` headings appear in the table of contents beside the post on wide screens.

---

A horizontal rule looks like the line above.
