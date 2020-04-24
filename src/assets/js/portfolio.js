const portfolioWrapper = document.querySelector('.portfolio');
const baseUrl = 'https://api.devx.pl';
const endpointAPI = `${baseUrl}/api/collections/get/portfolio`;
const tokenAPI = '7d00588bfc312fc16b35c1894b72b8';

async function getPages(endpoint) {
  const response = await fetch(endpoint);
  const data = await response.json();

  return data.entries;
}

function createTags(stringTags) {
  return stringTags
    .split(',')
    .map(tag => `<span>${tag.trimLeft()}</span>`)
    .join('');
}

function handlePages(pagesData) {
  const portfolioCategoryWrapper = document.querySelector(
    '.portfolio__categories'
  );
  const portfolioPagesWrapper = document.querySelector('.portfolio__pages');

  let categoryButtons = '<ul>';
  let portfolioPages = '';

  pagesData.forEach((group, index) => {
    const { category } = group;

    categoryButtons += `<li><button class="portfolio__category${
      !index ? ' portfolio__category--active' : ''
    }" data-category=${index}>${category}</button></li>`;

    group.pages.forEach(item => {
      const { value } = item;

      portfolioPages += `
        <a class="portfolio-page" href="${value.url}" rel="nofollow noreferrer noopener" target="_blank" data-category="${index}">
      `;
      portfolioPages += `
        <h3 class="portfolio-page__title">${value.name}</h3>
        <span class="portfolio-page__url">${value.url}</span>
      `;

      portfolioPages += value.desc
        ? `<p class="portfolio-page__desc">${value.desc}</p>`
        : '';

      portfolioPages += value.tags
        ? `<div class="portfolio-page__tags">${createTags(value.tags)}</div>`
        : '';

      portfolioPages += '</a>';
    });
  });

  categoryButtons += '</ul>';

  portfolioCategoryWrapper.innerHTML = categoryButtons;
  portfolioPagesWrapper.innerHTML = portfolioPages;

  const categorySwitchers = document.querySelectorAll('.portfolio__category');
  const portfolioPagesEl = document.querySelectorAll('.portfolio-page');

  categorySwitchers.forEach(categorySwitcher =>
    categorySwitcher.addEventListener('click', e => {
      const categoryId = categorySwitcher.dataset.category;

      categorySwitchers.forEach(categorySwitcher =>
        categorySwitcher.classList.remove('portfolio__category--active')
      );
      e.currentTarget.classList.toggle('portfolio__category--active');

      portfolioPagesEl.forEach(portfolioPage => {
        if (portfolioPage.dataset.category == categoryId) {
          portfolioPage.style.display = 'grid';
        } else {
          portfolioPage.style.display = 'none';
        }
      });
    })
  );
}

getPages(`${endpointAPI}?token=${tokenAPI}`).then(response =>
  handlePages(response)
);
