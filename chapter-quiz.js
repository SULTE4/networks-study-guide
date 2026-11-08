'use strict';
// One-question-at-a-time quiz used at the end of each chapter and on the juice page.
(function (root) {
  const LETTERS = ['A', 'B', 'C', 'D'];
  const read = key => { try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage is optional */ } };
  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function rich(node, text) {
    String(text).split('`').forEach((part, i) => {
      if (!part) return;
      if (i % 2) { const c = document.createElement('code'); c.textContent = part; node.append(c); } else node.append(part);
    });
    return node;
  }
  function el(tag, className, text) {
    const n = document.createElement(tag);
    if (className) n.className = className;
    if (text !== undefined) rich(n, text);
    return n;
  }
  function button(label, className, onClick) {
    const b = el('button', className, label); b.type = 'button'; b.addEventListener('click', onClick); return b;
  }

  function mount(host, items, options) {
    const opts = Object.assign({ eyebrow: 'CHECK YOURSELF', title: 'Chapter quiz', count: 0, key: '', source: null }, options);
    const storeKey = opts.key ? 'cn-quiz-' + opts.key : '';
    let deck, index, score, missed, answered;

    function deal(pool) {
      const picked = shuffle(pool);
      deck = (opts.count && picked.length > opts.count ? picked.slice(0, opts.count) : picked)
        .map(item => ({ item, options: shuffle([item[1]].concat(item[2])) }));
      index = 0; score = 0; missed = []; answered = false;
      draw(false);
    }
    function head() {
      const box = el('div', 'quiz-head');
      const left = el('div');
      left.append(el('p', 'eyebrow', opts.eyebrow), el('h3', 'quiz-title', opts.title));
      box.append(left);
      const best = storeKey && read(storeKey);
      if (best && best.total) box.append(el('p', 'quiz-best', 'Best: ' + best.score + ' / ' + best.total));
      return box;
    }
    function drawResult() {
      const total = deck.length, pct = Math.round(score / total * 100);
      const prev = storeKey && read(storeKey);
      if (storeKey && (!prev || score / total >= prev.score / prev.total)) write(storeKey, { score, total });
      const box = el('div', 'quiz-result');
      box.append(el('p', 'quiz-score', score + ' / ' + total));
      box.append(el('p', 'quiz-verdict', pct >= 85 ? 'Solid. Come back in a couple of days and it will stick.' : pct >= 60 ? 'Close. Retry the ones you missed, then reread those parts.' : 'Worth another read before you retry.'));
      const row = el('div', 'quiz-actions');
      if (missed.length) row.append(button('Retry the ' + missed.length + ' you missed', 'quiz-primary', () => deal(missed.slice())));
      row.append(button('Start over', 'quiz-ghost', () => deal(items)));
      box.append(row);
      return box;
    }
    function drawQuestion(focus) {
      const card = deck[index], [q, correct, , why] = card.item;
      const wrap = el('div', 'quiz-body');
      const meter = el('div', 'quiz-meter'); meter.setAttribute('aria-hidden', 'true');
      const fill = el('span'); fill.style.width = ((index + (answered ? 1 : 0)) / deck.length * 100) + '%'; meter.append(fill);
      const count = el('p', 'quiz-count', 'Question ' + (index + 1) + ' of ' + deck.length + ' / score ' + score);
      const title = el('p', 'quiz-question', q); title.tabIndex = -1;
      wrap.append(meter, count, title);
      const list = el('div', 'quiz-options'); list.setAttribute('role', 'group'); list.setAttribute('aria-label', 'Answer choices');
      const feedback = el('div', 'quiz-feedback'); feedback.setAttribute('aria-live', 'polite');
      const footer = el('div', 'quiz-actions');
      const buttons = card.options.map((text, i) => {
        const b = el('button', 'quiz-option'); b.type = 'button';
        b.append(el('span', 'quiz-letter', LETTERS[i]), el('span', 'quiz-text', text));
        b.addEventListener('click', () => choose(i));
        list.append(b);
        return b;
      });
      function choose(i) {
        if (answered) return;
        answered = true;
        const right = card.options[i] === correct;
        if (right) score++; else missed.push(card.item);
        buttons.forEach((b, j) => {
          b.disabled = true;
          const isCorrect = card.options[j] === correct;
          if (isCorrect) { b.classList.add('is-correct'); b.append(el('span', 'quiz-mark', 'Correct')); }
          else if (j === i) { b.classList.add('is-wrong'); b.append(el('span', 'quiz-mark', 'Your pick')); }
        });
        fill.style.width = ((index + 1) / deck.length * 100) + '%';
        count.textContent = 'Question ' + (index + 1) + ' of ' + deck.length + ' / score ' + score;
        feedback.replaceChildren(el('p', right ? 'quiz-right' : 'quiz-wrong', right ? 'Right.' : 'Not quite.'), el('p', 'quiz-why', why));
        if (opts.source) { const link = opts.source(card.item); if (link) feedback.append(link); }
        const next = button(index + 1 < deck.length ? 'Next question' : 'See my score', 'quiz-primary', () => { index++; answered = false; draw(true); });
        footer.replaceChildren(next);
        next.focus({ preventScroll: true });
      }
      wrap.append(list, feedback, footer);
      if (focus) setTimeout(() => title.focus({ preventScroll: true }), 0);
      return wrap;
    }
    function draw(focus) {
      const parts = [head(), index < deck.length ? drawQuestion(focus) : drawResult()];
      host.replaceChildren(...parts);
      if (focus && host.getBoundingClientRect().top < 0) host.scrollIntoView({ block: 'start' });
    }
    deal(items);
    return { restart: () => deal(items) };
  }

  root.ChapterQuiz = { mount, shuffle, rich };
  function autoMount() {
    if (!root.QUIZ_BANK) return;
    document.querySelectorAll('[data-quiz]').forEach(node => {
      const chapter = root.QUIZ_BANK[node.dataset.quiz];
      if (chapter) mount(node, chapter.items, { title: 'Quiz: ' + chapter.title, key: node.dataset.quiz });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', autoMount); else autoMount();
})(window);
