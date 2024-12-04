// Defineeri majutusInfo globaalselt
const majutusInfo = {
    villa: { hind: 120, maxInimesi: 6, maxArv: 1 },
    kapteni: { hind: 100, maxInimesi: 5, maxArv: 1 },
    jarve: { hind: 80, maxInimesi: 4, maxArv: 4 },
    ranna: { hind: 50, maxInimesi: 2, maxArv: 2 }
};

document.addEventListener('DOMContentLoaded', function() {
    // Kontrolli URL parameetreid
    const urlParams = new URLSearchParams(window.location.search);
    const majaTyyp = urlParams.get('maja');
    
    // Kui URL-is on maja tüüp määratud, vali see automaatselt
    if (majaTyyp && document.getElementById(majaTyyp)) {
        document.getElementById(majaTyyp).value = "1";
        // Arvuta kohe uued väärtused
        arvutaMaxInimesed();
        arvutaKoguHind();
    }

    // Seadista kuupäevade minimaalsed väärtused
    const tana = new Date().toISOString().split('T')[0];
    document.getElementById('saabumis_kuupaev').min = tana;
    document.getElementById('lahkumis_kuupaev').min = tana;

    // Lisa sündmuste kuularid kõigile select elementidele
    document.querySelectorAll('.majutus-select').forEach(select => {
        select.addEventListener('change', () => {
            arvutaMaxInimesed();
            arvutaKoguHind();
        });
    });

    // Lisa kuularid kuupäevadele
    document.getElementById('saabumis_kuupaev').addEventListener('change', arvutaKoguHind);
    document.getElementById('lahkumis_kuupaev').addEventListener('change', arvutaKoguHind);
    
    // Lisa kuular inimeste arvule
    document.getElementById('inimeste_arv').addEventListener('change', kontrolliInimesteArvu);
});

function arvutaMaxInimesed() {
    let maxInimesi = 0;
    
    // Arvuta iga valitud majutuse maksimaalne mahutavus
    Object.keys(majutusInfo).forEach(majutus => {
        const valitudArv = parseInt(document.getElementById(majutus).value);
        maxInimesi += majutusInfo[majutus].maxInimesi * valitudArv;
    });
    
    document.getElementById('maxInimesi').textContent = maxInimesi;
    
    // Uuenda inimeste arvu sisendi maksimumi
    const inimesteArvInput = document.getElementById('inimeste_arv');
    inimesteArvInput.max = maxInimesi;
    
    return maxInimesi;
}

function arvutaKoguHind() {
    const saabumis_kuupaev = new Date(document.getElementById('saabumis_kuupaev').value);
    const lahkumis_kuupaev = new Date(document.getElementById('lahkumis_kuupaev').value);
    
    if (!isNaN(saabumis_kuupaev) && !isNaN(lahkumis_kuupaev)) {
        const oodeArv = Math.ceil((lahkumis_kuupaev - saabumis_kuupaev) / (1000 * 60 * 60 * 24));
        
        if (oodeArv > 0) {
            let koguHind = 0;
            
            // Arvuta iga valitud majutuse hind
            Object.keys(majutusInfo).forEach(majutus => {
                const valitudArv = parseInt(document.getElementById(majutus).value);
                koguHind += majutusInfo[majutus].hind * valitudArv * oodeArv;
            });
            
            document.getElementById('koguHind').textContent = `${koguHind}€`;
        }
    }
}

function kontrolliInimesteArvu() {
    const inimesteArv = parseInt(document.getElementById('inimeste_arv').value);
    const maxInimesi = arvutaMaxInimesed();
    
    if (inimesteArv > maxInimesi) {
        naitaHoiatus(`Valitud majutused mahutavad maksimaalselt ${maxInimesi} inimest!`);
        document.getElementById('inimeste_arv').value = maxInimesi;
    }
}

function naitaHoiatus(tekst) {
    let hoiatus = document.querySelector('.hoiatus');
    if (!hoiatus) {
        hoiatus = document.createElement('div');
        hoiatus.className = 'hoiatus';
        document.getElementById('inimeste_arv').parentNode.appendChild(hoiatus);
    }
    hoiatus.textContent = tekst;
    hoiatus.classList.add('naita');
    
    setTimeout(() => {
        hoiatus.classList.remove('naita');
    }, 5000);
}

function saidaBroneering(event) {
    event.preventDefault();
    
    // Kontrolli, kas vähemalt üks majutus on valitud
    const onValitudMajutus = Object.keys(majutusInfo).some(majutus => 
        parseInt(document.getElementById(majutus).value) > 0
    );
    
    if (!onValitudMajutus) {
        naitaTeade('Palun valige vähemalt üks majutus!', 'viga');
        return false;
    }

    // Kontrolli kuupäevi
    const saabumis_kuupaev = new Date(document.getElementById('saabumis_kuupaev').value);
    const lahkumis_kuupaev = new Date(document.getElementById('lahkumis_kuupaev').value);
    
    if (saabumis_kuupaev >= lahkumis_kuupaev) {
        naitaTeade('Lahkumise kuupäev peab olema hilisem kui saabumise kuupäev!', 'viga');
        return false;
    }

    // Kontrolli inimeste arvu
    const inimesteArv = parseInt(document.getElementById('inimeste_arv').value);
    const maxInimesi = arvutaMaxInimesed();
    
    if (inimesteArv > maxInimesi) {
        naitaTeade(`Valitud majutused mahutavad maksimaalselt ${maxInimesi} inimest!`, 'viga');
        return false;
    }

    // Näita eduteadet
    naitaTeade('Broneering on edukalt saadetud! Võtame teiega peagi ühendust.', 'edukas');
    
    // Tühjenda vorm
    document.getElementById('broneerimisVorm').reset();
    
    // Suuna tagasi avalehele 3 sekundi pärast
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}

function naitaTeade(tekst, tyyp) {
    const teade = document.createElement('div');
    teade.className = `teade teade-${tyyp}`;
    teade.textContent = tekst;
    
    document.body.appendChild(teade);
    
    // Eemalda teade pärast 5 sekundit
    setTimeout(() => {
        teade.remove();
    }, 5000);
}