let fireworks = []
let clicked = false
let userName = ''
let nomorWA = ''
let showModal = true
let confetti = []
let candleLightIntensity = 0
let horns = []
let shareButton
let startButton
let modalY = 0
let isDragging = false
let startY = 0
let currentY = 0

// Create a consistent ID mapping function
const generateHashedId = (originalId) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(originalId);
  // Use a deterministic approach to generate consistent hashes
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    hash = ((hash << 5) - hash) + data[i];
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `id_${Math.abs(hash).toString(16)}`;
};

// Create a mapping of original IDs to hashed IDs
const idMap = {
  modal: generateHashedId('modal'),
  inputName: generateHashedId('inputName'),
  inputPhone: generateHashedId('inputPhone'),
  modalContent: generateHashedId('modal-content')
};

const wishes = [
    "Semoga panjang umur dan sehat selalu! 🎂",
    "Wish you all the best! May all your dreams come true! 🌟",
    "Selamat ulang tahun! Semoga sukses selalu! 🎉",
    "Happy Birthday! Semoga bahagia selalu! 🎊",
    "Selamat bertambah usia! Tetap semangat! 💪"
]

let audioContext;
let birthdayAudio;

// Add these variables at the top of main.js
let isLoading = true;
let skeletonTimeout;

// Add this function to create skeleton loader
function createSkeletonLoader() {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const skeletonModal = createDiv('');
    skeletonModal.class('skeleton-modal');
    skeletonModal.style('background', 'rgba(0,0,0,0.8)');
    skeletonModal.style('position', 'fixed');
    skeletonModal.style('top', '0');
    skeletonModal.style('left', '0');
    skeletonModal.style('width', '100%');
    skeletonModal.style('height', '100%');
    skeletonModal.style('display', 'flex');
    skeletonModal.style('justify-content', 'center');
    skeletonModal.style('align-items', 'center');
    skeletonModal.style('z-index', '999');

    const skeletonContent = createDiv('');
    skeletonContent.class('skeleton-content');
    skeletonContent.style('padding', '20px');
    skeletonContent.style('border-radius', '20px');
    skeletonContent.style('text-align', 'center');
    skeletonContent.style('width', '80%');
    skeletonContent.style('max-width', '500px');
    skeletonContent.style('position', window.innerWidth <= 768 ? 'absolute' : 'relative');
    skeletonContent.style('bottom', window.innerWidth <= 768 ? '10px' : '0');
    skeletonContent.style('background-color', isDarkMode ? '#1e1e1e' : '#ffffff');

    // Create skeleton elements
    const swipeIndicator = createDiv('');
    swipeIndicator.class('skeleton-swipe');
    swipeIndicator.style('width', '40px');
    swipeIndicator.style('height', '4px');
    swipeIndicator.style('background-color', isDarkMode ? '#333' : '#ddd');
    swipeIndicator.style('border-radius', '2px');
    swipeIndicator.style('margin', '0 auto 15px auto');
    swipeIndicator.style('display', window.innerWidth <= 768 ? 'block' : 'none');

    const titleSkeleton = createDiv('');
    titleSkeleton.class('skeleton-title skeleton-animation');
    titleSkeleton.style('height', '24px');
    titleSkeleton.style('width', '60%');
    titleSkeleton.style('margin', '15px auto');
    titleSkeleton.style('background-color', isDarkMode ? '#333' : '#eee');
    titleSkeleton.style('border-radius', '4px');

    const inputSkeleton1 = createDiv('');
    inputSkeleton1.class('skeleton-input skeleton-animation');
    inputSkeleton1.style('height', '45px');
    inputSkeleton1.style('width', '80%');
    inputSkeleton1.style('margin', '10px auto');
    inputSkeleton1.style('background-color', isDarkMode ? '#333' : '#eee');
    inputSkeleton1.style('border-radius', '5px');

    const inputSkeleton2 = createDiv('');
    inputSkeleton2.class('skeleton-input skeleton-animation');
    inputSkeleton2.style('height', '45px');
    inputSkeleton2.style('width', '80%');
    inputSkeleton2.style('margin', '10px auto');
    inputSkeleton2.style('background-color', isDarkMode ? '#333' : '#eee');
    inputSkeleton2.style('border-radius', '5px');

    const buttonSkeleton = createDiv('');
    buttonSkeleton.class('skeleton-button skeleton-animation');
    buttonSkeleton.style('height', '45px');
    buttonSkeleton.style('width', '120px');
    buttonSkeleton.style('margin', '10px auto');
    buttonSkeleton.style('background-color', isDarkMode ? '#333' : '#eee');
    buttonSkeleton.style('border-radius', '5px');

    // Add skeleton elements to content
    skeletonContent.child(swipeIndicator);
    skeletonContent.child(titleSkeleton);
    skeletonContent.child(inputSkeleton1);
    skeletonContent.child(inputSkeleton2);
    skeletonContent.child(buttonSkeleton);
    skeletonModal.child(skeletonContent);

    return skeletonModal;
}

// Initialize audio properly
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        birthdayAudio = new Audio('./hbd.mp3');
        birthdayAudio.loop = true;
    }
}

// Handle page visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (birthdayAudio) birthdayAudio.pause();
    } else {
        if (clicked && birthdayAudio) birthdayAudio.play().catch(console.error);
    }
});

// Replace the existing pageshow and pagehide event listeners with:
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // Reset necessary state
        fireworks = [];
        confetti = [];
        if (clicked && birthdayAudio) {
            birthdayAudio.play().catch(console.error);
        }
    }
});
class Horn {
    constructor(x, y, isLeft) {
        this.x = x
        this.y = y
        this.isLeft = isLeft
        this.angle = isLeft ? -PI / 4 : PI / 4
        this.blowing = false
    }

    draw() {
        push()
        translate(this.x, this.y)
        rotate(this.angle)
        fill(218, 165, 32)
        rect(0, 0, 60, 20)
        ellipse(60, 10, 30, 30)
        if (this.blowing && random() > 0.5) {
            this.createConfetti()
        }
        pop()
    }

    createConfetti() {
        for (let i = 0; i < 3; i++) {
            let velocity = p5.Vector.random2D()
            velocity.mult(random(2, 5))
            confetti.push({
                x: this.x + (this.isLeft ? 60 : -60),
                y: this.y,
                vx: velocity.x,
                vy: velocity.y,
                color: color(random(255), random(255), random(255)),
                rotation: random(TWO_PI)
            })
        }
    }
}
// Function to update OG metadata dynamically
function updateOGMetadata(name, wish) {
    // Create or update OG meta tags
    const metaTags = {
        'og:title': `Selamat Ulang Tahun ${name} 🎉`,
        'og:description': `Selamat Ulang Tahun ${name}! ${wish}`,
        'og:image': 'https://4211421036.github.io/hbd/hbd.jpg', // Pastikan untuk menambahkan gambar OG yang sesuai
        'og:url': window.location.href,
        'og:type': 'website',
        'twitter:card': 'summary_large_image',
        'twitter:title': `Selamat Ulang Tahun ${name} 🎉`,
        'twitter:description': `Selamat Ulang Tahun ${name}! ${wish}`,
        'twitter:image': 'https://4211421036.github.io/hbd/hbd.jpg'
    };

    // Update or create meta tags
    Object.entries(metaTags).forEach(([property, content]) => {
        let metaTag = document.querySelector(`meta[property="${property}"]`);
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute('property', property);
            document.head.appendChild(metaTag);
        }
        metaTag.setAttribute('content', content);
    });

    // Update document title
    document.title = `Selamat Ulang Tahun ${name} 🎉`;
}
function createModal() {
    if (showModal) {
        const existingSkeleton = select('.skeleton-modal');
        if (existingSkeleton) {
            existingSkeleton.remove();
        }

        // Create and show skeleton first
        const skeletonLoader = createSkeletonLoader();
        
        skeletonTimeout = setTimeout(() => {
            isLoading = false;
            skeletonLoader.remove();
            const modal = createDiv('')
            modal.style('background', 'rgba(0,0,0,0.8)')
            modal.style('position', 'fixed')
            modal.style('top', '0')
            modal.style('left', '0')
            modal.style('width', '100%')
            modal.style('height', '100%')
            modal.style('display', 'flex')
            modal.style('justify-content', 'center')
            modal.style('align-items', 'center')
            modal.style('z-index', '1000')
            modal.style('transition', 'transform 0.3s ease')
            modal.id(idMap.modal);
            modal.attribute('role', 'document')
            modal.attribute('tabindex', '0')
    
            const modalContent = createDiv('')
            modalContent.style('background', 'radial-gradient(100% 193.51% at 100% 0%, #EDF4F8 0%, #EFF2FA 16.92%, #FAEFF6 34.8%, #FAE6F2 48.8%, #FAF0F7 63.79%, #F1F1FB 81.34%, #F0F4F8 100%);')
            modalContent.style('padding', '20px')
            modalContent.style('border-radius', '20px')
            modalContent.style('text-align', 'center')
            modalContent.style('width', '80%')
            modalContent.style('max-width', '500px')
            modalContent.style('position', 'relative')
            modalContent.style('touch-action', 'none')
            modalContent.style('transition', 'transform 0.5s ease')
            modalContent.style('bottom', '0')
            modalContent.style('transform', 'translateY(0)')
            modalContent.id(idMap.modalContent);
            modalContent.attribute('role', 'document')
    
            const swipeIndicator = createDiv('')
            swipeIndicator.style('width', '40px')
            swipeIndicator.style('height', '4px')
            swipeIndicator.style('background-color', 'rgb(205 205 205)')
            swipeIndicator.style('border-radius', '2px')
            swipeIndicator.style('margin', '0 auto 15px auto')
    
            // Deteksi mode gelap
            const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            
            // Input untuk nama dengan label sebagai pengganti placeholder
            const nameLabel = createDiv('')
            nameLabel.html('Nama yang Ulang Tahun')
            nameLabel.style('margin-top', '10px')
            nameLabel.style('font-size', '14px')
            nameLabel.style('text-align', 'left')
            nameLabel.style('margin-left', '10%')
            nameLabel.style('margin-bottom', '5px')
            
            const inputName = createInput('')
            inputName.id(idMap.inputName);
            inputName.attribute('aria-label', 'Nama yang Ulang Tahun')
            inputName.attribute('name', 'name')
            inputName.attribute('autocomplete', 'name')
            inputName.attribute('required', 'true')
            inputName.style('margin', '0 10px 10px 10px')
            inputName.style('padding', '10px')
            inputName.style('width', '80%')
            inputName.style('border', '1px solid #ddd')
            inputName.style('border-radius', '5px')
            inputName.style('font-size', '16px')
            
            // Input label untuk nomor WhatsApp
            const phoneLabel = createDiv('')
            phoneLabel.html('Nomor WA (dimulai dengan 62)')
            phoneLabel.style('margin-top', '10px')
            phoneLabel.style('font-size', '14px')
            phoneLabel.style('text-align', 'left')
            phoneLabel.style('margin-left', '10%')
            phoneLabel.style('margin-bottom', '5px')
            
            const inputPhone = createInput('')
            inputPhone.id(idMap.inputPhone);
            inputPhone.attribute('name', 'phone')
            inputPhone.attribute('autocomplete', 'tel')
            inputPhone.attribute('pattern', '\\+62[0-9]{9,}')
            inputPhone.style('margin', '0 10px 10px 10px')
            inputPhone.style('padding', '10px')
            inputPhone.style('width', '80%')
            inputPhone.style('border', '1px solid #ddd')
            inputPhone.style('border-radius', '5px')
            inputPhone.style('font-size', '16px')
            
            // Tambahkan placeholder setelah fokus pertama
            inputName.elt.addEventListener('focus', function() {
                if (!this.placeholder) {
                    this.placeholder = 'Masukkan nama yang Ulang Tahun';
                }
            });
            
            inputPhone.elt.addEventListener('focus', function() {
                if (!this.placeholder) {
                    this.placeholder = 'Masukkan nomor WA (+62)';
                }
            });
            
            // Autofocus pada elemen pertama
            inputName.attribute('autofocus', 'true')
    
            const button = createButton('OK')
            button.style('margin', '10px')
            button.style('padding', '10px 30px')
            button.style('background', 'rgb(52 127 56)')
            button.attribute('accesskey','n')
            button.attribute('type','submit')
            button.attribute('role','button')
            if (!isDragging) {
                startButton.hide()
            }
            button.style('border', 'none')
            button.style('border-radius', '5px')
            button.style('cursor', 'pointer')
            button.style('font-size', '16px')
    
            button.mousePressed(() => submitName())
            modalContent.child(swipeIndicator)
            modalContent.child(createP('Siapa yang ulang tahun?').attribute('role', 'text'))
            modalContent.child(nameLabel)
            modalContent.child(inputName)
            modalContent.child(phoneLabel)
            modalContent.child(inputPhone)
            modalContent.child(button)
            modal.child(modalContent)
            
            let modalContentElem = select(`#${idMap.modalContent}`).elt;
            
            modalContentElem.addEventListener('touchstart', handleTouchStart, false)
            modalContentElem.addEventListener('touchmove', handleTouchMove, false)
            modalContentElem.addEventListener('touchend', handleTouchEnd, false)
            if (window.innerWidth <= 768) {
                modalContent.style('position', 'absolute');
                modalContent.style('bottom', '10px');
                swipeIndicator.style('display', 'block');
            } else {
                swipeIndicator.style('display', 'none');
            }
            
            // Update styles for dark/light mode
            if (isDarkMode) {
                modal.style('background', 'rgba(0,0,0,0.8)');
                modalContent.style('backgroundColor', '#1e1e1e');
                modalContent.style('color', '#ffffff');
                nameLabel.style('color', '#ffffff');
                phoneLabel.style('color', '#ffffff');
                swipeIndicator.style('backgroundColor', '#333');
                button.style('background', 'rgb(52 127 56)')
                inputName.style('background', '#2c2c2c')
                inputName.style('color', '#ffffff')
                inputName.style('border', '1px solid #444')
                inputPhone.style('background', '#2c2c2c')
                inputPhone.style('color', '#ffffff')
                inputPhone.style('border', '1px solid #444')
                
                // Add placeholder style but keep it empty initially
                let style = document.createElement('style');
                style.innerHTML = `
                    #${idMap.inputName}::placeholder, #${idMap.inputPhone}::placeholder {
                        color: rgba(255,255,255,0.6);
                        opacity: 1;
                    }
                `;
                document.head.appendChild(style);
            } else {
                modal.style('background', 'rgba(255, 246, 246, 0.8)');
                modalContent.style('background', 'radial-gradient(100% 193.51% at 100% 0%, #EDF4F8 0%, #EFF2FA 16.92%, #FAEFF6 34.8%, #FAE6F2 48.8%, #FAF0F7 63.79%, #F1F1FB 81.34%, #F0F4F8 100%)');
                modalContent.style('color', '#000000');
                nameLabel.style('color', '#000000');
                phoneLabel.style('color', '#000000');
                button.style('background', 'rgb(115 235 121)')
                swipeIndicator.style('backgroundColor', 'rgb(205 205 205)');
                inputName.style('background', '#ffffff')
                inputName.style('color', '#000000')
                inputPhone.style('background', '#ffffff')
                inputPhone.style('color', '#000000')
                
                // Add placeholder style but keep it empty initially
                let style = document.createElement('style');
                style.innerHTML = `
                    #${idMap.inputName}::placeholder, #${idMap.inputPhone}::placeholder {
                        color: rgba(0,0,0,0.6);
                        opacity: 1;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Menambahkan efek setelah modal dibuat
            setTimeout(() => {
                modal.style('opacity', '1')  // Fade-in efek
                modalContent.style('opacity', '1')  // Fade-in efek
                modalContent.style('transform', 'translateY(0)')
            }, 50)
            
            function submitName() {
              userName = inputName.value();
              nomorWA = inputPhone.value();
          
              if (userName.trim() !== '' && nomorWA.startsWith('62')) {
                  showModal = false;
                  clicked = true;
                  select(`#${idMap.modal}`).remove();
                  startButton.remove();

                  const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
                  updateOGMetadata(userName, randomWish);
                  
                  // Generate the shareable URL
                  const shareableUrl = `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(userName)}`;
                  window.shareableUrl = shareableUrl;  
                
                  initAudio();
                  birthdayAudio.play().catch(error => {
                      console.log('Audio playback failed:', error);
                  });
              } else {
                  alert("Pastikan nomor WA dimulai dengan 62.");
              }
          }
        }, 500); // Reduced timeout for faster appearance
    }
}

function cleanup() {
    if (skeletonTimeout) {
        clearTimeout(skeletonTimeout);
    }
    const existingSkeleton = select('.skeleton-modal');
    if (existingSkeleton) {
        existingSkeleton.remove();
    }
    // ... (rest of your existing cleanup code)
}

function handleTouchStart(event) {
    startY = event.touches[0].clientY
    isDragging = true
    currentY = 0
}

function handleTouchMove(event) {
    if (!isDragging) return

    currentY = event.touches[0].clientY - startY
    if (currentY < 0) currentY = 0

    const modal = select(`#${idMap.modalContent}`).elt;
    modal.style.transform = `translateY(${currentY}px)`
}

function handleTouchEnd() {
    startButton.position(windowWidth / 2 - 100, windowHeight / 2 - 25)
    startButton.style('width', 'max-content')
    startButton.style('height', 'max-content')
    startButton.style('font-size', '16px')

    isDragging = false
    const modal = select(`#${idMap.modalContent}`).elt;

    if (currentY > 150) {
        showModal = false
        select(`#${idMap.modal}`).remove();
        startButton.show()
    } else {
        modal.style.transform = 'translateY(0)'
    }
}

function createStartButton() {
    startButton = createButton('Selamat Ulang Tahun! 🎂')
    startButton.position(windowWidth / 2 - 100, windowHeight / 2 - 25)
    startButton.style('padding', '15px 30px')
    startButton.style('background-color', '#FF4081')
    startButton.style('color', 'white')
    startButton.style('border', 'none')
    startButton.style('border-radius', '25px')
    startButton.style('cursor', 'pointer')
    startButton.style('font-size', '18px')
    startButton.style('box-shadow', '0 4px 8px rgba(0,0,0,0.2)')
    startButton.style('transition', 'all 0.3s ease')
    startButton.style('z-index', '999')
    startButton.style('transform', 'translateX(-5%)')
    startButton.attribute('role', 'button')
    startButton.attribute('type', 'button')
    startButton.attribute('aria-label', 'Selamat Ulang Tahun 🎂')
    startButton.hide()

    startButton.mousePressed(() => {
        startButton.hide()
        showModal = true
        createModal()
    })
    startButton.mouseOver(() => {
        startButton.style('transform', 'scale(1.05)')
        startButton.style('box-shadow', '0 6px 12px rgba(0,0,0,0.3)')
    })
    startButton.mouseOut(() => {
        startButton.style('transform', 'scale(1)')
        startButton.style('box-shadow', '0 4px 8px rgba(0,0,0,0.2)')
    })
}

function getUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        name: urlParams.get('name'),
    };
}

function initializeApp() {
    const params = getUrlParams();
    
    if (params.name) {
        userName = decodeURIComponent(params.name);
        const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
        updateOGMetadata(userName, randomWish);
        showModal = false;
        clicked = true;
        initAudio();
        birthdayAudio.play().catch(error => {
            console.log('Audio playback failed:', error);
        });
        if (startButton) startButton.remove();
        return true;
    }
    return false;
}

function shareToWhatsApp() {
    const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
    const message = `${randomWish}\nUcapkan selamat ulang tahun untuk ${userName}!`;

   // Use the generated shareable URL instead of the static one
    const shareableUrl = window.shareableUrl || `${window.location.origin}${window.location.pathname}?name=${encodeURIComponent(userName)}`;
    
    const encodedMessage = encodeURIComponent(message);
    const shareLink = `https://wa.me/${nomorWA}?text=${encodedMessage}%0A${encodeURIComponent(shareableUrl)}`;

    // Buka WhatsApp untuk berbagi pesan dan gambar
    window.open(shareLink, '_blank');
}


function createShareButton() {
    shareButton = createButton('Download & Share to WhatsApp 📱');
    shareButton.style('padding', '20px 10px');
    shareButton.style('background', 'rgb(12 77 36 / 50%)');
    shareButton.style('color', 'white');
    shareButton.style('border', 'none');
    shareButton.style('border-radius', '10px');
    shareButton.style('cursor', 'pointer');
    shareButton.style('backdrop-filter', 'blur(15px)');
    shareButton.style('font-size', '16px');
    shareButton.style('z-index', '1000');
    shareButton.style('position', 'absolute');
    shareButton.style('left', '50%');
    shareButton.style('bottom', '10px');
    shareButton.style('transform', 'translateX(-50%)');
    shareButton.attribute('role', 'alertdialog')
    shareButton.attribute('aria-label', 'Share Sosial Media')
    shareButton.attribute('accesskey','s')
    shareButton.attribute('role','button')
    shareButton.attribute('type','button')
    shareButton.hide();

    shareButton.mousePressed(shareToWhatsApp);
}

function setup() {
    createCanvas(windowWidth, windowHeight)
    rectMode(CENTER)
  
    const shouldSkipModal = initializeApp();
    
    if (!shouldSkipModal) {
        createStartButton();
        createModal();
    }

    horns.push(new Horn(50, 50, true));
    horns.push(new Horn(width - 50, 50, false));
    
    createShareButton()
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
    const skeletonContent = select('.skeleton-content');
    if (skeletonContent) {
        skeletonContent.style('position', window.innerWidth <= 768 ? 'absolute' : 'relative');
        skeletonContent.style('bottom', window.innerWidth <= 768 ? '10px' : '0');
    }
    if (shareButton) {
        shareButton.style('left', '50%')
        shareButton.style('transform', 'translateX(-50%)')
    }
    if (startButton) {
        startButton.style('left', '50%')
        startButton.style('top', '50%')
        startButton.style('transform', 'translate(-50%, -50%)')
    }
}

function draw() {
    background(0, 0, 0, 25)

    // Menyesuaikan ukuran layar untuk mobile dan desktop
    let isMobile = window.innerWidth <= 768;
    let textSizeValue = isMobile ? 30 : 50; // Lebih kecil untuk mobile, lebih besar untuk desktop
    let candleLightIntensityMultiplier = isMobile ? 15 : 20; // Intensitas lebih rendah untuk mobile

    if (clicked) {
        horns.forEach(horn => {
            horn.blowing = true
            horn.draw()
        })

        // Animasi confetti
        for (let i = confetti.length - 1; i >= 0; i--) {
            let c = confetti[i]
            c.x += c.vx
            c.y += c.vy
            c.vy += 0.1
            c.rotation += 0.1

            push()
            translate(c.x, c.y)
            rotate(c.rotation)
            fill(c.color)
            rect(0, 0, 5, 5)
            pop()

            if (c.y > height) confetti.splice(i, 1)
        }

        // Sesuaikan intensitas cahaya lilin berdasarkan ukuran layar
        candleLightIntensity = sin(frameCount * 0.1) * candleLightIntensityMultiplier + 50

        // Menampilkan teks "Selamat Ulang Tahun"
        textSize(textSizeValue)
        let glowAmount = candleLightIntensity / 255

        for (let i = 20; i > 0; i--) {
            let alpha = glowAmount * (i / 20) * 255
            fill(255, 200, 0, alpha)
            textAlign(CENTER, CENTER)
            text(`Selamat Ulang Tahun\n${userName}!`,
                width / 2 + random(-1, 1),
                height / 2 + random(-1, 1))
        }

        fill(255, 255, 255)
        text(`Selamat Ulang Tahun\n${userName}!`, width / 2, height / 2)

        // Tombol share hanya muncul pada perangkat mobile
        if (isMobile) {
            shareButton.show()
        }

        // Menampilkan kembang api
        for (let f of fireworks) f.step()
    } else {
        fill(255, 255, 255, 10)
        noStroke()
        textAlign(CENTER, CENTER)
        text("Klik untuk memulai", width / 2, height / 2)
    }
}


function mouseReleased() {
    if (clicked && mouseY < windowHeight && mouseX < windowWidth) {
        let target = {
            x: mouseX,
            y: mouseY
        };
        fireworks.push(new Firework(target));
    }
}
