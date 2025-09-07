const categories = {
  backend: ['C#', 'Go', 'Javascript', 'Python', 'R', 'Rust', 'Typescript'],
  frontend: ['Django', 'EmberJS', 'Flask', 'HTML5', 'Playwright', 'ReactJS', 'Svelte', 'Tailwind CSS', 'Tauri'],
  packages: ['MatplotLib', 'NetworkX', 'OpenAI API', 'OpenCV', 'Pandas', 'PyTorch', 'Pytest', 'Scikit-Learn', 'Tensorflow'],
  database: ['Azure Blob Storage', 'Firebase', 'PostgreSQL', 'SQLite'],
  other: ['Blender', 'Devicon', 'ESLint', 'Figma', 'Github Actions', 'Google Colab', 'Jira', 'JSON', 'LaTeX', 'OAuth', 'ROS2', 'Unity']
};

let expandedCategory = null;
let selectedTags = new Set();
let showCurrentOnly = false;

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

function handleCategoryClick(category, wrapper, event) {
  if (event && event.stopPropagation) event.stopPropagation();
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
  const projects = document.querySelectorAll('section');
  const noProjectsMessage = document.getElementById('noProjectsMessage');
  let visibleCount = 0;

  projects.forEach((project, index) => {
    const skills = Array.from(project.querySelectorAll('.skill-item img')).map(img => img.title);
    const projectDate = project.querySelector('.project-date')?.textContent || '';
    const matchesTags = selectedTags.size === 0 || Array.from(selectedTags).some(tag => skills.includes(tag));
    const matchesCurrent = !showCurrentOnly || projectDate.includes('Current');
    const isVisible = matchesTags && matchesCurrent;
    
    if (isVisible) {
      visibleCount++;
      setTimeout(() => {
        project.classList.remove('fade-out');
        project.style.display = '';
      }, index * 50);
    } else {
      project.classList.add('fade-out');
      setTimeout(() => {
        project.style.display = 'none';
      }, 400);
    }
  });

  setTimeout(() => {
    if (!noProjectsMessage) return;
    if (visibleCount === 0) {
      noProjectsMessage.classList.add('show');
    } else {
      noProjectsMessage.classList.remove('show');
    }
  }, 200);
}

function handleCurrentProjectsClick() {
  const btn = document.getElementById('currentProjectsBtn');
  btn.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    btn.style.transform = '';
    
    showCurrentOnly = !showCurrentOnly;
    
    if (showCurrentOnly) {
      btn.classList.add('active');
      btn.textContent = 'Show All Projects';
    } else {
      btn.classList.remove('active');
      btn.textContent = 'Show Current Projects';
    }
    
    filterProjects();
  }, 100);
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
  const currentBtn = document.getElementById('currentProjectsBtn');
  if (currentBtn) {
    currentBtn.addEventListener('click', handleCurrentProjectsClick);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const gallery = btn.nextElementSibling;
      gallery.classList.toggle('open');
      btn.textContent = gallery.classList.contains('open')
        ? 'Hide Screenshots'
        : 'View Screenshots';
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.toggle-btn-poster').forEach(btn => {
    btn.addEventListener('click', () => {
      const gallery = btn.nextElementSibling;
      gallery.classList.toggle('open');
      btn.textContent = gallery.classList.contains('open')
        ? 'Hide Poster'
        : 'View Poster';
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const closeBtn = lightbox.querySelector('.lightbox-close');

  document.querySelectorAll('.screenshot-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const src = link.dataset.full;
      lightboxImg.src = src;
      lightbox.removeAttribute('hidden');
    });
  });

  closeBtn.addEventListener('click', () => {
    lightbox.setAttribute('hidden', '');
    lightboxImg.src = '';
  });
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) {
      lightbox.setAttribute('hidden', '');
      lightboxImg.src = '';
    }
  });
});
