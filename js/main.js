// espera o HTML carregar antes de rodar tudo
document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initMegaMenus();
  renderProducts();
  initCarousels();
  initNewsletter();
});

// BUSCA
function initSearch() {
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  const result = document.getElementById('search-result');

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // pra página não recarregar

    const term = input.value.trim();

    // se não digitou nada, não mostra a mensagem
    if (!term) {
      result.hidden = true;
      input.focus();
      return;
    }

    result.textContent = `Você buscou por: '${term}'`;
    result.hidden = false;
  });

  // quando apaga o texto, a mensagem some
  input.addEventListener('input', () => {
    if (!input.value.trim()) result.hidden = true;
  });
}

// MENU (dropdowns)
// cria as colunas com os links "Categoria"
function createColumns(total = 3, itemsPerColumn = 8) {
  const columns = document.createElement('div');
  columns.className = 'mega__columns';

  for (let c = 0; c < total; c++) {
    const list = document.createElement('ul');
    list.className = 'mega__column';
    for (let i = 0; i < itemsPerColumn; i++) {
      list.insertAdjacentHTML('beforeend', '<li><a href="#">Categoria</a></li>');
    }
    columns.appendChild(list);
  }
  return columns;
}

function initMegaMenus() {
  const allColumns = document.querySelector('.mega--all [data-columns]');
  allColumns.replaceWith(createColumns());

  // todos os departamentos têm o mesmo dropdown, então crio ele aqui em vez de repetir no HTML
  const card = document.querySelector('.mega__card');

  document.querySelectorAll('[data-department]').forEach((item) => {
    const mega = document.createElement('div');
    mega.className = 'mega mega--department';
    mega.innerHTML = `
      <div class="mega__header">
        <p class="mega__header-title">Departamento</p>
        <a href="#" class="mega__header-link">Ver tudo</a>
      </div>`;
    mega.appendChild(createColumns());
    mega.appendChild(card.cloneNode(true));
    item.appendChild(mega);
  });
}

// PRODUTOS
// os 15 produtos são iguais no layout, então fiz um array pra não repetir o card no HTML
const products = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1,
  name: 'Lorem ipsum dolor sit amet consectetuer adipiscing elit',
  image: 'assets/img/product.webp',
  oldPrice: 'R$ 100,00',
  price: 'R$79,90',
  discount: '10% off',
  installments: '10x de R$ 7,90',
}));

function productCard(product, plainDiscount = false) {
  return `
    <article class="swiper-slide card">
      <div class="card__media">
        <img src="${product.image}" alt="Camiseta branca" width="222" height="222" loading="lazy">
        <span class="card__badge">Novo</span>
      </div>
      <h3 class="card__title">
        <span class="tag">&lt;h3&gt;</span> ${product.name} <span class="tag">&lt;/h3&gt;</span>
      </h3>
      <div class="card__prices">
        <div>
          <s class="card__old-price">${product.oldPrice}</s>
          <p class="card__price">${product.price}</p>
        </div>
        <span class="card__discount${plainDiscount ? ' card__discount--plain' : ''}">${product.discount}</span>
      </div>
      <p class="card__installments">Ou em até <strong>${product.installments}</strong></p>
      <button class="card__button" type="button">Comprar</button>
    </article>`;
}

function renderProducts() {
  document.querySelectorAll('[data-products]').forEach((wrapper, carouselIndex) => {
    wrapper.innerHTML = products
      // no layout o 5º card da primeira vitrine está sem sublinhado no "10% off"
      .map((product, i) => productCard(product, carouselIndex === 0 && i === 4))
      .join('');
  });
}

// CARROSSEIS (Swiper)
const TOTAL_DOTS = 3; // no layout são sempre 3 bolinhas

function initCarousels() {
  if (typeof Swiper === 'undefined') return;

  document.querySelectorAll('.showcase').forEach((section) => {
    const dots = section.querySelector('.showcase__dots');

    const swiper = new Swiper(section.querySelector('.products-swiper'), {
      slidesPerView: 2,
      slidesPerGroup: 2,
      spaceBetween: 10,
      speed: 500,
      rewind: true, // quando chega no fim, volta pro começo
      navigation: {
        prevEl: section.querySelector('.showcase__arrow--prev'),
        nextEl: section.querySelector('.showcase__arrow--next'),
      },
      // 2 cards no celular, 4 em tela média e 5 no desktop
      breakpoints: {
        1024: { slidesPerView: 4, slidesPerGroup: 4, spaceBetween: 17 },
        1280: { slidesPerView: 5, slidesPerGroup: 5, spaceBetween: 17 },
      },
      on: {
        init: (s) => updateDots(s, dots),
        slideChange: (s) => updateDots(s, dots),
        resize: (s) => updateDots(s, dots),
      },
    });

    dots.innerHTML = Array.from({ length: TOTAL_DOTS }, (_, i) =>
      `<button type="button" class="showcase__dot" aria-label="Ir para o grupo ${i + 1}"></button>`
    ).join('');

    // clicar na bolinha leva pro começo, meio ou fim do carrossel
    dots.querySelectorAll('.showcase__dot').forEach((dot, i) => {
      dot.addEventListener('click', () => {
        const lastIndex = swiper.slides.length - swiper.params.slidesPerView;
        swiper.slideTo(Math.round((lastIndex * i) / (TOTAL_DOTS - 1)));
      });
    });

    updateDots(swiper, dots);
  });
}

// marca a bolinha certa de acordo com o quanto o carrossel já andou (progress vai de 0 a 1)
function updateDots(swiper, dots) {
  if (!dots) return;
  const active = Math.round(swiper.progress * (TOTAL_DOTS - 1));
  dots.querySelectorAll('.showcase__dot').forEach((dot, i) => {
    dot.classList.toggle('is-active', i === active);
  });
}

// NEWSLETTER - só limpa o formulário, não envia pra lugar nenhum
function initNewsletter() {
  const form = document.getElementById('newsletter-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    form.reset();
  });
}
