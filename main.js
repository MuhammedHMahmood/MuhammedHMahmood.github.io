const SKILLS = [
  { group: 'Cloud & Infra', items: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Docker'] },
  { group: 'AI',            items: ['Claude API', 'Whisper', 'RAG', 'Prompt Engineering'] },
  { group: 'Dev',           items: ['Node.js', 'React Native', 'Firebase', 'GitHub API'] },
  { group: 'Teaching',      items: ['CMPE281', 'Curriculum Design', 'Lab Development'] },
];

let activeCard = null;
let activePair = null;

function esc(str) {
  const d = document.createElement('div');
  d.textContent = String(str);
  return d.innerHTML;
}

function buildCard(project) {
  const card = document.createElement('div');
  card.className = 'card';

  const safeHref = project.github?.startsWith('https://') ? project.github : null;
  const githubLink = safeHref
    ? `<a class="card-github" href="${safeHref}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>`
    : '';

  card.innerHTML = `
    <div class="card-header">
      <span class="card-title">${esc(project.title)}</span>
      <span class="card-arrow">↗</span>
    </div>
    <div class="card-tags">
      ${project.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}
    </div>
    <div class="card-detail">
      <div class="detail-col">
        <h4>Problem</h4>
        <p>${esc(project.problem)}</p>
      </div>
      <div class="detail-col">
        <h4>How I Used AI</h4>
        <p>${esc(project.aiUsage)}</p>
      </div>
      <div class="detail-col">
        <h4>Outcome</h4>
        <p>${esc(project.outcome)}</p>
        ${githubLink}
      </div>
    </div>
    <div class="card-hint">click to close</div>
  `;

  const githubAnchor = card.querySelector('.card-github');
  if (githubAnchor) {
    githubAnchor.addEventListener('click', e => e.stopPropagation());
  }

  return card;
}

function closeActive() {
  if (!activeCard) return;
  activeCard.classList.remove('open');
  activePair.classList.remove('expanded-left', 'expanded-right');
  activeCard = null;
  activePair = null;
}

function toggleCard(card, pair, cardOnRight) {
  const isOpen = card.classList.contains('open');

  closeActive();

  if (!isOpen) {
    card.classList.add('open');
    pair.classList.add(cardOnRight ? 'expanded-right' : 'expanded-left');
    activeCard = card;
    activePair = pair;
  }
}

function renderGrid() {
  if (!window.PROJECTS?.length) {
    console.error('main.js: window.PROJECTS not found — ensure projects.js loads before main.js');
    return;
  }

  const grid = document.getElementById('projects-grid');

  window.PROJECTS.forEach((project, i) => {
    const cardOnRight = Math.floor(i / 2) === 1;

    const pair = document.createElement('div');
    pair.className = 'pair';

    const card = buildCard(project);
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder';

    if (cardOnRight) {
      pair.appendChild(placeholder);
      pair.appendChild(card);
    } else {
      pair.appendChild(card);
      pair.appendChild(placeholder);
    }

    card.addEventListener('click', () => toggleCard(card, pair, cardOnRight));

    grid.appendChild(pair);
  });
}

function renderSkills() {
  const container = document.getElementById('skills-groups');

  SKILLS.forEach(({ group, items }) => {
    const div = document.createElement('div');
    div.className = 'skill-group';
    div.innerHTML = `
      <span class="skill-group-label">${esc(group)}</span>
      ${items.map(item => `<span class="skill-tag">${esc(item)}</span>`).join('')}
    `;
    container.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderGrid();
  renderSkills();
});
