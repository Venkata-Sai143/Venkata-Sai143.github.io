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
    } catch (_) {}

    return false;
  }

  var changed = false;

  // =========================
  // SKILLS
  // =========================
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

      var skills = order.map(function (category) {
        return {
          category: category,
          skills: groups[category]
        };
      });

      if (save('portfolio_skills', skills)) {
        window.location.reload();
      }
    })
    .catch(function (error) {
      console.warn('[portfolio] Skills sync skipped:', error);
    });

  // =========================
  // EXPERIENCE
  // =========================
  fetch(
    url +
      '/rest/v1/experiences?select=company,job_title,location,start_date,end_date,is_current,period_label,description,sort_order,is_published&is_published=eq.true&order=sort_order.asc',
    { headers: headers }
  )
    .then(function (response) {
      if (!response.ok) throw new Error('Experience request failed');
      return response.json();
    })
    .then(function (rows) {
      var experience = rows.map(function (row) {
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
          description: row.description || ''
        };
      });

      if (save('portfolio_experience', experience)) {
        window.location.reload();
      }
    })
    .catch(function (error) {
      console.warn('[portfolio] Experience sync skipped:', error);
    });

  // =========================
  // PROJECTS
  // =========================
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
      var projects = rows.map(function (row) {
        return {
          title: row.title || '',
          category: row.category || '',
          description: row.short_description || '',
          tags: row.tags || [],
          match: row.match_label || 'New',
          episode: row.episode || ''
        };
      });

      if (save('portfolio_projects', projects)) {
        window.location.reload();
      }
    })
    .catch(function (error) {
      console.warn('[portfolio] Projects sync skipped:', error);
    });

  // =========================
  // CERTIFICATES
  // =========================
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
      var certificates = rows.map(function (row) {
        return {
          title: row.title || '',
          issuer: row.issuer || '',
          date: row.date_label || ''
        };
      });

      if (save('portfolio_certificates', certificates)) {
        window.location.reload();
      }
    })
    .catch(function (error) {
      console.warn('[portfolio] Certificates sync skipped:', error);
    });
})();
