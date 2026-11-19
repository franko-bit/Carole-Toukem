import { useEffect, useState } from 'react';
import vid1 from '../vid1.mp4';
import vid2 from '../vid2.mp4';
import vid3 from '../vid3.mp4';

const sectionIds = ['thesis', 'accompagnements', 'ebook', 'insights', 'about', 'pitch', 'contact'];

const calendlyUrl = 'https://calendly.com/carole-accompagnatricedevie/45min?month=2026-11';
const bookCoverUrl = 'https://res.cloudinary.com/franklinrw/image/upload/v1795104949/Gemini_Generated_Image_lgmed2lgmed2lgme_sicvhw.jpg';
const quoteImageUrl = 'https://res.cloudinary.com/franklinrw/image/upload/v1795109022/Gemini_Generated_Image_12u5kw12u5kw12u5_herw9j.jpg';
const videos = [vid1, vid2, vid3];

const accompagnementsFr = [
  ['Coaching individuel', 'Séances personnalisées autour de ton mindset, ta clarté, ton identité et tes priorités.', '#pitch'],
  ['Ateliers & conférences', 'Des sessions de groupe sur la gestion du temps, la gestion du stress et l’alignement personnel.', '#pitch'],
  ['Vision de vie', 'Clarifier une direction inspirante et passer d’une vie vécue par habitude à une vie choisie.', '#pitch'],
];

const accompagnementsEn = [
  ['Individual coaching', 'Personal sessions focused on mindset, clarity, identity and priorities.', '#pitch'],
  ['Workshops & talks', 'Group sessions on time management, stress management and personal alignment.', '#pitch'],
  ['Life vision', 'Clarify an inspiring direction and move from a life lived by habit to a life chosen with intention.', '#pitch'],
];

const insightsFr = [
  ['Partir de la base', 'Une transformation durable commence par l’état d’esprit : tant que la pensée intérieure ne change pas, les changements visibles restent fragiles.'],
  ['Définir son Top 3', 'Clarifier les priorités essentielles permet d’éviter la dispersion et de concentrer son énergie sur ce qui fait vraiment avancer.'],
  ['Passer de spectatrice à actrice', 'Une vision ne suffit pas : elle devient réelle quand elle se traduit en choix, habitudes et actions concrètes.'],
];

const insightsEn = [
  ['Start with the foundation', 'Lasting transformation begins with mindset: visible change remains fragile until the inner patterns change.'],
  ['Define your Top 3', 'Clarifying essential priorities reduces distraction and directs your energy toward what truly moves you forward.'],
  ['Move from spectator to actor', 'A vision becomes real when it turns into choices, habits and concrete action.'],
];

function Cta({ href, children }) {
  return (
    <a className="cta" href={href}>
      <b>{children}</b>
      <em aria-hidden="true">{children}</em>
    </a>
  );
}

function App() {
  const [themeLabel, setThemeLabel] = useState('Light');
  const [language, setLanguage] = useState('fr');
  const [pitchStatus, setPitchStatus] = useState('');
  const [statusVersion, setStatusVersion] = useState(0);
  const [cityTimes, setCityTimes] = useState({ paris: '--:--:--', utc: '--:--:--' });
  const isEnglish = language === 'en';
  const accompagnements = isEnglish ? accompagnementsEn : accompagnementsFr;
  const insights = isEnglish ? insightsEn : insightsFr;
  const navItems = isEnglish
    ? [['thesis', 'Approach'], ['accompagnements', 'Coaching'], ['ebook', 'Free eBook'], ['insights', 'Resources'], ['about', 'About'], ['pitch', 'Call'], ['contact', 'Contact']]
    : [['thesis', 'Approche'], ['accompagnements', 'Accompagnements'], ['ebook', 'E-book gratuit'], ['insights', 'Ressources'], ['about', 'À propos'], ['pitch', 'RDV'], ['contact', 'Contact']];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = () => {
      const theme = root.dataset.theme;
      return theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    };
    const updateLabel = () => setThemeLabel(isDark() ? 'Dark' : 'Light');
    updateLabel();

    const themeButton = document.getElementById('theme');
    const toggleTheme = () => {
      const dark = !isDark();
      root.dataset.theme = dark ? 'dark' : 'light';
      try {
        localStorage.setItem('carole-theme', dark ? 'dark' : 'light');
      } catch {
        // Storage can be unavailable in private browsing contexts.
      }
      updateLabel();
    };
    themeButton.addEventListener('click', toggleTheme);

    const activeLinks = document.querySelectorAll('.rail a, header nav a');
    let sectionObserver;
    if ('IntersectionObserver' in window) {
      sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeLinks.forEach((link) => {
              link.classList.toggle('on', link.getAttribute('href') === `#${entry.target.id}`);
            });
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) sectionObserver.observe(element);
      });
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let revealObserver;
    const revealTimers = [];
    if ('IntersectionObserver' in window && !reducedMotion) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const element = entry.target;
          element.classList.add('in');
          observer.unobserve(element);
          revealTimers.push(window.setTimeout(() => {
            element.classList.remove('rv', 'in');
            element.style.transitionDelay = '';
          }, 1000));
        });
      }, { threshold: 0.08 });
      document.querySelectorAll('.head,.row,.split>div,.mqw').forEach((element) => {
        element.classList.add('rv');
        if (element.classList.contains('row')) {
          const index = Array.prototype.indexOf.call(element.parentNode.children, element) % 4;
          element.style.transitionDelay = `${index * 60}ms`;
        }
        revealObserver.observe(element);
      });
    }

    const heads = document.querySelectorAll('.head');
    let dotObserver;
    if ('IntersectionObserver' in window) {
      dotObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('go');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      heads.forEach((head) => {
        if (head.querySelector('.dot')) dotObserver.observe(head);
      });
    } else {
      heads.forEach((head) => head.classList.add('go'));
    }

    const progress = document.getElementById('prog');
    const portraitImage = document.querySelector('.portrait img');
    let scrollQueued = false;
    const updateScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${height > 0 ? window.scrollY / height : 0})`;
      if (portraitImage && window.scrollY < window.innerHeight * 1.5) {
        portraitImage.style.setProperty('--py', `${window.scrollY * 0.08}px`);
      }
      scrollQueued = false;
    };
    const onScroll = () => {
      if (!scrollQueued) {
        scrollQueued = true;
        window.requestAnimationFrame(updateScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    updateScroll();

    const wordmark = document.querySelector('.big');
    let wordmarkObserver;
    if (wordmark && 'IntersectionObserver' in window) {
      wordmarkObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            wordmark.classList.add('go');
            observer.disconnect();
          }
        });
      }, { threshold: 0.2 });
      wordmarkObserver.observe(wordmark);
    } else if (wordmark) {
      wordmark.classList.add('go');
    }

    const canHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches && !reducedMotion;
    let cursorFrame;
    let cursor;
    const magneticButtons = document.querySelectorAll('.cta');
    const moveMagnet = (event) => {
      const button = event.currentTarget;
      const bounds = button.getBoundingClientRect();
      button.style.translate = `${(event.clientX - bounds.left - bounds.width / 2) * 0.18}px ${(event.clientY - bounds.top - bounds.height / 2) * 0.3}px`;
    };
    const resetMagnet = (event) => {
      event.currentTarget.style.translate = '';
    };
    let mouseMove;
    let mouseLeave;
    if (canHover) {
      magneticButtons.forEach((button) => {
        button.addEventListener('mousemove', moveMagnet);
        button.addEventListener('mouseleave', resetMagnet);
      });
      cursor = document.getElementById('cur');
      let x = 0;
      let y = 0;
      let currentX = 0;
      let currentY = 0;
      mouseMove = (event) => {
        x = event.clientX;
        y = event.clientY;
        cursor.classList.add('on');
        cursor.classList.toggle('big-c', Boolean(event.target.closest('a,button,.row,input,select,textarea')));
      };
      mouseLeave = () => cursor.classList.remove('on');
      window.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseleave', mouseLeave);
      const followCursor = () => {
        currentX += (x - currentX) * 0.18;
        currentY += (y - currentY) * 0.18;
        cursor.style.translate = `${currentX}px ${currentY}px`;
        cursorFrame = window.requestAnimationFrame(followCursor);
      };
      cursorFrame = window.requestAnimationFrame(followCursor);
    }

    const updateClocks = () => {
      const formatTime = (timeZone) => new Intl.DateTimeFormat('en-GB', {
        timeZone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date());
      try {
        setCityTimes({
          paris: formatTime('Europe/Paris'),
          utc: formatTime('UTC'),
        });
      } catch {
        console.error('Unable to format the displayed local times.');
      }
    };
    updateClocks();
    const clockTimer = window.setInterval(updateClocks, 1000);

    return () => {
      themeButton.removeEventListener('click', toggleTheme);
      sectionObserver?.disconnect();
      revealObserver?.disconnect();
      dotObserver?.disconnect();
      wordmarkObserver?.disconnect();
      revealTimers.forEach(window.clearTimeout);
      window.removeEventListener('scroll', onScroll);
      window.clearInterval(clockTimer);
      if (canHover) {
        magneticButtons.forEach((button) => {
          button.removeEventListener('mousemove', moveMagnet);
          button.removeEventListener('mouseleave', resetMagnet);
        });
        window.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseleave', mouseLeave);
        window.cancelAnimationFrame(cursorFrame);
      }
    };
  }, []);

  const handlePitchSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const requiredFields = [...form.querySelectorAll('[required]')];
    const invalidFields = requiredFields.filter((field) => !field.value.trim());
    requiredFields.forEach((field) => {
      const invalid = invalidFields.includes(field);
      field.style.borderColor = invalid ? 'var(--fg)' : '';
      field.style.borderWidth = invalid ? '2px' : '';
    });
    if (invalidFields.length) {
      setPitchStatus(isEnglish ? 'Please complete all required fields.' : 'Merci de compléter tous les champs requis.');
    } else {
      setPitchStatus(isEnglish ? 'Your request has been received.' : 'Ta demande a bien été reçue.');
      form.reset();
    }
    setStatusVersion((version) => version + 1);
  };

  return (
    <>
      <div className="cur" id="cur" aria-hidden="true" />
      <header>
        <div className="bar">
          <a className="logo" href="#top">carole.</a>
          <nav className="small" aria-label="Primary">
            {navItems.map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}
          </nav>
          <div className="clock small" role="status" aria-live="off">
            <span className="clock-city">Lörrach <time className="clock-time" key={cityTimes.paris}>{cityTimes.paris}</time></span>
            <span className="clock-separator" aria-hidden="true">/</span>
            <span className="clock-city">UTC <time className="clock-time" key={cityTimes.utc}>{cityTimes.utc}</time></span>
          </div>
          <button type="button" className="tbtn small" id="theme" aria-label="Toggle theme">
            <span>{themeLabel}</span><i />
          </button>
          <button type="button" className="tbtn small" aria-label={isEnglish ? 'Passer en français' : 'Switch to English'} onClick={() => setLanguage(isEnglish ? 'fr' : 'en')}>
            <span>{isEnglish ? 'FR' : 'EN'}</span>
          </button>
        </div>
        <div className="prog" id="prog" />
      </header>

      <div className="rail" role="navigation" aria-label="Sections">
        {navItems.filter(([id]) => ['thesis', 'accompagnements', 'ebook', 'insights', 'contact'].includes(id)).map(([id, label]) => (
          <a href={`#${id}`} aria-label={label} key={id}><span>{label}</span><i /></a>
        ))}
      </div>

      <main id="top">
        <div className="wrap">
          <section className="hero" style={{ borderBottom: '1px solid var(--line)' }}>
            <div className="hero-top"><p className="label">{isEnglish ? 'Life coach / Francophone' : 'Accompagnatrice de vie / Francophone'}</p><p className="label">2026</p></div>
            <h1 aria-label="Carole Toukem">
              {'Carole Toukem'.split('').map((letter, index) => (
                <span key={index} style={{ animationDelay: `${index * 0.04}s` }}>{letter === ' ' ? '\u00a0' : letter}</span>
              ))}
            </h1>
            <div className="hero-meta">
              <div className="info">
                <ul>
                  <li>{isEnglish ? 'French, German & English' : 'Français, allemand & anglais'}</li>
                  <li>{isEnglish ? 'Individual coaching' : 'Coaching individuel'}</li>
                  <li>{isEnglish ? 'France & Germany' : 'France & Allemagne'}</li>
                </ul>
                <div className="actions">
                  <Cta href={calendlyUrl}>{isEnglish ? 'book a discovery call' : 'réserver un appel'}</Cta>
                  <Cta href="#thesis">{isEnglish ? 'discover my approach' : 'Découvrir l’approche'}</Cta>
                </div>
              </div>
              <div className="portrait">
                <span className="small" style={{ opacity: 0.6 }}>krol — carole toukem</span>
                <img
                  src="https://res.cloudinary.com/franklinrw/image/upload/v1795100454/357194710_637450351667443_5415814331704702051_n_wgxiu1.jpg"
                  alt="Carole Toukem"
                  style={{ width: '100%', height: '26rem', objectFit: 'cover', display: 'block', border: '1px solid var(--line)' }}
                />
              </div>
            </div>
          </section>

          <section id="thesis">
            <div className="head"><p className="label">{isEnglish ? 'my' : 'mon'}</p><h2>{isEnglish ? 'approach' : 'approche'}<span className="dot d-bounce">.</span></h2></div>
            <div className="split" style={{ borderBottom: '1px solid var(--line)' }}>
              <div>
                <p className="lead">{isEnglish
                  ? 'Move from a default future to an intentionally designed future. Every coaching engagement starts with a solid mindset foundation, because lasting transformation grows from the inside out.'
                  : 'Passe d’un futur par défaut à un futur intentionnellement designé. Tout accompagnement commence par une base solide autour de l’état d’esprit : une transformation durable avance de l’intérieur vers l’extérieur.'}</p>
                <Cta href="#accompagnements">{isEnglish ? 'discover the pillars' : 'Découvrir les piliers'}</Cta>
              </div>
              <div style={{ padding: 0, alignItems: 'stretch', gap: 0 }}>
                {[
                  isEnglish
                    ? ['clarity & life vision', 'leave the fog / define a direction']
                    : ['clarté & vision de vie', 'sortir du brouillard / définir une direction'],
                  isEnglish
                    ? ['identity', 'who am I? / reconnect with purpose']
                    : ['identité', 'qui suis-je ? / reconnecter avec son but'],
                  isEnglish
                    ? ['productivity & action', 'top 3 / goals / habits']
                    : ['productivité & passage à l’action', 'top 3 / objectifs / habitudes'],
                ].map(([title, detail], index) => (
                  <div className="row slim" style={{ gridTemplateColumns: '3rem 1fr', borderBottom: index < 2 ? '1px solid var(--line)' : 0 }} key={title}>
                    <span className="n">0{index + 1}</span>
                    <div style={{ padding: '1rem' }}><h3 style={{ fontSize: '1.5rem' }}>{title}</h3><p className="small" style={{ opacity: 0.7, marginTop: '.5rem' }}>{detail}</p></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="accompagnements">
            <div className="head"><p className="label">{isEnglish ? 'my' : 'mes'}</p><h2>{isEnglish ? 'coaching' : 'accompagnements'}<span className="dot d-pulse">.</span></h2></div>
            {accompagnements.map(([name, description, href], index) => (
              <a className="row portfolio-row" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer noopener' : undefined} key={name}>
                <span className="n">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="portfolio-name">{name}</h3>
                <p className="d">{description}</p>
              </a>
            ))}
            <a className="mqw" href="#pitch" aria-label="réserver un appel découverte">
              <div className="mq" aria-hidden="true">
                {Array.from({ length: 12 }, (_, index) => <span key={index}>réserver un appel<b>/</b></span>)}
              </div>
            </a>
          </section>

          <section id="ebook">
            <div className="head">
              <p className="label">{isEnglish ? 'free resource' : 'ressource gratuite'}</p>
              <h2>{isEnglish ? 'free ebook' : 'ebook gratuit'}<span className="dot d-pulse">.</span></h2>
            </div>
            <div className="split" style={{ borderBottom: '1px solid var(--line)' }}>
              <div style={{ minWidth: 0 }}>
                <p className="label">{isEnglish ? 'FREE EBOOK TO DOWNLOAD' : 'EBOOK GRATUIT À TÉLÉCHARGER'}</p>
                <h3 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', marginTop: '1.25rem' }}>
                  {isEnglish ? 'EMPLOYEE & ENTREPRENEUR!' : 'SALARIÉ(E) & ENTREPRENEUR(E)!'}
                </h3>
                <p className="lead" style={{ marginTop: '1.25rem' }}>
                  {isEnglish
                    ? '5 golden rules for developing your personal projects or business alongside your job.'
                    : '5 règles d’or pour développer tes projets personnels ou ton activité à côté de ton emploi.'}
                </p>
                <Cta href={bookCoverUrl}>
                  {isEnglish ? 'take a look' : 'voir l’e-book'}
                </Cta>
              </div>
              <div style={{ padding: 0, alignItems: 'stretch', gap: 0 }}>
                <img
                  src={bookCoverUrl}
                  alt={isEnglish ? 'Employee and entrepreneur e-book cover' : 'Couverture de l’e-book Salarié(e) & Entrepreneur(e)'}
                  style={{ width: '100%', height: '100%', minHeight: '26rem', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
            <article className="row slim">
              <span className="n">01</span>
              <h3>{isEnglish ? 'What you will learn' : 'Ce que tu vas apprendre'}</h3>
              <ul className="d" style={{ display: 'grid', gap: '.55rem' }}>
                <li>{isEnglish ? 'Why it feels difficult to develop projects alongside your job.' : 'Pourquoi il est difficile de développer tes projets à côté de ton emploi.'}</li>
                <li>{isEnglish ? 'How to start or grow an activity close to your heart.' : 'Comment démarrer ou développer une activité qui te tient à cœur.'}</li>
                <li>{isEnglish ? 'A bonus secret for staying consistent even when it is difficult.' : 'Le bonus secret pour persévérer et rester constant, même dans les moments difficiles.'}</li>
              </ul>
            </article>
            <div className="split" style={{ borderBottom: '1px solid var(--line)' }}>
              <div>
                <p className="small">VISION — PLANNING — ACTION</p>
                <blockquote className="lead" style={{ marginTop: '1.25rem', fontSize: 'clamp(1.8rem, 4vw, 3.5rem)' }}>
                  “{isEnglish
                    ? 'When you know why you do what you do, even the most difficult days become easier.'
                    : 'Quand tu sais pourquoi tu fais ce que tu fais, même les jours les plus difficiles deviennent plus faciles.'}”
                </blockquote>
                <p className="small" style={{ marginTop: '1rem', opacity: 0.7 }}>— {isEnglish ? 'Author unknown' : 'Auteur inconnu'} / Carole Toukem</p>
                <p className="small" style={{ marginTop: '1.5rem' }}>
                  {isEnglish ? 'Would you like a copy of the book? Send me a request.' : 'Tu souhaites recevoir un exemplaire du livre ? Envoie-moi une demande.'}
                </p>
                <Cta href="#pitch">{isEnglish ? 'request a copy' : 'demander un exemplaire'}</Cta>
              </div>
              <img
                src={quoteImageUrl}
                alt={isEnglish ? 'Carole Toukem' : 'Carole Toukem'}
                style={{ width: '100%', maxHeight: '28rem', objectFit: 'cover', display: 'block', borderLeft: '1px solid var(--line)' }}
              />
            </div>
          </section>

          <section id="insights">
            <div className="head"><p className="label">{isEnglish ? 'my' : 'mes'}</p><h2>{isEnglish ? 'resources' : 'ressources'}<span className="dot d-flip">.</span></h2></div>
            {insights.map(([title, description], index) => (
              <article className="row slim" key={title}>
                <span className="n">0{index + 1}</span><h3>{title}</h3><p className="d">{description}</p>
              </article>
            ))}
          </section>

          <section id="about">
            <div className="head"><p className="label">{isEnglish ? 'about' : 'à propos'}</p><h2>carole.</h2></div>
            <div className="split" style={{ gridTemplateColumns: '1fr' }}>
              <div style={{ borderRight: 0 }}>
                <p className="lead" style={{ maxWidth: '60ch' }}>{isEnglish
                  ? 'Originally from Cameroon and based in Germany since 2007, I earned a Master’s degree in electronic engineering and automation at Hochschule Darmstadt before building a career as a sales engineer. Between 2015 and 2018, my personal development journey helped me move from spectator to actor in my own life. I launched Krol – Accompagnatrice d’Vie in 2020 to help others move from a routine that feels empty to a life that is clear, aligned and fulfilling.'
                  : 'Originaire du Cameroun et installée en Allemagne depuis 2007, j’ai obtenu un Master en ingénierie électronique et automatisation à Hochschule Darmstadt avant d’évoluer comme ingénieure commerciale. Entre 2015 et 2018, ma démarche de développement personnel m’a permis de passer de spectatrice à actrice de ma vie. J’ai lancé Krol – Accompagnatrice d’Vie en 2020 pour accompagner celles et ceux qui veulent sortir d’une vie fade pour vivre une vie alignée, claire et passionnante.'}</p>
                <Cta href={calendlyUrl}>{isEnglish ? 'book a call' : 'réserver un appel'}</Cta>
              </div>
            </div>
            <div className="about-video">
              {videos.map((video, index) => (
                <video
                  key={video}
                  src={video}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label={isEnglish ? `Carole Toukem video ${index + 1}` : `Vidéo ${index + 1} de Carole Toukem`}
                />
              ))}
            </div>
          </section>

          <section id="pitch" style={{ borderBottom: 0 }}>
            <div className="head"><p className="label">{isEnglish ? 'book a' : 'réserver un'}</p><h2>{isEnglish ? 'call' : 'appel'}<span className="dot">?</span></h2></div>
            <div className="split" style={{ borderBottom: '1px solid var(--line)' }}>
              <div><p className="lead">{isEnglish
                ? 'Tell me what you are experiencing, what you want to achieve and where you want to go. Together, we will define the next steps.'
                : 'Parle-moi de ce que tu traverses, de ton objectif et de là où tu veux aller. Nous définirons ensemble les prochaines étapes.'}</p></div>
              <form id="pf" noValidate style={{ alignItems: 'stretch' }} onSubmit={handlePitchSubmit}>
                <div className="fg">
                  <label className="small"><span>{isEnglish ? 'Full name' : 'Prénom & nom'}</span><input name="founder" required /></label>
                  <label className="small"><span>{isEnglish ? 'Email address' : 'Adresse e-mail'}</span><input name="email" type="email" required /></label>
                  <label className="small"><span>{isEnglish ? 'Phone' : 'Téléphone'}</span><input name="phone" /></label>
                  <label className="small"><span>{isEnglish ? 'What you are looking for' : 'Ce que tu recherches'}</span><select name="sector">{isEnglish
                    ? <><option>Clarity & vision</option><option>Identity & confidence</option><option>Productivity</option><option>Workshop or talk</option></>
                    : <><option>Clarté & vision</option><option>Identité & confiance</option><option>Productivité</option><option>Atelier ou conférence</option></>}</select></label>
                  <label className="small"><span>{isEnglish ? 'Preferred language' : 'Langue préférée'}</span><select name="stage"><option>{isEnglish ? 'English' : 'Français'}</option><option>{isEnglish ? 'French' : 'Allemand'}</option><option>{isEnglish ? 'German' : 'Anglais'}</option></select></label>
                  <label className="small"><span>{isEnglish ? 'Availability' : 'Disponibilité'}</span><input name="availability" /></label>
                </div>
                <label className="small"><span>{isEnglish ? 'What you would like to transform or request' : 'Ce que tu aimerais transformer ou demander'}</span><textarea name="summary" rows="3" required placeholder={isEnglish ? 'You can also ask for a copy of the book.' : 'Tu peux aussi demander un exemplaire du livre.'} /></label>
                <div className="row-act">
                  <button type="submit" className="cta"><b>{isEnglish ? 'send my request' : 'envoyer ma demande'}</b><em aria-hidden="true">{isEnglish ? 'send my request' : 'envoyer ma demande'}</em></button>
                  <p id="ps" key={statusVersion} className={`small${pitchStatus ? ' pop' : ''}`} style={{ opacity: 0.75 }} role="status" aria-live="polite">{pitchStatus}</p>
                </div>
              </form>
            </div>
          </section>

          <section id="contact" style={{ borderBottom: 0 }}>
            <div className="head" style={{ borderTop: 0 }}><p className="label">{isEnglish ? 'stay in' : 'reste en'}</p><h2>contact<span className="dot d-tilt">.</span></h2></div>
            <div className="split" style={{ borderBottom: '1px solid var(--line)' }}>
              <div><p className="lead">{isEnglish
                ? 'Does this resonate with you? Book a discovery call to discuss your situation, aspirations and the path that fits you.'
                : 'Tu te reconnais dans cette démarche ? Réserve un appel découverte pour parler de ta situation, de tes aspirations et du chemin qui te correspond.'}</p><Cta href={calendlyUrl}>{isEnglish ? 'book a discovery call' : 'réserver un appel'}</Cta></div>
              <div className="ph" aria-label="Accompagnement" style={{ minHeight: 200, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                <div style={{ padding: '1.5rem', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200 }}>
                  <span className="small">01 / Mindset</span><strong style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', letterSpacing: '-.06em', lineHeight: 1 }}>Clarté<br />&amp; identité</strong>
                </div>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200 }}>
                  <span className="small">02 / Passage à l’action</span><strong style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', letterSpacing: '-.06em', lineHeight: 1 }}>Vision<br />&amp; productivité</strong>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer>
        <nav aria-label="Footer"><a href="#about">{isEnglish ? 'about' : 'à propos'}</a><a href="#accompagnements">{isEnglish ? 'coaching' : 'accompagnements'}</a><a href="#ebook">{isEnglish ? 'free ebook' : 'ebook gratuit'}</a><a href="#contact">contact</a></nav>
        <div className="foot">
          <ul><li className="small" style={{ opacity: 0.75 }}>{isEnglish ? 'elsewhere' : 'ailleurs'}</li><li><a href="#about">{isEnglish ? 'About' : 'À propos'} →</a></li><li><a href="#accompagnements">{isEnglish ? 'Coaching' : 'Accompagnements'} →</a></li><li><a href={calendlyUrl} target="_blank" rel="noreferrer noopener">{isEnglish ? 'Book a call' : 'Réserver un appel'} →</a></li></ul>
          <div><p className="small">colophon</p><p className="small" style={{ marginTop: '1rem' }}>© 2026 Carole Toukem. {isEnglish ? 'All rights reserved.' : 'Tous droits réservés.'}</p><p className="small" style={{ marginTop: '.5rem' }}>Krol – Accompagnatrice d’Vie.</p></div>
        </div>
        <p className="big" aria-hidden="true">carole.</p>
      </footer>
    </>
  );
}

export default App;
