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
  // PROFILE / ABOUT (new)
  // =========================
  requests.push(
    fetch(
      url +
        '/rest/v1/profiles?select=name,headline,short_bio,about,location,email,phone,linkedin_url,github_url,resume_url,profile_image_url,hero_video_url,about_heading&limit=1',
      { headers: headers }
    )
      .then(function (response) {
        if (!response.ok) throw new Error('Profile request failed');
        return response.json();
      })
      .then(function (rows) {
        var row = rows[0] || {};
        return {
          key: 'portfolio_profile',
          data: {
            name: row.name || '',
            headline: row.headline || '',
            shortBio: row.short_bio || '',
            about: row.about || '',
            location: row.location || '',
            email: row.email || '',
            phone: row.phone || '',
            linkedinUrl: row.linkedin_url || '',
            githubUrl: row.github_url || '',
            resumeUrl: row.resume_url || '',
            profileImageUrl: row.profile_image_url || '',
            heroVideoUrl: row.hero_video_url || '',
            aboutHeading: row.about_heading || ''
          }
        };
      })
  );

  // =========================
  // EXPERTISE (new)
  // =========================
  requests.push(
    fetch(
      url +
        '/rest/v1/expertise?select=number,title,text,position_class,aos_type,aos_delay,sort_order,is_published&is_published=eq.true&order=sort_order.asc',
      { headers: headers }
    )
      .then(function (response) {
        if (!response.ok) throw new Error('Expertise request failed');
        return response.json();
      })
      .then(function (rows) {
        return {
          key: 'portfolio_expertise',
          data: rows.map(function (row) {
            return {
              number: row.number || '',
              title: row.title || '',
              text: row.text || '',
              className: row.position_class || '',
              aosType: row.aos_type || 'fade-up',
              aosDelay: row.aos_delay || '0'
            };
          })
        };
      })
  );

  // =========================
  // SKILLS (unchanged)
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
  // FEATURED SKILLS (new, separate from regular Skills)
  // =========================
  requests.push(
    fetch(
      url +
        '/rest/v1/skills?select=name,icon_url,sort_order&is_published=eq.true&is_featured=eq.true&order=sort_order.asc',
      { headers: headers }
    )
      .then(function (response) {
        if (!response.ok) throw new Error('Featured skills request failed');
        return response.json();
      })
      .then(function (rows) {
        return {
          key: 'portfolio_featured_skills',
          data: rows.map(function (row) {
            return {
              name: row.name || '',
              icon: row.icon_url || ''
            };
          })
        };
      })
  );

  // =========================
  // EXPERIENCE (unchanged)
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
  // PROJECTS (expanded to ALL fields)
  // =========================
  requests.push(
    fetch(
      url +
        '/rest/v1/projects?select=title,category,short_description,full_description,business_problem,tools,dataset,kpis,insights,recommendations,tags,match_label,episode,github_url,live_url,demo_video_url,thumbnail_url,gallery,sort_order,is_published&is_published=eq.true&order=sort_order.asc',
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
              fullDescription: row.full_description || '',
              businessProblem: row.business_problem || '',
              tools: row.tools || [],
              dataset: row.dataset || '',
              kpis: row.kpis || [],
              insights: row.insights || [],
              recommendations: row.recommendations || [],
              tags: row.tags || [],
              match: row.match_label || 'New',
              episode: row.episode || '',
              githubUrl: row.github_url || '',
              liveUrl: row.live_url || '',
              demoVideoUrl: row.demo_video_url || '',
              thumbnailUrl: row.thumbnail_url || '',
              gallery: row.gallery || []
            };
          })
        };
      })
  );

  // =========================
  // CERTIFICATES (expanded to ALL fields)
  // =========================
  requests.push(
    fetch(
      url +
        '/rest/v1/certificates?select=title,issuer,date_label,credential_id,credential_url,description,image_url,pdf_url,sort_order,is_published&is_published=eq.true&order=sort_order.asc',
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
              date: row.date_label || '',
              credentialId: row.credential_id || '',
              credentialUrl: row.credential_url || '',
              description: row.description || '',
              imageUrl: row.image_url || '',
              pdfUrl: row.pdf_url || ''
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

    var observer = new MutationObserver(function (mutations) {
        var relevant = false;

        mutations.forEach(function (mutation) {
            if (!mutation.addedNodes || !mutation.addedNodes.length) return;

            for (var i = 0; i < mutation.addedNodes.length; i++) {
                var node = mutation.addedNodes[i];

                if (node.nodeType !== 1) continue;

                if (
                    node.matches &&
                    node.matches('[data-backend-experience-details]')
                ) {
                    continue;
                }

                if (
                    node.querySelector &&
                    node.querySelector('[data-backend-experience-details]')
                ) {
                    continue;
                }

                relevant = true;
                break;
            }
        });

        if (!relevant) return;

        clearTimeout(timer);
        timer = setTimeout(loadExperienceDetails, 300);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
