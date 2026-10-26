document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
    
    // Language selector functionality
    const languageLinks = document.querySelectorAll('.language-selector a');
    
    // Function to update non-classed elements that need translation
    function updateButtonLabels(lang) {
        // Update all view buttons
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            if (lang === 'POL') {
                btn.textContent = 'Zobacz';
            } else {
                btn.textContent = 'View';
            }
        });
        
        // Update all download buttons in gallery
        const downloadButtons = document.querySelectorAll('.gallery-overlay .view-btn');
        downloadButtons.forEach(btn => {
            if (btn.textContent === 'Download' || btn.textContent === 'Pobierz') {
                if (lang === 'POL') {
                    btn.textContent = 'Pobierz';
                } else {
                    btn.textContent = 'Download';
                }
            }
        });
    }
    
    // Initialize buttons with English labels by default
    updateButtonLabels('ENG');
    
    languageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all language links
            languageLinks.forEach(lnk => lnk.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get the language from the clicked link text
            const lang = this.textContent.trim();
            
            // Switch language content
            if (lang === 'POL') {
                // Hide English content
                document.querySelectorAll('.lang-en').forEach(el => {
                    el.style.display = 'none';
                });
                
                // Show Polish content
                document.querySelectorAll('.lang-pl').forEach(el => {
                    el.style.display = 'block';
                });
                
                // Update buttons for Polish
                updateButtonLabels('POL');
                
                console.log('Language switched to Polish');
            } else {
                // Hide Polish content
                document.querySelectorAll('.lang-pl').forEach(el => {
                    el.style.display = 'none';
                });
                
                // Show English content
                document.querySelectorAll('.lang-en').forEach(el => {
                    el.style.display = 'block';
                });
                
                // Update buttons for English
                updateButtonLabels('ENG');
                
                console.log('Language switched to English');
            }
            
            // Create and dispatch a custom event for language change
            const event = new Event('languageChanged');
            this.dispatchEvent(event);
        });
    });

    // Gallery filter functionality
    function showSeriesStatement(filterValue) {
        document.querySelectorAll('.series-statement').forEach(s => {
            s.style.display = 'none';
        });
        const active = document.querySelector(`.series-statement[data-series="${filterValue}"]`);
        if (active) active.style.display = 'block';
    }

    function setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.gallery-filter .filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        filterButtons.forEach(button => {
            button.removeEventListener('click', handleFilterClick);
            button.addEventListener('click', handleFilterClick);
        });

        // Default to the first series button
        const firstButton = document.querySelector('.gallery-filter .filter-btn');
        if (firstButton) {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            firstButton.classList.add('active');
            const firstFilter = firstButton.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (item.getAttribute('data-category') === firstFilter) {
                    item.style.display = 'block';
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                } else {
                    item.style.display = 'none';
                }
            });

            showSeriesStatement(firstFilter);
        }
    }
    
    function handleFilterClick() {
        const filterButtons = document.querySelectorAll('.gallery-filter .filter-btn');
        const galleryItems = document.querySelectorAll('.gallery-item');

        filterButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        showSeriesStatement(filterValue);

        galleryItems.forEach(item => {
            if (item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Setup filter buttons immediately
    setupFilterButtons();
    
    // Add language change handler to reset filter buttons
    languageLinks.forEach(link => {
        link.addEventListener('languageChanged', function() {
            setTimeout(setupFilterButtons, 100); // Small delay to ensure DOM updates
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80; // Height of fixed header
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all section elements
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Simple lazy loading for gallery images (if needed)
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
    
    // Simple Video Enlarge Functionality
    const galleryImages = document.querySelectorAll('.gallery-image');
    const zoomContainer = document.getElementById('zoom-container') || null;
    const zoomContent = document.getElementById('zoom-content') || null;
    const zoomClose = document.querySelector('.zoom-close');
    
    console.log('Found gallery images:', galleryImages.length);
    
    // Direct click handler for gallery items
    galleryImages.forEach(image => {
        console.log('Setting up click handler for gallery item:', image);
        
        image.addEventListener('click', function() {
            // Check for different content types
            const isVideo = image.classList.contains('video-wrapper');
            const isKeynote = image.classList.contains('keynote-file');
            const isPDF = image.classList.contains('pdf-file');
            const isCaseStudy = image.classList.contains('casestudy-link');
            
            if (isPDF) {
                console.log('PDF file clicked:', image);
                handlePDFFile(image);
            } else if (isKeynote) {
                console.log('Keynote file clicked:', image);
                handleKeynoteFile(image);
            } else if (isCaseStudy) {
                console.log('Case study link clicked:', image);
                handleCaseStudyLink(image);
            } else if (isVideo) {
                console.log('Embedded video clicked:', image);
                
                // Create modal for videos
                document.body.style.overflow = 'hidden'; // Prevent scrolling
                
                // Create a fullscreen container if it doesn't exist
                let videoModal = document.getElementById('video-fullscreen-modal');
                if (!videoModal) {
                    videoModal = document.createElement('div');
                    videoModal.id = 'video-fullscreen-modal';
                    videoModal.style.position = 'fixed';
                    videoModal.style.top = '0';
                    videoModal.style.left = '0';
                    videoModal.style.width = '100vw';
                    videoModal.style.height = '100vh';
                    videoModal.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
                    videoModal.style.zIndex = '10000';
                    videoModal.style.display = 'flex';
                    videoModal.style.justifyContent = 'center';
                    videoModal.style.alignItems = 'center';
                    
                    document.body.appendChild(videoModal);
                    
                    // Add close button
                    const closeBtn = document.createElement('div');
                    closeBtn.className = 'video-modal-close';
                    closeBtn.innerHTML = '×';
                    closeBtn.style.position = 'absolute';
                    closeBtn.style.top = '20px';
                    closeBtn.style.right = '30px';
                    closeBtn.style.color = 'white';
                    closeBtn.style.fontSize = '40px';
                    closeBtn.style.cursor = 'pointer';
                    closeBtn.style.padding = '5px 15px';
                    closeBtn.style.background = 'rgba(0, 0, 0, 0.5)';
                    closeBtn.style.borderRadius = '50%';
                    closeBtn.style.width = '50px';
                    closeBtn.style.height = '50px';
                    closeBtn.style.display = 'flex';
                    closeBtn.style.alignItems = 'center';
                    closeBtn.style.justifyContent = 'center';
                    closeBtn.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
                    
                    // Add click event to close button
                    closeBtn.addEventListener('click', function() {
                        // Remove the fullscreen container
                        document.body.removeChild(videoModal);
                        document.body.style.overflow = 'auto'; // Restore scrolling
                    });
                    
                    videoModal.appendChild(closeBtn);
                }
                
                // Clear any existing content
                const existingContainer = videoModal.querySelector('.video-modal-container');
                if (existingContainer) {
                    existingContainer.remove();
                }
                
                // Create video container
                const videoContainer = document.createElement('div');
                videoContainer.className = 'video-modal-container';
                videoContainer.style.width = '85vw';
                videoContainer.style.maxWidth = '1200px';
                videoContainer.style.position = 'relative';
                videoContainer.style.paddingBottom = '48%';
                videoContainer.style.height = '0';
                
                // Get the iframe source
                const originalIframe = image.querySelector('iframe');
                if (originalIframe) {
                    // Create a new iframe for the modal
                    const iframe = document.createElement('iframe');
                    let src = originalIframe.src;
                    
                    // Add autoplay parameter to start playing
                    if (src.includes('youtube.com')) {
                        // For YouTube videos
                        if (!src.includes('autoplay=1')) {
                            if (src.includes('?')) {
                                src += '&autoplay=1&mute=0';
                            } else {
                                src += '?autoplay=1&mute=0';
                            }
                        }
                    } else if (src.includes('vimeo.com')) {
                        // For Vimeo videos
                        if (!src.includes('autoplay=1')) {
                            if (src.includes('?')) {
                                src += '&autoplay=1';
                            } else {
                                src += '?autoplay=1';
                            }
                        }
                    }
                    
                    iframe.src = src;
                    iframe.title = originalIframe.title || "Video";
                    iframe.allowFullscreen = true;
                    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                    iframe.style.position = 'absolute';
                    iframe.style.top = '0';
                    iframe.style.left = '0';
                    iframe.style.width = '100%';
                    iframe.style.height = '100%';
                    iframe.style.border = 'none';
                    iframe.style.boxShadow = '0 0 30px rgba(0, 0, 0, 0.5)';
                    
                    videoContainer.appendChild(iframe);
                    videoModal.appendChild(videoContainer);
                }
            } else {
                // For images, use the zoom modal
                console.log('Image clicked:', image);
                
                // Get caption from nearest gallery-caption if available
                const galleryItem = image.closest('.gallery-item');
                let title = '';
                let description = '';
                
                if (galleryItem) {
                    const captionElement = galleryItem.querySelector('.gallery-caption');
                    if (captionElement) {
                        const titleElement = captionElement.querySelector('h3');
                        const descElement = captionElement.querySelector('p');
                        
                        if (titleElement) title = titleElement.textContent;
                        if (descElement) description = descElement.textContent;
                    }
                }
                
                // Check if zoom elements exist
                if (zoomContent && zoomContainer) {
                    // Clear previous content
                    zoomContent.innerHTML = '';
                    
                    // It's an image - use the modal for images only
                    const imgElement = image.querySelector('img');
                    if (imgElement) {
                        // Create image element for zoom
                        const zoomedImage = document.createElement('img');
                        zoomedImage.className = 'zoomed-image';
                        zoomedImage.src = imgElement.src;
                        zoomedImage.alt = 'Zoomed Content';
                        
                        zoomContent.appendChild(zoomedImage);
                        
                        // Set caption if elements exist
                        const zoomTitle = document.getElementById('zoom-title');
                        const zoomDesc = document.getElementById('zoom-description');
                        if (zoomTitle) zoomTitle.textContent = title;
                        if (zoomDesc) zoomDesc.textContent = description;
                        
                        // Show the zoom container for images
                        zoomContainer.classList.add('active');
                        document.body.style.overflow = 'hidden'; // Prevent scrolling
                    }
                }
            }
        });
        
        // Handle View button click too (for both images and videos)
        const viewBtn = image.querySelector('.view-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                // Trigger click on parent
                image.click();
            });
        }
    });
    
    // Close when clicking the X (image modal only)
    if (zoomClose) {
        zoomClose.addEventListener('click', closeZoom);
    }
    
    // Close when clicking outside the content (image modal only)
    if (zoomContainer) {
        zoomContainer.addEventListener('click', function(e) {
            if (e.target === zoomContainer) {
                closeZoom();
            }
        });
    }
    
    // Close with escape key (for both image and video modals)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close image modal if open
            if (zoomContainer && zoomContainer.classList.contains('active')) {
                closeZoom();
            }
            
            // Close video modal if open
            const videoModal = document.getElementById('video-fullscreen-modal');
            if (videoModal) {
                document.body.removeChild(videoModal);
                document.body.style.overflow = 'auto'; // Restore scrolling
            }
        }
    });
    
    // Function to close the zoom (image modal only)
    function closeZoom() {
        if (zoomContainer) {
            zoomContainer.classList.remove('active');
            document.body.style.overflow = 'auto'; // Restore scrolling
            
            // Clear content
            if (zoomContent) {
                setTimeout(() => {
                    zoomContent.innerHTML = '';
                }, 300);
            }
        }
    }
    
    // Function for handling uploaded videos has been removed
    
    // Function to handle Keynote file clicks
    function handleKeynoteFile(imageContainer) {
        // Check if zoom elements exist
        if (!zoomContent || !zoomContainer) {
            console.warn('Zoom container or content elements not found');
            return;
        }
        
        // Get file data attributes
        const fileUrl = imageContainer.getAttribute('data-file-url');
        const fileName = imageContainer.getAttribute('data-file-name') || 'presentation.key';
        
        // Get image preview
        const imgElement = imageContainer.querySelector('img');
        
        // Create modal content for Keynote file
        zoomContent.innerHTML = '';
        
        // Create container for Keynote presentation
        const keynoteContainer = document.createElement('div');
        keynoteContainer.className = 'keynote-container';
        keynoteContainer.style.textAlign = 'center';
        keynoteContainer.style.padding = '20px';
        
        // Add preview image if available
        if (imgElement) {
            const previewImg = document.createElement('img');
            previewImg.src = imgElement.src;
            previewImg.alt = 'Keynote Preview';
            previewImg.style.maxWidth = '80%';
            previewImg.style.maxHeight = '70vh';
            previewImg.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            previewImg.style.borderRadius = '8px';
            previewImg.style.marginBottom = '20px';
            keynoteContainer.appendChild(previewImg);
        }
        
        // Add file info
        const fileInfo = document.createElement('div');
        fileInfo.style.marginBottom = '20px';
        fileInfo.style.fontSize = '1.2rem';
        fileInfo.innerHTML = `<strong>${fileName}</strong><p>This is an Apple Keynote presentation file (.key)</p>`;
        keynoteContainer.appendChild(fileInfo);
        
        // Add download button
        const downloadBtn = document.createElement('a');
        downloadBtn.href = fileUrl || '#';
        downloadBtn.download = fileName;
        downloadBtn.className = 'keynote-download-btn';
        downloadBtn.textContent = 'Download Keynote File';
        downloadBtn.style.display = 'inline-block';
        downloadBtn.style.padding = '12px 24px';
        downloadBtn.style.backgroundColor = '#007AFF'; // Apple blue
        downloadBtn.style.color = 'white';
        downloadBtn.style.borderRadius = '6px';
        downloadBtn.style.textDecoration = 'none';
        downloadBtn.style.fontWeight = 'bold';
        downloadBtn.style.transition = 'background-color 0.3s';
        
        // Hover effect
        downloadBtn.onmouseover = function() {
            this.style.backgroundColor = '#0056b3';
        };
        downloadBtn.onmouseout = function() {
            this.style.backgroundColor = '#007AFF';
        };
        
        // Handle case where file URL isn't available
        if (!fileUrl) {
            downloadBtn.style.backgroundColor = '#999';
            downloadBtn.style.cursor = 'not-allowed';
            downloadBtn.onclick = function(e) {
                e.preventDefault();
                alert('This is a demo. The Keynote file is not available for download.');
            };
        }
        
        keynoteContainer.appendChild(downloadBtn);
        
        // Add note
        const note = document.createElement('p');
        note.style.marginTop = '15px';
        note.style.fontSize = '0.9rem';
        note.style.color = '#666';
        note.textContent = 'Note: Keynote files can only be opened with Apple Keynote on macOS or iOS.';
        keynoteContainer.appendChild(note);
        
        zoomContent.appendChild(keynoteContainer);
        
        // Get caption from nearest gallery-caption if available
        const galleryItem = imageContainer.closest('.gallery-item');
        let title = '';
        let description = '';
        
        if (galleryItem) {
            const captionElement = galleryItem.querySelector('.gallery-caption');
            if (captionElement) {
                const titleElement = captionElement.querySelector('h3');
                const descElement = captionElement.querySelector('p');
                
                if (titleElement) title = titleElement.textContent;
                if (descElement) description = descElement.textContent;
            }
        }
        
        // Set caption if elements exist
        const zoomTitle = document.getElementById('zoom-title');
        const zoomDesc = document.getElementById('zoom-description');
        if (zoomTitle) zoomTitle.textContent = title;
        if (zoomDesc) zoomDesc.textContent = description;
        
        // Show the zoom container
        zoomContainer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Function to handle PDF file clicks
    function handlePDFFile(imageContainer) {
        // Check if zoom elements exist
        if (!zoomContent || !zoomContainer) {
            console.warn('Zoom container or content elements not found');
            return;
        }
        
        // Get file data attributes
        const fileUrl = imageContainer.getAttribute('data-file-url');
        const fileName = imageContainer.getAttribute('data-file-name') || 'document.pdf';
        
        // Get image preview
        const imgElement = imageContainer.querySelector('img');
        
        // Create modal content for PDF file
        zoomContent.innerHTML = '';
        
        // Create container for PDF document
        const pdfContainer = document.createElement('div');
        pdfContainer.className = 'pdf-container';
        pdfContainer.style.textAlign = 'center';
        pdfContainer.style.padding = '20px';
        
        // Add preview image if available
        if (imgElement) {
            const previewImg = document.createElement('img');
            previewImg.src = imgElement.src;
            previewImg.alt = 'PDF Preview';
            previewImg.style.maxWidth = '80%';
            previewImg.style.maxHeight = '70vh';
            previewImg.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            previewImg.style.borderRadius = '8px';
            previewImg.style.marginBottom = '20px';
            pdfContainer.appendChild(previewImg);
        }
        
        // Add file info
        const fileInfo = document.createElement('div');
        fileInfo.style.marginBottom = '20px';
        fileInfo.style.fontSize = '1.2rem';
        fileInfo.innerHTML = `<strong>${fileName}</strong><p>PDF document</p>`;
        pdfContainer.appendChild(fileInfo);
        
        // Add download button
        const downloadBtn = document.createElement('a');
        downloadBtn.href = fileUrl || '#';
        downloadBtn.download = fileName;
        downloadBtn.className = 'pdf-download-btn';
        downloadBtn.textContent = 'Download PDF';
        downloadBtn.style.display = 'inline-block';
        downloadBtn.style.padding = '12px 24px';
        downloadBtn.style.backgroundColor = '#E53935'; // PDF red
        downloadBtn.style.color = 'white';
        downloadBtn.style.borderRadius = '6px';
        downloadBtn.style.textDecoration = 'none';
        downloadBtn.style.fontWeight = 'bold';
        downloadBtn.style.transition = 'background-color 0.3s';
        
        // Hover effect
        downloadBtn.onmouseover = function() {
            this.style.backgroundColor = '#C62828';
        };
        downloadBtn.onmouseout = function() {
            this.style.backgroundColor = '#E53935';
        };
        
        // Handle case where file URL isn't available
        if (!fileUrl) {
            downloadBtn.style.backgroundColor = '#999';
            downloadBtn.style.cursor = 'not-allowed';
            downloadBtn.onclick = function(e) {
                e.preventDefault();
                alert('This is a demo. The PDF file is not available for download.');
            };
        }
        
        pdfContainer.appendChild(downloadBtn);
        
        // Add view button (optional, for PDFs you can also offer to view in browser)
        const viewBtn = document.createElement('a');
        viewBtn.href = fileUrl || '#';
        viewBtn.target = "_blank";
        viewBtn.className = 'pdf-view-btn';
        viewBtn.textContent = 'View PDF in Browser';
        viewBtn.style.display = 'inline-block';
        viewBtn.style.padding = '12px 24px';
        viewBtn.style.backgroundColor = '#333';
        viewBtn.style.color = 'white';
        viewBtn.style.borderRadius = '6px';
        viewBtn.style.textDecoration = 'none';
        viewBtn.style.fontWeight = 'bold';
        viewBtn.style.transition = 'background-color 0.3s';
        viewBtn.style.marginLeft = '10px';
        
        // Hover effect
        viewBtn.onmouseover = function() {
            this.style.backgroundColor = '#555';
        };
        viewBtn.onmouseout = function() {
            this.style.backgroundColor = '#333';
        };
        
        // Handle case where file URL isn't available
        if (!fileUrl) {
            viewBtn.style.backgroundColor = '#999';
            viewBtn.style.cursor = 'not-allowed';
            viewBtn.onclick = function(e) {
                e.preventDefault();
                alert('This is a demo. The PDF file is not available for viewing.');
            };
        }
        
        pdfContainer.appendChild(viewBtn);
        
        zoomContent.appendChild(pdfContainer);
        
        // Get caption from nearest gallery-caption if available
        const galleryItem = imageContainer.closest('.gallery-item');
        let title = '';
        let description = '';
        
        if (galleryItem) {
            const captionElement = galleryItem.querySelector('.gallery-caption');
            if (captionElement) {
                const titleElement = captionElement.querySelector('h3');
                const descElement = captionElement.querySelector('p');
                
                if (titleElement) title = titleElement.textContent;
                if (descElement) description = descElement.textContent;
            }
        }
        
        // Set caption if elements exist
        const zoomTitle = document.getElementById('zoom-title');
        const zoomDesc = document.getElementById('zoom-description');
        if (zoomTitle) zoomTitle.textContent = title;
        if (zoomDesc) zoomDesc.textContent = description;
        
        // Show the zoom container
        zoomContainer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Function to handle Case Study links
    function handleCaseStudyLink(imageContainer) {
        // Check if zoom elements exist
        if (!zoomContent || !zoomContainer) {
            console.warn('Zoom container or content elements not found');
            return;
        }
        
        // Get file data attributes
        const fileUrl = imageContainer.getAttribute('data-file-url');
        const fileName = imageContainer.getAttribute('data-file-name') || 'Case Study';
        
        // Get image preview
        const imgElement = imageContainer.querySelector('img');
        
        // Create modal content for Case Study
        zoomContent.innerHTML = '';
        
        // Create container for Case Study
        const caseStudyContainer = document.createElement('div');
        caseStudyContainer.className = 'casestudy-container';
        caseStudyContainer.style.textAlign = 'center';
        caseStudyContainer.style.padding = '20px';
        
        // Add preview image if available
        if (imgElement) {
            const previewImg = document.createElement('img');
            previewImg.src = imgElement.src;
            previewImg.alt = 'Case Study Preview';
            previewImg.style.maxWidth = '80%';
            previewImg.style.maxHeight = '60vh';
            previewImg.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
            previewImg.style.borderRadius = '8px';
            previewImg.style.marginBottom = '20px';
            caseStudyContainer.appendChild(previewImg);
        }
        
        // Add file info
        const fileInfo = document.createElement('div');
        fileInfo.style.marginBottom = '20px';
        fileInfo.style.fontSize = '1.2rem';
        fileInfo.innerHTML = `<strong>${fileName}</strong><p>Google Slides Case Study Presentation</p>`;
        caseStudyContainer.appendChild(fileInfo);
        
        // Add view button
        const viewBtn = document.createElement('a');
        viewBtn.href = fileUrl || '#';
        viewBtn.className = 'casestudy-button';
        viewBtn.innerHTML = '<i class="fas fa-external-link-alt"></i> Download Case Study';
        viewBtn.target = '_blank';
        viewBtn.style.display = 'inline-block';
        viewBtn.style.padding = '12px 24px';
        viewBtn.style.backgroundColor = '#E94FC3';
        viewBtn.style.color = 'white';
        viewBtn.style.textDecoration = 'none';
        viewBtn.style.borderRadius = '6px';
        viewBtn.style.fontWeight = 'bold';
        viewBtn.style.margin = '10px';
        caseStudyContainer.appendChild(viewBtn);
        
        zoomContent.appendChild(caseStudyContainer);
        
        // Show the zoom container
        zoomContainer.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
});
