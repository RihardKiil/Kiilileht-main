document.addEventListener('DOMContentLoaded', function() {
    // Vormi valideerimise seadistamine
    const vorm = document.getElementById('kontaktVorm');
    const telefonInput = document.getElementById('telefon');
    
    // Telefoni valideerimise funktsioon
    function valideeriTelefon(telefon) {
        const telefonRegex = /^(\+372|372)?\s*[5,8][0-9]{7}$|^[5,8][0-9]{7}$/;
        return telefonRegex.test(telefon.replace(/\s/g, ''));
    }
    
    // Lisa telefoni sisendi jälgimine
    if (telefonInput) {
        telefonInput.addEventListener('input', function() {
            if (this.value && !valideeriTelefon(this.value)) {
                this.setCustomValidity('Palun sisesta korrektne Eesti mobiilinumber');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});

function saidaSonum(event) {
    event.preventDefault();
    
    // Kogu vormi andmed
    const nimi = document.getElementById('nimi').value;
    const email = document.getElementById('email').value;
    const telefon = document.getElementById('telefon').value;
    const teema = document.getElementById('teema').value;
    const sonum = document.getElementById('sonum').value;

    // Valideeri e-post
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        naitaTeade('Palun sisesta korrektne e-posti aadress', 'viga');
        return false;
    }

    // Valideeri telefon kui see on sisestatud
    if (telefon) {
        const telefonRegex = /^(\+372|372)?\s*[5,8][0-9]{7}$|^[5,8][0-9]{7}$/;
        if (!telefonRegex.test(telefon.replace(/\s/g, ''))) {
            naitaTeade('Palun sisesta korrektne Eesti mobiilinumber', 'viga');
            return false;
        }
    }

    // Näita eduteadet
    naitaTeade('Sõnum on edukalt saadetud! Võtame teiega peagi ühendust.', 'edukas');
    
    // Tühjenda vorm
    document.getElementById('kontaktVorm').reset();
    
    return false;
}

function naitaTeade(tekst, tyyp) {
    // Eemalda vanad teated
    const vanadTeated = document.querySelectorAll('.teade');
    vanadTeated.forEach(teade => teade.remove());
    
    // Loo uus teade
    const teade = document.createElement('div');
    teade.className = `teade teade-${tyyp}`;
    teade.textContent = tekst;
    
    // Lisa teade lehele
    document.body.appendChild(teade);
    
    // Lisa animatsioon
    setTimeout(() => {
        teade.classList.add('naita');
    }, 100);
    
    // Eemalda teade pärast 5 sekundit
    setTimeout(() => {
        teade.classList.remove('naita');
        setTimeout(() => {
            teade.remove();
        }, 300);
    }, 5000);
}

// Lisa kaardi interaktiivsus
document.addEventListener('DOMContentLoaded', function() {
    const kaart = document.querySelector('.kaart-konteiner iframe');
    if (kaart) {
        kaart.addEventListener('click', function() {
            this.style.pointerEvents = 'auto';
        });
        
        kaart.addEventListener('mouseleave', function() {
            this.style.pointerEvents = 'none';
        });
    }
});