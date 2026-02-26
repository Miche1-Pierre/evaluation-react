/**
 * Seed script for CyberConf
 * Creates an admin user and sample conferences
 * 
 * Usage: node scripts/seed.js
 */

const API_BASE = 'http://localhost:4555';
let TOKEN = null;

async function request(path, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
        ...options.headers
    };

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} ${res.statusText}: ${text}`);
    }

    if (res.status === 204) return null;
    return res.json();
}

async function seedAdmin() {
    console.log('🔐 Creating admin user...');

    // Step 1: Create user via signup
    try {
        await request('/signup', {
            method: 'POST',
            body: JSON.stringify({
                id: 'admin',
                password: 'admin',
            }),
        });
        console.log('✅ User "admin" created');
    } catch (err) {
        if (err.message.includes('409') || err.message.includes('already exists') || err.message.includes('exist')) {
            console.log('ℹ️  User "admin" already exists');
        } else {
            console.error('❌ Failed to create user:', err.message);
            throw err;
        }
    }

    // Step 2: Login to get token
    try {
        const loginRes = await request('/login', {
            method: 'POST',
            body: JSON.stringify({
                id: 'admin',
                password: 'admin',
            }),
        });

        // The API might return { token: "..." } or just "token_string"
        TOKEN = typeof loginRes === 'string' ? loginRes : loginRes.token || loginRes.Token;
        console.log('✅ Logged in as admin, token acquired');
    } catch (err) {
        console.error('❌ Failed to login as admin:', err.message);
        throw err;
    }

    // Step 3: Try to promote to admin (try both /usertype/:id and /usertype?id=...)
    try {
        await request('/usertype/admin', {
            method: 'PATCH',
            body: JSON.stringify({
                newType: 'admin',
            }),
        });
        console.log('✅ User promoted to admin');
    } catch (err) {
        // Try with query param instead
        try {
            await request('/usertype?id=admin', {
                method: 'PATCH',
                body: JSON.stringify({
                    newType: 'admin',
                }),
            });
            console.log('✅ User promoted to admin');
        } catch (err2) {
            console.warn('⚠️  Could not promote user to admin (might already be admin):', err2.message);
        }
    }
}

async function cleanConferences() {
    console.log('\n🧹 Cleaning existing conferences...');
    try {
        const existing = await request('/conferences');
        if (existing && existing.length > 0) {
            console.log(`  Found ${existing.length} conferences to delete`);

            let removed = 0;
            for (const conf of existing) {
                try {
                    // API expects path parameter: /conference/:id with auto-generated UUID
                    await request(`/conference/${conf.id}`, { method: 'DELETE' });
                    removed++;
                } catch (err) {
                    console.warn(`  ⚠️  Failed to delete "${conf.title}":`, err.message.substring(0, 60));
                }
            }
            console.log(`✅ Removed ${removed}/${existing.length} conferences`);
        } else {
            console.log('ℹ️  No conferences to clean');
        }
    } catch (err) {
        console.warn('⚠️  Could not clean conferences:', err.message);
    }
}

async function seedConferences() {
    console.log('\n📚 Creating sample conferences...');

    const conferences = [
        {
            id: 'ai-2026',
            title: 'AI & Machine Learning Summit 2026',
            date: '2026-06-15T09:00:00Z',
            description: 'Découvrez les dernières avancées en intelligence artificielle et machine learning. Des experts mondiaux partagent leurs insights sur l\'avenir de l\'IA.',
            img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=675&fit=crop',
            content: '<p>Cette conférence phare réunit les plus grands noms de l\'IA pour explorer les innovations qui transforment notre monde. De l\'apprentissage profond aux modèles génératifs, plongez au cœur des technologies qui façonnent demain.</p><p>Au programme : deep learning, NLP, vision par ordinateur, IA éthique et bien plus encore.</p>',
            duration: '2 jours',
            osMap: {
                addressl1: '101 Avenue des Champs-Élysées',
                postalCode: '75008',
                city: 'Paris',
                coordinates: [48.8698, 2.3078],
            },
            speakers: [
                { firstname: 'Sophie', lastname: 'Chen' },
                { firstname: 'Marcus', lastname: 'Rodriguez' },
                { firstname: 'Aisha', lastname: 'Patel' },
            ],
            stakeholders: [
                { firstname: 'OpenAI', lastname: 'Team', job: 'Sponsor Gold' },
                { firstname: 'Google', lastname: 'Research', job: 'Sponsor Platinum' },
            ],
            design: {
                mainColor: '#6366f1',
                secondColor: '#818cf8',
            },
        },
        {
            id: 'web3-summit',
            title: 'Web3 & Blockchain Summit',
            date: '2026-07-20T10:00:00Z',
            description: 'La révolution Web3 est en marche. Rejoignez-nous pour explorer la décentralisation, les smart contracts, et l\'avenir d\'Internet.',
            img: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&h=675&fit=crop',
            content: '<p>Le Web3 redéfinit notre rapport à Internet. Cette conférence explore les technologies blockchain, DeFi, NFTs et DAOs qui transforment l\'économie numérique.</p>',
            duration: '1 jour',
            osMap: {
                addressl1: 'Station F',
                addressl2: '5 Parvis Alan Turing',
                postalCode: '75013',
                city: 'Paris',
                coordinates: [48.8338, 2.3724],
            },
            speakers: [
                { firstname: 'Vitalik', lastname: 'Buterin' },
                { firstname: 'Gavin', lastname: 'Wood' },
            ],
            stakeholders: [
                { firstname: 'Ethereum', lastname: 'Foundation', job: 'Partenaire principal' },
            ],
            design: {
                mainColor: '#8b5cf6',
                secondColor: '#a78bfa',
            },
        },
        {
            id: 'cybersec-2026',
            title: 'CyberSecurity World Conference',
            date: '2026-08-10T08:30:00Z',
            description: 'La sécurité informatique au cœur des enjeux actuels. Experts, white hats et chercheurs se réunissent pour partager leurs connaissances.',
            img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=675&fit=crop',
            content: '<p>Face à l\'augmentation des cybermenaces, cette conférence offre un panorama complet des stratégies de défense modernes. Pentest, threat hunting, incident response : tous les aspects de la cybersécurité sont couverts.</p>',
            duration: '3 jours',
            osMap: {
                addressl1: 'Palais des Congrès',
                addressl2: '2 Place de la Porte Maillot',
                postalCode: '75017',
                city: 'Paris',
                coordinates: [48.8786, 2.2834],
            },
            speakers: [
                { firstname: 'Kevin', lastname: 'Mitnick' },
                { firstname: 'Mikko', lastname: 'Hyppönen' },
                { firstname: 'Bruce', lastname: 'Schneier' },
            ],
            stakeholders: [
                { firstname: 'CrowdStrike', lastname: 'Team', job: 'Sponsor' },
                { firstname: 'Kaspersky', lastname: 'Lab', job: 'Sponsor' },
            ],
            design: {
                mainColor: '#ef4444',
                secondColor: '#f87171',
            },
        },
        {
            id: 'devops-days',
            title: 'DevOps Days France 2026',
            date: '2026-09-05T09:00:00Z',
            description: 'Culture DevOps, CI/CD, Infrastructure as Code : tout ce qu\'il faut savoir pour accélérer vos déploiements et améliorer la collaboration.',
            img: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&h=675&fit=crop',
            content: '<p>Le DevOps n\'est pas qu\'une méthodologie, c\'est une culture. Découvrez comment Docker, Kubernetes, Terraform et GitOps transforment le cycle de vie logiciel.</p>',
            duration: '2 jours',
            osMap: {
                addressl1: 'La Défense',
                postalCode: '92800',
                city: 'Puteaux',
                coordinates: [48.8925, 2.2381],
            },
            speakers: [
                { firstname: 'Kelsey', lastname: 'Hightower' },
                { firstname: 'Jessie', lastname: 'Frazelle' },
            ],
            stakeholders: [
                { firstname: 'HashiCorp', lastname: 'Inc', job: 'Sponsor' },
                { firstname: 'GitLab', lastname: 'Team', job: 'Partenaire' },
            ],
            design: {
                mainColor: '#10b981',
                secondColor: '#34d399',
            },
        },
        {
            id: 'react-conf-eu',
            title: 'React Conf Europe',
            date: '2026-10-12T10:00:00Z',
            description: 'La conférence européenne dédiée à React et son écosystème. Next.js, React Server Components, et les dernières innovations du framework.',
            img: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=675&fit=crop',
            content: '<p>React continue d\'évoluer. Server Components, Suspense, Concurrent Mode : découvrez comment construire des applications web performantes et modernes.</p>',
            duration: '2 jours',
            osMap: {
                addressl1: 'Le Cargo',
                addressl2: '1 bis Avenue Lucien Corbeaux',
                postalCode: '93500',
                city: 'Pantin',
                coordinates: [48.8951, 2.4042],
            },
            speakers: [
                { firstname: 'Dan', lastname: 'Abramov' },
                { firstname: 'Sophie', lastname: 'Alpert' },
                { firstname: 'Kent', lastname: 'C. Dodds' },
            ],
            stakeholders: [
                { firstname: 'Vercel', lastname: 'Inc', job: 'Sponsor Platinum' },
                { firstname: 'Meta', lastname: 'Team', job: 'Sponsor Gold' },
            ],
            design: {
                mainColor: '#06b6d4',
                secondColor: '#22d3ee',
            },
        },
        {
            id: 'cloud-native',
            title: 'Cloud Native Summit',
            date: '2026-11-08T09:00:00Z',
            description: 'Kubernetes, serverless, microservices : plongez dans l\'univers du cloud native et des architectures modernes.',
            img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=675&fit=crop',
            content: '<p>Le cloud native transforme la manière dont nous construisons et déployons des applications. Cette conférence explore les patterns, outils et best practices de l\'écosystème CNCF.</p>',
            duration: '2 jours',
            osMap: {
                addressl1: 'Lyon Convention Centre',
                postalCode: '69003',
                city: 'Lyon',
                coordinates: [45.7640, 4.8357],
            },
            speakers: [
                { firstname: 'Priyanka', lastname: 'Sharma' },
                { firstname: 'Brendan', lastname: 'Burns' },
            ],
            stakeholders: [
                { firstname: 'CNCF', lastname: 'Foundation', job: 'Organisateur' },
                { firstname: 'AWS', lastname: 'Team', job: 'Sponsor' },
            ],
            design: {
                mainColor: '#f59e0b',
                secondColor: '#fbbf24',
            },
        },
        {
            id: 'data-science-paris',
            title: 'Data Science Paris 2026',
            date: '2026-12-01T09:30:00Z',
            description: 'Big Data, analytics, visualisation : toutes les facettes de la data science par les meilleurs experts francophones et internationaux.',
            img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop',
            content: '<p>Les données sont le nouveau pétrole. Cette conférence explore comment extraire de la valeur de vos données grâce aux techniques de machine learning, statistiques et visualisation.</p>',
            duration: '1 jour',
            osMap: {
                addressl1: 'Cité des Sciences',
                addressl2: '30 Avenue Corentin Cariou',
                postalCode: '75019',
                city: 'Paris',
                coordinates: [48.8958, 2.3875],
            },
            speakers: [
                { firstname: 'Andrew', lastname: 'Ng' },
                { firstname: 'DJ', lastname: 'Patil' },
            ],
            stakeholders: [
                { firstname: 'Databricks', lastname: 'Inc', job: 'Sponsor' },
                { firstname: 'Snowflake', lastname: 'Team', job: 'Partenaire' },
            ],
            design: {
                mainColor: '#ec4899',
                secondColor: '#f472b6',
            },
        },
        {
            id: 'mobile-dev-summit',
            title: 'Mobile Dev Summit 2026',
            date: '2027-01-15T10:00:00Z',
            description: 'iOS, Android, Flutter, React Native : l\'univers du développement mobile en une seule conférence.',
            img: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=675&fit=crop',
            content: '<p>Le mobile reste un pilier du numérique. Découvrez les dernières tendances en développement d\'applications natives et cross-platform.</p>',
            duration: '2 jours',
            osMap: {
                addressl1: 'Le 104',
                addressl2: '5 Rue Curial',
                postalCode: '75019',
                city: 'Paris',
                coordinates: [48.8905, 2.3704],
            },
            speakers: [
                { firstname: 'Tim', lastname: 'Sneath' },
                { firstname: 'Mattt', lastname: 'Thompson' },
            ],
            stakeholders: [
                { firstname: 'Google', lastname: 'Flutter', job: 'Sponsor' },
                { firstname: 'Apple', lastname: 'Developer', job: 'Partenaire' },
            ],
            design: {
                mainColor: '#14b8a6',
                secondColor: '#2dd4bf',
            },
        },
        {
            id: 'classic-animation-2026',
            title: 'Animation Classique : L\'Art du Cartoon',
            date: '2026-09-12T09:00:00Z',
            description: 'Replongez dans l\'âge d\'or de l\'animation avec les techniques qui ont fait rêver des générations.',
            img: 'https://imgs.search.brave.com/55t3Be03faPUJfdZeDhL_KhOs23uPba_fBXI6fjmJI4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnNlcnZpbWcuY29tL3UvZjU3LzE4LzIxLzU1LzE4L3doMjV3YjEwLmpwZw',
            content: '<p>Découvrez les secrets des maîtres de l\'animation classique. Des studios Warner Bros aux techniques de Chuck Jones, explorez l\'héritage des Looney Tunes et leur impact culturel.</p><p>Masterclass, ateliers pratiques et projections exclusives au programme.</p>',
            duration: '1 jour',
            osMap: {
                addressl1: 'Cinémathèque française',
                addressl2: '51 Rue de Bercy',
                postalCode: '75012',
                city: 'Paris',
                coordinates: [48.8362, 2.3839],
            },
            speakers: [
                { firstname: 'Eric', lastname: 'Goldberg' },
                { firstname: 'Andreas', lastname: 'Deja' },
            ],
            stakeholders: [
                { firstname: 'Warner Bros', lastname: 'Animation', job: 'Sponsor Principal' },
                { firstname: 'Disney', lastname: 'Studios', job: 'Partenaire' },
            ],
            design: {
                mainColor: '#f59e0b',
                secondColor: '#fbbf24',
            },
        },
        {
            id: 'vfx-animation-summit',
            title: 'VFX & Animation : la super vitesse',
            date: '2026-10-05T10:00:00Z',
            description: 'Les effets visuels et l\'animation au service des histoires les plus folles. Techniques, outils et workflows professionnels.',
            img: 'https://imgs.search.brave.com/4HBvWoJlaBT7sEQ5H-5qZ8ub4lf3wKQAJB4fWM5Au-k/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cuc2VyaWVvdXNseS5jb20vYXBwL3VwbG9hZHMvMjAyMS8wNy9iaXAtYmlwLWV0LWNveW90ZS0xLmpwZz93aWR0aD03NjgmaGVpZ2h0PTQzMiZmaXQ9Y292ZXI',
            content: '<p>Du storyboard à la post-production, maîtrisez la chaîne complète de création d\'effets visuels. Découvrez comment les studios créent ces scènes d\'action spectaculaires.</p>',
            duration: '2 jours',
            osMap: {
                addressl1: 'Studio Iconoclast',
                addressl2: '12 Rue d\'Athènes',
                postalCode: '75009',
                city: 'Paris',
                coordinates: [48.8797, 2.3283],
            },
            speakers: [
                { firstname: 'John', lastname: 'Knoll' },
                { firstname: 'Victoria', lastname: 'Alonso' },
            ],
            stakeholders: [
                { firstname: 'ILM', lastname: 'Studios', job: 'Sponsor Gold' },
                { firstname: 'Adobe', lastname: 'Creative', job: 'Partenaire Tech' },
            ],
            design: {
                mainColor: '#dc2626',
                secondColor: '#ef4444',
            },
        },
        {
            id: 'cartoon-legacy',
            title: 'Gravity Lecon',
            date: '2026-11-18T14:00:00Z',
            description: 'De Tex Avery à Chuck Jones, retracez l\'histoire des personnages iconiques qui ont marqué la culture populaire.',
            img: 'https://imgs.search.brave.com/Z-w1hOC8J52xqk7Xy3EyGKHqpk1oCY3UtgxSjcp62kM/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pLnNlcnZpbWcuY29tL3UvZjU3LzE4LzIxLzU1LzE4L2ZvbmRfZTExLmpwZw',
            content: '<p>Plongez dans l\'univers des cartoons qui ont façonné l\'animation américaine. Analyse culturelle, techniques narratives et impact sociétal de ces œuvres intemporelles.</p>',
            duration: '1 jour',
            osMap: {
                addressl1: 'Musée de la BD',
                addressl2: '16 Rue de la Banque',
                postalCode: '75002',
                city: 'Paris',
                coordinates: [48.8682, 2.3395],
            },
            speakers: [
                { firstname: 'Leonard', lastname: 'Maltin' },
                { firstname: 'Jerry', lastname: 'Beck' },
            ],
            stakeholders: [
                { firstname: 'Cartoon Network', lastname: 'Studios', job: 'Sponsor' },
                { firstname: 'Nickelodeon', lastname: 'Animation', job: 'Partenaire' },
            ],
            design: {
                mainColor: '#0ea5e9',
                secondColor: '#38bdf8',
            },
        },
        {
            id: 'modern-animation-prod',
            title: 'Les chutes',
            date: '2026-12-08T09:30:00Z',
            description: 'Workflows, pipelines et outils pour produire de l\'animation de qualité studio. Du concept art au rendering final.',
            img: 'https://imgs.search.brave.com/DBnmju8tsp1Rd2SjKIWYmcUJ2pjM0RpbXMH8EQn7Cxo/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cuZWNyYW5sYXJnZS5jb20vY29udGVudC91cGxvYWRzLzIwMTgvMDgvbG9vbmV5LXR1bmVzLXBhc3NlbnQtYS1sLWFjdGlvbi1sZXMtcGhvdG8td2lsbC1lLWNveW90ZS0xMDMyOTMxLTMyMHgxNzAuanBn',
            content: '<p>Maîtrisez les outils professionnels : Maya, Blender, Houdini, Unreal Engine. Découvrez les workflows des plus grands studios d\'animation 3D.</p>',
            duration: '3 jours',
            osMap: {
                addressl1: 'Gobelins Paris',
                addressl2: '73 Boulevard Saint-Marcel',
                postalCode: '75013',
                city: 'Paris',
                coordinates: [48.8378, 2.3592],
            },
            speakers: [
                { firstname: 'Pete', lastname: 'Docter' },
                { firstname: 'Jennifer', lastname: 'Lee' },
            ],
            stakeholders: [
                { firstname: 'Pixar', lastname: 'Animation', job: 'Sponsor Platinum' },
                { firstname: 'DreamWorks', lastname: 'Animation', job: 'Sponsor Gold' },
            ],
            design: {
                mainColor: '#8b5cf6',
                secondColor: '#a78bfa',
            },
        },
        {
            id: 'storytelling-animation',
            title: 'Lecon de voltige',
            date: '2027-02-22T10:00:00Z',
            description: 'Comment raconter des histoires mémorables à travers l\'animation. Structure narrative, arcs émotionnels et timing.',
            img: 'https://imgs.search.brave.com/2rO6q_VLMu5KPPvSDmxlbVwkNlkQinayqbA83Fi3njM/rs:fit:0:180:1:0/g:ce/aHR0cHM6Ly93d3cuZWNyYW5sYXJnZS5jb20vY29udGVudC91cGxvYWRzLzIwMTgvMDgvbG9vbmV5LXR1bmVzLXBhc3NlbnQtYS1sLWFjdGlvbi1sZXMtcGhvdG8td2lsbC1lLWNveW90ZS0xMDMyOTI5LTMyMHgxNzAuanBn',
            content: '<p>Le storytelling est au cœur de toute grande animation. Apprenez des maîtres comment construire des personnages attachants et des histoires qui résonnent avec le public.</p>',
            duration: '2 jours',
            osMap: {
                addressl1: 'Forum des Images',
                addressl2: '2 Rue du Cinéma',
                postalCode: '75001',
                city: 'Paris',
                coordinates: [48.8619, 2.3421],
            },
            speakers: [
                { firstname: 'Brad', lastname: 'Bird' },
                { firstname: 'John', lastname: 'Lasseter' },
            ],
            stakeholders: [
                { firstname: 'Netflix', lastname: 'Animation', job: 'Sponsor' },
                { firstname: 'Sony Pictures', lastname: 'Animation', job: 'Partenaire' },
            ],
            design: {
                mainColor: '#10b981',
                secondColor: '#34d399',
            },
        },
    ];

    let created = 0;
    let skipped = 0;

    for (const conf of conferences) {
        try {
            await request('/conference', {
                method: 'POST',
                body: JSON.stringify(conf),
            });
            console.log(`✅ Created: ${conf.title}`);
            created++;
        } catch (err) {
            if (err.message.includes('409') || err.message.includes('already exists')) {
                console.log(`ℹ️  Skipped (exists): ${conf.title}`);
                skipped++;
            } else {
                console.error(`❌ Failed to create "${conf.title}":`, err.message);
            }
        }
    }

    console.log(`\n📊 Summary: ${created} created, ${skipped} skipped`);
}

async function main() {
    console.log('🌱 Starting seed script...\n');

    try {
        await seedAdmin();
        await cleanConferences();
        await seedConferences();
        console.log('\n✨ Seed completed successfully!');
        console.log('\n💡 You can now login with:');
        console.log('   Username: admin');
        console.log('   Password: admin\n');
    } catch (err) {
        console.error('\n❌ Seed failed:', err);
        process.exit(1);
    }
}

main();
