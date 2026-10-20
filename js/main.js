(function () {
    'use strict';

    var cardView = document.getElementById('cardView');
    var tableView = document.getElementById('tableView');
    var tableBody = document.getElementById('tableBody');
    var btnCards = document.getElementById('btnCards');
    var btnTable = document.getElementById('btnTable');
    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightboxImg');

    var items = Array.prototype.map.call(cardView.querySelectorAll('.inventory-item'), function (li) {
        return {
            el: li,
            id: li.dataset.id,
            name: li.querySelector('h2').textContent,
            model: li.querySelector('[data-model]').textContent,
            price: parseInt(li.dataset.price, 10)
        };
    });

    function fmt(n) {
        return '$' + n.toLocaleString('es-AR') + ' ARS';
    }

    function updateLot() {
        var total = items.reduce(function (s, it) { return s + it.price; }, 0);
        document.getElementById('lotTotal').textContent = fmt(total);
        document.getElementById('lotOld').textContent = fmt(total);
        document.getElementById('lotDiscount').textContent = fmt(Math.round(total * 0.8));
        document.getElementById('lotSub').textContent = items.length + ' equipos del lote';
    }

    function renderTable() {
        tableBody.innerHTML = items.map(function (it) {
            return '<tr><td class="idc">' + it.id + '</td><td>' + it.name +
                '</td><td>' + it.model + '</td><td class="num">' + fmt(it.price) + '</td></tr>';
        }).join('');
    }

    function setView(view) {
        var isTable = view === 'table';
        cardView.classList.toggle('hidden', isTable);
        tableView.classList.toggle('visible', isTable);
        btnCards.setAttribute('aria-pressed', String(!isTable));
        btnTable.setAttribute('aria-pressed', String(isTable));
    }

    function swapThumb(el) {
        var media = el.closest('.item-media');
        media.querySelector('.item-image').src = el.src;
        media.querySelectorAll('.thumbs img').forEach(function (t) {
            t.classList.remove('active');
        });
        el.classList.add('active');
    }

    function openLightbox(src, alt) {
        lightboxImg.src = src;
        lightboxImg.alt = alt || 'Vista ampliada';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
    }

    btnCards.addEventListener('click', function () { setView('cards'); });
    btnTable.addEventListener('click', function () { setView('table'); });

    cardView.addEventListener('click', function (e) {
        var t = e.target;
        if (t.matches('.thumbs img')) {
            swapThumb(t);
        } else if (t.matches('.item-image')) {
            openLightbox(t.src, t.alt);
        }
    });

    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
    });

    renderTable();
    updateLot();
})();
