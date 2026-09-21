(function () {
  var config = window.PORTFOLIO_CONFIG;

  if (!config || !config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
    return;
  }

  var url = config.SUPABASE_URL.replace(/\/$/, '');
  var key = config.SUPABASE_ANON_KEY;

  fetch(
    url +
      '/rest/v1/skills?select=name,category,sort_order,is_published&is_published=eq.true&order=sort_order.asc',
    {
      headers: {
        apikey: key,
        Authorization: 'Bearer ' + key
      }
    }
  )
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Skills request failed: ' + response.status);
      }
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

      var oldData = localStorage.getItem('portfolio_skills');
      var newData = JSON.stringify(skills);

      if (oldData !== newData) {
        localStorage.setItem('portfolio_skills', newData);
        window.location.reload();
      }
    })
    .catch(function (error) {
      console.warn('[portfolio] Skills sync skipped:', error);
    });
})();
