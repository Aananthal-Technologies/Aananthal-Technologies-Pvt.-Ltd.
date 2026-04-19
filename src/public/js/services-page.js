// ─── Scroll Reveal ────────────────────────────────────────
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in');
            entry.target.querySelectorAll('.service-card-item').forEach((card, i) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
                setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'none'; }, 50 + i * 80);
            });
            entry.target.querySelectorAll('.process-timeline-item').forEach((item, i) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
                setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'none'; }, 50 + i * 70);
            });
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ─── Service Modal Data ───────────────────────────────────
const serviceData = {
    '01': { icon: 'folder_open', num: '01', title: 'Requirements Engineering', tagline: 'Know before you build.', desc: 'We conduct in-depth stakeholder workshops, workflow analysis, and competitive landscape reviews to translate your business vision into an actionable technical blueprint. Great software begins with great understanding — we make sure nothing is lost in translation between what you need and what gets built.', deliverables: ['Business Requirements Document (BRD)', 'Technical Specification (TSD)', 'User Stories & Acceptance Criteria', 'System Architecture Proposal', 'Risk Assessment Report'], timeline: '1–2 weeks', cta: 'Start Discovery' },
    '02': { icon: 'precision_manufacturing', num: '02', title: 'Solution Development', tagline: 'Full-cycle engineering from zero to production.', desc: "Our engineers own the entire build — from system architecture and database design to frontend interfaces and hardware firmware. We don't hand off to subcontractors. The same team that designs your system builds and ships it, ensuring deep accountability and zero context loss at every layer.", deliverables: ['Production-ready codebase (fully documented)', 'API design & documentation', 'CI/CD pipeline setup', 'Deployment scripts & environment configs', 'Code review reports & quality audits'], timeline: '4–16 weeks (scope dependent)', cta: 'Get a Quote' },
    '03': { icon: 'swap_horiz', num: '03', title: 'API & System Integration', tagline: 'Connect everything. Break nothing.', desc: 'Modern systems are complex webs of services, sensors, and platforms. We specialise in making these components communicate reliably — integrating AI models, IoT device fleets, third-party APIs, cloud platforms, and legacy enterprise systems into unified, observable, and resilient pipelines.', deliverables: ['Integration architecture diagram', 'API gateway configuration', 'Automated integration test suite', 'Monitoring & alerting dashboard', 'Runbook for ongoing operations'], timeline: '2–6 weeks', cta: 'Discuss Integration' },
    '04': { icon: 'verified', num: '04', title: 'Quality Assurance', tagline: 'Ship with confidence, every time.', desc: 'We implement multi-layer QA that mirrors real-world usage scenarios — not just unit tests. Our QA practice covers functional correctness, performance under load, security surface review, and accessibility. Every release passes through our rigorous gate before it touches your users.', deliverables: ['QA test plan & test cases', 'Automated regression test suite', 'Performance & load testing report', 'Security scan summary', 'Bug tracker with severity classification'], timeline: 'Ongoing (embedded in dev cycle)', cta: 'Improve Quality' },
    '05': { icon: 'bolt', num: '05', title: 'VFD & Automation', tagline: 'Industrial intelligence, precision-engineered.', desc: 'Our embedded and hardware engineers deliver specialised automation solutions for manufacturing and industrial clients. We design, configure, and deploy Variable Frequency Drive systems that reduce energy consumption, extend motor life, and enable predictive maintenance through real-time AI-driven monitoring.', deliverables: ['Hardware specification & BOM', 'VFD control software', 'Energy efficiency audit report', 'Remote monitoring dashboard', 'Maintenance documentation & SOP'], timeline: '3–8 weeks', cta: 'Automate Your Plant' },
    '06': { icon: 'support_agent', num: '06', title: 'Operational Support', tagline: 'We stay with you after launch.', desc: "Deployment is not the end — it's the beginning of real-world performance. Our operational support practice provides 24/7 monitoring, proactive incident response, regular performance tuning, and feature iteration. We treat your system like it's ours, because we built it and we want it to succeed.", deliverables: ['SLA agreement with uptime guarantees', 'Live monitoring & alerting setup', 'Incident response runbook', 'Monthly performance & health reports', 'Quarterly roadmap reviews'], timeline: 'Monthly retainer', cta: 'Get Support' }
};

window.openServiceModal = function (card) {
    const d = serviceData[card.dataset.service];
    if (!d) return;
    const deliverablesList = d.deliverables.map(item =>
        `<li class="smd-deliverable-item"><span class="material-icons smd-check">check_circle</span>${item}</li>`
    ).join('');
    document.getElementById('service-modal-content').innerHTML = `
        <div class="smd-eyebrow">
            <div class="smd-icon-wrap"><span class="material-icons">${d.icon}</span></div>
            <span class="smd-num">${d.num}</span>

        </div>
        <h2 class="smd-title">${d.title}</h2>
        <p class="smd-tagline">${d.tagline}</p>
        <p class="smd-desc">${d.desc}</p>
        <div class="smd-divider"></div>
        <h4 class="smd-section-label">What You Get</h4>
        <ul class="smd-deliverables">${deliverablesList}</ul>
        <div class="smd-footer">
            <div class="smd-timeline"><span class="material-icons">schedule</span><span>${d.timeline}</span></div>
            <a href="/contact" class="smd-cta">${d.cta} <span class="material-icons">arrow_forward</span></a>
        </div>
    `;
    document.getElementById('service-modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
};

window.closeServiceModal = function (event) {
    if (event && event.target !== document.getElementById('service-modal-overlay')) return;
    document.getElementById('service-modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
};

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') window.closeServiceModal({ target: document.getElementById('service-modal-overlay') });
});

// ─── Process Modal ────────────────────────────────────────
const processData = {
    '01': { icon: 'folder_open', title: 'Discovery & Requirements', tagline: 'Know before you build.', desc: 'We run deep-dive stakeholder workshops, map out technical constraints, and define measurable success metrics. Every engagement begins here — because a solution built on unclear requirements is a solution built to fail. We leave this phase with a shared, written understanding of exactly what needs to be built and why.' },
    '02': { icon: 'architecture', title: 'Architecture & Design', tagline: 'Design for scale from day one.', desc: 'Before a line of code is written, we blueprint the system — technology stack selection, data flow diagrams, API contracts, security surface analysis, and deployment topology. This phase produces a design document that guides every build decision and prevents costly rework down the line.' },
    '03': { icon: 'code', title: 'Build & Develop', tagline: 'Iterative, accountable, fast.', desc: "Development happens in two-week sprints with working software delivered at the end of each. You see progress continuously, not just at the end. Our engineers own their modules end-to-end — there's no hand-off overhead or context loss between teams. Code is reviewed, tested, and documented in the same cycle it's written." },
    '04': { icon: 'verified', title: 'Test & QA', tagline: 'Confidence before every release.', desc: 'We run multi-layer QA that mirrors real-world usage — unit, integration, load, and security testing included. Our QA team embeds with the development team so issues are caught and fixed in the same sprint, not discovered weeks later. Every release passes a defined quality gate before it gets near your users.' },
    '05': { icon: 'cloud_upload', title: 'Deploy & Launch', tagline: 'Zero-downtime. Zero surprises.', desc: 'Our deployments are scripted, repeatable, and rehearsed before go-live. We use CI/CD pipelines, infrastructure-as-code, and blue-green deployment strategies to ensure that launch day is boring — in the best possible way. Full data migration support and a dedicated go-live team are included in every deployment.' },
    '06': { icon: 'monitoring', iconStyle: 'width: 20px;', title: 'Monitor & Optimise', tagline: 'Performance that improves over time.', desc: 'Post-launch, we instrument your system with real-time dashboards, structured logging, and alerting that catches issues before your users do. We conduct quarterly performance reviews and proactively tune configuration, query performance, and resource allocation — keeping your system at peak efficiency as load grows.' },
    '07': { icon: 'support_agent', title: 'Ongoing Support', tagline: "We stay. We don't ghost.", desc: "Our support practice is not a ticket queue — it's a partnership. We provide 24/7 incident response, proactive system health checks, and a named engineer who knows your codebase. SLA agreements are tailored to your criticality requirements, from next-business-day to sub-hour response times." },
    '08': { icon: 'autorenew', title: 'Scale & Evolve', tagline: 'Built for where you\'re going, not just where you are.', desc: 'As your business grows, your system needs to grow with it. We provide capacity planning, architectural evolution roadmaps, and hands-on scaling support — whether that means distributing a monolith, migrating to edge infrastructure, or adding new AI capabilities to an existing product. We help you scale intelligently, not reactively.' }
};

window.openProcessModal = function (item) {
    const d = processData[item.dataset.step];
    if (!d) return;
    document.getElementById('service-modal-content').innerHTML = `
        <div class="smd-eyebrow">
            <div class="smd-icon-wrap"><span class="material-icons"${d.iconStyle ? ` style="${d.iconStyle}"` : ''}>${d.icon}</span></div>
            <span class="smd-num">${item.dataset.step}</span>
        </div>
        <h2 class="smd-title">${d.title}</h2>
        <p class="smd-tagline">${d.tagline}</p>
        <p class="smd-desc">${d.desc}</p>
        <div class="smd-footer">
            <a href="/contact" class="smd-cta">Get in Touch <span class="material-icons">arrow_forward</span></a>
        </div>
    `;
    document.getElementById('service-modal-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
};
