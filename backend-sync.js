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
        '/rest/v1/experiences?select=company,job_title,location,start_date,end_date,is_current,period_label,description,responsibilities,tools,sort_order,is_published&is_published=eq.true&order=sort_order.asc',
      { headers: headers }
    )
      .then(function (response) {
        if (!response.ok) throw new Error('Experience request failed');
        return response.json();
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
              tools: row.tools || []
            };
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
  function loadExperienceDetails() {
    var config = window.PORTFOLIO_CONFIG;
    if (!config) return;

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
        if (!section) return;

        var headings = section.querySelectorAll('h3');

        rows.forEach(function (row) {
          var heading = Array.from(headings).find(function (h) {
            return h.textContent.trim() === row.job_title;
          });

          if (!heading) return;

          var card = heading.closest('div[class*="rounded-3xl"]');
          if (!card) return;

          var old = card.querySelector('[data-backend-experience-details]');
          if (old) old.remove();

          var details = document.createElement('div');
          details.setAttribute(
            'data-backend-experience-details',
            'true'
          );
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
      })
      .catch(function (error) {
        console.warn('[portfolio] Experience details failed:', error);
      });
  }

  function start() {
    loadExperienceDetails();

    var observer = new MutationObserver(function () {
      loadExperienceDetails();
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
