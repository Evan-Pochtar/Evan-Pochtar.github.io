const categories = {
  backend: ['Python', 'R', 'Go', 'Typescript', 'Javascript'],
  frontend: ['Svelte', 'Flask', 'EmberJS', 'HTML5', 'Tailwind CSS', 'React'],
  packages: ['Scikit-Learn', 'Pandas', 'MatplotLib', 'NetworkX', 'PyTorch', 'Tensorflow', 'OpenCV', 'OpenAI API'],
  database: ['Azure Blob Storage', 'Firebase', 'PostgreSQL', 'SQLite'],
  other: ['LaTeX', 'Unity', 'Figma']
};

let expandedCategory = null;
let selectedTags = new Set();

function createCategoryButtons() {
  const container = document.querySelector('.category-buttons');
  Object.keys(categories).forEach(category => {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'button-wrapper';
    
    const button = document.createElement('button');
    button.className = 'category-button';
    button.textContent = category;
    button.onclick = (event) => handleCategoryClick(category, buttonWrapper, event);
    
    buttonWrapper.appendChild(button);
    container.appendChild(buttonWrapper);
  });
 }

function handleCategoryClick(category, wrapper) {
  event.stopPropagation();
  if (expandedCategory === category) {
    const existingDropdown = wrapper.querySelector('.dropdown');
    if (existingDropdown) existingDropdown.remove();
    expandedCategory = null;
    return;
  }
  
  document.querySelectorAll('.dropdown').forEach(el => el.remove());
  
  const dropdown = document.createElement('div');
  dropdown.className = 'dropdown';
  
  categories[category].forEach(tag => {
    const tagButton = document.createElement('button');
    tagButton.textContent = tag;
    tagButton.onclick = () => handleTagClick(tag);
    dropdown.appendChild(tagButton);
  });
  
  wrapper.appendChild(dropdown);
  expandedCategory = category;
}

function handleTagClick(tag) {
  if (selectedTags.has(tag)) {
    selectedTags.delete(tag);
  } else {
    selectedTags.add(tag);
  }
  updateSelectedTags();
  filterProjects();
  
  const dropdown = document.querySelector('.dropdown');
  if (dropdown) {
    dropdown.remove();
    expandedCategory = null;
  }
}

function updateSelectedTags() {
  const container = document.querySelector('.selected-tags');
  container.innerHTML = '';
  
  selectedTags.forEach(tag => {
    const tagSpan = document.createElement('span');
    tagSpan.innerHTML = `
      ${tag}
      <button style="margin-bottom:3px;">×</button>
    `;
    tagSpan.querySelector('button').onclick = () => handleTagClick(tag);
    container.appendChild(tagSpan);
  });
}

function filterProjects() {
  const projects = document.querySelectorAll('.project-card');
  projects.forEach(project => {
    const skills = Array.from(project.querySelectorAll('.skill-item img')).map(img => img.title);
    const isVisible = selectedTags.size === 0 || Array.from(selectedTags).some(tag => skills.includes(tag));
    project.style.display = isVisible ? '' : 'none';
  });
}

function handleClickOutside(event) {
  if (!event.target.closest('.button-wrapper')) {
    const dropdown = document.querySelector('.dropdown');
    if (dropdown) {
      dropdown.remove();
      expandedCategory = null;
    }
  }
 }

document.addEventListener('DOMContentLoaded', () => {
  createCategoryButtons();
  document.addEventListener('click', handleClickOutside);
});