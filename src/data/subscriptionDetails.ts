export interface PlanDetails {
    image: string;
    summary: string;
    validity: string;
    sessionLength: string;
    text: string[];
    program: string[];
    benefits?: string[];
    extra?: string[];
}

export const planDetails: Record<string, PlanDetails> = {
    'plan1': {
        image: "https://atlantisswim.md/wp-content/uploads/2025/08/1755791387916257-scaled.jpg",
        summary: 'Un plan clar și accesibil pentru un început liniștit și consecvent în apă.',
        validity: '1 lună',
        sessionLength: '45 minute / ședință',
        text: ['Include 4 lecții de înot pe parcursul a 4 săptămâni', 'Lecțiile sunt în grup', 'Durata: 45 minute'],
        program: ['Luni & Miercuri: 17:00, 18:00, 19:00', 'Marți & Joi: 17:00, 18:00, 19:00', 'Weekend: 10:00, 11:00, 12:00']
    },
    'plan2': {
        image: "https://atlantisswim.md/wp-content/uploads/2025/08/1755791394434546-scaled.jpg",
        summary: 'Varianta echilibrată pentru progres vizibil fără să încarci programul copilului.',
        validity: '1 lună',
        sessionLength: '45 minute / ședință',
        text: ['Include 8 lecții de înot în 4 săptămâni', 'Lecții în grup', 'Durata: 45 minute'],
        program: ['Luni & Miercuri: 17:00, 18:00, 19:00', 'Marți & Joi: 16:00, 17:00, 18:00, 19:00', 'Weekend: 10:00, 11:00, 12:00']
    },
    'plan3': {
        image: "https://atlantisswim.md/wp-content/uploads/2022/11/175560875357502-scaled.jpg",
        summary: 'Pentru familiile care vor un ritm mai intens și rezultate mai rapide într-o lună.',
        validity: '1 lună',
        sessionLength: '45 minute / ședință',
        text: ['Ideal pentru progres rapid', '12 antrenamente în 4 săptămâni', '3 ședințe pe săptămână'],
        program: ['Luni, Miercuri, Vineri: 17:00, 18:00, 19:00', 'Marți, Joi, Vineri: 17:00, 18:00, 19:00']
    },
    'plan4': {
        image: "https://atlantisswim.md/wp-content/uploads/2025/08/175560879720414-scaled.jpg",
        summary: 'Abonamentul stabil pentru continuitate, disciplină și un cost mai bun pe termen lung.',
        validity: '3 luni',
        sessionLength: '45 minute / ședință',
        text: ['24 lecții (8/lună × 3 luni)', 'Progres constant și stabil', 'Reducere 10%'],
        benefits: ['Economisești 540 lei', 'Continuitate garantată', 'Progres vizibil'],
        program: ['Luni & Miercuri: 17:00, 18:00, 19:00', 'Marți & Joi: 16:00–19:00', 'Weekend: 10:00–12:00']
    },
    'plan5': {
        image: "https://atlantisswim.md/wp-content/uploads/2025/08/1755608799148271-scaled.jpg",
        summary: 'Pachetul premium pentru familiile care urmăresc progres accelerat și rezervări sigure.',
        validity: '3 luni',
        sessionLength: '45 minute / ședință',
        text: ['36 lecții (12/lună × 3 luni)', 'Progres accelerat', 'Reducere 10%'],
        benefits: ['Economisești 720 lei', 'Rezervare garantată', 'Recomandat pentru rezultate rapide'],
        program: ['Luni, Miercuri, Vineri', 'Marți, Joi, Vineri']
    },
    'plan6': {
        image: "https://atlantisswim.md/wp-content/uploads/2025/08/175560879055773-scaled.jpg",
        summary: 'Sesiuni 1 la 1 pentru obiective clare, atenție maximă și adaptare la ritmul elevului.',
        validity: '3 săptămâni',
        sessionLength: '45 minute / ședință',
        text: ['Antrenamente 1 la 1', '5 ședințe personalizate', 'Durată: 3 săptămâni'],
        extra: ['Posibil antrenor în apă', 'Reprogramare permisă'],
        program: ['Flexibil']
    },
    'plan7': {
        image: "https://atlantisswim.md/wp-content/uploads/2025/08/1755608863802712-1-scaled.jpg",
        summary: 'Un format individual extins, potrivit pentru corecții tehnice și progres susținut.',
        validity: '5 săptămâni',
        sessionLength: '45 minute / ședință',
        text: ['10 ședințe personalizate', 'Durată: 5 săptămâni', 'Reducere 7%'],
        program: ['Flexibil']
    },
    'plan8': {
        image: "https://atlantisswim.md/wp-content/uploads/2025/09/542081340_18064308863363900_4440822476891816333_n.jpg",
        summary: 'Pachet complet cu logistică inclusă, creat pentru confort și rutină fără compromisuri.',
        validity: '1 lună',
        sessionLength: '45 minute / ședință',
        text: ['Transport inclus tur-retur', 'Antrenamente la Arena Chișinău', '8 ședințe în 4 săptămâni'],
        program: []
    },
    'plan9': {
        image: "https://atlantisswim.md/wp-content/uploads/2022/11/1755608905796779-scaled.jpg",
        summary: 'Soluția dedicată pentru Ialoveni, cu transport organizat și program simplu de urmat.',
        validity: '1 lună',
        sessionLength: '45 minute / ședință',
        text: ['Transport din Ialoveni', 'Antrenamente la Arena Chișinău', '8 ședințe în 4 săptămâni'],
        program: []
    }
};
