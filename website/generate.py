#!/usr/bin/env python3
"""
Life Compass — Article Page Generator
Converts content/week-XX/article.md into website/issues/week-XX.html
Run: python3 generate.py
"""

import os
import re

CONTENT_DIR = "../content"
OUTPUT_DIR  = "issues"
TOTAL_WEEKS = 52

PHASES = {
    range(1,  8):  ("Phase 1", "The Quiet Desperation"),
    range(8,  16): ("Phase 2", "The Broken Transmission"),
    range(16, 22): ("Phase 3", "How Men Are Actually Built"),
    range(22, 29): ("Phase 4", "Building Your Own Template"),
    range(29, 36): ("Phase 5", "Foundations"),
    range(36, 43): ("Phase 6", "Purpose and Work"),
    range(43, 50): ("Phase 7", "People and Contribution"),
    range(50, 53): ("Phase 8", "The Long Game"),
}

def get_phase(week_num):
    for r, (phase_id, phase_name) in PHASES.items():
        if week_num in r:
            return phase_id, phase_name
    return "Phase ?", "Unknown"

def md_to_html(text):
    """Minimal Markdown → HTML for our article format."""
    lines   = text.split("\n")
    html    = []
    i       = 0
    in_p    = False

    def close_p():
        nonlocal in_p
        if in_p:
            html.append("</p>")
            in_p = False

    while i < len(lines):
        line = lines[i]

        # Skip YAML-like meta lines at top
        if line.startswith("**Week:**") or line.startswith("**Phase:**"):
            i += 1
            continue

        # Horizontal rule
        if line.strip() == "---":
            close_p()
            i += 1
            continue

        # H1
        if line.startswith("# "):
            close_p()
            content = line[2:].strip()
            html.append(f"<h1>{content}</h1>")
            i += 1
            continue

        # H2
        if line.startswith("## "):
            close_p()
            content = line[3:].strip()
            html.append(f"<h2>{content}</h2>")
            i += 1
            continue

        # H3
        if line.startswith("### "):
            close_p()
            content = line[4:].strip()
            html.append(f"<h3>{content}</h3>")
            i += 1
            continue

        # Empty line
        if line.strip() == "":
            close_p()
            i += 1
            continue

        # Regular paragraph line — inline formatting
        content = line.strip()
        # Bold: **text**
        content = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', content)
        # Italic: *text*
        content = re.sub(r'\*(.+?)\*', r'<em>\1</em>', content)

        if not in_p:
            html.append("<p>")
            in_p = True
        else:
            html.append(" ")

        html.append(content)
        i += 1

    close_p()
    return "\n".join(html)

def extract_title(article_text):
    for line in article_text.split("\n"):
        if line.startswith("# "):
            return line[2:].strip()
    return "Life Compass"

def build_page(week_num, article_html, title, phase_id, phase_name):
    prev_link = f'<a href="week-{week_num-1:02d}.html">← Previous issue</a>' if week_num > 1 else ""
    next_link = f'<a href="week-{week_num+1:02d}.html">Next issue →</a>' if week_num < TOTAL_WEEKS else ""

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} — Life Compass</title>
  <meta name="description" content="Life Compass Issue {week_num}: {title}">
  <link rel="stylesheet" href="../style.css">
</head>
<body>

  <nav class="nav">
    <div class="nav__inner">
      <a href="../index.html" class="nav__logo">Life<span>Compass</span></a>
      <ul class="nav__links">
        <li><a href="../articles.html">All Issues</a></li>
        <li><a href="../index.html#about">About</a></li>
        <li><a href="../index.html#subscribe" class="nav__cta">Subscribe</a></li>
      </ul>
    </div>
  </nav>

  <div class="article-header">
    <div class="container">
      <p class="article-header__meta">
        Issue {week_num} of 52 &nbsp;·&nbsp; {phase_id} — {phase_name}
      </p>
      <h1 class="article-header__title">{title}</h1>
    </div>
  </div>

  <div class="article-body">
    {article_html}

    <div class="signup-block">
      <h3>Get the next issue in your inbox</h3>
      <p>Life Compass arrives every week — free. 52 issues. One complete journey.</p>
      <div data-fs-success class="signup-success">You're in. First issue on its way.</div>
      <div data-fs-error class="signup-error"></div>
      <form id="form-article" class="signup-form fs-form" method="post">
        <input type="email" name="email" placeholder="Your email address" required data-fs-field>
        <button type="submit" class="btn" data-fs-submit-btn>Subscribe Free &rarr;</button>
      </form>
    </div>

    <nav class="article-nav">
      <div>{prev_link}</div>
      <div>{next_link}</div>
    </nav>
  </div>

  <footer class="footer">
    <div class="container--wide">
      <div class="footer__inner">
        <span class="footer__logo">Life<span>Compass</span></span>
        <ul class="footer__links">
          <li><a href="../articles.html">All Issues</a></li>
          <li><a href="../index.html#about">About</a></li>
          <li><a href="../index.html#subscribe">Subscribe</a></li>
        </ul>
        <p class="footer__copy">© 2025 Life Compass. All rights reserved.</p>
      </div>
    </div>
  </footer>

<script>
  window.formspree = window.formspree || function(){{(formspree.q=formspree.q||[]).push(arguments);}};
  formspree('initForm',{{formElement:'#form-article',formId:'xyklgzvn'}});
</script>
<script src="https://unpkg.com/@formspree/ajax@1" defer></script>
</body>
</html>"""

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    generated = 0
    errors    = []

    for week in range(1, TOTAL_WEEKS + 1):
        article_path = os.path.join(CONTENT_DIR, f"week-{week:02d}", "article.md")

        if not os.path.exists(article_path):
            errors.append(f"Missing: {article_path}")
            continue

        with open(article_path, "r", encoding="utf-8") as f:
            raw = f.read()

        # Strip the first H1 (title) from body — we render it in header
        body_text = re.sub(r'^#\s+.+\n', '', raw, count=1)

        title        = extract_title(raw)
        article_html = md_to_html(body_text)
        phase_id, phase_name = get_phase(week)

        page = build_page(week, article_html, title, phase_id, phase_name)

        out_path = os.path.join(OUTPUT_DIR, f"week-{week:02d}.html")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(page)

        print(f"✓ week-{week:02d}.html — {title[:60]}")
        generated += 1

    print(f"\n{generated} pages generated.")
    if errors:
        print("Errors:")
        for e in errors:
            print(f"  {e}")

if __name__ == "__main__":
    main()
