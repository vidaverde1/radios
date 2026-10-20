(function () {
    'use strict';

    var cardView = document.getElementById('cardView');
    var tableView = document.getElementById('tableView');
    var tableBody = document.getElementById('tableBody');
    var btnCards = document.getElementById('btnCards');
    var btnTable = document.getElementById('btnTable');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');

    if (lightboxImg) {
        lightboxImg.src = '';
    }

    function collectItems() {
        if (!cardView) return [];
        var nodes = cardView.querySelectorAll('.inventory-item');
        var arr = [];
        for (var i = 0; i < nodes.length; i++) {
            var li = nodes[i];
            arr.push({
                el: li,
                id: li.getAttribute('data-id') || '',
                name: li.querySelector('h2') ? li.querySelector('h2').textContent : '',
                model: li.querySelector('[data-model]') ? li.querySelector('[data-model]').textContent : '',
                price: parseInt(li.getAttribute('data-price') || '0', 10)
            });
        }
        return arr;
    }

    var items = collectItems();

    function fmt(n) {
        return '$' + n.toLocaleString('es-AR') + ' ARS';
    }

    function renderSummaryAndTable() {
        var total = 0;
        for (var i = 0; i < items.length; i++) {
            total += items[i].price || 0;
        }

        var lotTotalEl = document.getElementById('lotTotal');
        var lotOldEl = document.getElementById('lotOld');
        var lotDiscountEl = document.getElementById('lotDiscount');
        var lotSubEl = document.getElementById('lotSub');

        if (lotTotalEl) lotTotalEl.textContent = fmt(total);
        if (lotOldEl) lotOldEl.textContent = fmt(total);
        if (lotDiscountEl) lotDiscountEl.textContent = fmt(Math.round(total * 0.8));
        if (lotSubEl) lotSubEl.textContent = items.length + ' equipos del lote';

        if (!tableBody) return;

        tableBody.innerHTML = '';

        var fragment = document.createDocumentFragment();
        for (var j = 0; j < items.length; j++) {
            var it = items[j];
            var tr = document.createElement('tr');

            var tdId = document.createElement('td');
            tdId.className = 'idc';
            tdId.textContent = it.id;

            var tdName = document.createElement('td');
            tdName.textContent = it.name;

            var tdModel = document.createElement('td');
            tdModel.textContent = it.model;

            var tdPrice = document.createElement('td');
            tdPrice.className = 'num';
            tdPrice.textContent = fmt(it.price);

            tr.appendChild(tdId);
            tr.appendChild(tdName);
            tr.appendChild(tdModel);
            tr.appendChild(tdPrice);
            fragment.appendChild(tr);
        }

        tableBody.appendChild(fragment);
    }

    function scheduleSummaryAndTable() {
        if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(function () {
                renderSummaryAndTable();
            }, { timeout: 1000 });
        } else {
            setTimeout(function () {
                renderSummaryAndTable();
            }, 0);
        }
    }

    function setView(view) {
        var isTable = view === 'table';
        if (cardView) cardView.classList.toggle('hidden', isTable);
        if (tableView) tableView.classList.toggle('visible', isTable);
        if (btnCards) btnCards.setAttribute('aria-pressed', String(!isTable));
        if (btnTable) btnTable.setAttribute('aria-pressed', String(isTable));
    }

    function openLightboxFromImg(imgEl) {
        if (!lightbox || !lightboxImg || !imgEl) return;
        var fullSrc = imgEl.getAttribute('data-full-src') || imgEl.getAttribute('src') || '';
        if (!fullSrc) return;
        lightboxImg.src = fullSrc;
        lightboxImg.alt = imgEl.getAttribute('alt') || 'Vista ampliada';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
        if (!lightbox || !lightboxImg) return;
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
    }

    if (btnCards) btnCards.addEventListener('click', function () { setView('cards'); });
    if (btnTable) btnTable.addEventListener('click', function () { setView('table'); });

    if (cardView) {
        cardView.addEventListener('click', function (e) {
            var target = e.target;
            if (target && target.classList && target.classList.contains('item-image')) {
                openLightboxFromImg(target);
            }
        });
    }

    if (lightbox) lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
    });

    function init() {
        scheduleSummaryAndTable();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
