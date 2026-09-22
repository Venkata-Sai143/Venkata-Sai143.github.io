(function () {
  var running = false;

  function loadExperienceDetails() {
    if (running) return;
    running = true;

    var config = window.PORTFOLIO_CONFIG;
    if (!config) { running = false; return; }

    var url = config.SUPABASE_URL.replace(/\/$/, '');
    var key = config.SUPABASE_ANON_KEY;

    fetch(
      url +
        '/rest/v1/experiences?select=job_title,responsibilities,tools&is_published=eq.true&order=sort_order.asc',
      {
        headers: {
          apikey: key,
          Authorization: 'Bearer ' + key
        }
      }
    )
      .then(function (response) {
        if (!response.ok) throw new Error('Experience details failed');
        return response.json();
      })
      .then(function (rows) {
        var section = document.querySelector('#experience');
        if (!section) { running = false; return; }

        var headings = Array.from(section.querySelectorAll('h3'));

        rows.forEach(function (row) {
          var wanted = (row.job_title || '').trim().toLowerCase();

          var heading = headings.find(function (h) {
            return h.textContent.trim().toLowerCase() === wanted;
          });

          if (!heading) return;

          var card = heading.closest('div[class*="rounded-3xl"]') || heading.closest('div');
          if (!card) return;

          var old = card.querySelector('[data-backend-experience-details]');
          if (old) old.remove();

          var details = document.createElement('div');
          details.setAttribute('data-backend-experience-details', 'true');
          details.style.marginTop = '24px';

          if (row.responsibilities && row.responsibilities.length) {
            var title = document.createElement('h4');
            title.textContent = 'Responsibilities';
            title.style.fontWeight = '600';
            title.style.marginBottom = '10px';

            var list = document.createElement('ul');
            list.style.paddingLeft = '20px';
            list.style.marginBottom = '20px';

            row.responsibilities.forEach(function (item) {
              var li = document.createElement('li');
              li.textContent = item;
              li.style.marginBottom = '6px';
              list.appendChild(li);
            });

            details.appendChild(title);
            details.appendChild(list);
          }

          if (row.tools && row.tools.length) {
            var toolsTitle = document.createElement('h4');
            toolsTitle.textContent = 'Tools';
            toolsTitle.style.fontWeight = '600';
            toolsTitle.style.marginBottom = '10px';

            var tools = document.createElement('div');
            tools.style.display = 'flex';
            tools.style.flexWrap = 'wrap';
            tools.style.gap = '8px';

            row.tools.forEach(function (item) {
              var chip = document.createElement('span');
              chip.textContent = item;
              chip.style.padding = '6px 12px';
              chip.style.border = '1px solid currentColor';
              chip.style.borderRadius = '999px';
              chip.style.fontSize = '12px';
              tools.appendChild(chip);
            });

            details.appendChild(toolsTitle);
            details.appendChild(tools);
          }

          if (details.children.length) {
            card.appendChild(details);
          }
        });

        running = false;
      })
      .catch(function (error) {
        console.warn('[portfolio] Experience details failed:', error);
        running = false;
      });
  }

  function start() {
    loadExperienceDetails();

    var timer = null;
    var observer = new MutationObserver(function () {
      clearTimeout(timer);
      timer = setTimeout(loadExperienceDetails, 300);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
