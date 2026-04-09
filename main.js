const SKILLS = [
  { group: 'Cloud & Infra', items: ['Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Docker'] },
  { group: 'AI',            items: ['Claude API', 'Whisper', 'RAG', 'Prompt Engineering'] },
  { group: 'Dev',           items: ['Node.js', 'React Native', 'Firebase', 'GitHub API'] },
  { group: 'Teaching',      items: ['CMPE281', 'Curriculum Design', 'Lab Development'] },
];

// Which side of the pair each project sits on (by project index 0–5)
// Row 0 (projects 0,1): card on LEFT  → cardOnRight = false
// Row 1 (projects 2,3): card on RIGHT → cardOnRight = true
// Row 2 (projects 4,5): card on LEFT  → cardOnRight = false
const CARD_ON_RIGHT = [false, false, true, true, false, false];

let activeCard = null;
let activePair = null;

function buildCard(project) {
  const card = document.createElement('div');
  card.className = 'card';

  const githubLink = project.github
    ? `<a class="card-github" href="${project.github}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">GitHub ↗</a>`
    : '';

  card.innerHTML = `
    <div class="card-header">
      <span class="card-title">${project.title}</span>
      <span class="card-arrow">↗</span>
    </div>
    <div class="card-tags">
      ${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}
    </div>
    <div class="card-detail">
      <div class="detail-col">
        <h4>Problem</h4>
        <p>${project.problem}</p>
      </div>
      <div class="detail-col">
        <h4>How I Used AI</h4>
        <p>${project.aiUsage}</p>
      </div>
      <div class="detail-col">
        <h4>Outcome</h4>
        <p>${project.outcome}</p>
        ${githubLink}
      </div>
    </div>
    <div class="card-hint">click to close</div>
  `;

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
  const grid = document.getElementById('projects-grid');

  window.PROJECTS.forEach((project, i) => {
    const cardOnRight = CARD_ON_RIGHT[i];

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
      <span class="skill-group-label">${group}</span>
      ${items.map(item => `<span class="skill-tag">${item}</span>`).join('')}
    `;
    container.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderGrid();
  renderSkills();
});
