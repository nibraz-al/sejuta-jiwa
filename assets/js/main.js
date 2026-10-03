document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            const opened = nav.classList.toggle('open');
            burger.setAttribute('aria-expanded', opened ? 'true' : 'false');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    const STORAGE_KEY = 'sejutaJiwaOrders';
    const orderCount = document.getElementById('orderCount');
    const toast = document.getElementById('toast');

    let orders = [];
    try {
        orders = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        orders = [];
    }

    const updateBadge = () => {
        if (!orderCount) return;
        const total = orders.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        orderCount.textContent = total;
        orderCount.hidden = total <= 0;
    };

    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(window.sejutaToastTimer);
        window.sejutaToastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 1800);
    };

    document.querySelectorAll('.btn-add').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name || 'Produk';
            const price = Number(button.dataset.price || 0);
            const image = button.dataset.image || '';
            const existing = orders.find(item => item.name === name);

            if (existing) {
                existing.quantity += 1;
            } else {
                orders.push({ name, price, image, quantity: 1 });
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
            updateBadge();
            showToast(`${name} ditambahkan ke pesanan.`);

            const originalText = button.dataset.originalText || button.textContent.trim();
            button.dataset.originalText = originalText;
            button.textContent = '✓ Ditambah';
            setTimeout(() => { button.textContent = originalText; }, 900);
        });
    });

    /* MENU FILTER + SEARCH - static GitHub Pages version */
    const filterButtons = document.querySelectorAll('.menu-filter');
    const searchInput = document.getElementById('menuSearch');
    const searchForm = document.getElementById('menuSearchForm');
    const productCards = document.querySelectorAll('.menu-product-card');
    const emptyState = document.getElementById('menuEmpty');

    let activeFilter = 'all';

    const applyMenuFilter = () => {
        if (!productCards.length) return;
        const keyword = (searchInput?.value || '').trim().toLowerCase();
        let visible = 0;

        productCards.forEach(card => {
            const category = (card.dataset.category || card.querySelector('.menu-product-category')?.textContent || '').trim().toLowerCase();
            const name = (card.dataset.name || card.querySelector('h3')?.textContent || '').trim().toLowerCase();
            const categoryMatch = activeFilter === 'all' || category === activeFilter;
            const searchMatch = !keyword || name.includes(keyword);
            const show = categoryMatch && searchMatch;
            card.hidden = !show;
            if (show) visible += 1;
        });

        if (emptyState) emptyState.hidden = visible !== 0;
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', event => {
            event.preventDefault();
            filterButtons.forEach(item => item.classList.remove('active'));
            button.classList.add('active');
            activeFilter = button.dataset.filter || 'all';
            applyMenuFilter();
        });
    });

    if (searchInput) searchInput.addEventListener('input', applyMenuFilter);
    if (searchForm) searchForm.addEventListener('submit', event => {
        event.preventDefault();
        applyMenuFilter();
    });

    updateBadge();

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', event => {
            const targetId = link.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const target = document.querySelector(targetId);
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    window.addEventListener('scroll', () => {
        const header = document.querySelector('.site-header');
        if (!header) return;
        header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });

    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => {
            img.style.visibility = 'hidden';
        });
    });
});
