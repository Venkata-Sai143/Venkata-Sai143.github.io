(function () {
  var config = window.PORTFOLIO_CONFIG;

  if (!config || !config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
    return;
  }

  var url = config.SUPABASE_URL.replace(/\/$/, '');
  var key = config.SUPABASE_ANON_KEY;

  var headers = {
    apikey: key,
    Authorization: 'Bearer ' + key
  };

  function save(name, value) {
    try {
      var newData = JSON.stringify(value);
      var oldData = localStorage.getItem(name);

      if (oldData !== newData) {
        localStorage.setItem(name, newData);
        return true;
      }
    } catch (error) {
      console.warn('[portfolio] Local storage error:', error);
    }

    return false;
  }

  var requests = [];

  // =========================
  // SKILLS
  // =========================
  requests.push(
    fetch(
      url +
        '/rest/v1/skills?select=name,category,sort_order,is_published&is_published=eq.true&order=sort_order.asc',
      { headers: headers }
    )
      .then(function (response) {
        if (!response.ok) throw new Error('Skills request failed');
        return response.json();
      })
      .then(function (rows) {
        var order = [];
        var groups = {};

        rows.forEach(function (row) {
          if (!groups[row.category]) {
            groups[row.category] = [];
            order.push(row.category);
          }

          groups[row.category].push(row.name);
        });

        return {
          key: 'portfolio_skills',
          data: order.map(function (category) {
            return {
              category: category,
              skills: groups[category]
            };
          })
        };
      })
  );

  // =========================
  // EXPERIENCE
  // =========================
  requests.push(
    fetch(
      url +
url +
url +
url +
url +
  '/rest/v1/experiences?select=company,job_title,location,start_date,end_date,is_current,period_label,description,responsibilities,tools,sort_order,is_published&is_published=eq.true&order=sort_order.asc',        return response.json();
      })
      .then(function (rows) {
        return {
          key: 'portfolio_experience',
          data: rows.map(function (row) {
            return {
              period:
                row.period_label ||
                (
                  (row.start_date || '') +
                  ' — ' +
                  (row.is_current ? 'PRESENT' : (row.end_date || ''))
                ),
              tag: 'WORK EXPERIENCE',
              tagAccent: row.job_title || '',
              title: row.job_title || '',
              company: row.company || '',
description: row.description || '',
responsibilities: row.responsibilities || [],
tools: row.tools || []            };
          })
        };
      })
  );

  // =========================
  // PROJECTS
  // =========================
  requests.push(
    fetch(
      url +
        '/rest/v1/projects?select=title,category,short_description,tags,match_label,episode&is_published=eq.true&order=sort_order.asc',
      { headers: headers }
    )
      .then(function (response) {
        if (!response.ok) throw new Error('Projects request failed');
        return response.json();
      })
      .then(function (rows) {
        return {
          key: 'portfolio_projects',
          data: rows.map(function (row) {
            return {
              title: row.title || '',
              category: row.category || '',
              description: row.short_description || '',
              tags: row.tags || [],
              match: row.match_label || 'New',
              episode: row.episode || ''
            };
          })
        };
      })
  );

  // =========================
  // CERTIFICATES
  // =========================
  requests.push(
    fetch(
      url +
        '/rest/v1/certificates?select=title,issuer,date_label&is_published=eq.true&order=sort_order.asc',
      { headers: headers }
    )
      .then(function (response) {
        if (!response.ok) throw new Error('Certificates request failed');
        return response.json();
      })
      .then(function (rows) {
        return {
          key: 'portfolio_certificates',
          data: rows.map(function (row) {
            return {
              title: row.title || '',
              issuer: row.issuer || '',
              date: row.date_label || ''
            };
          })
        };
      })
  );

  // =========================
  // SAVE EVERYTHING FIRST
  // THEN RELOAD ONCE
  // =========================
  Promise.all(requests)
    .then(function (results) {
      var changed = false;

      results.forEach(function (result) {
        if (save(result.key, result.data)) {
          changed = true;
        }
      });

      if (changed) {
        window.location.reload();
      }
    })
    .catch(function (error) {
      console.warn('[portfolio] Backend sync failed:', error);
    });
})();
(function () {
  function showExperienceDetails() {
    var section = document.querySelector('#experience');
    if (!section) return;

    var data;

    try {
      data = JSON.parse(localStorage.getItem('portfolio_experience') || '[]');
    } catch (error) {
      return;
    }

    var cards = Array.from(
      section.querySelectorAll('div.relative.rounded-3xl')
    );

    cards.slice(0, data.length).forEach(function (card, index) {
      if (card.querySelector('[data-backend-details]')) return;

      var item = data[index];
      if (!item) return;

      var details = document.createElement('div');
      details.setAttribute('data-backend-details', 'true');
      details.className = 'mt-6 space-y-5';

      if (item.responsibilities && item.responsibilities.length) {
        var responsibilityTitle = document.createElement('h4');
        responsibilityTitle.className = 'text-sm font-semibold uppercase tracking-wider';
        responsibilityTitle.textContent = 'Responsibilities';

        var list = document.createElement('ul');
        list.className = 'mt-2 space-y-2 text-sm opacity-80';

        item.responsibilities.forEach(function (value) {
          var li = document.createElement('li');
          li.textContent = '• ' + value;
          list.appendChild(li);
        });

        details.appendChild(responsibilityTitle);
        details.appendChild(list);
      }

      if (item.tools && item.tools.length) {
        var toolsTitle = document.createElement('h4');
        toolsTitle.className = 'text-sm font-semibold uppercase tracking-wider';
        toolsTitle.textContent = 'Tools';

        var tools = document.createElement('div');
        tools.className = 'mt-2 flex flex-wrap gap-2';

        item.tools.forEach(function (value) {
          var chip = document.createElement('span');
          chip.className = 'rounded-full border px-3 py-1 text-xs';
          chip.textContent = value;
          tools.appendChild(chip);
        });

        details.appendChild(toolsTitle);
        details.appendChild(tools);
      }

      if (details.children.length) {
        card.appendChild(details);
      }
    });
  }

  showExperienceDetails();

  var observer = new MutationObserver(function () {
    showExperienceDetails();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
