// Pildi vahetamise funktsionaalsus
function vahetaPilt(src) {
    const peaminePilt = document.querySelector('.peamine-pilt');
    // Lisa üleminek
    peaminePilt.style.opacity = '0';
    
    setTimeout(() => {
        peaminePilt.src = src;
        peaminePilt.style.opacity = '1';
    }, 300);
}

// Lisa aktiivsete pisipiltide jälgimine
document.addEventListener('DOMContentLoaded', function() {
    const pisipildid = document.querySelectorAll('.pisipildid img');
    
    pisipildid.forEach(pilt => {
        pilt.addEventListener('click', function() {
            // Eemalda aktiivne klass kõigilt piltidelt
            pisipildid.forEach(p => p.classList.remove('aktiivne'));
            // Lisa aktiivne klass klikitud pildile
            this.classList.add('aktiivne');
        });
    });

    // Lisa klaviatuuri tugi galerii jaoks
    document.addEventListener('keydown', function(e) {
        const aktivnePilt = document.querySelector('.pisipildid img.aktiivne') || pisipildid[0];
        let jargminePilt;

        if (e.key === 'ArrowRight') {
            jargminePilt = aktivnePilt.nextElementSibling || pisipildid[0];
            vahetaPilt(jargminePilt.src);
            aktivnePilt.classList.remove('aktiivne');
            jargminePilt.classList.add('aktiivne');
        } else if (e.key === 'ArrowLeft') {
            jargminePilt = aktivnePilt.previousElementSibling || pisipildid[pisipildid.length - 1];
            vahetaPilt(jargminePilt.src);
            aktivnePilt.classList.remove('aktiivne');
            jargminePilt.classList.add('aktiivne');
        }
    });

    // Lisa puutetundlikkus mobiilseadmetele
    let touchstartX = 0;
    let touchendX = 0;
    
    const peaminePilt = document.querySelector('.peamine-pilt');
    
    peaminePilt.addEventListener('touchstart', e => {
        touchstartX = e.changedTouches[0].screenX;
    });

    peaminePilt.addEventListener('touchend', e => {
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const aktivnePilt = document.querySelector('.pisipildid img.aktiivne') || pisipildid[0];
        let jargminePilt;

        if (touchendX < touchstartX) {
            // Swipe vasakule
            jargminePilt = aktivnePilt.nextElementSibling || pisipildid[0];
        }
        if (touchendX > touchstartX) {
            // Swipe paremale
            jargminePilt = aktivnePilt.previousElementSibling || pisipildid[pisipildid.length - 1];
        }

        if (jargminePilt) {
            vahetaPilt(jargminePilt.src);
            aktivnePilt.classList.remove('aktiivne');
            jargminePilt.classList.add('aktiivne');
        }
    }
});